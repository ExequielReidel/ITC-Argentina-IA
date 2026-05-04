import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/admin-auth'

export default withAuth(
  async function middleware(req: NextRequest & { nextauth: { token: { role?: string } | null } }) {
    const { pathname } = req.nextUrl

    if (pathname.startsWith('/admin')) {
      if (pathname === '/admin') return NextResponse.next()
      const cookie = req.cookies.get(COOKIE_NAME)
      if (!cookie || !(await verifyAdminToken(cookie.value))) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return NextResponse.next()
    }

    const role = req.nextauth.token?.role
    if (pathname.startsWith('/alumno') && role !== 'alumno') {
      return NextResponse.redirect(new URL('/profesor/inicio', req.url))
    }
    if (pathname.startsWith('/profesor') && role !== 'profesor') {
      return NextResponse.redirect(new URL('/alumno/inicio', req.url))
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ token, req }) {
        if (req.nextUrl.pathname.startsWith('/admin')) return true
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/alumno/:path*', '/profesor/:path*', '/admin/:path*'],
}
