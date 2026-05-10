import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { clasesHabilitadas } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(req: Request, { params }: { params: Promise<{ numero: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'profesor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const profesorId = parseInt((session.user as any).id)
  const { numero } = await params
  const claseNum = parseInt(numero)
  const body = await req.json().catch(() => ({}))
  const { notas } = body

  await db.insert(clasesHabilitadas).values({
    claseNumero: claseNum,
    profesorId,
    notasDocente: notas || null,
  }).onConflictDoUpdate({
    target: [clasesHabilitadas.claseNumero, clasesHabilitadas.profesorId],
    set: { fechaHabilitada: new Date(), notasDocente: notas || null },
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ numero: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'profesor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const profesorId = parseInt((session.user as any).id)
  const { numero } = await params
  await db.delete(clasesHabilitadas)
    .where(and(eq(clasesHabilitadas.claseNumero, parseInt(numero)), eq(clasesHabilitadas.profesorId, profesorId)))
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ numero: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'profesor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const profesorId = parseInt((session.user as any).id)
  const { numero } = await params
  const { notas } = await req.json()
  await db.update(clasesHabilitadas)
    .set({ notasDocente: notas })
    .where(and(eq(clasesHabilitadas.claseNumero, parseInt(numero)), eq(clasesHabilitadas.profesorId, profesorId)))

  return NextResponse.json({ ok: true })
}
