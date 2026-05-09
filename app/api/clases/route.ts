import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { clasesHabilitadas, progresoAlumnos, asistencia, users } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const role = (session.user as any).role
  const userId = parseInt((session.user as any).id)

  const habilitadas = await db.select().from(clasesHabilitadas)
  const habilitadasNums = new Set(habilitadas.map(h => h.claseNumero))

  if (role === 'alumno') {
    const progreso = await db.select().from(progresoAlumnos)
      .where(and(eq(progresoAlumnos.userId, userId), eq(progresoAlumnos.completada, true)))
    const completadasNums = new Set(progreso.map(p => p.claseNumero))

    // Presentes: clases a las que asistió → puede acceder
    const presenteRows = await db.select({ claseNumero: asistencia.claseNumero })
      .from(asistencia)
      .where(and(eq(asistencia.userId, userId), eq(asistencia.presente, true)))

    // Ausentes: el turno ya pasó pero faltó → bloqueada con estado "ausente"
    const ausenteRows = await db.select({ claseNumero: asistencia.claseNumero })
      .from(asistencia)
      .where(and(eq(asistencia.userId, userId), eq(asistencia.presente, false)))

    return NextResponse.json({
      habilitadas: presenteRows.map(r => r.claseNumero),
      completadas: Array.from(completadasNums),
      ausencias: ausenteRows.map(r => r.claseNumero),
    })
  }

  // Para el profesor: incluir cuántos alumnos completaron cada clase
  const alumnos = await db.select({ id: users.id }).from(users).where(eq(users.role, 'alumno'))
  const totalAlumnos = alumnos.length

  const porClase = await Promise.all(
    Array.from({ length: 22 }, (_, i) => i + 1).map(async (num) => {
      const completaron = await db.select().from(progresoAlumnos)
        .where(and(eq(progresoAlumnos.claseNumero, num), eq(progresoAlumnos.completada, true)))
      const nota = habilitadas.find(h => h.claseNumero === num)
      return {
        numero: num,
        habilitada: habilitadasNums.has(num),
        fechaHabilitada: nota?.fechaHabilitada ?? null,
        notasDocente: nota?.notasDocente ?? null,
        alumnosCompletaron: completaron.length,
        totalAlumnos,
      }
    })
  )

  return NextResponse.json(porClase)
}
