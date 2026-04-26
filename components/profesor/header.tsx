'use client'

import { useSession, signOut } from 'next-auth/react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, User, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  onMenuClick: () => void
}

export function ProfesorHeader({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user as any

  const nombre = user?.name ?? ''
  const initials = nombre
    ? nombre.split(' ').filter((n: string) => !n.includes('.')).map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'P'

  return (
    <header className="sticky top-0 z-30 h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden lg:block">
        <h1 className="font-heading font-semibold text-foreground">
          Panel del Profesor — IA + Automatizaciones 2026
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-accent text-accent-foreground text-sm font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm font-medium">
                {nombre || 'Profesor'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{nombre || '—'}</p>
              <p className="text-xs text-muted-foreground">Profesor</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profesor/perfil')}>
              <User className="mr-2 h-4 w-4" />Mi Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
