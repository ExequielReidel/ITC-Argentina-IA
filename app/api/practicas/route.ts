import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { asistencia, progresoPracticas } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'alumno') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const userId = parseInt((session.user as any).id)

  // Las prácticas se habilitan solo para alumnos que asistieron a la clase correspondiente
  const presenteRows = await db.select({ claseNumero: asistencia.claseNumero })
    .from(asistencia)
    .where(and(eq(asistencia.userId, userId), eq(asistencia.presente, true)))
  const habilitadasNums = presenteRows.map(r => r.claseNumero)

  const completadas = await db.select({ practicaNumero: progresoPracticas.practicaNumero })
    .from(progresoPracticas)
    .where(and(eq(progresoPracticas.userId, userId), eq(progresoPracticas.completada, true)))
  const completadasNums = completadas.map(p => p.practicaNumero)

  return NextResponse.json({ habilitadas: habilitadasNums, completadas: completadasNums })
}
