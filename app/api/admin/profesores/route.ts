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

export async function GET(req: NextRequest) {
  if (!(await checkAdmin(req))) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const profesores = await db
    .select({
      id: users.id,
      nombre: users.nombre,
      email: users.email,
      dni: users.dni,
      telefono: users.telefono,
      sede: users.turno,
      activo: users.activo,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.role, 'profesor'))

  return NextResponse.json(profesores)
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin(req))) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json() as {
    nombre: string
    email: string
    dni?: string
    telefono?: string
    sede?: string
    password: string
  }

  if (!body.nombre?.trim() || !body.email?.trim() || !body.password) {
    return NextResponse.json({ error: 'Nombre, email y contraseña son obligatorios' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    return NextResponse.json({ error: 'El formato del email no es válido' }, { status: 400 })
  }

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, body.email.toLowerCase()))
  if (existing.length > 0) {
    return NextResponse.json({ error: 'Ya existe un usuario con ese email' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(body.password, 12)

  const [nuevo] = await db
    .insert(users)
    .values({
      nombre: body.nombre.trim(),
      email: body.email.toLowerCase().trim(),
      passwordHash,
      dni: body.dni?.trim() || null,
      telefono: body.telefono?.trim() || null,
      turno: body.sede?.trim() || null,
      role: 'profesor',
      activo: true,
    })
    .returning({ id: users.id, nombre: users.nombre, email: users.email })

  return NextResponse.json(nuevo, { status: 201 })
}
