'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { clasesDemo } from '@/lib/data'
import { cn } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'

const CATEGORIAS = [
  { key: 'ia-aplicada',    nombre: 'IA Aplicada',     color: 'bg-blue-500' },
  { key: 'diseno-ia',      nombre: 'Diseño con IA',   color: 'bg-pink-500' },
  { key: 'estrategia',     nombre: 'Estrategia',      color: 'bg-violet-500' },
  { key: 'automatizacion', nombre: 'Automatización',  color: 'bg-purple-500' },
  { key: 'proyectos',      nombre: 'Proyectos',       color: 'bg-emerald-500' },
]

interface Insignia {
  id: string
  emoji: string
  nombre: string
  descripcion: string
  desbloqueada: boolean
}

function buildInsignias(
  completadas: number[],
  practicasCompletadas: number[],
  aprobado: boolean,
): Insignia[] {
  const fase1 = clasesDemo.filter(c => c.fase === 1).map(c => c.numero)
  const fase2 = clasesDemo.filter(c => c.fase === 2).map(c => c.numero)
  const todasFase1 = fase1.every(n => completadas.includes(n))
  const todasFase2 = fase2.every(n => completadas.includes(n))

  return [
    {
      id: 'primera-clase',
      emoji: '🌱',
      nombre: 'Primera Chispa',
      descripcion: 'Completaste tu primera clase del curso.',
      desbloqueada: completadas.length >= 1,
    },
    {
      id: 'cinco-clases',
      emoji: '🔥',
      nombre: 'En Racha',
      descripcion: 'Llevas 5 clases completadas. Vas muy bien.',
      desbloqueada: completadas.length >= 5,
    },
    {
      id: 'mitad',
      emoji: '⚡',
      nombre: 'Mitad del Camino',
      descripcion: 'Superaste la mitad del curso. 11 clases completadas.',
      desbloqueada: completadas.length >= 11,
    },
    {
      id: 'fase1',
      emoji: '🧠',
      nombre: 'Experto en IA',
      descripcion: 'Completaste todas las clases de la Fase 1 — IA Aplicada.',
      desbloqueada: todasFase1,
    },
    {
      id: 'fase2-inicio',
      emoji: '🤖',
      nombre: 'Primer Automatizador',
      descripcion: 'Completaste tu primera clase de la Fase 2 — Automatización.',
      desbloqueada: fase2.some(n => completadas.includes(n)),
    },
    {
      id: 'fase2',
      emoji: '⚙️',
      nombre: 'Arquitecto Digital',
      descripcion: 'Completaste todas las clases de la Fase 2 — Automatización.',
      desbloqueada: todasFase2,
    },
    {
      id: 'curso-completo',
      emoji: '🏆',
      nombre: 'Curso Completo',
      descripcion: 'Completaste las 22 clases del curso. ¡Logro máximo!',
      desbloqueada: completadas.length >= 22,
    },
    {
      id: 'practicante',
      emoji: '✏️',
      nombre: 'Practicante',
      descripcion: 'Realizaste 5 prácticas opcionales. Tu dedicación se nota.',
      desbloqueada: practicasCompletadas.length >= 5,
    },
    {
      id: 'practicante-pro',
      emoji: '📚',
      nombre: 'Curioso Profesional',
      descripcion: 'Realizaste 10 prácticas opcionales. Vas más allá.',
      desbloqueada: practicasCompletadas.length >= 10,
    },
    {
      id: 'aprobado',
      emoji: '🎓',
      nombre: 'Graduado',
      descripcion: 'Aprobaste el examen final del curso.',
      desbloqueada: aprobado,
    },
  ]
}

