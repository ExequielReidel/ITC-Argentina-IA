'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  BookOpen, 
  Flame, 
  Target, 
  FileText,
  Clock,
  ChevronRight
} from 'lucide-react'
import { alumnoDemo, clasesDemo, getCategoriaBgLight } from '@/lib/data'
import { cn } from '@/lib/utils'

export default function AlumnoInicioPage() {
  const alumno = alumnoDemo
  const totalClases = 22
  const porcentajeProgreso = Math.round((alumno.progreso / totalClases) * 100)
  
  // Encontrar la próxima clase (la que está "en_curso")
  const proximaClase = clasesDemo.find(c => c.estado === 'en_curso') || clasesDemo[alumno.progreso]

  return (
    <div className="space-y-6">
      {/* Card de bienvenida */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-itc">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
                Hola, {alumno.nombre.split(' ')[0]}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Sede {alumno.sede} - Turno {alumno.turno} 10:00hs
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Tu progreso</p>
                <p className="text-2xl font-bold text-primary">{porcentajeProgreso}%</p>
              </div>
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-primary/20"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={175.9}
                    strokeDashoffset={175.9 - (175.9 * porcentajeProgreso) / 100}
                    className="text-primary"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Completaste {alumno.progreso} de {totalClases} clases</span>
              <span className="font-medium text-primary">{totalClases - alumno.progreso} restantes</span>
            </div>
            <Progress value={porcentajeProgreso} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Próxima clase */}
      {proximaClase && (
        <Card className="shadow-itc-lg hover-lift overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className={cn(
              'w-full lg:w-2 flex-shrink-0',
              proximaClase.categoria === 'ia-aplicada' && 'bg-blue-500',
              proximaClase.categoria === 'diseno-ia' && 'bg-pink-500',
              proximaClase.categoria === 'estrategia' && 'bg-violet-500',
              proximaClase.categoria === 'automatizacion' && 'bg-purple-500',
              proximaClase.categoria === 'proyectos' && 'bg-emerald-500'
            )} />
            <div className="flex-1 p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="space-y-3">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    PROXIMA CLASE
                  </Badge>
                  <div>
                    <h2 className="font-heading text-xl lg:text-2xl font-bold text-foreground">
                      Clase {String(proximaClase.numero).padStart(2, '0')} - {proximaClase.titulo}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <Badge className={cn('rounded-full', getCategoriaBgLight(proximaClase.categoria))}>
                        {proximaClase.categoriaLabel}
                      </Badge>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {proximaClase.duracion} minutos
                      </span>
                    </div>
                  </div>
                </div>
                <Link href={`/alumno/clases/${proximaClase.id}`}>
                  <Button size="lg" className="shadow-itc gap-2">
                    <Play className="h-5 w-5" />
                    Abrir clase
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Grid de métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-itc hover-lift">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clases completadas</p>
                <p className="text-2xl lg:text-3xl font-bold mt-1">
                  <span className="text-primary">{alumno.progreso}</span>
                  <span className="text-muted-foreground text-lg"> / {totalClases}</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-itc hover-lift">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Racha de asistencia</p>
                <p className="text-2xl lg:text-3xl font-bold mt-1">
                  <span className="text-orange-500">{alumno.rachaAsistencia}</span>
                  <span className="text-muted-foreground text-lg"> sem.</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-itc hover-lift">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Promedio ejercicios</p>
                <p className="text-2xl lg:text-3xl font-bold mt-1">
                  <span className="text-emerald-500">{alumno.promedioEjercicios}</span>
                  <span className="text-muted-foreground text-lg">%</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Target className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-itc hover-lift">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estado del examen</p>
                <p className="text-xl lg:text-2xl font-bold mt-1 text-amber-500 capitalize">
                  {alumno.examenEstado}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accesos rápidos */}
      <Card className="shadow-itc">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Accesos rápidos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/alumno/clases" className="block">
            <div className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Mis Clases</p>
                    <p className="text-sm text-muted-foreground">{alumno.progreso} completadas</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          </Link>

          <Link href="/alumno/progreso" className="block">
            <div className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Target className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium">Mi Progreso</p>
                    <p className="text-sm text-muted-foreground">Ver estadísticas</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          </Link>

          <Link href="/alumno/certificado" className="block">
            <div className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-medium">Mi Certificado</p>
                    <p className="text-sm text-muted-foreground">Ver requisitos</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
