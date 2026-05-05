'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Plus, Eye, Pencil, UserX, UserCheck, Trash2, AlertTriangle, KeyRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const HORARIOS = ['10:00', '14:00', '15:30', '18:00', '19:30', '21:00']

interface AlumnoRow { id: number; nombre: string; email: string; dni?: string; telefono?: string; turno?: string; activo?: boolean; clasesCompletadas: number; asistenciaPct: number }
interface EditForm { id: number; nombre: string; email: string; dni: string; telefono: string; dia: string; hora: string; nuevaPassword: string }

const parseTurno = (turno?: string): { dia: string; hora: string } => {
  if (!turno) return { dia: '', hora: '' }
  const idx = turno.lastIndexOf(' ')
  if (idx === -1) return { dia: turno, hora: '' }
  return { dia: turno.slice(0, idx), hora: turno.slice(idx + 1) }
}

export default function AlumnosPage() {
  const [alumnos, setAlumnos] = useState<AlumnoRow[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [showNuevo, setShowNuevo] = useState(false)
  const [detalleId, setDetalleId] = useState<number | null>(null)
  const [detalle, setDetalle] = useState<any>(null)
  const [eliminarId, setEliminarId] = useState<number | null>(null)
  const [eliminando, setEliminando] = useState(false)
  const [editando, setEditando] = useState<EditForm | null>(null)
  const [guardandoEdicion, setGuardandoEdicion] = useState(false)
  const [form, setForm] = useState({ nombre: '', email: '', dni: '', telefono: '', dia: '', hora: '', password: '' })
  const [guardando, setGuardando] = useState(false)
  const [totalClases] = useState(22)

  const cargar = () => fetch('/api/alumnos').then(r => r.json()).then(setAlumnos)
  useEffect(() => { cargar() }, [])

  const cargarDetalle = async (id: number) => {
    const data = await fetch(`/api/alumnos/${id}`).then(r => r.json())
    setDetalle(data)
    setDetalleId(id)
  }

  const genPassword = () => Math.random().toString(36).slice(-8).toUpperCase()

  const abrirEdicion = (alumno: AlumnoRow) => {
    const { dia, hora } = parseTurno(alumno.turno)
    setEditando({
      id: alumno.id,
      nombre: alumno.nombre,
      email: alumno.email,
      dni: alumno.dni ?? '',
      telefono: alumno.telefono ?? '',
      dia,
      hora,
      nuevaPassword: '',
    })
  }

  const guardarEdicion = async () => {
    if (!editando) return
    if (!editando.nombre || !editando.email) { toast.error('Nombre y email son obligatorios'); return }
    setGuardandoEdicion(true)
    const turno = editando.dia && editando.hora ? `${editando.dia} ${editando.hora}` : ''
    const body: any = {
      nombre: editando.nombre,
      email: editando.email,
      dni: editando.dni,
      telefono: editando.telefono,
      turno,
    }
    if (editando.nuevaPassword) body.nuevaPassword = editando.nuevaPassword

    const res = await fetch(`/api/alumnos/${editando.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      toast.success('Datos actualizados correctamente')
      if (editando.nuevaPassword) toast.success(`Nueva contraseña: ${editando.nuevaPassword}`, { duration: 12000 })
      setEditando(null)
      cargar()
    } else {
      const d = await res.json()
      toast.error(d.error ?? 'Error al guardar')
    }
    setGuardandoEdicion(false)
  }

  const crearAlumno = async () => {
    if (!form.nombre || !form.email || !form.password) { toast.error('Nombre, email y contraseña son obligatorios'); return }
    setGuardando(true)
    const turno = form.dia && form.hora ? `${form.dia} ${form.hora}` : ''
    const res = await fetch('/api/alumnos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, turno }),
    })
    if (res.ok) {
      toast.success(`Alumno creado. Contraseña: ${form.password}`, { duration: 10000 })
      setShowNuevo(false)
      setForm({ nombre: '', email: '', dni: '', telefono: '', dia: '', hora: '', password: '' })
      cargar()
    } else {
      const d = await res.json()
      toast.error(d.error ?? 'Error al crear alumno')
    }
    setGuardando(false)
  }

  const pausarAlumno = async (id: number) => {
    await fetch(`/api/alumnos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: false }),
    })
    toast.success('Alumno pausado')
    cargar()
  }

  const activarAlumno = async (id: number) => {
    await fetch(`/api/alumnos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: true }),
    })
    toast.success('Alumno reactivado')
    cargar()
  }

  const confirmarEliminar = async () => {
    if (!eliminarId) return
    setEliminando(true)
    await fetch(`/api/alumnos/${eliminarId}`, { method: 'DELETE' })
    toast.success('Alumno eliminado permanentemente')
    setEliminarId(null)
    setEliminando(false)
    cargar()
  }

  const filtrados = alumnos.filter(a =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.email.toLowerCase().includes(busqueda.toLowerCase())
  )

  const getAsistenciaColor = (pct: number) => pct >= 75 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-red-600'
  const alumnoAEliminar = alumnos.find(a => a.id === eliminarId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold">Mis Alumnos</h1>
          <p className="text-muted-foreground mt-1">{alumnos.length} alumnos registrados</p>
        </div>
        <Button onClick={() => { setForm({ ...form, password: genPassword() }); setShowNuevo(true) }} className="gap-2">
          <Plus className="h-4 w-4" />Nuevo alumno
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nombre o email..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="pl-9" />
      </div>

      <div className="grid gap-3">
        {filtrados.map(alumno => (
          <Card key={alumno.id} className={cn('shadow-itc', !alumno.activo && 'opacity-60')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                    {alumno.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{alumno.nombre}</p>
                      <p className="text-sm text-muted-foreground truncate">{alumno.email}</p>
                      {alumno.turno && <p className="text-xs text-muted-foreground">{alumno.turno}</p>}
                      {!alumno.activo && <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 mt-1">Pausado</Badge>}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title="Ver detalle" onClick={() => cargarDetalle(alumno.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700" title="Editar datos" onClick={() => abrirEdicion(alumno)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {alumno.activo !== false ? (
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-amber-500 hover:text-amber-700" title="Pausar alumno" onClick={() => pausarAlumno(alumno.id)}>
                          <UserX className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-emerald-500 hover:text-emerald-700" title="Reactivar alumno" onClick={() => activarAlumno(alumno.id)}>
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-600" title="Eliminar permanentemente" onClick={() => setEliminarId(alumno.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium">{alumno.clasesCompletadas}/{totalClases}</span>
                      </div>
                      <Progress value={Math.round((alumno.clasesCompletadas / totalClases) * 100)} className="h-1.5" />
                    </div>
                    <div className={cn('text-sm font-bold', getAsistenciaColor(alumno.asistenciaPct))}>
                      {alumno.asistenciaPct}% asist.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtrados.length === 0 && (
          <Card><CardContent className="p-12 text-center text-muted-foreground">No hay alumnos{busqueda ? ` que coincidan con "${busqueda}"` : ' registrados aún'}.</CardContent></Card>
        )}
      </div>

      {/* Modal nuevo alumno */}
      <Dialog open={showNuevo} onOpenChange={setShowNuevo}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Nuevo alumno</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {[
              { label: 'Nombre completo *', key: 'nombre', type: 'text', placeholder: 'Juan Pérez' },
              { label: 'Email *', key: 'email', type: 'email', placeholder: 'juan@email.com' },
              { label: 'DNI', key: 'dni', type: 'text', placeholder: '28.123.456' },
              { label: 'Teléfono', key: 'telefono', type: 'tel', placeholder: '3492 123456' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <Label className="text-sm">{label}</Label>
                <Input type={type} placeholder={placeholder} value={(form as any)[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-sm">Día</Label>
                <Select value={form.dia} onValueChange={v => setForm(f => ({ ...f, dia: v }))}>
                  <SelectTrigger><SelectValue placeholder="Día" /></SelectTrigger>
                  <SelectContent>{DIAS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Horario</Label>
                <Select value={form.hora} onValueChange={v => setForm(f => ({ ...f, hora: v }))}>
                  <SelectTrigger><SelectValue placeholder="Hora" /></SelectTrigger>
                  <SelectContent>{HORARIOS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-sm">Contraseña temporal *</Label>
              <div className="flex gap-2">
                <Input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="font-mono" />
                <Button variant="outline" type="button" onClick={() => setForm(f => ({ ...f, password: genPassword() }))}>Generar</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Anotala para entregársela al alumno</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNuevo(false)}>Cancelar</Button>
            <Button onClick={crearAlumno} disabled={guardando}>{guardando ? 'Guardando...' : 'Crear alumno'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal editar alumno */}
      {editando && (
        <Dialog open={!!editando} onOpenChange={() => setEditando(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="flex items-center gap-2"><Pencil className="h-4 w-4" />Editar alumno</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Nombre completo *</Label>
                <Input value={editando.nombre} onChange={e => setEditando(f => f && ({ ...f, nombre: e.target.value }))} />
              </div>
              <div>
                <Label className="text-sm">Email *</Label>
                <Input type="email" value={editando.email} onChange={e => setEditando(f => f && ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <Label className="text-sm">DNI</Label>
                <Input value={editando.dni} placeholder="28.123.456" onChange={e => setEditando(f => f && ({ ...f, dni: e.target.value }))} />
              </div>
              <div>
                <Label className="text-sm">Teléfono</Label>
                <Input value={editando.telefono} placeholder="3492 123456" onChange={e => setEditando(f => f && ({ ...f, telefono: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-sm">Día</Label>
                  <Select value={editando.dia} onValueChange={v => setEditando(f => f && ({ ...f, dia: v }))}>
                    <SelectTrigger><SelectValue placeholder="Día" /></SelectTrigger>
                    <SelectContent>{DIAS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Horario</Label>
                  <Select value={editando.hora} onValueChange={v => setEditando(f => f && ({ ...f, hora: v }))}>
                    <SelectTrigger><SelectValue placeholder="Hora" /></SelectTrigger>
                    <SelectContent>{HORARIOS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-sm flex items-center gap-1"><KeyRound className="h-3.5 w-3.5" />Nueva contraseña</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={editando.nuevaPassword}
                    placeholder="Dejá vacío para no cambiar"
                    onChange={e => setEditando(f => f && ({ ...f, nuevaPassword: e.target.value }))}
                    className="font-mono"
                  />
                  <Button variant="outline" type="button" onClick={() => setEditando(f => f && ({ ...f, nuevaPassword: genPassword() }))}>Generar</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Si completás este campo se cambiará la contraseña del alumno</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditando(null)}>Cancelar</Button>
              <Button onClick={guardarEdicion} disabled={guardandoEdicion}>{guardandoEdicion ? 'Guardando...' : 'Guardar cambios'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal detalle alumno */}
      <Dialog open={detalleId !== null} onOpenChange={() => { setDetalleId(null); setDetalle(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Detalle del alumno</DialogTitle></DialogHeader>
          {detalle ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground text-xs">Nombre</p><p className="font-medium">{detalle.alumno.nombre}</p></div>
                <div><p className="text-muted-foreground text-xs">Email</p><p className="font-medium">{detalle.alumno.email}</p></div>
                <div><p className="text-muted-foreground text-xs">DNI</p><p className="font-medium">{detalle.alumno.dni ?? '—'}</p></div>
                <div><p className="text-muted-foreground text-xs">Teléfono</p><p className="font-medium">{detalle.alumno.telefono ?? '—'}</p></div>
                <div><p className="text-muted-foreground text-xs">Turno</p><p className="font-medium">{detalle.alumno.turno ?? '—'}</p></div>
                <div><p className="text-muted-foreground text-xs">Clases completadas</p><p className="font-medium">{detalle.progreso.filter((p: any) => p.completada).length}/22</p></div>
              </div>
              {detalle.examenes.length > 0 && (
                <div>
                  <p className="font-medium text-sm mb-2">Historial de exámenes</p>
                  {detalle.examenes.map((e: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b last:border-0 text-sm">
                      <span className="text-muted-foreground">Intento {e.intentoNumero}</span>
                      <Badge className={e.aprobado ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>{e.puntaje}/{e.totalPreguntas} — {e.aprobado ? 'Aprobado' : 'Reprobado'}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : <div className="py-8 text-center"><div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></div>}
        </DialogContent>
      </Dialog>

      {/* Modal confirmar eliminación */}
      <Dialog open={eliminarId !== null} onOpenChange={() => setEliminarId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Eliminar alumno
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Estás por eliminar permanentemente a <span className="font-semibold text-foreground">{alumnoAEliminar?.nombre}</span>.
            </p>
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              Esta acción no se puede deshacer. Se eliminarán todos sus datos, progreso, asistencias y resultados de examen.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEliminarId(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmarEliminar} disabled={eliminando}>
              {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
