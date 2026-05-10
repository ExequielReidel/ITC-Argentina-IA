import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { asistencia, users } from '@/lib/db/schema'
import { eq, and, inArray } from 'drizzle-orm'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'profesor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const profesorId = parseInt((session.user as any).id)
  const { searchParams } = new URL(req.url)
  const claseNum = searchParams.get('clase')
  const userId = searchParams.get('alumno')

  // Obtener solo IDs de alumnos de este profesor
  const misAlumnos = await db.select({ id: users.id }).from(users)
    .where(and(eq(users.role, 'alumno'), eq(users.profesorId, profesorId)))
  const alumnoIds = misAlumnos.map(a => a.id)

  if (alumnoIds.length === 0) return NextResponse.json([])

  const conditions = [inArray(asistencia.userId, alumnoIds)]
  if (claseNum) conditions.push(eq(asistencia.claseNumero, parseInt(claseNum)))
  if (userId) conditions.push(eq(asistencia.userId, parseInt(userId)))

  const result = await db.select().from(asistencia).where(and(...conditions))
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'profesor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const profesorId = parseInt((session.user as any).id)
  const body = await req.json()
  const { userId, claseNumero, presente } = body

  // Verificar que el alumno pertenece a este profesor
  const [alumno] = await db.select({ id: users.id }).from(users)
    .where(and(eq(users.id, userId), eq(users.profesorId, profesorId)))
  if (!alumno) return NextResponse.json({ error: 'Alumno no encontrado' }, { status: 404 })

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
