'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { LogoITC } from '@/components/logo-itc'
import {
  Home,
  Users,
  BookOpen,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const menuItems = [
  { href: '/profesor/inicio', label: 'Panel General', icon: Home },
  { href: '/profesor/alumnos', label: 'Mis Alumnos', icon: Users },
  { href: '/profesor/clases', label: 'Gestión de Clases', icon: BookOpen },
  { href: '/profesor/examenes', label: 'Exámenes', icon: FileText },
]

export function ProfesorSidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [totalAlumnos, setTotalAlumnos] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/alumnos').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setTotalAlumnos(d.filter((a: any) => a.activo !== false).length)
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

      {/* Info del profesor */}
      <div className={cn(
        'p-4 border-b border-border',
        isCollapsed ? 'flex justify-center' : ''
      )}>
        {isCollapsed ? (
          <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
            {totalAlumnos ?? '—'}
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Alumnos activos</p>
            <p className="text-2xl font-bold text-accent">{totalAlumnos ?? '—'}</p>
            <p className="text-xs text-muted-foreground">ITC Argentina 2026</p>
          </div>
        )}
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
                  ? 'bg-accent text-accent-foreground shadow-itc' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                isCollapsed && 'justify-center px-2'
              )}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-accent-foreground')} />
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
            <p>Panel del Profesor</p>
            <p>ITC Argentina 2026</p>
          </div>
        </div>
      )}
    </aside>
  )
}
