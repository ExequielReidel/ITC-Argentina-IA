'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Search, Plus, Eye, KeyRound, UserX, UserCheck, Mail, Phone, MapPin, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Profesor {
  id: number
  nombre: string
  email: string
  dni: string | null
  telefono: string | null
  sede: string | null
  activo: boolean | null
  createdAt: string | null
}

const genPassword = () =>
  Math.random().toString(36).slice(2, 6).toUpperCase() +
  Math.random().toString(36).slice(2, 6)

export default function AdminProfesoresPage() {
  const [profesores, setProfesores] = useState<Profesor[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [showNuevo, setShowNuevo] = useState(false)
  const [detalleProfesor, setDetalleProfesor] = useState<Profesor | null>(null)
  const [resetProfesor, setResetProfesor] = useState<Profesor | null>(null)
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    dni: '',
    telefono: '',
    sede: '',
    password: genPassword(),
  })

  const cargar = async () => {
    const data = await fetch('/api/admin/profesores').then(r => r.json()) as Profesor[] | { error: string }
    if (Array.isArray(data)) setProfesores(data)
  }

  useEffect(() => { cargar() }, [])

  const filtrados = profesores.filter(p => {
    const q = busqueda.toLowerCase()
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      (p.dni ?? '').toLowerCase().includes(q) ||
      (p.telefono ?? '').toLowerCase().includes(q) ||
      (p.sede ?? '').toLowerCase().includes(q)
    )
  })

  const crearProfesor = async () => {
    if (!form.nombre.trim() || !form.email.trim() || !form.password) {
      toast.error('Nombre, email y contraseña son obligatorios')
      return
    }
    setGuardando(true)
    const res = await fetch('/api/admin/profesores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form }),
    })
    if (res.ok) {
      toast.success(`Profesor creado. Contraseña: ${form.password}`, { duration: 10000 })
      setShowNuevo(false)
      setForm({ nombre: '', email: '', dni: '', telefono: '', sede: '', password: genPassword() })
      cargar()
    } else {
      const d = await res.json() as { error?: string }
      toast.error(d.error ?? 'Error al crear profesor')
    }
    setGuardando(false)
  }

  const toggleActivo = async (p: Profesor) => {
    if (p.activo) {
      await fetch(`/api/admin/profesores/${p.id}`, { method: 'DELETE' })
      toast.success(`${p.nombre} desactivado`)
    } else {
      await fetch(`/api/admin/profesores/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: true }),
      })
      toast.success(`${p.nombre} reactivado`)
    }
    cargar()
  }

  const confirmarReset = async () => {
    if (!resetProfesor || !nuevaPassword) return
    setGuardando(true)
    const res = await fetch(`/api/admin/profesores/${resetProfesor.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nuevaPassword }),
    })
    if (res.ok) {
      toast.success(`Contraseña actualizada: ${nuevaPassword}`, { duration: 10000 })
      setResetProfesor(null)
      setNuevaPassword('')
    } else {
      toast.error('Error al resetear contraseña')
    }
    setGuardando(false)
  }

  const abrirReset = (p: Profesor) => {
    setNuevaPassword(genPassword())
    setResetProfesor(p)
  }

  const initials = (nombre: string) =>
    nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold">Profesores</h1>
          <p className="text-muted-foreground mt-1">{profesores.length} profesores registrados</p>
        </div>
        <Button
          onClick={() => { setForm(f => ({ ...f, password: genPassword() })); setShowNuevo(true) }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />Nuevo profesor
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, email, DNI, teléfono o sede..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-3">
        {filtrados.map(p => (
          <Card key={p.id} className={cn('shadow-itc', !p.activo && 'opacity-60')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-11 w-11 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                    {initials(p.nombre)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold truncate">{p.nombre}</p>
                        <Badge
                          className={cn(
                            'text-xs',
                            p.activo
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          )}
                        >
                          {p.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground truncate">
                          <Mail className="h-3.5 w-3.5 flex-shrink-0" />{p.email}
                        </span>
                        {p.sede && (
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />{p.sede}
                          </span>
                        )}
                        {p.telefono && (
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3.5 w-3.5 flex-shrink-0" />{p.telefono}
                          </span>
                        )}
                        {p.dni && (
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <CreditCard className="h-3.5 w-3.5 flex-shrink-0" />{p.dni}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        size="sm" variant="ghost" className="h-8 w-8 p-0"
                        title="Ver detalle"
                        onClick={() => setDetalleProfesor(p)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm" variant="ghost" className="h-8 w-8 p-0"
                        title="Resetear contraseña"
                        onClick={() => abrirReset(p)}
                      >
                        <KeyRound className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm" variant="ghost" className="h-8 w-8 p-0"
                        title={p.activo ? 'Desactivar' : 'Reactivar'}
                        onClick={() => toggleActivo(p)}
                      >
                        {p.activo
                          ? <UserX className="h-4 w-4 text-muted-foreground" />
                          : <UserCheck className="h-4 w-4 text-emerald-500" />
                        }
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtrados.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              {busqueda
                ? `No hay profesores que coincidan con "${busqueda}"`
                : 'No hay profesores registrados aún.'}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal nuevo profesor */}
      <Dialog open={showNuevo} onOpenChange={setShowNuevo}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Nuevo profesor</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {([
              { label: 'Nombre completo *', key: 'nombre', type: 'text', placeholder: 'María García' },
              { label: 'Email *', key: 'email', type: 'email', placeholder: 'profe@itcargentina.com' },
              { label: 'DNI', key: 'dni', type: 'text', placeholder: '28.123.456' },
              { label: 'Teléfono', key: 'telefono', type: 'tel', placeholder: '3492 123456' },
              { label: 'Sede *', key: 'sede', type: 'text', placeholder: 'Córdoba Centro' },
            ] as const).map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <Label className="text-sm">{label}</Label>
                <Input
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div>
              <Label className="text-sm">Contraseña inicial *</Label>
              <div className="flex gap-2">
                <Input
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setForm(f => ({ ...f, password: genPassword() }))}
                >
                  Generar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Anotala para entregársela al profesor</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNuevo(false)}>Cancelar</Button>
            <Button onClick={crearProfesor} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Crear profesor'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal detalle */}
      <Dialog open={detalleProfesor !== null} onOpenChange={() => setDetalleProfesor(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Detalle del profesor</DialogTitle></DialogHeader>
          {detalleProfesor && (
            <div className="space-y-3 text-sm">
              {[
                { label: 'Nombre', value: detalleProfesor.nombre },
                { label: 'Email', value: detalleProfesor.email },
                { label: 'DNI', value: detalleProfesor.dni ?? '—' },
                { label: 'Teléfono', value: detalleProfesor.telefono ?? '—' },
                { label: 'Sede', value: detalleProfesor.sede ?? '—' },
                {
                  label: 'Estado',
                  value: detalleProfesor.activo ? 'Activo' : 'Inactivo',
                },
                {
                  label: 'Alta',
                  value: detalleProfesor.createdAt
                    ? new Date(detalleProfesor.createdAt).toLocaleDateString('es-AR')
                    : '—',
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b pb-2 last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetalleProfesor(null)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal resetear contraseña */}
      <Dialog open={resetProfesor !== null} onOpenChange={() => setResetProfesor(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Resetear contraseña</DialogTitle></DialogHeader>
          {resetProfesor && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Estás por cambiar la contraseña de <span className="font-semibold text-foreground">{resetProfesor.nombre}</span>.
              </p>
              <div>
                <Label className="text-sm">Nueva contraseña</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={nuevaPassword}
                    onChange={e => setNuevaPassword(e.target.value)}
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setNuevaPassword(genPassword())}
                  >
                    Generar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Anotala para entregársela al profesor</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetProfesor(null)}>Cancelar</Button>
            <Button onClick={confirmarReset} disabled={guardando || !nuevaPassword}>
              {guardando ? 'Guardando...' : 'Confirmar cambio'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
