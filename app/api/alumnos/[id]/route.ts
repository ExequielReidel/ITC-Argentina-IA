import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { users, progresoAlumnos, asistencia, examenesResultados } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'profesor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  const userId = parseInt(id)

  const [alumno] = await db.select().from(users).where(eq(users.id, userId))
  if (!alumno) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  const progreso = await db.select().from(progresoAlumnos).where(eq(progresoAlumnos.userId, userId))
  const asistencias = await db.select().from(asistencia).where(eq(asistencia.userId, userId))
  const examenes = await db.select().from(examenesResultados).where(eq(examenesResultados.userId, userId))

  return NextResponse.json({ alumno, progreso, asistencias, examenes })
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'profesor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  const userId = parseInt(id)
  const body = await req.json()
  const { nombre, email, dni, telefono, turno, activo, nuevaPassword } = body

  const updateData: any = { nombre, email: email?.toLowerCase(), dni, telefono, turno, activo }
  if (nuevaPassword) {
    updateData.passwordHash = await bcrypt.hash(nuevaPassword, 12)
  }

  await db.update(users).set(updateData).where(eq(users.id, userId))
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'profesor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  await db.delete(users).where(eq(users.id, parseInt(id)))
  return NextResponse.json({ ok: true })
}
