import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/admin-auth'

async function checkAdmin(req: NextRequest): Promise<boolean> {
  const cookie = req.cookies.get(COOKIE_NAME)
  return !!cookie && await verifyAdminToken(cookie.value)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin(req))) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id: idStr } = await params
  const id = parseInt(idStr)
  if (isNaN(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  const body = await req.json() as {
    nombre?: string
    email?: string
    dni?: string
    telefono?: string
    sede?: string
    activo?: boolean
    nuevaPassword?: string
  }

  const updates: Partial<typeof users.$inferInsert> = {}
  if (body.nombre !== undefined) updates.nombre = body.nombre.trim()
  if (body.email !== undefined) updates.email = body.email.toLowerCase().trim()
  if (body.dni !== undefined) updates.dni = body.dni.trim() || null
  if (body.telefono !== undefined) updates.telefono = body.telefono.trim() || null
  if (body.sede !== undefined) updates.turno = body.sede.trim() || null
  if (body.activo !== undefined) updates.activo = body.activo
  if (body.nuevaPassword) {
    updates.passwordHash = await bcrypt.hash(body.nuevaPassword, 12)
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Sin cambios para aplicar' }, { status: 400 })
  }

  await db.update(users).set(updates).where(eq(users.id, id))
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin(req))) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id: idStr } = await params
  const id = parseInt(idStr)
  if (isNaN(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  await db.update(users).set({ activo: false }).where(eq(users.id, id))
  return NextResponse.json({ ok: true })
}
