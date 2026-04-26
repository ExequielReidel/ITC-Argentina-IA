import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { asistencia, users } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'profesor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const claseNum = searchParams.get('clase')
  const userId = searchParams.get('alumno')

  let query = db.select().from(asistencia).$dynamic()
  if (claseNum) query = query.where(eq(asistencia.claseNumero, parseInt(claseNum)))
  if (userId) query = query.where(eq(asistencia.userId, parseInt(userId)))

  const result = await query
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'profesor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const { userId, claseNumero, presente } = body

  await db.insert(asistencia).values({
    userId,
    claseNumero,
    presente: presente ?? true,
    fecha: new Date(),
  }).onConflictDoUpdate({
    target: [asistencia.userId, asistencia.claseNumero],
    set: { presente: presente ?? true, fecha: new Date() },
  })

  return NextResponse.json({ ok: true })
}
