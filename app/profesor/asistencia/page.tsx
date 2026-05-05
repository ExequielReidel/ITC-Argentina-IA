'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle2, XCircle, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ClaseInfo { numero: number; habilitada: boolean }
interface Alumno { id: number; nombre: string; email: string; turno?: string }
interface AsistenciaRecord { userId: number; claseNumero: number; presente: boolean }

export default function AsistenciaPage() {
  const [clases, setClases] = useState<ClaseInfo[]>([])
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [claseSeleccionada, setClaseSeleccionada] = useState<string>('')
  const [asistencias, setAsistencias] = useState<Record<number, boolean>>({})
  const [guardando, setGuardando] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/clases').then(r => r.json()).then((data: ClaseInfo[]) => {
      if (Array.isArray(data)) setClases(data.filter(c => c.habilitada))
    }).catch(() => {})
    fetch('/api/alumnos').then(r => r.json()).then((data: any[]) => {
      if (Array.isArray(data)) setAlumnos(data.filter(a => a.activo !== false))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!claseSeleccionada) return
    fetch(`/api/asistencia?clase=${claseSeleccionada}`)
      .then(r => r.json())
      .then((rows: AsistenciaRecord[]) => {
        const map: Record<number, boolean> = {}
        rows.forEach(r => { map[r.userId] = r.presente })
        setAsistencias(map)
      })
      .catch(() => {})
  }, [claseSeleccionada])

  const toggleAsistencia = async (alumnoId: number, presente: boolean) => {
    setGuardando(alumnoId)
    const res = await fetch('/api/asistencia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: alumnoId, claseNumero: parseInt(claseSeleccionada), presente }),
    })
    if (res.ok) {
      setAsistencias(prev => ({ ...prev, [alumnoId]: presente }))
      toast.success(presente ? 'Marcado presente' : 'Marcado ausente')
    } else {
      toast.error('Error al guardar')
    }
    setGuardando(null)
  }

  const presentesCount = Object.values(asistencias).filter(Boolean).length
  const ausentesCount = Object.values(asistencias).filter(v => v === false).length
  const sinRegistro = alumnos.length - Object.keys(asistencias).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold">Asistencia</h1>
        <p className="text-muted-foreground mt-1">Registrá la asistencia de tus alumnos por clase</p>
      </div>

      <Card className="shadow-itc">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Seleccioná una clase</label>
              <Select value={claseSeleccionada} onValueChange={setClaseSeleccionada}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Clase..." />
                </SelectTrigger>
                <SelectContent>
                  {clases.map(c => (
                    <SelectItem key={c.numero} value={String(c.numero)}>
                      Clase {String(c.numero).padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {claseSeleccionada && (
              <div className="flex gap-3 text-sm">
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="h-4 w-4" />{presentesCount} presentes
                </span>
                <span className="flex items-center gap-1 text-red-500 font-medium">
                  <XCircle className="h-4 w-4" />{ausentesCount} ausentes
                </span>
                {sinRegistro > 0 && (
                  <span className="text-muted-foreground">{sinRegistro} sin registrar</span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!claseSeleccionada && (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Seleccioná una clase para registrar la asistencia</p>
          </CardContent>
        </Card>
      )}

      {claseSeleccionada && (
        <div className="grid gap-2">
          {alumnos.map(alumno => {
            const presente = asistencias[alumno.id]
            const cargando = guardando === alumno.id

            return (
              <Card key={alumno.id} className={cn(
                'shadow-itc transition-colors',
                presente === true && 'border-emerald-200 bg-emerald-50/30',
                presente === false && 'border-red-200 bg-red-50/30',
              )}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 flex-shrink-0">
                      <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                        {alumno.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{alumno.nombre}</p>
                      {alumno.turno && <p className="text-xs text-muted-foreground">{alumno.turno}</p>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant={presente === true ? 'default' : 'outline'}
                        className={cn('gap-1 h-8', presente === true && 'bg-emerald-600 hover:bg-emerald-700')}
                        disabled={cargando}
                        onClick={() => toggleAsistencia(alumno.id, true)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Presente</span>
                      </Button>
                      <Button
                        size="sm"
                        variant={presente === false ? 'destructive' : 'outline'}
                        className="gap-1 h-8"
                        disabled={cargando}
                        onClick={() => toggleAsistencia(alumno.id, false)}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Ausente</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {alumnos.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">No hay alumnos activos.</CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
