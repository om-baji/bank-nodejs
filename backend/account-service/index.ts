import crypto from "crypto"
import type { NextFunction, Request, Response } from "express"
import express from "express"
import router from "./routes/account.routes"

const app = express()
app.use(express.json())

const ALGORITHM = "aes-256-gcm"
const SECRET_KEY = crypto.scryptSync(process.env.DATA_ENCRYPTION_KEY || "default_secret_key", "salt", 32)
const IV_LENGTH = 16

function encrypt(data: object) {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv)
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "base64")
  encrypted += cipher.final("base64")
  const tag = cipher.getAuthTag()
  return {
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    payload: encrypted
  }
}

function decrypt(encrypted: { iv: string; tag: string; payload: string }) {
  const iv = Buffer.from(encrypted.iv, "base64")
  const tag = Buffer.from(encrypted.tag, "base64")
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv)
  decipher.setAuthTag(tag)
  let decrypted = decipher.update(encrypted.payload, "base64", "utf8")
  decrypted += decipher.final("utf8")
  return JSON.parse(decrypted)
}

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.is("application/json") && req.body?.iv && req.body?.payload && req.body?.tag) {
    try {
      req.body = decrypt(req.body)
    } catch {
      return res.status(400).json({ success: false, message: "Invalid encrypted payload" })
    }
  }
  const originalJson = res.json.bind(res)
  res.json = (body: any) => {
    const encrypted = encrypt(body)
    return originalJson(encrypted)
  }
  next()
})

app.use("/status", (_req,res) => {
    res.json({
        health: "Ok!",
        timeStamp : new Date(),
    })
})

app.use("/api/account", router)

app.listen(3000, () => console.log("Account Service running with encrypted request/response"))
