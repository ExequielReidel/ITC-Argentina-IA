'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Check,
  Clock,
  Maximize2,
  Minimize2,
  Target,
  BookOpen,
  Wrench,
  ClipboardCheck,
  Hand,
  RotateCcw,
  CheckCircle2
} from 'lucide-react'
import { clasesDemo, getCategoriaBgLight } from '@/lib/data'
import { clasesContenido } from '@/lib/clases-contenido'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const seccionIconos = {
  objetivo: Target,
  bienvenida: Hand,
  repaso: RotateCcw,
  teoria: BookOpen,
  practica: Wrench,
  ejercicio: ClipboardCheck,
  cierre: CheckCircle2,
}

const seccionColores = {
  objetivo: 'border-blue-500 bg-blue-50',
  bienvenida: 'border-emerald-500 bg-emerald-50',
  repaso: 'border-slate-500 bg-slate-50',
  teoria: 'border-amber-500 bg-amber-50',
  practica: 'border-sky-500 bg-sky-50',
  ejercicio: 'border-violet-500 bg-violet-50',
  cierre: 'border-green-500 bg-green-50',
}

export default function ClaseViewerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMarking, setIsMarking] = useState(false)
  const [activeSeccion, setActiveSeccion] = useState(0)

  const claseId = parseInt(id)
  const clase = clasesDemo.find(c => c.id === claseId)
  const contenido = clasesContenido[claseId]
  
  if (!clase) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Clase no encontrada</p>
      </div>
    )
  }

  const prevClase = clasesDemo.find(c => c.id === claseId - 1)
  const nextClase = clasesDemo.find(c => c.id === claseId + 1)
  const canMarkAsViewed = clase.estado === 'en_curso' || clase.estado === 'completada'

  const handleMarkAsViewed = async () => {
    setIsMarking(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Clase marcada como completada')
    setIsMarking(false)
  }

  const handleClose = () => {
    router.push('/alumno/clases')
  }

  // Función para renderizar markdown simple
  const renderMarkdown = (text: string) => {
    return text
      .split('\n\n')
      .map((paragraph, i) => {
        // Headers
        if (paragraph.startsWith('### ')) {
          return <h3 key={i} className="text-lg font-bold text-foreground mt-6 mb-3">{paragraph.replace('### ', '')}</h3>
        }
        if (paragraph.startsWith('## ')) {
          return <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-4">{paragraph.replace('## ', '')}</h2>
        }
        
        // Blockquotes
        if (paragraph.startsWith('> ')) {
          const content = paragraph.replace(/^> /gm, '')
          return (
            <blockquote key={i} className="border-l-4 border-primary bg-primary/5 p-4 rounded-r-lg my-4 text-foreground">
              <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(content) }} />
            </blockquote>
          )
        }

        // Code blocks
        if (paragraph.startsWith('```')) {
          const code = paragraph.replace(/```\w*\n?/g, '').trim()
          return (
            <pre key={i} className="bg-slate-900 text-slate-100 p-4 rounded-xl my-4 overflow-x-auto text-sm font-mono whitespace-pre-wrap">
              {code}
            </pre>
          )
        }

        // Tables
        if (paragraph.includes('|') && paragraph.includes('---')) {
          const lines = paragraph.split('\n').filter(l => l.trim())
          const headers = lines[0].split('|').filter(h => h.trim()).map(h => h.trim())
          const rows = lines.slice(2).map(line => 
            line.split('|').filter(c => c.trim()).map(c => c.trim())
          )
          return (
            <div key={i} className="overflow-x-auto my-4">
              <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                <thead className="bg-muted">
                  <tr>
                    {headers.map((h, j) => (
                      <th key={j} className="p-3 text-left font-bold text-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-card">
                  {rows.map((row, j) => (
                    <tr key={j} className="border-t border-border">
                      {row.map((cell, k) => (
                        <td key={k} className="p-3 text-muted-foreground" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell) }} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        // Lists
        if (paragraph.match(/^[-*\d+\.]\s/m)) {
          const items = paragraph.split('\n').filter(l => l.trim())
          const isOrdered = items[0].match(/^\d+\./)
          const ListTag = isOrdered ? 'ol' : 'ul'
          return (
            <ListTag key={i} className={cn("my-4 space-y-2", isOrdered ? "list-decimal" : "list-disc", "ml-6")}>
              {items.map((item, j) => (
                <li key={j} className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item.replace(/^[-*\d+\.]\s*/, '')) }} />
              ))}
            </ListTag>
          )
        }

        // Horizontal rule
        if (paragraph.trim() === '---') {
          return <hr key={i} className="my-8 border-border" />
        }

        // Regular paragraph
        return (
          <p key={i} className="text-muted-foreground leading-relaxed my-4" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(paragraph) }} />
        )
      })
  }

  // Format inline markdown (bold, italic, links, inline code)
  const formatInlineMarkdown = (text: string): string => {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer">$1</a>')
  }

  return (
    <div className={cn(
      'bg-background',
      isFullscreen && 'fixed inset-0 z-50'
    )}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleClose}
            >
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
              </div>
              <h1 className="font-semibold text-foreground truncate">
                {clase.titulo}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {clase.duracion} min
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={cn(
        'bg-background',
        isFullscreen ? 'h-[calc(100vh-140px)]' : 'min-h-[70vh]'
      )}>
        {contenido ? (
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Objetivo de la clase */}
            <Card className="border-l-4 border-l-primary bg-primary/5 mb-8">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xs uppercase tracking-widest font-bold text-primary mb-2">
                      Objetivo de la clase
                    </h2>
                    <p className="text-foreground font-medium leading-relaxed">
                      {contenido.objetivo}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline de secciones */}
            <div className="flex flex-wrap gap-2 mb-8">
              {contenido.secciones.map((seccion, index) => {
                const Icon = seccionIconos[seccion.tipo] || BookOpen
                return (
                  <Button
                    key={index}
                    variant={activeSeccion === index ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveSeccion(index)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{seccion.titulo.split(' ').slice(0, 2).join(' ')}</span>
                    {seccion.duracion && (
                      <span className="text-xs opacity-70">{seccion.duracion}min</span>
                    )}
                  </Button>
                )
              })}
            </div>

            {/* Contenido de la sección activa */}
            <ScrollArea className={isFullscreen ? 'h-[calc(100vh-320px)]' : ''}>
              {contenido.secciones.map((seccion, index) => {
                const Icon = seccionIconos[seccion.tipo] || BookOpen
                if (index !== activeSeccion) return null
                
                return (
                  <Card 
                    key={index} 
                    className={cn(
                      'border-l-4',
                      seccionColores[seccion.tipo] || 'border-slate-500 bg-slate-50'
                    )}
                  >
                    <CardContent className="p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          seccion.tipo === 'objetivo' && 'bg-blue-500 text-white',
                          seccion.tipo === 'bienvenida' && 'bg-emerald-500 text-white',
                          seccion.tipo === 'repaso' && 'bg-slate-500 text-white',
                          seccion.tipo === 'teoria' && 'bg-amber-500 text-white',
                          seccion.tipo === 'practica' && 'bg-sky-500 text-white',
                          seccion.tipo === 'ejercicio' && 'bg-violet-500 text-white',
                          seccion.tipo === 'cierre' && 'bg-green-500 text-white',
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
                            {seccion.tipo.charAt(0).toUpperCase() + seccion.tipo.slice(1)}
                            {seccion.duracion && ` · ${seccion.duracion} min`}
                          </p>
                          <h3 className="text-xl font-bold text-foreground">
                            {seccion.titulo}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="prose prose-slate max-w-none">
                        {renderMarkdown(seccion.contenido)}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </ScrollArea>

            {/* Navegación entre secciones */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setActiveSeccion(Math.max(0, activeSeccion - 1))}
                disabled={activeSeccion === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              
              <span className="text-sm text-muted-foreground">
                {activeSeccion + 1} / {contenido.secciones.length}
              </span>
              
              <Button
                variant="outline"
                onClick={() => setActiveSeccion(Math.min(contenido.secciones.length - 1, activeSeccion + 1))}
                disabled={activeSeccion === contenido.secciones.length - 1}
                className="gap-2"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          // Placeholder para clases sin contenido
          <div className="w-full h-full flex items-center justify-center bg-muted/50 border-y border-border min-h-[400px]">
            <div className="text-center p-8 max-w-md">
              <div className={cn(
                'w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center',
                clase.categoria === 'ia-aplicada' && 'bg-blue-100',
                clase.categoria === 'diseno-ia' && 'bg-pink-100',
                clase.categoria === 'estrategia' && 'bg-violet-100',
                clase.categoria === 'automatizacion' && 'bg-purple-100',
                clase.categoria === 'proyectos' && 'bg-emerald-100'
              )}>
                <span className="text-3xl font-bold font-heading text-slate-700">
                  {String(clase.numero).padStart(2, '0')}
                </span>
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                {clase.titulo}
              </h2>
              <p className="text-muted-foreground mt-2">
                El contenido de esta clase estara disponible proximamente.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Las primeras 4 clases ya tienen contenido completo disponible.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Navigation */}
      <div className="sticky bottom-0 bg-card border-t border-border p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {prevClase && prevClase.estado !== 'bloqueada' && (
              <Button
                variant="outline"
                onClick={() => router.push(`/alumno/clases/${prevClase.id}`)}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Clase anterior</span>
              </Button>
            )}
          </div>

          {canMarkAsViewed && (
            <Button 
              onClick={handleMarkAsViewed}
              disabled={isMarking}
              className="gap-2"
            >
              {isMarking ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Marcar como vista
                </>
              )}
            </Button>
          )}

          <div className="flex items-center gap-2">
            {nextClase && nextClase.estado !== 'bloqueada' && (
              <Button
                variant="outline"
                onClick={() => router.push(`/alumno/clases/${nextClase.id}`)}
                className="gap-2"
              >
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
