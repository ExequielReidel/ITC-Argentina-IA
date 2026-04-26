'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Play, BookOpen, FileText, Target, Clock, ChevronRight, CheckCircle2 } from 'lucide-react'
import { clasesDemo, getCategoriaBgLight } from '@/lib/data'
import { cn } from '@/lib/utils'

export default function AlumnoInicioPage() {
  const { data: session } = useSession()
  const [clasesData, setClasesData] = useState<{ habilitadas: number[]; completadas: number[] } | null>(null)
  const [examenConfig, setExamenConfig] = useState<{ habilitado: boolean } | null>(null)

  useEffect(() => {
    fetch('/api/clases').then(r => r.json()).then(setClasesData)
    fetch('/api/examen/config').then(r => r.json()).then(setExamenConfig)
  }, [])

  const user = session?.user as any
  const completadas = clasesData?.completadas ?? []
  const habilitadas = clasesData?.habilitadas ?? []
  const totalClases = 22
  const clasesCompletadas = completadas.length
  const pct = Math.round((clasesCompletadas / totalClases) * 100)

  // Próxima clase: la primera habilitada que no está completada
  const proximaClaseNum = habilitadas.find(n => !completadas.includes(n))
  const proximaClase = proximaClaseNum ? clasesDemo.find(c => c.numero === proximaClaseNum) : null

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-itc">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
                Hola, {user?.name?.split(' ')[0] ?? 'Alumno'}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Turno: {user?.turno ?? '—'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Tu progreso</p>
                <p className="text-2xl font-bold text-primary">{pct}%</p>
              </div>
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" className="text-primary/20" />
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none"
                    strokeDasharray={175.9} strokeDashoffset={175.9 - (175.9 * pct) / 100}
                    className="text-primary" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Completaste {clasesCompletadas} de {totalClases} clases</span>
              <span className="font-medium text-primary">{totalClases - clasesCompletadas} restantes</span>
            </div>
            <Progress value={pct} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {proximaClase && (
        <Card className="shadow-itc-lg hover-lift overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className={cn('w-full lg:w-2 flex-shrink-0 h-2 lg:h-auto',
              proximaClase.categoria === 'ia-aplicada' && 'bg-blue-500',
              proximaClase.categoria === 'diseno-ia' && 'bg-pink-500',
              proximaClase.categoria === 'estrategia' && 'bg-violet-500',
              proximaClase.categoria === 'automatizacion' && 'bg-purple-500',
              proximaClase.categoria === 'proyectos' && 'bg-emerald-500'
            )} />
            <div className="flex-1 p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="space-y-3">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">PRÓXIMA CLASE</Badge>
                  <div>
                    <h2 className="font-heading text-xl lg:text-2xl font-bold text-foreground">
                      Clase {String(proximaClase.numero).padStart(2, '0')} — {proximaClase.titulo}
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
                <Link href={`/alumno/clases/${proximaClase.numero}`}>
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

      {!proximaClase && habilitadas.length === 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-6 text-center">
            <p className="text-amber-800 font-medium">Tu profesor aún no habilitó ninguna clase.</p>
            <p className="text-amber-700 text-sm mt-1">Cuando libere la primera clase vas a poder empezar acá.</p>
          </CardContent>
        </Card>
      )}

      {!proximaClase && habilitadas.length > 0 && completadas.length === habilitadas.length && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
            <p className="text-emerald-800 font-bold text-lg">¡Completaste todas las clases disponibles!</p>
            <p className="text-emerald-700 text-sm mt-1">Esperá que tu profesor habilite la siguiente.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-itc hover-lift">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clases completadas</p>
                <p className="text-2xl lg:text-3xl font-bold mt-1">
                  <span className="text-primary">{clasesCompletadas}</span>
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
                <p className="text-sm text-muted-foreground">Clases habilitadas</p>
                <p className="text-2xl lg:text-3xl font-bold mt-1">
                  <span className="text-violet-500">{habilitadas.length}</span>
                  <span className="text-muted-foreground text-lg"> / {totalClases}</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                <Target className="h-5 w-5 text-violet-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-itc hover-lift col-span-2">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estado del examen</p>
                <p className="text-xl lg:text-2xl font-bold mt-1">
                  {examenConfig?.habilitado
                    ? <span className="text-emerald-500">¡Disponible!</span>
                    : <span className="text-amber-500">Pendiente</span>}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-amber-500" />
              </div>
            </div>
            {examenConfig?.habilitado && (
              <Link href="/alumno/examen" className="mt-3 block">
                <Button size="sm" className="gap-1 w-full">Ir al examen</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-itc">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Accesos rápidos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { href: '/alumno/clases', icon: BookOpen, color: 'blue', label: 'Mis Clases', sub: `${clasesCompletadas} completadas` },
            { href: '/alumno/progreso', icon: Target, color: 'emerald', label: 'Mi Progreso', sub: 'Ver estadísticas' },
            { href: '/alumno/examen', icon: FileText, color: 'violet', label: 'Examen Final', sub: examenConfig?.habilitado ? '¡Disponible!' : 'Pendiente' },
          ].map(({ href, icon: Icon, color, label, sub }) => (
            <Link key={href} href={href} className="block">
              <div className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-${color}-100 flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 text-${color}-600`} />
                    </div>
                    <div>
                      <p className="font-medium">{label}</p>
                      <p className="text-sm text-muted-foreground">{sub}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
