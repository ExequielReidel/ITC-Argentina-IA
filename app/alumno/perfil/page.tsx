'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Save,
  Lock
} from 'lucide-react'
import { alumnoDemo } from '@/lib/data'
import { toast } from 'sonner'

export default function PerfilPage() {
  const alumno = alumnoDemo
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nombre: alumno.nombre,
    email: alumno.email,
    telefono: alumno.telefono || '',
  })

  const initials = alumno.nombre
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Perfil actualizado correctamente')
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
          Mi Perfil
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestioná tu información personal
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Card principal */}
        <Card className="shadow-itc lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-lg">Información personal</CardTitle>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Editar
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar y nombre */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-heading text-xl font-bold">{alumno.nombre}</h2>
                <p className="text-muted-foreground">Alumno/a</p>
              </div>
            </div>

            {/* Campos */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Nombre completo
                </label>
                {isEditing ? (
                  <Input 
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground">{alumno.nombre}</p>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email
                </label>
                {isEditing ? (
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground">{alumno.email}</p>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Teléfono
                </label>
                {isEditing ? (
                  <Input 
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="Ej: +54 11 1234-5678"
                  />
                ) : (
                  <p className="text-foreground">{alumno.telefono || 'No especificado'}</p>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Sede
                </label>
                <p className="text-foreground">{alumno.sede}</p>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Turno
                </label>
                <p className="text-foreground capitalize">{alumno.turno} 10:00hs</p>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cambiar contraseña */}
          <Card className="shadow-itc">
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Cambiar contraseña
              </Button>
            </CardContent>
          </Card>

          {/* Info del curso */}
          <Card className="shadow-itc">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Mi curso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Curso</p>
                <p className="font-medium">IA + Automatizaciones 2026</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de inicio</p>
                <p className="font-medium">Febrero 2026</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <p className="font-medium text-emerald-600">Activo</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
