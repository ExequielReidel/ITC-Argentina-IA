'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { CheckCircle2, Circle, ExternalLink, Users, Save, Lock, Unlock } from 'lucide-react'
import { clasesDemo, getCategoriaBgLight } from '@/lib/data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ClaseEstado { numero: number; habilitada: boolean; fechaHabilitada: string | null; notasDocente: string | null; alumnosCompletaron: number; totalAlumnos: number }

export default function GestionClasesPage() {
  const [clasesEstado, setClasesEstado] = useState<ClaseEstado[]>([])
  const [notasModal, setNotasModal] = useState<number | null>(null)
  const [notasTexto, setNotasTexto] = useState('')
  const [loading, setLoading] = useState(true)

  const cargar = async () => {
    const data = await fetch('/api/clases').then(r => r.json())
    setClasesEstado(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  const toggleHabilitar = async (numero: number, habilitada: boolean) => {
    if (habilitada) {
      await fetch(`/api/clases/${numero}/habilitar`, { method: 'DELETE' })
      toast.success(`Clase ${numero} deshabilitada`)
    } else {
      await fetch(`/api/clases/${numero}/habilitar`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      toast.success(`Clase ${numero} habilitada para los alumnos`)
    }
    cargar()
  }

  const guardarNotas = async () => {
    if (!notasModal) return
    await fetch(`/api/clases/${notasModal}/habilitar`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notas: notasTexto }),
    })
    toast.success('Notas guardadas')
    setNotasModal(null)
    cargar()
  }

  const abrirNotas = (numero: number) => {
    const ce = clasesEstado.find(c => c.numero === numero)
    setNotasTexto(ce?.notasDocente ?? '')
    setNotasModal(numero)
  }

  const fase1 = clasesDemo.filter(c => c.fase === 1)
  const fase2 = clasesDemo.filter(c => c.fase === 2)

  const renderClase = (clase: typeof clasesDemo[0]) => {
    const ce = clasesEstado.find(c => c.numero === clase.numero)
    const habilitada = ce?.habilitada ?? false

    return (
      <Card key={clase.id} className={cn('shadow-itc transition-all', !habilitada && 'opacity-70')}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white',
              clase.categoria === 'ia-aplicada' ? 'bg-blue-500' : clase.categoria === 'diseno-ia' ? 'bg-pink-500' :
              clase.categoria === 'estrategia' ? 'bg-violet-500' : clase.categoria === 'automatizacion' ? 'bg-purple-500' : 'bg-emerald-500')}>
              {String(clase.numero).padStart(2, '0')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-sm">{clase.titulo}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={cn('text-xs', getCategoriaBgLight(clase.categoria))}>{clase.categoriaLabel}</Badge>
                    {habilitada && ce?.alumnosCompletaron !== undefined && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />{ce.alumnosCompletaron}/{ce.totalAlumnos} completaron
                      </span>
                    )}
                  </div>
                  {habilitada && ce?.fechaHabilitada && (
                    <p className="text-xs text-muted-foreground mt-1">Habilitada: {new Date(ce.fechaHabilitada).toLocaleDateString('es-AR')}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {habilitada ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Circle className="h-4 w-4 text-slate-300" />}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Button size="sm" variant={habilitada ? 'destructive' : 'default'}
                  className={cn('gap-1 h-7 text-xs', !habilitada && 'bg-emerald-600 hover:bg-emerald-700')}
                  onClick={() => toggleHabilitar(clase.numero, habilitada)}>
                  {habilitada ? <><Lock className="h-3 w-3" />Deshabilitar</> : <><Unlock className="h-3 w-3" />Habilitar</>}
                </Button>
                <Button size="sm" variant="outline" className="gap-1 h-7 text-xs" onClick={() => abrirNotas(clase.numero)}>
                  <Save className="h-3 w-3" />Notas
                </Button>
                <a href={clase.htmlPath} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs"><ExternalLink className="h-3 w-3" />Ver HTML</Button>
                </a>
              </div>
              {ce?.notasDocente && <p className="text-xs text-muted-foreground mt-2 bg-muted/50 rounded p-2 italic">📝 {ce.notasDocente}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold">Gestión de Clases</h1>
        <p className="text-muted-foreground mt-1">Habilitá las clases semana a semana para tus alumnos</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="font-heading text-lg font-bold mb-4">Fase 1 — IA Aplicada ({fase1.length} clases)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{fase1.map(renderClase)}</div>
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold mb-4">Fase 2 — Automatización ({fase2.length} clases)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{fase2.map(renderClase)}</div>
          </div>
        </div>
      )}

      <Dialog open={notasModal !== null} onOpenChange={() => setNotasModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notas — Clase {notasModal}</DialogTitle>
          </DialogHeader>
          <Textarea value={notasTexto} onChange={e => setNotasTexto(e.target.value)}
            placeholder="Temas que costaron más, preguntas frecuentes, observaciones..." rows={5} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotasModal(null)}>Cancelar</Button>
            <Button onClick={guardarNotas}><Save className="h-4 w-4 mr-2" />Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
