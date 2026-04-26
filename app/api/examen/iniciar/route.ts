import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { examenConfig, preguntasExamen, examenesResultados } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'alumno') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const userId = parseInt((session.user as any).id)
  const { password } = await req.json()

  const [config] = await db.select().from(examenConfig).limit(1)
  if (!config?.habilitado) {
    return NextResponse.json({ error: 'El examen no está habilitado aún' }, { status: 403 })
  }

  if (config.passwordExamen && config.passwordExamen !== password) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  // Verificar intentos
  const intentosPrevios = await db.select().from(examenesResultados)
    .where(eq(examenesResultados.userId, userId))
  const intentosUsados = intentosPrevios.length

  if (intentosUsados >= (config.intentosPermitidos ?? 3)) {
    return NextResponse.json({ error: `Usaste los ${config.intentosPermitidos} intentos permitidos` }, { status: 403 })
  }

  // Verificar si ya aprobó
  const yaAprobo = intentosPrevios.some(i => i.aprobado)
  if (yaAprobo) {
    return NextResponse.json({ error: 'Ya aprobaste el examen' }, { status: 403 })
  }

  // Seleccionar 15 preguntas aleatorias del banco activo
  const todasPreguntas = await db.select().from(preguntasExamen).where(eq(preguntasExamen.activa, true))
  const seleccionadas = shuffle(todasPreguntas).slice(0, 15)

  // Registrar inicio del intento
  const [intento] = await db.insert(examenesResultados).values({
    userId,
    intentoNumero: intentosUsados + 1,
    puntaje: 0,
    totalPreguntas: 15,
    aprobado: false,
    fechaInicio: new Date(),
    preguntasIds: seleccionadas.map(p => p.id),
  }).returning()

  // Devolver preguntas SIN la respuesta correcta
  const preguntasSinRespuesta = seleccionadas.map(p => ({
    id: p.id,
    enunciado: p.enunciado,
    opcionA: p.opcionA,
    opcionB: p.opcionB,
    opcionC: p.opcionC,
    opcionD: p.opcionD,
  }))

  return NextResponse.json({
    intentoId: intento.id,
    intentoNumero: intentosUsados + 1,
    intentosRestantes: (config.intentosPermitidos ?? 3) - intentosUsados - 1,
    tiempoLimiteMin: config.tiempoLimiteMin ?? 45,
    puntajeMinimo: config.puntajeMinimo ?? 9,
    preguntas: preguntasSinRespuesta,
  })
}
