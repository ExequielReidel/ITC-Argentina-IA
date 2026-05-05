import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'alumno') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const profesores = await db
    .select({ nombre: users.nombre, email: users.email })
    .from(users)
    .where(and(eq(users.role, 'profesor'), eq(users.activo, true)))

  return NextResponse.json(profesores)
}
