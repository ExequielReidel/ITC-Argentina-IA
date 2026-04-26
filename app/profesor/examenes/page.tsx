'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Settings2, 
  FileText, 
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Users
} from 'lucide-react'
import { alumnosDemo, preguntasExamen } from '@/lib/data'
import { cn } from '@/lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

// Datos demo de resultados
const resultadosDemo = [
  { alumnoId: '3', alumnoNombre: 'Juan Herrera', intento: 1, puntaje: 26, fecha: new Date('2026-04-10'), duracion: 38, aprobado: true },
  { alumnoId: '6', alumnoNombre: 'Lucía Pereyra', intento: 1, puntaje: 24, fecha: new Date('2026-04-12'), duracion: 42, aprobado: true },
  { alumnoId: '11', alumnoNombre: 'Diego Ruiz', intento: 1, puntaje: 28, fecha: new Date('2026-04-11'), duracion: 35, aprobado: true },
]

// Distribución de puntajes para el histograma
const distribucionPuntajes = [
  { rango: '0-10', cantidad: 0 },
  { rango: '11-15', cantidad: 0 },
  { rango: '16-20', cantidad: 0 },
  { rango: '21-25', cantidad: 2 },
  { rango: '26-30', cantidad: 1 },
]

export default function ExamenesPage() {
  const [activeTab, setActiveTab] = useState('resultados')
  const [habilitarTodos, setHabilitarTodos] = useState(false)
  const [intentosPermitidos, setIntentosPermitidos] = useState('2')
  const [tiempoLimite, setTiempoLimite] = useState('45')

  const alumnosQueRindieron = resultadosDemo.length
  const totalAlumnos = alumnosDemo.length
  const aprobados = resultadosDemo.filter(r => r.aprobado).length
  const tasaAprobacion = alumnosQueRindieron > 0 ? Math.round((aprobados / alumnosQueRindieron) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
          Exámenes
        </h1>
        <p className="text-muted-foreground mt-1">
          Configurá y revisá los resultados del examen final
        </p>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-itc">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Rindieron</p>
                <p className="text-xl font-bold">{alumnosQueRindieron}/{totalAlumnos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-itc">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm text-muted-foreground">Aprobados</p>
                <p className="text-xl font-bold text-emerald-600">{aprobados}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-itc">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Reprobados</p>
                <p className="text-xl font-bold text-red-600">{alumnosQueRindieron - aprobados}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-itc">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Tasa aprobación</p>
                <p className="text-xl font-bold text-primary">{tasaAprobacion}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="resultados" className="gap-2">
            <FileText className="h-4 w-4" />
            Resultados
          </TabsTrigger>
          <TabsTrigger value="configuracion" className="gap-2">
            <Settings2 className="h-4 w-4" />
            Configuración
          </TabsTrigger>
        </TabsList>

        {/* Tab Resultados */}
        <TabsContent value="resultados" className="space-y-6 mt-6">
          {/* Tabla de resultados */}
          <Card className="shadow-itc overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading text-lg">Resultados del examen</CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar CSV
              </Button>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground">Alumno</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Intento</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Fecha</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Puntaje</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Duración</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {resultadosDemo.map((resultado, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium">{resultado.alumnoNombre}</td>
                      <td className="p-4">{resultado.intento}°</td>
                      <td className="p-4 text-muted-foreground">
                        {resultado.fecha.toLocaleDateString('es-AR')}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold">{resultado.puntaje}/30</span>
                        <span className="text-muted-foreground ml-1">
                          ({Math.round((resultado.puntaje / 30) * 100)}%)
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{resultado.duracion} min</td>
                      <td className="p-4">
                        {resultado.aprobado ? (
                          <Badge className="bg-emerald-100 text-emerald-700">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Aprobado
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700">
                            <XCircle className="h-3 w-3 mr-1" />
                            Reprobado
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Gráfico de distribución */}
          <Card className="shadow-itc">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Distribución de puntajes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distribucionPuntajes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="rango" stroke="#64748B" fontSize={12} />
                    <YAxis stroke="#64748B" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="cantidad" fill="#4338CA" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Configuración */}
        <TabsContent value="configuracion" className="space-y-6 mt-6">
          <Card className="shadow-itc">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Configuración del examen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Habilitar para todos */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                <div>
                  <p className="font-medium">Habilitar examen para todos</p>
                  <p className="text-sm text-muted-foreground">
                    Permite que todos los alumnos que completaron la clase 21 puedan rendir
                  </p>
                </div>
                <Switch
                  checked={habilitarTodos}
                  onCheckedChange={setHabilitarTodos}
                />
              </div>

              {/* Intentos */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Intentos permitidos</label>
                  <Input
                    type="number"
                    min="1"
                    max="3"
                    value={intentosPermitidos}
                    onChange={(e) => setIntentosPermitidos(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tiempo límite (minutos)</label>
                  <Input
                    type="number"
                    min="15"
                    max="90"
                    value={tiempoLimite}
                    onChange={(e) => setTiempoLimite(e.target.value)}
                  />
                </div>
              </div>

              <Button className="gap-2">
                Guardar configuración
              </Button>
            </CardContent>
          </Card>

          {/* Banco de preguntas */}
          <Card className="shadow-itc">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Banco de preguntas ({preguntasExamen.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {preguntasExamen.slice(0, 10).map((pregunta, idx) => (
                  <div key={pregunta.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {idx + 1}. {pregunta.enunciado}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Respuesta correcta: {pregunta.respuestaCorrecta.toUpperCase()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
                <p className="text-sm text-muted-foreground text-center py-2">
                  Mostrando 10 de {preguntasExamen.length} preguntas
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
