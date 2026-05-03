import { createHmac, timingSafeEqual } from 'crypto'

export const COOKIE_NAME = 'admin_session'
const EXPIRY_MS = 8 * 60 * 60 * 1000 // 8 horas

function secret(): string {
  return process.env.NEXTAUTH_SECRET ?? 'dev-fallback-secret'
}

export function createAdminToken(): string {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + EXPIRY_MS })).toString('base64url')
  const sig = createHmac('sha256', secret()).update(payload).digest('hex')
  return `${payload}.${sig}`
}

export function verifyAdminToken(token: string): boolean {
  try {
    const dot = token.lastIndexOf('.')
    if (dot === -1) return false
    const payload = token.slice(0, dot)
    const sig = token.slice(dot + 1)
    const expected = createHmac('sha256', secret()).update(payload).digest('hex')
    const sigBuf = Buffer.from(sig, 'hex')
    const expectedBuf = Buffer.from(expected, 'hex')
    if (sigBuf.length !== expectedBuf.length) return false
    if (!timingSafeEqual(sigBuf, expectedBuf)) return false
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { exp: number }
    return typeof data.exp === 'number' && data.exp > Date.now()
  } catch {
    return false
  }
}
