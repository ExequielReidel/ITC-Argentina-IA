import { LogoITC } from '@/components/logo-itc'
import LogoutAdminButton from './logout-button'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 h-16 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <LogoITC variant="dark" size="sm" />
          <span className="text-sm text-muted-foreground hidden sm:block">Panel de Administración</span>
        </div>
        <LogoutAdminButton />
      </header>
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {children}
      </main>
    </div>
  )
}
