'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Search, 
  UserPlus, 
  Eye,
  Mail,
  Edit,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react'
import { alumnosDemo } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Alumno } from '@/lib/types'

export default function AlumnosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null)

  // Filtrar alumnos
  const alumnosFiltrados = alumnosDemo.filter(alumno => {
    const matchSearch = alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       alumno.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filtro === 'todos') return matchSearch
    if (filtro === 'al_dia') return matchSearch && alumno.asistencia >= 75
    if (filtro === 'atrasados') return matchSearch && alumno.asistencia < 50
    if (filtro === 'aprobados') return matchSearch && alumno.examenEstado === 'aprobado'
    return matchSearch
  })

  const getAsistenciaColor = (asistencia: number) => {
    if (asistencia >= 75) return 'text-emerald-600 bg-emerald-50'
    if (asistencia >= 50) return 'text-amber-600 bg-amber-50'
    return 'text-red-600 bg-red-50'
  }

  const getExamenBadge = (estado: string, puntaje?: number) => {
    switch (estado) {
      case 'aprobado':
        return <Badge className="bg-emerald-100 text-emerald-700">Aprobado {puntaje}%</Badge>
      case 'reprobado':
        return <Badge className="bg-red-100 text-red-700">Reprobado {puntaje}%</Badge>
      case 'en_curso':
        return <Badge className="bg-blue-100 text-blue-700">En curso</Badge>
      default:
        return <Badge variant="secondary">Pendiente</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
            Mis Alumnos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestioná los {alumnosDemo.length} alumnos de tu grupo
          </p>
        </div>
        <Link href="/profesor/nuevo-alumno">
          <Button className="gap-2 shadow-itc">
            <UserPlus className="h-4 w-4" />
            Agregar alumno
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card className="shadow-itc">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filtro} onValueChange={setFiltro}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="al_dia">Al día (+75%)</SelectItem>
                <SelectItem value="atrasados">Atrasados (-50%)</SelectItem>
                <SelectItem value="aprobados">Aprobaron examen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de alumnos */}
      <Card className="shadow-itc overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Alumno</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Progreso</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Asistencia</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Examen</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Certificado</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {alumnosFiltrados.map((alumno) => {
                const initials = alumno.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)
                
                return (
                  <tr key={alumno.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-accent/10 text-accent text-sm">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{alumno.nombre}</p>
                          <p className="text-sm text-muted-foreground">{alumno.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Progress value={(alumno.progreso / 22) * 100} className="w-20 h-2" />
                          <span className="text-sm font-medium">{alumno.progreso}/22</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        'px-2 py-1 rounded-lg text-sm font-medium',
                        getAsistenciaColor(alumno.asistencia)
                      )}>
                        {alumno.asistencia}%
                      </span>
                    </td>
                    <td className="p-4">
                      {getExamenBadge(alumno.examenEstado, alumno.examenPuntaje)}
                    </td>
                    <td className="p-4">
                      {alumno.certificadoEmitido ? (
                        <Badge className="bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Emitido
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Pendiente
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setSelectedAlumno(alumno)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal de detalle del alumno */}
      <Dialog open={!!selectedAlumno} onOpenChange={() => setSelectedAlumno(null)}>
        <DialogContent className="max-w-2xl">
          {selectedAlumno && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-xl">
                  Detalle del alumno
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Info básica */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-accent/10 text-accent text-xl">
                      {selectedAlumno.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedAlumno.nombre}</h3>
                    <p className="text-muted-foreground">{selectedAlumno.email}</p>
                    <p className="text-sm text-muted-foreground">{selectedAlumno.sede} - {selectedAlumno.turno}</p>
                  </div>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-3 rounded-xl bg-slate-50 text-center">
                    <p className="text-2xl font-bold text-primary">{selectedAlumno.progreso}/22</p>
                    <p className="text-xs text-muted-foreground">Clases</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 text-center">
                    <p className={cn('text-2xl font-bold', selectedAlumno.asistencia >= 75 ? 'text-emerald-600' : 'text-amber-600')}>
                      {selectedAlumno.asistencia}%
                    </p>
                    <p className="text-xs text-muted-foreground">Asistencia</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 text-center">
                    <p className="text-2xl font-bold text-orange-500">{selectedAlumno.rachaAsistencia}</p>
                    <p className="text-xs text-muted-foreground">Racha (sem)</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedAlumno.promedioEjercicios}%</p>
                    <p className="text-xs text-muted-foreground">Ejercicios</p>
                  </div>
                </div>

                {/* Estado del examen */}
                <div className="p-4 rounded-xl border">
                  <h4 className="font-medium mb-2">Estado del examen</h4>
                  {getExamenBadge(selectedAlumno.examenEstado, selectedAlumno.examenPuntaje)}
                </div>

                {/* Acciones */}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    Habilitar examen manualmente
                  </Button>
                  <Button variant="outline" className="flex-1 text-destructive hover:text-destructive">
                    Resetear progreso
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
