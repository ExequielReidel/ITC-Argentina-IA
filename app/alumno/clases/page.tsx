'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  RotateCcw, 
  Lock, 
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react'
import { clasesDemo, getCategoriaBgLight } from '@/lib/data'
import { cn } from '@/lib/utils'

export default function ClasesPage() {
  const [activeTab, setActiveTab] = useState('fase1')
  
  const fase1 = clasesDemo.filter(c => c.fase === 1)
  const fase2 = clasesDemo.filter(c => c.fase === 2)

  const renderClaseCard = (clase: typeof clasesDemo[0]) => {
    const isCompletada = clase.estado === 'completada'
    const isEnCurso = clase.estado === 'en_curso'
    const isBloqueada = clase.estado === 'bloqueada'

    return (
      <Card 
        key={clase.id} 
        className={cn(
          'shadow-itc hover-lift transition-all duration-300 overflow-hidden',
          isBloqueada && 'opacity-60'
        )}
      >
        <div className={cn(
          'h-1',
          clase.categoria === 'ia-aplicada' && 'bg-blue-500',
          clase.categoria === 'diseno-ia' && 'bg-pink-500',
          clase.categoria === 'estrategia' && 'bg-violet-500',
          clase.categoria === 'automatizacion' && 'bg-purple-500',
          clase.categoria === 'proyectos' && 'bg-emerald-500'
        )} />
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className={cn(
              'text-3xl font-bold font-heading',
              clase.categoria === 'ia-aplicada' && 'text-blue-600',
              clase.categoria === 'diseno-ia' && 'text-pink-600',
              clase.categoria === 'estrategia' && 'text-violet-600',
              clase.categoria === 'automatizacion' && 'text-purple-600',
              clase.categoria === 'proyectos' && 'text-emerald-600'
            )}>
              {String(clase.numero).padStart(2, '0')}
            </div>
            <div className="flex-shrink-0">
              {isCompletada && (
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
              )}
              {isEnCurso && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Play className="h-4 w-4 text-blue-600" />
                </div>
              )}
              {isBloqueada && (
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
              )}
            </div>
          </div>

          <h3 className="font-semibold text-foreground mt-3 line-clamp-2">
            {clase.titulo}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="outline" className={cn('text-xs', getCategoriaBgLight(clase.categoria))}>
              {clase.categoriaLabel}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {clase.duracion} min
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className={cn(
              'text-sm font-medium',
              isCompletada && 'text-emerald-600',
              isEnCurso && 'text-blue-600',
              isBloqueada && 'text-slate-400'
            )}>
              {isCompletada && 'Completada'}
              {isEnCurso && 'En curso'}
              {isBloqueada && 'Bloqueada'}
            </span>
            
            {isCompletada && (
              <Link href={`/alumno/clases/${clase.id}`}>
                <Button variant="outline" size="sm" className="gap-1">
                  <RotateCcw className="h-3 w-3" />
                  Repasar
                </Button>
              </Link>
            )}
            {isEnCurso && (
              <Link href={`/alumno/clases/${clase.id}`}>
                <Button size="sm" className="gap-1">
                  <Play className="h-3 w-3" />
                  Continuar
                </Button>
              </Link>
            )}
            {isBloqueada && (
              <Button variant="outline" size="sm" disabled className="gap-1">
                Próximamente
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
          Mis Clases
        </h1>
        <p className="text-muted-foreground mt-1">
          Accedé al contenido de las 22 clases del curso
        </p>
      </div>

      {/* Tabs de fases */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 h-12">
          <TabsTrigger value="fase1" className="text-sm lg:text-base">
            Fase 1 - IA Aplicada ({fase1.length} clases)
          </TabsTrigger>
          <TabsTrigger value="fase2" className="text-sm lg:text-base">
            Fase 2 - Automatización ({fase2.length} clases)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fase1" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fase1.map(renderClaseCard)}
          </div>
        </TabsContent>

        <TabsContent value="fase2" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fase2.map(renderClaseCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Info de desbloqueo */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4 flex items-start gap-3">
          <Lock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              Sistema de desbloqueo secuencial
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Las clases se desbloquean cuando tu profesor las marca como dictadas. Podés repasar las clases completadas en cualquier momento.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
