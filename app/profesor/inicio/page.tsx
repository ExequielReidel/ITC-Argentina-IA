'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  BookOpen, 
  Award,
  AlertTriangle,
  Check,
  ChevronRight,
  TrendingUp
} from 'lucide-react'
import { profesorDemo, alumnosDemo, clasesDemo } from '@/lib/data'
import { cn } from '@/lib/utils'

export default function ProfesorInicioPage() {
  const profesor = profesorDemo
  const alumnos = alumnosDemo
  
  // Calcular métricas
  const totalAlumnos = alumnos.length
  const claseActual = clasesDemo.find(c => c.estado === 'en_curso')
  const promedioAsistencia = Math.round(alumnos.reduce((acc, a) => acc + a.asistencia, 0) / totalAlumnos)
  const alumnosAprobados = alumnos.filter(a => a.examenEstado === 'aprobado').length
  
  // Alertas
  const alumnosAtrasados = alumnos.filter(a => a.asistencia < 50)
  const alumnosExamenPendiente = alumnos.filter(a => a.examenEstado === 'pendiente' && a.progreso >= 21)

  // Última clase dictada
  const clasesCompletadas = clasesDemo.filter(c => c.estado === 'completada')
  const ultimaClaseDictada = clasesCompletadas[clasesCompletadas.length - 1]
  const proximaClase = claseActual || clasesDemo[clasesCompletadas.length]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
          Panel General
        </h1>
        <p className="text-muted-foreground mt-1">
          Bienvenido, {profesor.nombre}
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-itc hover-lift">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alumnos activos</p>
                <p className="text-3xl font-bold mt-1 text-accent">{totalAlumnos}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-itc hover-lift">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clase en curso</p>
                <p className="text-2xl font-bold mt-1 text-primary">
                  {claseActual ? `Clase ${claseActual.numero}` : '-'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-itc hover-lift">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Asistencia promedio</p>
                <p className={cn(
                  'text-3xl font-bold mt-1',
                  promedioAsistencia >= 75 ? 'text-emerald-600' : promedioAsistencia >= 50 ? 'text-amber-600' : 'text-red-600'
                )}>
                  {promedioAsistencia}%
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-itc hover-lift">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aprobaron examen</p>
                <p className="text-3xl font-bold mt-1">
                  <span className="text-emerald-600">{alumnosAprobados}</span>
                  <span className="text-muted-foreground text-lg"> / {totalAlumnos}</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Award className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado de clases */}
      <Card className="shadow-itc">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Estado del curso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-sm text-muted-foreground">Última clase dictada</p>
              <p className="font-semibold mt-1">
                {ultimaClaseDictada ? `Clase ${ultimaClaseDictada.numero} - ${ultimaClaseDictada.titulo}` : 'Ninguna'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-sm text-muted-foreground">Próxima clase</p>
              <p className="font-semibold mt-1 text-primary">
                {proximaClase ? `Clase ${proximaClase.numero} - ${proximaClase.titulo}` : 'Curso completado'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              {proximaClase && (
                <Button className="w-full gap-2">
                  <Check className="h-4 w-4" />
                  Marcar clase {proximaClase.numero} como dictada
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas */}
      {(alumnosAtrasados.length > 0 || alumnosExamenPendiente.length > 0) && (
        <Card className="shadow-itc border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="font-heading text-lg flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Alertas activas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alumnosAtrasados.length > 0 && (
              <div className="p-3 rounded-lg bg-white border border-amber-200">
                <p className="font-medium text-amber-800">
                  {alumnosAtrasados.length} alumno(s) con menos del 50% de asistencia
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  {alumnosAtrasados.map(a => a.nombre.split(' ')[0]).join(', ')}
                </p>
              </div>
            )}
            {alumnosExamenPendiente.length > 0 && (
              <div className="p-3 rounded-lg bg-white border border-amber-200">
                <p className="font-medium text-amber-800">
                  {alumnosExamenPendiente.length} alumno(s) con examen pendiente (ya pueden rendir)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Accesos rápidos */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/profesor/alumnos">
          <Card className="shadow-itc hover-lift cursor-pointer h-full">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold">Mis Alumnos</p>
                  <p className="text-sm text-muted-foreground">{totalAlumnos} registrados</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/profesor/clases">
          <Card className="shadow-itc hover-lift cursor-pointer h-full">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Gestión de Clases</p>
                  <p className="text-sm text-muted-foreground">{clasesCompletadas.length}/22 dictadas</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/profesor/reportes">
          <Card className="shadow-itc hover-lift cursor-pointer h-full">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold">Reportes</p>
                  <p className="text-sm text-muted-foreground">Ver estadísticas</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
