'use client'

import { useState, useEffect } from 'react'
import { AlumnoSidebar } from '@/components/alumno/sidebar'
import { AlumnoHeader } from '@/components/alumno/header'
import { cn } from '@/lib/utils'

export default function AlumnoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 transition-transform duration-300',
        isMobile && !mobileMenuOpen && '-translate-x-full'
      )}>
        <AlumnoSidebar 
          isCollapsed={!isMobile && sidebarCollapsed} 
          onToggle={() => {
            if (isMobile) {
              setMobileMenuOpen(false)
            } else {
              setSidebarCollapsed(!sidebarCollapsed)
            }
          }} 
        />
      </aside>

      {/* Main content area */}
      <div className={cn(
        'min-h-screen transition-all duration-300',
        !isMobile && (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64')
      )}>
        <AlumnoHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
