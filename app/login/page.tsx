'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LogoITC } from '@/components/logo-itc'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Lock, Eye, EyeOff, Users, MapPin, BookOpen, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email: email.toLowerCase(),
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Email o contraseña incorrectos')
      setIsLoading(false)
      return
    }

    // Obtener la sesión para saber a dónde redirigir
    const res = await fetch('/api/auth/session')
    const session = await res.json()
    const role = session?.user?.role

    if (role === 'profesor') {
      router.push('/profesor/inicio')
    } else {
      router.push('/alumno/inicio')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Columna izquierda - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-itc relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <LogoITC variant="light" size="lg" />
            <p className="text-blue-100 mt-3 text-lg">
              Capacitaciones presenciales en tu ciudad
            </p>
          </div>

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
            <div className="glassmorphism rounded-full py-3 px-6 inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white font-medium">Curso IA + Automatizaciones 2026</span>
            </div>
          </div>

          <div className="text-blue-200 text-sm">
            <p>Informatic Training Center</p>
            <p>itcargentina.com</p>
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      {/* Columna derecha - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <LogoITC variant="dark" size="md" className="justify-center" />
            <p className="text-muted-foreground mt-2 text-sm">Capacitaciones presenciales en tu ciudad</p>
          </div>

          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground">Bienvenido/a</h1>
            <p className="text-muted-foreground mt-2">Ingresá con tu cuenta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
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

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">Contraseña</label>
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

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

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
              ) : 'Ingresar'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            ¿No tenés cuenta? Pedile el acceso a tu sede ITC.
          </p>
        </div>
      </div>
    </div>
  )
}
