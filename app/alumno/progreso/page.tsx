'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { clasesDemo } from '@/lib/data'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle, BookOpen, Award, TrendingUp } from 'lucide-react'

const CATEGORIAS = [
  { key: 'ia-aplicada', nombre: 'IA Aplicada', color: 'bg-blue-500' },
  { key: 'diseno-ia', nombre: 'Diseño con IA', color: 'bg-pink-500' },
  { key: 'estrategia', nombre: 'Estrategia', color: 'bg-violet-500' },
  { key: 'automatizacion', nombre: 'Automatización', color: 'bg-purple-500' },
  { key: 'proyectos', nombre: 'Proyectos', color: 'bg-emerald-500' },
]

export default function ProgresoPage() {
  const [completadas, setCompletadas] = useState<number[]>([])
  const [habilitadas, setHabilitadas] = useState<number[]>([])
  const [resultados, setResultados] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const totalClases = 22

  useEffect(() => {
    Promise.all([
      fetch('/api/clases').then(r => r.json()),
      fetch('/api/examen/resultados').then(r => r.json()),
    ]).then(([clases, res]) => {
      setCompletadas(clases?.completadas ?? [])
      setHabilitadas(clases?.habilitadas ?? [])
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
            <p className="text-sm text-muted-foreground">Clases disponibles</p>
            <p className="text-3xl font-bold mt-1 text-blue-600">{habilitadas.length}</p>
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

      {/* Lista de clases */}
      <Card className="shadow-itc">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Detalle por clase</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {clasesDemo.map(clase => {
              const esCompletada = completadas.includes(clase.numero)
              const esHabilitada = habilitadas.includes(clase.numero)
              return (
                <div key={clase.numero} className="flex items-center gap-3 p-3">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold',
                    esCompletada ? 'bg-emerald-100 text-emerald-700' : esHabilitada ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400')}>
                    {String(clase.numero).padStart(2, '0')}
                  </div>
                  <span className={cn('flex-1 text-sm truncate', !esHabilitada && 'text-muted-foreground')}>
                    {clase.titulo}
                  </span>
                  {esCompletada
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    : esHabilitada
                      ? <Circle className="h-4 w-4 text-blue-400 flex-shrink-0" />
                      : <Circle className="h-4 w-4 text-slate-200 flex-shrink-0" />
                  }
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
