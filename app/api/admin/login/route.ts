import { NextRequest, NextResponse } from 'next/server'
import { createAdminToken, COOKIE_NAME } from '@/lib/admin-auth'

const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX = 5
const WINDOW = 5 * 60 * 1000

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  const now = Date.now()

  const entry = attempts.get(ip)
  if (entry && entry.resetAt > now && entry.count >= MAX) {
    return NextResponse.json({ error: 'Demasiados intentos. Esperá 5 minutos.' }, { status: 429 })
  }

  const body = await req.json() as { password?: string }
  const adminPassword = process.env.ADMIN_PASSWORD

  // Visible en Vercel Runtime Logs para diagnosticar
  console.log('[admin-login] ADMIN_PASSWORD configurada:', !!adminPassword, '| largo:', adminPassword?.length ?? 0)

  if (!adminPassword || body.password !== adminPassword) {
    const cur = attempts.get(ip)
    if (!cur || cur.resetAt <= now) {
      attempts.set(ip, { count: 1, resetAt: now + WINDOW })
    } else {
      cur.count++
    }
    return NextResponse.json({ error: 'Contraseña incorrecta. Verificá e intentá de nuevo.' }, { status: 401 })
  }

  attempts.delete(ip)

  const token = await createAdminToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60,
    path: '/',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(COOKIE_NAME)
  return res
}
