import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { users, progresoAlumnos, asistencia, clasesHabilitadas } from '@/lib/db/schema'
import { eq, and, count } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'profesor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const profesorId = parseInt((session.user as any).id)
  const alumnos = await db.select().from(users)
    .where(and(eq(users.role, 'alumno'), eq(users.profesorId, profesorId)))

  const habilitadas = await db.select().from(clasesHabilitadas)
    .where(eq(clasesHabilitadas.profesorId, profesorId))
  const totalHabilitadas = habilitadas.length || 1

  const result = await Promise.all(alumnos.map(async (a) => {
    const progreso = await db.select().from(progresoAlumnos)
      .where(and(eq(progresoAlumnos.userId, a.id), eq(progresoAlumnos.completada, true)))

    const asistencias = await db.select().from(asistencia)
      .where(and(eq(asistencia.userId, a.id), eq(asistencia.presente, true)))

    return {
      id: a.id,
      nombre: a.nombre,
      email: a.email,
      dni: a.dni,
      telefono: a.telefono,
      turno: a.turno,
      activo: a.activo,
      createdAt: a.createdAt,
      clasesCompletadas: progreso.length,
      asistenciaPct: Math.round((asistencias.length / totalHabilitadas) * 100),
    }
  }))

  return NextResponse.json(result)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'profesor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const profesorId = parseInt((session.user as any).id)
  const body = await req.json()
  const { nombre, email, dni, telefono, turno, password } = body

  if (!nombre || !email || !password) {
    return NextResponse.json({ error: 'Nombre, email y contraseña son obligatorios' }, { status: 400 })
  }

  const hash = await bcrypt.hash(password, 12)

  const [nuevo] = await db.insert(users).values({
    nombre,
    email: email.toLowerCase(),
    passwordHash: hash,
    dni: dni || null,
    telefono: telefono || null,
    turno: turno || null,
    role: 'alumno',
    activo: true,
    profesorId,
  }).returning({ id: users.id, nombre: users.nombre, email: users.email })

  return NextResponse.json(nuevo, { status: 201 })
}
