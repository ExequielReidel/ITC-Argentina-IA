'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Award, BookOpen, FileText, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const FRASES = [
  'El conocimiento que adquiriste ya es tuyo para siempre. ¡Usalo para transformar tu trabajo y el de los demás!',
  '¡Pasaste al siguiente nivel! La IA ya no es un misterio para vos — ahora sos quien la aplica.',
  'Cada clase fue un paso. Hoy llegaste al final, pero esto es solo el comienzo de lo que podés lograr.',
  '¡Lo lograste! El futuro del trabajo lo construyen personas como vos, que se animan a aprender y adaptarse.',
  'Completaste el curso y eso dice mucho de tu compromiso. ¡A aplicarlo en grande!',
]

export default function CertificadoPage() {
  const { data: session } = useSession()
  const [resultados, setResultados] = useState<any[]>([])
  const [clasesCompletadas, setClasesCompletadas] = useState(0)
  const [cargando, setCargando] = useState(true)

  const user = session?.user as any

  useEffect(() => {
    Promise.all([
      fetch('/api/examen/resultados').then(r => r.json()),
      fetch('/api/clases').then(r => r.json()),
    ]).then(([res, clases]) => {
      setResultados(Array.isArray(res) ? res : [])
      if (clases?.completadas) setClasesCompletadas(clases.completadas.length)
      setCargando(false)
    })
  }, [])

  const aprobado = resultados.some(r => r.aprobado)
  const frase = FRASES[Math.floor((user?.id ?? 0) % FRASES.length)]

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (aprobado) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center px-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
          <Award className="h-12 w-12 text-white" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h1 className="font-heading text-3xl lg:text-4xl font-bold">¡Felicitaciones, {user?.name?.split(' ')[0]}!</h1>
            <Sparkles className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-xl text-muted-foreground">Completaste el curso <span className="font-semibold text-foreground">IA + Automatizaciones 2026</span></p>
        </div>

        <Card className="shadow-itc-lg max-w-lg w-full border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-8 space-y-4">
            <p className="text-lg font-medium text-amber-900 leading-relaxed italic">"{frase}"</p>
            <div className="pt-4 border-t border-amber-200 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Clases completadas</p>
                <p className="font-bold text-lg">{clasesCompletadas}/22</p>
              </div>
              <div>
                <p className="text-muted-foreground">Mejor puntaje</p>
                <p className="font-bold text-lg text-emerald-600">
                  {Math.max(...resultados.map(r => r.puntaje))}/15
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground max-w-md">
          El certificado oficial será entregado por tu profesor al finalizar el curso presencial. ¡Seguí en contacto con ITC Argentina!
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center px-4">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
        <Award className="h-12 w-12 text-muted-foreground" />
      </div>

      <div className="space-y-2">
        <h1 className="font-heading text-2xl lg:text-3xl font-bold">Tu certificado te espera</h1>
        <p className="text-muted-foreground max-w-md">
          Para acceder a esta sección necesitás aprobar el examen final del curso.
        </p>
      </div>

      <Card className="shadow-itc max-w-sm w-full">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
            <span>{clasesCompletadas}/22 clases completadas</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <FileText className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <span>{resultados.length === 0 ? 'Examen pendiente' : `${resultados.length} intento${resultados.length > 1 ? 's' : ''} realizados`}</span>
          </div>
        </CardContent>
      </Card>

      <Link href="/alumno/examen">
        <Button className="gap-2">
          <FileText className="h-4 w-4" />
          Ir al examen final
        </Button>
      </Link>
    </div>
  )
}
