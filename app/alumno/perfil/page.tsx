'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, Mail, Phone, Calendar, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

export default function PerfilPage() {
  const { data: session } = useSession()
  const user = session?.user as any

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground mt-1">Tu información personal del curso</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="shadow-itc lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Información personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-heading text-xl font-bold">{user?.name ?? '—'}</h2>
                <p className="text-muted-foreground">Alumno/a</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-1">
                <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />Nombre completo
                </label>
                <p className="text-foreground">{user?.name ?? '—'}</p>
              </div>
              <div className="grid gap-1">
                <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />Email
                </label>
                <p className="text-foreground">{user?.email ?? '—'}</p>
              </div>
              <div className="grid gap-1">
                <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />Teléfono
                </label>
                <p className="text-foreground">{user?.telefono ?? 'No especificado'}</p>
              </div>
              <div className="grid gap-1">
                <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />Turno
                </label>
                <p className="text-foreground">{user?.turno ?? 'No asignado'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-itc">
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Lock className="h-5 w-5" />Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Para cambiar tu contraseña, pedísela a tu profesor.
              </p>
              <Button variant="outline" className="w-full" onClick={() => signOut({ callbackUrl: '/login' })}>
                Cerrar sesión
              </Button>
            </CardContent>
          </Card>

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
