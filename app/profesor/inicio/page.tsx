'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Users, BookOpen, Award, ChevronRight, CheckCircle2, AlertTriangle, Unlock } from 'lucide-react'
import { clasesDemo } from '@/lib/data'
import { toast } from 'sonner'

export default function ProfesorInicioPage() {
  const { data: session } = useSession()
  const [alumnos, setAlumnos] = useState<any[]>([])
  const [clasesEstado, setClasesEstado] = useState<any[]>([])
  const [examenConfig, setExamenConfig] = useState<any>(null)
  const [examResultados, setExamResultados] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/alumnos').then(r => r.json()),
      fetch('/api/clases').then(r => r.json()),
      fetch('/api/examen/config').then(r => r.json()),
      fetch('/api/examen/resultados').then(r => r.json()),
    ]).then(([a, c, cfg, res]) => {
      setAlumnos(Array.isArray(a) ? a : [])
      setClasesEstado(Array.isArray(c) ? c : [])
      setExamenConfig(cfg)
      setExamResultados(Array.isArray(res) ? res : [])
    })
  }, [])

  const habilitadas = clasesEstado.filter(c => c.habilitada)
  const proximaAHabilitar = clasesEstado.find(c => !c.habilitada)
  const ultimaHabilitada = habilitadas[habilitadas.length - 1]
  const promedioAsistencia = alumnos.length > 0 ? Math.round(alumnos.reduce((s, a) => s + a.asistenciaPct, 0) / alumnos.length) : 0
  const aprobados = new Set(examResultados.filter(r => r.aprobado).map(r => r.userId)).size
  const alumnosConPocaAsistencia = alumnos.filter(a => a.asistenciaPct < 50)

  const habilitarProxima = async () => {
    if (!proximaAHabilitar) return
    await fetch(`/api/clases/${proximaAHabilitar.numero}/habilitar`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
    toast.success(`Clase ${proximaAHabilitar.numero} habilitada`)
    const c = await fetch('/api/clases').then(r => r.json())
    setClasesEstado(Array.isArray(c) ? c : [])
  }

  const user = session?.user as any

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold">Panel General</h1>
        <p className="text-muted-foreground mt-1">Bienvenido/a, {user?.name ?? 'Profesor'}</p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, color: 'blue', label: 'Alumnos activos', value: alumnos.filter(a => a.activo !== false).length },
          { icon: BookOpen, color: 'violet', label: 'Clases habilitadas', value: `${habilitadas.length}/22` },
          { icon: CheckCircle2, color: 'emerald', label: 'Asistencia promedio', value: `${promedioAsistencia}%` },
          { icon: Award, color: 'amber', label: 'Aprobaron examen', value: `${aprobados}/${alumnos.length}` },
        ].map(({ icon: Icon, color, label, value }) => (
          <Card key={label} className="shadow-itc hover-lift">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl lg:text-3xl font-bold mt-1 text-foreground">{value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 text-${color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Acción rápida - habilitar próxima clase */}
      {proximaAHabilitar && (
        <Card className="shadow-itc border-blue-200 bg-blue-50">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-semibold text-blue-900">Próxima clase a habilitar</p>
                <p className="text-blue-700 mt-1">
                  Clase {String(proximaAHabilitar.numero).padStart(2, '0')} — {clasesDemo.find(c => c.numero === proximaAHabilitar.numero)?.titulo}
                </p>
              </div>
              <Button onClick={habilitarProxima} className="gap-2 bg-blue-600 hover:bg-blue-700 flex-shrink-0">
                <Unlock className="h-4 w-4" />Habilitar para alumnos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {habilitadas.length === 22 && (
        <Card className="shadow-itc border-emerald-200 bg-emerald-50">
          <CardContent className="p-5 flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
            <p className="text-emerald-800 font-medium">¡Habilitaste todas las clases del curso!</p>
          </CardContent>
        </Card>
      )}

      {/* Alertas */}
      {alumnosConPocaAsistencia.length > 0 && (
        <Card className="shadow-itc border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Alumnos con baja asistencia (&lt;50%)</p>
                <div className="mt-2 space-y-1">
                  {alumnosConPocaAsistencia.map(a => (
                    <p key={a.id} className="text-sm text-amber-700">{a.nombre} — {a.asistenciaPct}%</p>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Examen */}
      <Card className="shadow-itc">
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Estado del examen final</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {examenConfig?.habilitado ? '🟢 Habilitado para los alumnos' : '🔴 No habilitado aún'}
              </p>
            </div>
            <Link href="/profesor/examenes">
              <Button variant="outline" className="gap-2">Gestionar<ChevronRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Top alumnos */}
      {alumnos.length > 0 && (
        <Card className="shadow-itc">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-heading">Alumnos — vista rápida</CardTitle>
              <Link href="/profesor/alumnos">
                <Button variant="ghost" size="sm" className="gap-1">Ver todos<ChevronRight className="h-4 w-4" /></Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {alumnos.slice(0, 5).map(a => (
              <div key={a.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                  {a.nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{a.nombre}</p>
                  <Progress value={Math.round((a.clasesCompletadas / 22) * 100)} className="h-1 mt-1" />
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{a.clasesCompletadas}/22</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
