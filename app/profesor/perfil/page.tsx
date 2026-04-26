'use client'

import { useSession, signOut } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { User, Mail, Shield, LogOut } from 'lucide-react'

export default function PerfilProfesorPage() {
  const { data: session } = useSession()
  const user = session?.user as any

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'P'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground mt-1">Información de tu cuenta</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="shadow-itc lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Información personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-accent text-accent-foreground text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-heading text-xl font-bold">{user?.name ?? '—'}</h2>
                <p className="text-muted-foreground">Profesor ITC Argentina</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-1">
                <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />Nombre
                </label>
                <p className="text-foreground">{user?.name ?? '—'}</p>
              </div>
              <div className="grid gap-1">
                <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />Email
                </label>
                <p className="text-foreground">{user?.email ?? '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-itc">
          <CardHeader>
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />Sesión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              ITC Argentina — Curso IA + Automatizaciones 2026
            </p>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <LogOut className="h-4 w-4" />Cerrar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
