import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { examenesResultados, preguntasExamen, examenConfig } from '@/lib/db/schema'
import { eq, inArray } from 'drizzle-orm'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'alumno') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const userId = parseInt((session.user as any).id)
  const { intentoId, respuestas } = await req.json()
  // respuestas: { [preguntaId]: 'a' | 'b' | 'c' | 'd' }

  const [intento] = await db.select().from(examenesResultados)
    .where(eq(examenesResultados.id, intentoId))

  if (!intento || intento.userId !== userId) {
    return NextResponse.json({ error: 'Intento inválido' }, { status: 403 })
  }

  const preguntaIds = (intento.preguntasIds as number[]) ?? []
  const preguntas = await db.select().from(preguntasExamen)
    .where(inArray(preguntasExamen.id, preguntaIds))

  let puntaje = 0
  const detalle: Record<number, { correcta: string; dada: string; ok: boolean }> = {}

  for (const p of preguntas) {
    const dada = respuestas[p.id] ?? null
    const ok = dada === p.respuestaCorrecta
    if (ok) puntaje++
    detalle[p.id] = { correcta: p.respuestaCorrecta, dada, ok }
  }

  const [config] = await db.select().from(examenConfig).limit(1)
  const puntajeMinimo = config?.puntajeMinimo ?? 9
  const aprobado = puntaje >= puntajeMinimo

  await db.update(examenesResultados).set({
    puntaje,
    totalPreguntas: preguntas.length,
    aprobado,
    fechaFin: new Date(),
    respuestas: detalle,
  }).where(eq(examenesResultados.id, intentoId))

  return NextResponse.json({ puntaje, total: preguntas.length, aprobado, puntajeMinimo, detalle })
}
