import type { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { AccountService } from '../action/account.action'
import { AppError } from './handler'

const SERVER_PRIVATE_KEY_PEM = process.env.SERVER_PRIVATE_KEY_PEM || ''
const ALLOWED_TIMESTAMP_DRIFT_MS = Number(process.env.ALLOWED_TIMESTAMP_DRIFT_MS || '120000')
const NONCE_TTL_MS = Number(process.env.NONCE_TTL_MS || '300000')

const nonceCache = new Map<string, number>()
function addNonce(nonce: string) {
  nonceCache.set(nonce, Date.now())
  setTimeout(() => nonceCache.delete(nonce), NONCE_TTL_MS)
}
function hasNonce(nonce: string) {
  return nonceCache.has(nonce)
}

function rsaPrivateDecrypt(base64Encrypted: string) {
  const encrypted = Buffer.from(base64Encrypted, 'base64')
  return crypto.privateDecrypt(
    {
      key: SERVER_PRIVATE_KEY_PEM,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    },
    encrypted
  )
}

function aesGcmDecrypt(base64Payload: string, base64Iv: string, base64Tag: string, key: Buffer) {
  const iv = Buffer.from(base64Iv, 'base64')
  const tag = Buffer.from(base64Tag, 'base64')
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)
  let decrypted = decipher.update(base64Payload, 'base64', 'utf8')
  decrypted += decipher.final('utf8')
  return JSON.parse(decrypted)
}

async function getClientPublicKey(clientId: string): Promise<string> {
  const CLIENT_KEYS: Record<string, string> = {
    demo_client: process.env.DEMO_CLIENT_PUBLIC_KEY_PEM || ''
  }
  return CLIENT_KEYS[clientId] || ''
}

async function verifySignature(clientId: string, signatureBase64: string, message: Buffer) {
  const clientPub = await getClientPublicKey(clientId)
  if (!clientPub) return false
  const verify = crypto.createVerify('sha256')
  verify.update(message)
  verify.end()
  return verify.verify(clientPub, Buffer.from(signatureBase64, 'base64'))
}

export function transferSecurityMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        clientId,
        encryptedKey,
        iv,
        tag,
        payload,
        signature,
        timestamp,
        nonce,
        idempotencyKey
      } = req.body as Record<string, any>

      if (!clientId || !encryptedKey || !iv || !tag || !payload || !signature || !timestamp || !nonce)
        return res.status(400).json({ success: false, message: 'Missing security fields' })

      const ts = Number(timestamp)
      if (Number.isNaN(ts)) return res.status(400).json({ success: false, message: 'Invalid timestamp' })
      const now = Date.now()
      if (Math.abs(now - ts) > ALLOWED_TIMESTAMP_DRIFT_MS)
        return res.status(400).json({ success: false, message: 'Timestamp outside allowed window' })

      if (hasNonce(nonce)) return res.status(409).json({ success: false, message: 'Replay detected (nonce used)' })
      addNonce(nonce)

      const signatureMessage = Buffer.concat([
        Buffer.from(encryptedKey, 'base64'),
        Buffer.from(iv, 'base64'),
        Buffer.from(payload, 'base64'),
        Buffer.from(String(timestamp)),
        Buffer.from(nonce)
      ])

      const sigOk = await verifySignature(clientId, signature, signatureMessage)
      if (!sigOk) return res.status(401).json({ success: false, message: 'Invalid signature' })

      const symmetricKeyBuf = rsaPrivateDecrypt(encryptedKey)
      const decrypted = aesGcmDecrypt(payload, iv, tag, symmetricKeyBuf)

      if (!decrypted.fromAccountId || !decrypted.toAccountId || !decrypted.amount)
        return res.status(400).json({ success: false, message: 'Invalid decrypted payload' })

      req.body = {
        clientId,
        idempotencyKey,
        transfer: decrypted
      }

      next()
    } catch (err: any) {
      return res.status(400).json({ success: false, message: 'Security validation failed' })
    }
  }
}

const accountService = new AccountService()
export async function transferHandler(req: Request, res: Response) {
  const { transfer, idempotencyKey } = req.body as any
  if (idempotencyKey) {
    const handled = await checkIdempotency(idempotencyKey)
    if (handled) return res.json({ success: true, data: handled })
  }
  try {
    const transaction = await accountService.transfer(
      transfer.fromAccountId,
      transfer.toAccountId,
      Number(transfer.amount),
      transfer.description
    )
    if (idempotencyKey) await storeIdempotency(idempotencyKey, transaction)
    return res.json({ success: true, data: transaction })
  } catch (err: any) {
    throw new AppError(err.message || 'Transfer failed', 400)
  }
}

const idempotencyStore = new Map<string, any>()
async function checkIdempotency(key: string) {
  return idempotencyStore.get(key) || null
}
async function storeIdempotency(key: string, value: any) {
  idempotencyStore.set(key, value)
  setTimeout(() => idempotencyStore.delete(key), 24 * 60 * 60 * 1000)
}
