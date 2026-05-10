import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { examenesResultados, users } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const role = (session.user as any).role
  const userId = parseInt((session.user as any).id)

  if (role === 'alumno') {
    const resultados = await db.select().from(examenesResultados)
      .where(eq(examenesResultados.userId, userId))
    return NextResponse.json(resultados)
  }

  // Para profesor: solo resultados de sus alumnos
  const profesorId = userId
  const resultados = await db
    .select({
      id: examenesResultados.id,
      userId: examenesResultados.userId,
      nombre: users.nombre,
      email: users.email,
      intentoNumero: examenesResultados.intentoNumero,
      puntaje: examenesResultados.puntaje,
      totalPreguntas: examenesResultados.totalPreguntas,
      aprobado: examenesResultados.aprobado,
      fechaInicio: examenesResultados.fechaInicio,
      fechaFin: examenesResultados.fechaFin,
    })
    .from(examenesResultados)
    .innerJoin(users, and(eq(examenesResultados.userId, users.id), eq(users.profesorId, profesorId)))

  return NextResponse.json(resultados)
}
