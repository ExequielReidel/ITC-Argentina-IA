'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, ChevronLeft, ChevronRight, Check, Clock, Maximize2, Minimize2, Lock } from 'lucide-react'
import { clasesDemo, getCategoriaBgLight } from '@/lib/data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function ClaseViewerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMarking, setIsMarking] = useState(false)
  const [habilitadas, setHabilitadas] = useState<number[]>([])
  const [completadas, setCompletadas] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  const claseNum = parseInt(id)
  const clase = clasesDemo.find(c => c.numero === claseNum)

  useEffect(() => {
    fetch('/api/clases')
      .then(r => r.json())
      .then(data => {
        setHabilitadas(data.habilitadas ?? [])
        setCompletadas(data.completadas ?? [])
        setLoading(false)
      })
  }, [])

  if (!clase) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Clase no encontrada</p>
      </div>
    )
  }

  const estaHabilitada = habilitadas.includes(claseNum)
  const estaCompletada = completadas.includes(claseNum)
  const puedeMarcar = estaHabilitada && !estaCompletada

  const prevNum = claseNum - 1
  const nextNum = claseNum + 1
  const prevClase = clasesDemo.find(c => c.numero === prevNum)
  const nextClase = clasesDemo.find(c => c.numero === nextNum)

  const handleMarkAsViewed = async () => {
    setIsMarking(true)
    const res = await fetch(`/api/clases/${claseNum}/completar`, { method: 'POST' })
    if (res.ok) {
      setCompletadas(prev => [...prev, claseNum])
      toast.success('¡Excelente! Clase marcada como completada.')
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
        <h2 className="font-heading text-xl font-bold">Esta clase aún no está disponible</h2>
        <p className="text-muted-foreground max-w-sm">Tu profesor todavía no habilitó esta clase. Volvé más tarde o consultale.</p>
        <Button variant="outline" onClick={() => router.push('/alumno/clases')}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Volver a mis clases
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
            <Button variant="ghost" size="icon" onClick={() => router.push('/alumno/clases')}>
              <X className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading font-bold text-lg text-primary">
                  Clase {String(clase.numero).padStart(2, '0')}
                </span>
                <Badge variant="outline" className={cn('text-xs', getCategoriaBgLight(clase.categoria))}>
                  {clase.categoriaLabel}
                </Badge>
                {estaCompletada && (
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                    ✓ Completada
                  </Badge>
                )}
              </div>
              <h1 className="font-semibold text-foreground truncate">{clase.titulo}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />{clase.duracion} min
            </span>
            <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Iframe con el HTML de la clase */}
      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-muted/30">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <iframe
            src={clase.htmlPath}
            className="w-full h-full border-0"
            title={clase.titulo}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
          />
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-card border-t border-border p-4 flex-shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div>
            {prevClase && habilitadas.includes(prevNum) && (
              <Button variant="outline" onClick={() => router.push(`/alumno/clases/${prevNum}`)} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Clase anterior</span>
              </Button>
            )}
          </div>

          {puedeMarcar && (
            <Button onClick={handleMarkAsViewed} disabled={isMarking} className="gap-2 shadow-itc">
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
              <span className="text-sm">Ya completaste esta clase</span>
            </div>
          )}

          <div>
            {nextClase && habilitadas.includes(nextNum) && (
              <Button variant="outline" onClick={() => router.push(`/alumno/clases/${nextNum}`)} className="gap-2">
                <span className="hidden sm:inline">Clase siguiente</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
