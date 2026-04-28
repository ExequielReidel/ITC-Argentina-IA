import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { progresoAlumnos, clasesHabilitadas } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(req: Request, { params }: { params: Promise<{ numero: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'alumno') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { numero } = await params
  const claseNum = parseInt(numero)
  const userId = parseInt((session.user as any).id)

  // Verificar que la clase esté habilitada
  const [habilitada] = await db.select().from(clasesHabilitadas)
    .where(eq(clasesHabilitadas.claseNumero, claseNum))

  if (!habilitada) {
    return NextResponse.json({ error: 'Esta clase aún no fue habilitada' }, { status: 403 })
  }

  await db.insert(progresoAlumnos).values({
    userId,
    claseNumero: claseNum,
    completada: true,
    fechaCompletada: new Date(),
  }).onConflictDoUpdate({
    target: [progresoAlumnos.userId, progresoAlumnos.claseNumero],
    set: { completada: true, fechaCompletada: new Date() },
  })

  return NextResponse.json({ ok: true })
}
