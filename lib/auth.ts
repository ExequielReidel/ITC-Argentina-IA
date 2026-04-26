import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const result = await db.select().from(users)
          .where(eq(users.email, credentials.email.toLowerCase()))
          .limit(1)

        const user = result[0]
        if (!user || !user.activo) return null

        const match = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!match) return null

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.nombre,
          role: user.role,
          turno: user.turno ?? undefined,
          dni: user.dni ?? undefined,
          telefono: user.telefono ?? undefined,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id!
        token.turno = (user as any).turno
        token.dni = (user as any).dni
        token.telefono = (user as any).telefono
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
        ;(session.user as any).id = token.id
        ;(session.user as any).turno = token.turno
        ;(session.user as any).dni = token.dni
        ;(session.user as any).telefono = token.telefono
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
