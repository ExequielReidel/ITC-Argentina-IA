'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { alumnoDemo, logrosDemo, clasesDemo } from '@/lib/data'
import { cn } from '@/lib/utils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// Datos de asistencia semanal (demo)
const asistenciaSemanal = [
  { semana: 'Sem 1', asistencia: 100 },
  { semana: 'Sem 2', asistencia: 100 },
  { semana: 'Sem 3', asistencia: 80 },
  { semana: 'Sem 4', asistencia: 100 },
  { semana: 'Sem 5', asistencia: 60 },
  { semana: 'Sem 6', asistencia: 100 },
  { semana: 'Sem 7', asistencia: 100 },
  { semana: 'Sem 8', asistencia: 80 },
]

export default function ProgresoPage() {
  const alumno = alumnoDemo
  const totalClases = 22
  const clasesCompletadas = alumno.progreso
  const clasesRestantes = totalClases - clasesCompletadas

  // Datos para el gráfico de torta
  const pieData = [
    { name: 'Completadas', value: clasesCompletadas, color: '#1D4ED8' },
    { name: 'Restantes', value: clasesRestantes, color: '#E2E8F0' },
  ]

  // Progreso por categoría
  const categorias = [
    { nombre: 'IA Aplicada', completadas: 5, total: 9, color: 'bg-blue-500' },
    { nombre: 'Diseño con IA', completadas: 2, total: 3, color: 'bg-pink-500' },
    { nombre: 'Estrategia', completadas: 0, total: 4, color: 'bg-violet-500' },
    { nombre: 'Automatización', completadas: 0, total: 5, color: 'bg-purple-500' },
    { nombre: 'Proyectos', completadas: 0, total: 2, color: 'bg-emerald-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
          Mi Progreso
        </h1>
        <p className="text-muted-foreground mt-1">
          Seguí tu avance en el curso IA + Automatizaciones
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-itc">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Clases completadas</p>
            <p className="text-3xl font-bold mt-1">
              <span className="text-primary">{clasesCompletadas}</span>
              <span className="text-muted-foreground text-lg">/{totalClases}</span>
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-itc">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Asistencia</p>
            <p className="text-3xl font-bold mt-1 text-emerald-600">{alumno.asistencia}%</p>
          </CardContent>
        </Card>
        <Card className="shadow-itc">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Racha actual</p>
            <p className="text-3xl font-bold mt-1 text-orange-500">{alumno.rachaAsistencia} sem</p>
          </CardContent>
        </Card>
        <Card className="shadow-itc">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Promedio ejercicios</p>
            <p className="text-3xl font-bold mt-1 text-blue-600">{alumno.promedioEjercicios}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Gráfico de asistencia semanal */}
        <Card className="shadow-itc">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Asistencia semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={asistenciaSemanal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="semana" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="asistencia" 
                    stroke="#1D4ED8" 
                    strokeWidth={3}
                    dot={{ fill: '#1D4ED8', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de torta */}
        <Card className="shadow-itc">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Progreso general</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <p className="text-3xl font-bold text-foreground">
                  {Math.round((clasesCompletadas / totalClases) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">completado</p>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Completadas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <span className="text-sm text-muted-foreground">Restantes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progreso por categoría */}
      <Card className="shadow-itc">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Progreso por módulo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categorias.map((cat) => (
            <div key={cat.nombre} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{cat.nombre}</span>
                <span className="text-muted-foreground">{cat.completadas}/{cat.total} clases</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={cn('h-full rounded-full transition-all', cat.color)}
                  style={{ width: `${(cat.completadas / cat.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Logros */}
      <Card className="shadow-itc">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Logros desbloqueados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {logrosDemo.map((logro) => (
              <div 
                key={logro.id}
                className={cn(
                  'p-4 rounded-2xl text-center transition-all',
                  logro.desbloqueado 
                    ? 'bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20' 
                    : 'bg-slate-50 border border-slate-100 opacity-50'
                )}
              >
                <div className="text-3xl mb-2">{logro.icono}</div>
                <p className={cn(
                  'text-xs font-medium',
                  logro.desbloqueado ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {logro.titulo}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
