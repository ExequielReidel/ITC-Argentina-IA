// Web Crypto API — funciona en Edge Runtime (middleware) y Node.js 18+

export const COOKIE_NAME = 'admin_session'
const EXPIRY_MS = 8 * 60 * 60 * 1000

function getSecret(): string {
  return process.env.NEXTAUTH_SECRET ?? 'dev-fallback-secret'
}

async function getKey(): Promise<CryptoKey> {
  return globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

function toBase64url(buf: ArrayBuffer): string {
  let binary = ''
  const bytes = new Uint8Array(buf)
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function fromBase64url(str: string): Uint8Array {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - (str.length % 4)) % 4)
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0))
}

export async function createAdminToken(): Promise<string> {
  const payload = toBase64url(new TextEncoder().encode(JSON.stringify({ exp: Date.now() + EXPIRY_MS })))
  const key = await getKey()
  const sig = await globalThis.crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return `${payload}.${toBase64url(sig)}`
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const dot = token.lastIndexOf('.')
    if (dot === -1) return false
    const payload = token.slice(0, dot)
    const sig = fromBase64url(token.slice(dot + 1))
    const key = await getKey()
    const valid = await globalThis.crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(payload))
    if (!valid) return false
    const data = JSON.parse(new TextDecoder().decode(fromBase64url(payload))) as { exp: number }
    return typeof data.exp === 'number' && data.exp > Date.now()
  } catch {
    return false
  }
}
