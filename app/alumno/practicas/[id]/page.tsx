'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, ChevronLeft, ChevronRight, Check, Clock, Maximize2, Minimize2, Lock, PenLine } from 'lucide-react'
import { practicasDemo, getCategoriaBgLight } from '@/lib/data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function PracticaViewerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMarking, setIsMarking] = useState(false)
  const [habilitadas, setHabilitadas] = useState<number[]>([])
  const [completadas, setCompletadas] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  const practicaNum = parseInt(id)
  const practica = practicasDemo.find(p => p.numero === practicaNum)

  useEffect(() => {
    fetch('/api/practicas')
      .then(r => r.json())
      .then(data => {
        setHabilitadas(data.habilitadas ?? [])
        setCompletadas(data.completadas ?? [])
        setLoading(false)
      })
  }, [])

  if (!practica) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Práctica no encontrada</p>
      </div>
    )
  }

  const estaHabilitada = habilitadas.includes(practicaNum)
  const estaCompletada = completadas.includes(practicaNum)
  const puedeMarcar = estaHabilitada && !estaCompletada

  const prevNum = practicaNum - 1
  const nextNum = practicaNum + 1
  const prevPractica = practicasDemo.find(p => p.numero === prevNum)
  const nextPractica = practicasDemo.find(p => p.numero === nextNum)

  const handleMarkAsCompleted = async () => {
    setIsMarking(true)
    const res = await fetch(`/api/practicas/${practicaNum}/completar`, { method: 'POST' })
    if (res.ok) {
      setCompletadas(prev => [...prev, practicaNum])
      toast.success('¡Muy bien! Práctica marcada como completada.')
    } else {
      const data = await res.json()
      toast.error(data.error ?? 'No se pudo guardar')
    }
    setIsMarking(false)
  }

  if (!loading && !estaHabilitada) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center p-8">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
          <Lock className="h-10 w-10 text-slate-400" />
        </div>
        <h2 className="font-heading text-xl font-bold">Esta práctica aún no está disponible</h2>
        <p className="text-muted-foreground max-w-sm">Se habilitará automáticamente cuando tu profesor abra la clase correspondiente.</p>
        <Button variant="outline" onClick={() => router.push('/alumno/practicas')}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Volver a mis prácticas
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('bg-background flex flex-col', isFullscreen ? 'fixed inset-0 z-50 h-screen' : 'h-[calc(100vh-4rem)]')}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border p-4 flex-shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Button variant="ghost" size="icon" onClick={() => router.push('/alumno/practicas')}>
              <X className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading font-bold text-lg text-primary">
                  Práctica {String(practica.numero).padStart(2, '0')}
                </span>
                <Badge variant="outline" className={cn('text-xs', getCategoriaBgLight(practica.categoria))}>
                  {practica.categoriaLabel}
                </Badge>
                {estaCompletada && (
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                    ✓ Completada
                  </Badge>
                )}
              </div>
              <h1 className="font-semibold text-foreground truncate">{practica.titulo}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />~{practica.duracion} min
            </span>
            <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Iframe */}
      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-muted/30">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <iframe
            src={practica.htmlPath}
            className="w-full h-full border-0"
            title={practica.titulo}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
          />
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-card border-t border-border p-4 flex-shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div>
            {prevPractica && habilitadas.includes(prevNum) && (
              <Button variant="outline" onClick={() => router.push(`/alumno/practicas/${prevNum}`)} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Anterior</span>
              </Button>
            )}
          </div>

          {puedeMarcar && (
            <Button onClick={handleMarkAsCompleted} disabled={isMarking} className="gap-2 shadow-itc">
              {isMarking ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Guardando...</>
              ) : (
                <><Check className="h-4 w-4" />Marcar como completada</>
              )}
            </Button>
          )}

          {estaCompletada && (
            <div className="flex items-center gap-2 text-emerald-600 font-medium">
              <Check className="h-4 w-4" />
              <span className="text-sm">Práctica completada</span>
            </div>
          )}

          <div>
            {nextPractica && habilitadas.includes(nextNum) && (
              <Button variant="outline" onClick={() => router.push(`/alumno/practicas/${nextNum}`)} className="gap-2">
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
