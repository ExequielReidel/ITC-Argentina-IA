'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogoITC } from '@/components/logo-itc'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Lock, Eye, EyeOff, GraduationCap, UserCog, Users, MapPin, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

type UserRole = 'alumno' | 'profesor'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>('alumno')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simular login
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (selectedRole === 'alumno') {
      router.push('/alumno/inicio')
    } else {
      router.push('/profesor/inicio')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Columna izquierda - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-itc relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo y tagline */}
          <div>
            <LogoITC variant="light" size="lg" />
            <p className="text-blue-100 mt-3 text-lg">
              Capacitaciones presenciales en tu ciudad
            </p>
          </div>

          {/* Stats cards con glassmorphism */}
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="glassmorphism rounded-2xl p-4 text-center hover-lift">
                <Users className="w-6 h-6 text-white mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">+65.000</p>
                <p className="text-blue-100 text-sm">alumnos</p>
              </div>
              <div className="glassmorphism rounded-2xl p-4 text-center hover-lift">
                <MapPin className="w-6 h-6 text-white mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">+200</p>
                <p className="text-blue-100 text-sm">ciudades</p>
              </div>
              <div className="glassmorphism rounded-2xl p-4 text-center hover-lift">
                <BookOpen className="w-6 h-6 text-white mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">22</p>
                <p className="text-blue-100 text-sm">clases</p>
              </div>
            </div>

            {/* Badge del curso */}
            <div className="glassmorphism rounded-full py-3 px-6 inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white font-medium">Curso IA + Automatizaciones 2026</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-blue-200 text-sm">
            <p>Informatic Training Center</p>
            <p>itcargentina.com</p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      {/* Columna derecha - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Logo en mobile */}
          <div className="lg:hidden mb-8 text-center">
            <LogoITC variant="dark" size="md" className="justify-center" />
            <p className="text-muted-foreground mt-2 text-sm">
              Capacitaciones presenciales en tu ciudad
            </p>
          </div>

          {/* Título */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Bienvenido/a
            </h1>
            <p className="text-muted-foreground mt-2">
              Ingresá con tu cuenta para continuar
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Recordarme y olvidé contraseña */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Recordarme
                </label>
              </div>
              <a href="#" className="text-sm text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón Ingresar */}
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-base font-semibold shadow-itc"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </span>
              ) : (
                'Ingresar'
              )}
            </Button>

            {/* Separador */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">o</span>
              </div>
            </div>

            {/* Selector de rol */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground text-center">
                Seleccioná tu rol
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Card 
                  className={cn(
                    'cursor-pointer transition-all duration-300 hover-lift',
                    selectedRole === 'alumno' 
                      ? 'border-2 border-primary shadow-itc bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  )}
                  onClick={() => setSelectedRole('alumno')}
                >
                  <CardContent className="p-4 flex flex-col items-center gap-2">
                    <div className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                      selectedRole === 'alumno' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    )}>
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <span className={cn(
                      'font-medium text-sm',
                      selectedRole === 'alumno' ? 'text-primary' : 'text-foreground'
                    )}>
                      Soy alumno
                    </span>
                  </CardContent>
                </Card>

                <Card 
                  className={cn(
                    'cursor-pointer transition-all duration-300 hover-lift',
                    selectedRole === 'profesor' 
                      ? 'border-2 border-accent shadow-itc bg-accent/5' 
                      : 'border-border hover:border-accent/50'
                  )}
                  onClick={() => setSelectedRole('profesor')}
                >
                  <CardContent className="p-4 flex flex-col items-center gap-2">
                    <div className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                      selectedRole === 'profesor' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                    )}>
                      <UserCog className="w-6 h-6" />
                    </div>
                    <span className={cn(
                      'font-medium text-sm',
                      selectedRole === 'profesor' ? 'text-accent' : 'text-foreground'
                    )}>
                      Soy profesor
                    </span>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>

          {/* Nota al pie */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            ¿No tenés cuenta? Pedile el acceso a tu sede ITC.
          </p>
        </div>
      </div>
    </div>
  )
}
