import crypto from "crypto"

const NODE_API = "http://localhost:3000"
const ALGORITHM = "aes-256-gcm"
const SECRET_KEY = crypto.scryptSync(process.env.DATA_ENCRYPTION_KEY || "default_secret_key", "salt", 32)
const IV_LENGTH = 16

function encrypt(data: object) {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv)
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "base64")
  encrypted += cipher.final("base64")
  const tag = cipher.getAuthTag()
  return { iv: iv.toString("base64"), tag: tag.toString("base64"), payload: encrypted }
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

export default {
  async fetch(req: Request) {
    const url = new URL(req.url)
    const targetPath = url.pathname + url.search

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS", "Access-Control-Allow-Headers": "*" } })
    }

    let body: any = {}
    if (req.method !== "GET" && req.headers.get("content-type")?.includes("application/json")) {
      body = await req.json().catch(() => ({}))
    }

    const encryptedBody = encrypt(body)
    const nodeRes = await fetch(NODE_API + targetPath, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method === "GET" ? undefined : JSON.stringify(encryptedBody)
    })

    const encRes = await nodeRes.json() as { iv: string; tag: string; payload: string }
    const decrypted = decrypt(encRes)

    return new Response(JSON.stringify(decrypted), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      status: nodeRes.status
    })
  }
}