export default function ProgresoPage() {
  const [completadas, setCompletadas] = useState<number[]>([])
  const [habilitadas, setHabilitadas] = useState<number[]>([])
  const [practicasCompletadas, setPracticasCompletadas] = useState<number[]>([])
  const [resultados, setResultados] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const totalClases = 22

  useEffect(() => {
    Promise.all([
      fetch('/api/clases').then(r => r.json()),
      fetch('/api/practicas').then(r => r.json()),
      fetch('/api/examen/resultados').then(r => r.json()),
    ]).then(([clases, practicas, res]) => {
      setCompletadas(clases?.completadas ?? [])
      setHabilitadas(clases?.habilitadas ?? [])
      setPracticasCompletadas(practicas?.completadas ?? [])
      setResultados(Array.isArray(res) ? res : [])
      setCargando(false)
    })
  }, [])

  const pct = Math.round((completadas.length / totalClases) * 100)
  const aprobado = resultados.some(r => r.aprobado)
  const mejorPuntaje = resultados.length > 0 ? Math.max(...resultados.map(r => r.puntaje)) : null

  const categorias = CATEGORIAS.map(cat => {
    const clasesCat = clasesDemo.filter(c => c.categoria === cat.key)
    const completadasCat = clasesCat.filter(c => completadas.includes(c.numero)).length
    return { ...cat, completadas: completadasCat, total: clasesCat.length }
  })

  const insignias = buildInsignias(completadas, practicasCompletadas, aprobado)
  const desbloqueadas = insignias.filter(i => i.desbloqueada).length

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold">Mi Progreso</h1>
        <p className="text-muted-foreground mt-1">Seguí tu avance en el curso IA + Automatizaciones</p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-itc">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Clases completadas</p>
            <p className="text-3xl font-bold mt-1">
              <span className="text-primary">{completadas.length}</span>
              <span className="text-muted-foreground text-lg">/{totalClases}</span>
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-itc">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Progreso general</p>
            <p className="text-3xl font-bold mt-1 text-emerald-600">{pct}%</p>
          </CardContent>
        </Card>
        <Card className="shadow-itc">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Prácticas hechas</p>
            <p className="text-3xl font-bold mt-1 text-blue-600">{practicasCompletadas.length}</p>
          </CardContent>
        </Card>
        <Card className="shadow-itc">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Examen</p>
            <p className={cn('text-3xl font-bold mt-1', aprobado ? 'text-emerald-600' : 'text-muted-foreground')}>
              {aprobado ? `${mejorPuntaje}/15` : resultados.length > 0 ? 'Pendiente' : '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de progreso general */}
      <Card className="shadow-itc">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-semibold">Progreso general del curso</span>
            <span className="ml-auto font-bold text-primary">{pct}%</span>
          </div>
          <Progress value={pct} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">{completadas.length} de {totalClases} clases completadas</p>
        </CardContent>
      </Card>

      {/* Progreso por módulo */}
      <Card className="shadow-itc">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Progreso por módulo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categorias.map(cat => (
            <div key={cat.key} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{cat.nombre}</span>
                <span className="text-muted-foreground">{cat.completadas}/{cat.total} clases</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', cat.color)}
                  style={{ width: cat.total > 0 ? `${(cat.completadas / cat.total) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Insignias */}
      <Card className="shadow-itc">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-heading text-lg">Insignias</CardTitle>
            <span className="text-sm font-medium text-muted-foreground">
              {desbloqueadas}/{insignias.length} desbloqueadas
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {insignias.map(insignia => (
              <div
                key={insignia.id}
                title={insignia.descripcion}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-2xl border text-center transition-all duration-200 cursor-default select-none',
                  insignia.desbloqueada
                    ? 'bg-gradient-to-b from-amber-50 to-white border-amber-200 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
                )}
              >
                <span className={cn('text-3xl leading-none', !insignia.desbloqueada && 'filter grayscale')}>
                  {insignia.emoji}
                </span>
                <span className={cn(
                  'text-xs font-semibold leading-tight',
                  insignia.desbloqueada ? 'text-amber-800' : 'text-slate-400'
                )}>
                  {insignia.nombre}
                </span>
                {insignia.desbloqueada && (
                  <span className="text-[10px] text-amber-600 leading-tight">{insignia.descripcion}</span>
                )}
                {!insignia.desbloqueada && (
                  <span className="text-[10px] text-slate-400 leading-tight">Bloqueada</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
