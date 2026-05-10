import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { examenConfig, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const role = (session.user as any).role
  const userId = parseInt((session.user as any).id)

  // Alumno: buscar el profesorId del alumno para encontrar su config de examen
  let targetProfesorId: number | null = null
  if (role === 'alumno') {
    const [alumnoRow] = await db.select({ profesorId: users.profesorId }).from(users).where(eq(users.id, userId))
    targetProfesorId = alumnoRow?.profesorId ?? null
  } else {
    targetProfesorId = userId
  }

  if (!targetProfesorId) return NextResponse.json({ habilitado: false, intentosPermitidos: 3, tiempoLimiteMin: 45, puntajeMinimo: 9 })

  const [config] = await db.select().from(examenConfig).where(eq(examenConfig.profesorId, targetProfesorId)).limit(1)
  if (!config) return NextResponse.json({ habilitado: false, intentosPermitidos: 3, tiempoLimiteMin: 45, puntajeMinimo: 9 })

  if (role === 'alumno') {
    const { passwordExamen, ...rest } = config
    return NextResponse.json({ ...rest, tienePassword: !!passwordExamen })
  }

  return NextResponse.json(config)
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'profesor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const profesorId = parseInt((session.user as any).id)
  const body = await req.json()
  const { habilitado, passwordExamen, intentosPermitidos, tiempoLimiteMin, puntajeMinimo } = body

  const [existing] = await db.select().from(examenConfig).where(eq(examenConfig.profesorId, profesorId)).limit(1)

  if (existing) {
    await db.update(examenConfig).set({
      habilitado: habilitado ?? existing.habilitado,
      passwordExamen: passwordExamen !== undefined ? passwordExamen : existing.passwordExamen,
      intentosPermitidos: intentosPermitidos ?? existing.intentosPermitidos,
      tiempoLimiteMin: tiempoLimiteMin ?? existing.tiempoLimiteMin,
      puntajeMinimo: puntajeMinimo ?? existing.puntajeMinimo,
      updatedAt: new Date(),
    }).where(eq(examenConfig.profesorId, profesorId))
  } else {
    await db.insert(examenConfig).values({ profesorId, habilitado, passwordExamen, intentosPermitidos, tiempoLimiteMin, puntajeMinimo })
  }

  return NextResponse.json({ ok: true })
}
