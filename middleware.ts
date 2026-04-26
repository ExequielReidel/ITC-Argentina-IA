import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
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
      authorized({ token }) {
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/alumno/:path*', '/profesor/:path*'],
}
