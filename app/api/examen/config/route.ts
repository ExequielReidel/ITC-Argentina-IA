import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { examenConfig } from '@/lib/db/schema'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const [config] = await db.select().from(examenConfig).limit(1)
  if (!config) return NextResponse.json({ habilitado: false, intentosPermitidos: 3, tiempoLimiteMin: 45, puntajeMinimo: 9 })

  // Para alumnos no mostramos la contraseña
  const role = (session.user as any).role
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

  const body = await req.json()
  const { habilitado, passwordExamen, intentosPermitidos, tiempoLimiteMin, puntajeMinimo } = body

  const [existing] = await db.select().from(examenConfig).limit(1)

  if (existing) {
    await db.update(examenConfig).set({
      habilitado: habilitado ?? existing.habilitado,
      passwordExamen: passwordExamen !== undefined ? passwordExamen : existing.passwordExamen,
      intentosPermitidos: intentosPermitidos ?? existing.intentosPermitidos,
      tiempoLimiteMin: tiempoLimiteMin ?? existing.tiempoLimiteMin,
      puntajeMinimo: puntajeMinimo ?? existing.puntajeMinimo,
      updatedAt: new Date(),
    })
  } else {
    await db.insert(examenConfig).values({ habilitado, passwordExamen, intentosPermitidos, tiempoLimiteMin, puntajeMinimo })
  }

  return NextResponse.json({ ok: true })
}
