'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, EyeOff, Save, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'

export default function ExamenesPage() {
  const [config, setConfig] = useState<any>(null)
  const [resultados, setResultados] = useState<any[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState({ habilitado: false, passwordExamen: '', intentosPermitidos: 3, tiempoLimiteMin: 45, puntajeMinimo: 9 })

  const cargar = async () => {
    const [cfg, res] = await Promise.all([
      fetch('/api/examen/config').then(r => r.json()),
      fetch('/api/examen/resultados').then(r => r.json()),
    ])
    setConfig(cfg)
    setResultados(Array.isArray(res) ? res : [])
    setForm({
      habilitado: cfg.habilitado ?? false,
      passwordExamen: cfg.passwordExamen ?? '',
      intentosPermitidos: cfg.intentosPermitidos ?? 3,
      tiempoLimiteMin: cfg.tiempoLimiteMin ?? 45,
      puntajeMinimo: cfg.puntajeMinimo ?? 9,
    })
  }

  useEffect(() => { cargar() }, [])

  const guardar = async () => {
    setGuardando(true)
    const res = await fetch('/api/examen/config', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, passwordExamen: form.passwordExamen || null }),
    })
    if (res.ok) { toast.success('Configuración guardada'); cargar() }
    else toast.error('Error al guardar')
    setGuardando(false)
  }

  const aprobados = resultados.filter(r => r.aprobado).length
  const totalUnicos = new Set(resultados.map(r => r.userId)).size
  const promedioPuntaje = resultados.length > 0 ? Math.round(resultados.reduce((s, r) => s + r.puntaje, 0) / resultados.length) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold">Exámenes</h1>
        <p className="text-muted-foreground mt-1">Configurá y gestioná el examen final del curso</p>
      </div>

      <Tabs defaultValue="config">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="config">Configuración</TabsTrigger>
          <TabsTrigger value="resultados">Resultados ({resultados.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4 mt-4">
          <Card className="shadow-itc">
            <CardHeader><CardTitle className="text-lg">Estado del examen</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed">
                <div>
                  <p className="font-semibold">{form.habilitado ? '🟢 Examen HABILITADO' : '🔴 Examen DESHABILITADO'}</p>
                  <p className="text-sm text-muted-foreground">{form.habilitado ? 'Los alumnos pueden rendirlo ahora' : 'Los alumnos no pueden acceder'}</p>
                </div>
                <Switch checked={form.habilitado} onCheckedChange={v => setForm(f => ({ ...f, habilitado: v }))} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Contraseña de acceso</Label>
                  <div className="relative mt-1">
                    <Input type={showPassword ? 'text' : 'password'} value={form.passwordExamen}
                      onChange={e => setForm(f => ({ ...f, passwordExamen: e.target.value }))}
                      placeholder="Sin contraseña = acceso libre" className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Usá contraseñas distintas por turno para evitar que rinden antes de tiempo</p>
                </div>
                <div>
                  <Label>Intentos permitidos</Label>
                  <Input type="number" min={1} max={5} value={form.intentosPermitidos}
                    onChange={e => setForm(f => ({ ...f, intentosPermitidos: parseInt(e.target.value) }))} className="mt-1" />
                </div>
                <div>
                  <Label>Tiempo límite (minutos)</Label>
                  <Input type="number" min={10} max={120} value={form.tiempoLimiteMin}
                    onChange={e => setForm(f => ({ ...f, tiempoLimiteMin: parseInt(e.target.value) }))} className="mt-1" />
                </div>
                <div>
                  <Label>Puntaje mínimo para aprobar (de 15)</Label>
                  <Input type="number" min={1} max={15} value={form.puntajeMinimo}
                    onChange={e => setForm(f => ({ ...f, puntajeMinimo: parseInt(e.target.value) }))} className="mt-1" />
                  <p className="text-xs text-muted-foreground mt-1">{form.puntajeMinimo}/15 = {Math.round((form.puntajeMinimo / 15) * 100)}%</p>
                </div>
              </div>

              <Button onClick={guardar} disabled={guardando} className="w-full gap-2">
                <Save className="h-4 w-4" />{guardando ? 'Guardando...' : 'Guardar configuración'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resultados" className="space-y-4 mt-4">
          <div className="grid grid-cols-3 gap-4">
            <Card className="shadow-itc"><CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{totalUnicos}</p>
              <p className="text-sm text-muted-foreground mt-1">Alumnos que rindieron</p>
            </CardContent></Card>
            <Card className="shadow-itc"><CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-emerald-500">{aprobados}</p>
              <p className="text-sm text-muted-foreground mt-1">Aprobados</p>
            </CardContent></Card>
            <Card className="shadow-itc"><CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-violet-500">{promedioPuntaje}/15</p>
              <p className="text-sm text-muted-foreground mt-1">Puntaje promedio</p>
            </CardContent></Card>
          </div>

          <Card className="shadow-itc">
            <CardContent className="p-0">
              {resultados.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground"><BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" /><p>Aún no hay resultados</p></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">Alumno</th>
                      <th className="p-3 text-center font-medium">Intento</th>
                      <th className="p-3 text-center font-medium">Puntaje</th>
                      <th className="p-3 text-center font-medium">Resultado</th>
                      <th className="p-3 text-left font-medium">Fecha</th>
                    </tr></thead>
                    <tbody>
                      {resultados.map((r, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="p-3"><p className="font-medium">{r.nombre}</p><p className="text-xs text-muted-foreground">{r.email}</p></td>
                          <td className="p-3 text-center">{r.intentoNumero}</td>
                          <td className="p-3 text-center font-bold">{r.puntaje}/{r.totalPreguntas}</td>
                          <td className="p-3 text-center">
                            <Badge className={r.aprobado ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>{r.aprobado ? '✓ Aprobado' : '✗ Reprobado'}</Badge>
                          </td>
                          <td className="p-3 text-muted-foreground text-xs">{r.fechaInicio ? new Date(r.fechaInicio).toLocaleString('es-AR') : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
