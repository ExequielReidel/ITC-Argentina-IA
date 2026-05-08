'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, RotateCcw, Lock, CheckCircle2, Clock, PenLine } from 'lucide-react'
import { practicasDemo, getCategoriaBgLight } from '@/lib/data'
import { cn } from '@/lib/utils'

export default function PracticasPage() {
  const [activeTab, setActiveTab] = useState('fase1')
  const [habilitadas, setHabilitadas] = useState<number[]>([])
  const [completadas, setCompletadas] = useState<number[]>([])

  useEffect(() => {
    fetch('/api/practicas')
      .then(r => r.json())
      .then(data => {
        setHabilitadas(data.habilitadas ?? [])
        setCompletadas(data.completadas ?? [])
      })
  }, [])

  const getEstado = (numero: number) => {
    if (completadas.includes(numero)) return 'completada'
    if (habilitadas.includes(numero)) return 'disponible'
    return 'bloqueada'
  }

  const fase1 = practicasDemo.filter(p => p.fase === 1)
  const fase2 = practicasDemo.filter(p => p.fase === 2)
  const totalCompletadas = completadas.length
  const totalHabilitadas = habilitadas.length

  const renderCard = (practica: typeof practicasDemo[0]) => {
    const estado = getEstado(practica.numero)
    const isCompletada = estado === 'completada'
    const isDisponible = estado === 'disponible'
    const isBloqueada = estado === 'bloqueada'

    return (
      <Card key={practica.id} className={cn('shadow-itc hover-lift transition-all duration-300 overflow-hidden', isBloqueada && 'opacity-60')}>
        <div className={cn('h-1',
          practica.categoria === 'ia-aplicada'    && 'bg-blue-500',
          practica.categoria === 'diseno-ia'      && 'bg-pink-500',
          practica.categoria === 'estrategia'     && 'bg-violet-500',
          practica.categoria === 'automatizacion' && 'bg-purple-500',
          practica.categoria === 'proyectos'      && 'bg-emerald-500',
        )} />
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className={cn('text-3xl font-bold font-heading',
              practica.categoria === 'ia-aplicada'    && 'text-blue-600',
              practica.categoria === 'diseno-ia'      && 'text-pink-600',
              practica.categoria === 'estrategia'     && 'text-violet-600',
              practica.categoria === 'automatizacion' && 'text-purple-600',
              practica.categoria === 'proyectos'      && 'text-emerald-600',
            )}>
              {String(practica.numero).padStart(2, '0')}
            </div>
            <div className="flex-shrink-0">
              {isCompletada  && <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center"><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div>}
              {isDisponible  && <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><PenLine className="h-4 w-4 text-blue-600" /></div>}
              {isBloqueada   && <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><Lock className="h-4 w-4 text-slate-400" /></div>}
            </div>
          </div>

          <h3 className="font-semibold text-foreground mt-3 line-clamp-2">{practica.titulo}</h3>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="outline" className={cn('text-xs', getCategoriaBgLight(practica.categoria))}>
              {practica.categoriaLabel}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              ~{practica.duracion} min
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className={cn('text-sm font-medium',
              isCompletada && 'text-emerald-600',
              isDisponible && 'text-blue-600',
              isBloqueada  && 'text-slate-400',
            )}>
              {isCompletada && 'Completada'}
              {isDisponible && 'Disponible'}
              {isBloqueada  && 'Bloqueada'}
            </span>
            {isCompletada && (
              <Link href={`/alumno/practicas/${practica.numero}`}>
                <Button variant="outline" size="sm" className="gap-1"><RotateCcw className="h-3 w-3" />Repasar</Button>
              </Link>
            )}
            {isDisponible && (
              <Link href={`/alumno/practicas/${practica.numero}`}>
                <Button size="sm" className="gap-1"><Play className="h-3 w-3" />Hacer</Button>
              </Link>
            )}
            {isBloqueada && (
              <Button variant="outline" size="sm" disabled>Próximamente</Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">Mis Prácticas</h1>
          <p className="text-muted-foreground mt-1">Ejercicios opcionales para reforzar lo visto en clase</p>
        </div>
        {totalHabilitadas > 0 && (
          <p className="text-sm font-medium text-emerald-600">
            {totalCompletadas} / {totalHabilitadas} completadas
          </p>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 h-12">
          <TabsTrigger value="fase1" className="text-sm lg:text-base">Fase 1 — IA Aplicada ({fase1.length} prácticas)</TabsTrigger>
          <TabsTrigger value="fase2" className="text-sm lg:text-base">Fase 2 — Automatización ({fase2.length} prácticas)</TabsTrigger>
        </TabsList>
        <TabsContent value="fase1" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{fase1.map(renderCard)}</div>
        </TabsContent>
        <TabsContent value="fase2" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{fase2.map(renderCard)}</div>
        </TabsContent>
      </Tabs>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4 flex items-start gap-3">
          <PenLine className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">Las prácticas son opcionales</p>
            <p className="text-sm text-blue-700 mt-1">No son obligatorias ni afectan la nota final, pero te ayudan a reforzar y aplicar lo aprendido. Se habilitan junto con cada clase.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
