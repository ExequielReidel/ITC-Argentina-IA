'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { 
  CheckCircle2, 
  Circle, 
  Play,
  ExternalLink,
  Users,
  Save,
  FileText
} from 'lucide-react'
import { clasesDemo, alumnosDemo, getCategoriaBgLight } from '@/lib/data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function GestionClasesPage() {
  const [notasModal, setNotasModal] = useState<number | null>(null)
  const [notas, setNotas] = useState<Record<number, string>>({})

  // Simular alumnos que vieron cada clase
  const alumnosVieron = (claseNumero: number) => {
    const completadas = claseNumero <= 7 ? Math.floor(Math.random() * 5) + 12 : 0
    return completadas
  }

  const handleMarcarDictada = async (claseId: number) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success(`Clase ${claseId} marcada como dictada`)
  }

  const handleSaveNotas = () => {
    toast.success('Notas guardadas correctamente')
    setNotasModal(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
          Gestión de Clases
        </h1>
        <p className="text-muted-foreground mt-1">
          Administrá el avance de las 22 clases del curso
        </p>
      </div>

      {/* Progreso general */}
      <Card className="shadow-itc bg-gradient-to-r from-accent/5 to-transparent border-accent/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Progreso del curso</p>
              <p className="text-3xl font-bold mt-1">
                <span className="text-accent">{clasesDemo.filter(c => c.estado === 'completada').length}</span>
                <span className="text-muted-foreground"> / 22 clases dictadas</span>
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Dictada</span>
              </div>
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-blue-600" />
                <span>En curso</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-slate-400" />
                <span>Pendiente</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de clases */}
      <div className="space-y-4">
        {clasesDemo.map((clase) => {
          const vieron = alumnosVieron(clase.numero)
          const total = alumnosDemo.length
          
          return (
            <Card 
              key={clase.id} 
              className={cn(
                'shadow-itc transition-all',
                clase.estado === 'en_curso' && 'border-primary/50 bg-primary/5'
              )}
            >
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Info de la clase */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                      clase.estado === 'completada' && 'bg-emerald-100',
                      clase.estado === 'en_curso' && 'bg-blue-100',
                      clase.estado === 'bloqueada' && 'bg-slate-100'
                    )}>
                      {clase.estado === 'completada' && <CheckCircle2 className="h-6 w-6 text-emerald-600" />}
                      {clase.estado === 'en_curso' && <Play className="h-6 w-6 text-blue-600" />}
                      {clase.estado === 'bloqueada' && <Circle className="h-6 w-6 text-slate-400" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-heading font-bold text-lg">
                          Clase {String(clase.numero).padStart(2, '0')}
                        </span>
                        <Badge variant="outline" className={cn('text-xs', getCategoriaBgLight(clase.categoria))}>
                          {clase.categoriaLabel}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Fase {clase.fase}
                        </Badge>
                      </div>
                      <p className="font-medium text-foreground mt-1">{clase.titulo}</p>
                      
                      {clase.estado !== 'bloqueada' && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{vieron}/{total} alumnos la vieron</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.open(clase.htmlPath, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="hidden sm:inline">Vista previa</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => setNotasModal(clase.id)}
                    >
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">Notas</span>
                    </Button>

                    {clase.estado === 'en_curso' && (
                      <Button
                        size="sm"
                        className="gap-2 shadow-itc"
                        onClick={() => handleMarcarDictada(clase.numero)}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Marcar dictada
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Modal de notas */}
      <Dialog open={notasModal !== null} onOpenChange={() => setNotasModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">
              Notas de la Clase {notasModal}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Anotá temas que costaron más, preguntas frecuentes del grupo, etc.
            </p>
            <Textarea
              placeholder="Escribí tus notas sobre esta clase..."
              className="min-h-32"
              value={notas[notasModal || 0] || ''}
              onChange={(e) => setNotas({ ...notas, [notasModal || 0]: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotasModal(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveNotas} className="gap-2">
              <Save className="h-4 w-4" />
              Guardar notas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
