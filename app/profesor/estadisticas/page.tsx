"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { alumnosDemo, clasesDemo } from "@/lib/data"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts"
import { TrendingUp, TrendingDown, Users, BookOpen, Award, Clock } from "lucide-react"

export default function EstadisticasPage() {
  // Calcular estadísticas
  const totalStudents = alumnosDemo.length
  const completedStudents = alumnosDemo.filter(s => s.progreso === 7).length
  const avgProgress = Math.round(alumnosDemo.reduce((acc, s) => acc + (s.progreso / 22) * 100, 0) / totalStudents)
  const passedExams = alumnosDemo.filter(s => s.promedioEjercicios >= 70).length

  // Datos para gráfico de progreso por alumno
  const progressData = alumnosDemo.slice(0, 8).map(student => ({
    name: student.nombre.split(' ')[0],
    progreso: Math.round((student.progreso / 22) * 100),
    ejercicios: student.promedioEjercicios
  }))

  // Datos para gráfico de distribución de estado
  const statusData = [
    { name: 'Completado', value: completedStudents, color: '#22c55e' },
    { name: 'En progreso', value: totalStudents - completedStudents, color: '#3b82f6' },
  ]

  // Datos de progreso semanal (simulado)
  const weeklyData = [
    { semana: 'Sem 1', alumnos: 2, clases: 5 },
    { semana: 'Sem 2', alumnos: 4, clases: 8 },
    { semana: 'Sem 3', alumnos: 6, clases: 12 },
    { semana: 'Sem 4', alumnos: 8, clases: 18 },
  ]

  // Datos de rendimiento en ejercicios
  const examPerformance = [
    { rango: '0-59%', cantidad: alumnosDemo.filter(s => s.promedioEjercicios < 60).length },
    { rango: '60-79%', cantidad: alumnosDemo.filter(s => s.promedioEjercicios >= 60 && s.promedioEjercicios < 80).length },
    { rango: '80-89%', cantidad: alumnosDemo.filter(s => s.promedioEjercicios >= 80 && s.promedioEjercicios < 90).length },
    { rango: '90-100%', cantidad: alumnosDemo.filter(s => s.promedioEjercicios >= 90).length },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Estadísticas</h1>
        <p className="text-muted-foreground">Análisis detallado del rendimiento del curso</p>
      </div>

      {/* KPIs principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Alumnos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <div className="flex items-center text-xs text-success">
              <TrendingUp className="mr-1 h-3 w-3" />
              +2 este mes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProgress}%</div>
            <Progress value={avgProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aprobados</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passedExams}/{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((passedExams / totalStudents) * 100)}% tasa de aprobación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12h</div>
            <p className="text-xs text-muted-foreground">
              Por alumno completado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Progreso por alumno */}
        <Card>
          <CardHeader>
            <CardTitle>Progreso por Alumno</CardTitle>
            <CardDescription>Comparativa de avance en el curso y calificación de examen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={60} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="progreso" fill="hsl(var(--primary))" name="Progreso %" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="ejercicios" fill="hsl(var(--chart-2))" name="Ejercicios %" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribución de estado */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Estado</CardTitle>
            <CardDescription>Alumnos completados vs en progreso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Evolución semanal */}
        <Card>
          <CardHeader>
            <CardTitle>Evolución Semanal</CardTitle>
            <CardDescription>Progreso acumulado de alumnos y clases completadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="alumnos" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Alumnos activos"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clases" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    name="Clases completadas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Rendimiento en exámenes */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Calificaciones</CardTitle>
            <CardDescription>Rangos de puntuación en el examen final</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={examPerformance}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="rango" />
                  <YAxis allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="cantidad" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Cantidad de alumnos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de rendimiento detallado */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento Detallado por Alumno</CardTitle>
          <CardDescription>Vista completa del estado de cada alumno</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Alumno</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Progreso</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Clases</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Examen</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Estado</th>
                </tr>
              </thead>
              <tbody>
                {alumnosDemo.map((student) => {
                  const progressPercent = Math.round((student.progreso / 22) * 100)
                  return (
                    <tr key={student.id} className="border-b last:border-0">
                      <td className="py-3 px-4">
                        <div className="font-medium">{student.nombre}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Progress value={progressPercent} className="w-20 h-2" />
                          <span className="text-sm">{progressPercent}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {student.progreso}/{clasesDemo.length}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${student.promedioEjercicios >= 70 ? 'text-success' : 'text-destructive'}`}>
                          {student.promedioEjercicios}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={
                          student.progreso === 22 && student.promedioEjercicios >= 70
                            ? "default"
                            : student.progreso > 0
                            ? "secondary"
                            : "outline"
                        }>
                          {student.progreso === 22 && student.promedioEjercicios >= 70
                            ? "Certificado"
                            : student.progreso > 0
                            ? "En progreso"
                            : "Sin iniciar"}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
