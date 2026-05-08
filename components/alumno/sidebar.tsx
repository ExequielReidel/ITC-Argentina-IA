'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { LogoITC } from '@/components/logo-itc'
import {
  Home,
  BookOpen,
  FileText,
  BarChart3,
  // Award,  // Mi Certificado — oculto temporalmente
  PenLine,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const menuItems = [
  { href: '/alumno/inicio', label: 'Mi Inicio', icon: Home },
  { href: '/alumno/clases', label: 'Mis Clases', icon: BookOpen },
  { href: '/alumno/practicas', label: 'Mis Prácticas', icon: PenLine },
  { href: '/alumno/examen', label: 'Examen Final', icon: FileText },
  { href: '/alumno/progreso', label: 'Mi Progreso', icon: BarChart3 },
  // { href: '/alumno/certificado', label: 'Mi Certificado', icon: Award }, // oculto — disponible en duplicado de marca
  { href: '/alumno/soporte', label: 'Soporte', icon: HelpCircle },
  { href: '/alumno/perfil', label: 'Mi Perfil', icon: Settings },
]

export function AlumnoSidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [completadas, setCompletadas] = useState(0)
  const totalClases = 22
  const porcentaje = Math.round((completadas / totalClases) * 100)

  useEffect(() => {
    fetch('/api/clases').then(r => r.json()).then(d => {
      if (d?.completadas) setCompletadas(d.completadas.length)
    }).catch(() => {})
  }, [])

  return (
    <aside className={cn(
      'h-screen bg-card border-r border-border flex flex-col transition-all duration-300',
      isCollapsed ? 'w-20' : 'w-64'
    )}>
      {/* Header con logo */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && <LogoITC variant="dark" size="sm" />}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle}
          className={cn('h-8 w-8', isCollapsed && 'mx-auto')}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Progreso circular */}
      <div className={cn(
        'p-4 border-b border-border',
        isCollapsed ? 'flex justify-center' : ''
      )}>
        <div className={cn(
          'relative flex items-center justify-center',
          isCollapsed ? 'w-12 h-12' : 'w-full'
        )}>
          {isCollapsed ? (
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={125.6}
                  strokeDashoffset={125.6 - (125.6 * porcentaje) / 100}
                  className="text-primary"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                {completadas}
              </span>
            </div>
          ) : (
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tu progreso</span>
                <span className="font-semibold text-primary">Clase {completadas} / {totalClases}</span>
              </div>
              <Progress value={porcentaje} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">{porcentaje}% completado</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-itc' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                isCollapsed && 'justify-center px-2'
              )}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary-foreground')} />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            <p>ITC Argentina</p>
            <p>Curso IA + Automatizaciones 2026</p>
          </div>
        </div>
      )}
    </aside>
  )
}
