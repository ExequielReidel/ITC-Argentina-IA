import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { asistencia, progresoPracticas } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(_req: Request, { params }: { params: Promise<{ numero: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'alumno') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { numero } = await params
  const practicaNumero = parseInt(numero)
  const userId = parseInt((session.user as any).id)

  if (isNaN(practicaNumero)) {
    return NextResponse.json({ error: 'Número inválido' }, { status: 400 })
  }

  // Solo puede completar la práctica si asistió a la clase correspondiente
  const [asistenciaRow] = await db.select()
    .from(asistencia)
    .where(and(eq(asistencia.userId, userId), eq(asistencia.claseNumero, practicaNumero), eq(asistencia.presente, true)))

  if (!asistenciaRow) {
    return NextResponse.json({ error: 'Práctica no disponible' }, { status: 403 })
  }

  await db.insert(progresoPracticas).values({
    userId,
    practicaNumero,
    completada: true,
    fechaCompletada: new Date(),
  }).onConflictDoUpdate({
    target: [progresoPracticas.userId, progresoPracticas.practicaNumero],
    set: { completada: true, fechaCompletada: new Date() },
  })

  return NextResponse.json({ ok: true })
}
