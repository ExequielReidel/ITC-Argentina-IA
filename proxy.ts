import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/admin-auth'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Rutas /admin — autenticación propia con cookie
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin') return NextResponse.next()
    const cookie = req.cookies.get(COOKIE_NAME)
    if (!cookie || !(await verifyAdminToken(cookie.value))) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
    return NextResponse.next()
  }

  // Rutas /alumno y /profesor — autenticación NextAuth
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const role = token.role as string
  if (pathname.startsWith('/alumno') && role !== 'alumno') {
    return NextResponse.redirect(new URL('/profesor/inicio', req.url))
  }
  if (pathname.startsWith('/profesor') && role !== 'profesor') {
    return NextResponse.redirect(new URL('/alumno/inicio', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/alumno/:path*', '/profesor/:path*', '/admin/:path*'],
}
