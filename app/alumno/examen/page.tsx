'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Lock, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Target
} from 'lucide-react'
import { alumnoDemo, preguntasExamen } from '@/lib/data'
import { cn } from '@/lib/utils'
import confetti from 'canvas-confetti'

type ExamenState = 'bloqueado' | 'disponible' | 'en_curso' | 'resultado'

export default function ExamenPage() {
  const alumno = alumnoDemo
  const clasesParaDesbloqueo = 21
  const examenDesbloqueado = alumno.progreso >= clasesParaDesbloqueo

  const [examenState, setExamenState] = useState<ExamenState>(
    examenDesbloqueado ? 'disponible' : 'bloqueado'
  )
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [respuestas, setRespuestas] = useState<Record<number, 'a' | 'b' | 'c' | 'd'>>({})
  const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 minutos en segundos
  const [resultado, setResultado] = useState<{ correctas: number; total: number } | null>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const calcularResultado = useCallback(() => {
    let correctas = 0
    preguntasExamen.forEach((pregunta) => {
      if (respuestas[pregunta.id] === pregunta.respuestaCorrecta) {
        correctas++
      }
    })
    return { correctas, total: preguntasExamen.length }
  }, [respuestas])

  const finalizarExamen = useCallback(() => {
    const res = calcularResultado()
    setResultado(res)
    setExamenState('resultado')
    
    if (res.correctas >= 21) { // 70%
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [calcularResultado])

  useEffect(() => {
    if (examenState !== 'en_curso') return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          finalizarExamen()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [examenState, finalizarExamen])

  const handleStartExam = () => {
    setExamenState('en_curso')
    setCurrentQuestion(0)
    setRespuestas({})
    setTimeLeft(45 * 60)
  }

  const handleSelectOption = (option: 'a' | 'b' | 'c' | 'd') => {
    setRespuestas(prev => ({
      ...prev,
      [preguntasExamen[currentQuestion].id]: option
    }))
  }

  const porcentajeProgreso = (alumno.progreso / clasesParaDesbloqueo) * 100
  const preguntaActual = preguntasExamen[currentQuestion]
  const respuestaActual = respuestas[preguntaActual?.id]

  // Estado bloqueado
  if (examenState === 'bloqueado') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
            Examen Final
          </h1>
          <p className="text-muted-foreground mt-1">
            Evaluación final del curso IA + Automatizaciones
          </p>
        </div>

        <Card className="shadow-itc-lg max-w-xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <Lock className="h-10 w-10 text-slate-400" />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              Examen bloqueado
            </h2>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              El examen se habilita cuando tu profesor marque la Clase 21 como completada.
            </p>
            
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tu progreso</span>
                <span className="font-medium">{alumno.progreso} / {clasesParaDesbloqueo} clases</span>
              </div>
              <Progress value={porcentajeProgreso} className="h-3" />
              <p className="text-xs text-muted-foreground">
                Te faltan {clasesParaDesbloqueo - alumno.progreso} clases para desbloquear el examen
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Estado disponible
  if (examenState === 'disponible') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
            Examen Final
          </h1>
          <p className="text-muted-foreground mt-1">
            Evaluación final del curso IA + Automatizaciones
          </p>
        </div>

        <Card className="shadow-itc-lg max-w-xl mx-auto bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Target className="h-10 w-10 text-primary" />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              Tu examen está disponible!
            </h2>
            <p className="text-muted-foreground mt-2">
              Estás listo para rendir el examen final
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-card rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">Preguntas</p>
                <p className="text-lg font-bold">30 multiple choice</p>
              </div>
              <div className="p-4 bg-card rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">Tiempo límite</p>
                <p className="text-lg font-bold">45 minutos</p>
              </div>
              <div className="p-4 bg-card rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">Intentos</p>
                <p className="text-lg font-bold">2 permitidos</p>
              </div>
              <div className="p-4 bg-card rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">Para aprobar</p>
                <p className="text-lg font-bold">70% (21/30)</p>
              </div>
            </div>

            <Button 
              size="lg" 
              className="mt-6 shadow-itc"
              onClick={handleStartExam}
            >
              Comenzar Examen
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Estado en curso
  if (examenState === 'en_curso') {
    const preguntasRespondidas = Object.keys(respuestas).length
    const progressPercentage = ((currentQuestion + 1) / preguntasExamen.length) * 100

    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-heading font-bold text-lg">
                Pregunta {currentQuestion + 1} / {preguntasExamen.length}
              </span>
            </div>
            <div className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold',
              timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
            )}>
              <Clock className="h-4 w-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="max-w-4xl mx-auto mt-3">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-itc-lg">
              <CardContent className="p-6 lg:p-8">
                <p className="text-lg lg:text-xl font-medium text-foreground">
                  {preguntaActual.enunciado}
                </p>

                <div className="mt-6 space-y-3">
                  {(['a', 'b', 'c', 'd'] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => handleSelectOption(key)}
                      className={cn(
                        'w-full p-4 rounded-xl border-2 text-left transition-all',
                        respuestaActual === key
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      )}
                    >
                      <span className={cn(
                        'inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 font-bold text-sm',
                        respuestaActual === key
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}>
                        {key.toUpperCase()}
                      </span>
                      <span className="text-foreground">
                        {preguntaActual.opciones[key]}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Question indicators */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {preguntasExamen.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestion(idx)}
                  className={cn(
                    'w-8 h-8 rounded-lg text-sm font-medium transition-all',
                    idx === currentQuestion && 'ring-2 ring-primary ring-offset-2',
                    respuestas[preguntasExamen[idx].id]
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-card border-t border-border p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button
              variant="outline"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(prev => prev - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <p className="text-sm text-muted-foreground">
              {preguntasRespondidas} de {preguntasExamen.length} respondidas
            </p>

            {currentQuestion === preguntasExamen.length - 1 ? (
              <Button onClick={finalizarExamen}>
                Finalizar Examen
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Estado resultado
  if (examenState === 'resultado' && resultado) {
    const porcentaje = Math.round((resultado.correctas / resultado.total) * 100)
    const aprobado = porcentaje >= 70

    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
            Resultado del Examen
          </h1>
        </div>

        <Card className={cn(
          'shadow-itc-lg max-w-xl mx-auto',
          aprobado ? 'bg-gradient-to-br from-emerald-50 to-transparent border-emerald-200' : 'bg-gradient-to-br from-red-50 to-transparent border-red-200'
        )}>
          <CardContent className="p-8 text-center">
            <div className={cn(
              'w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6',
              aprobado ? 'bg-emerald-100' : 'bg-red-100'
            )}>
              {aprobado ? (
                <CheckCircle2 className="h-12 w-12 text-emerald-600" />
              ) : (
                <XCircle className="h-12 w-12 text-red-600" />
              )}
            </div>
            
            <h2 className={cn(
              'font-heading text-2xl font-bold',
              aprobado ? 'text-emerald-700' : 'text-red-700'
            )}>
              {aprobado ? 'Aprobaste!' : 'No aprobaste'}
            </h2>

            <div className="mt-4">
              <p className="text-4xl font-bold text-foreground">
                {resultado.correctas}/{resultado.total}
              </p>
              <p className="text-lg text-muted-foreground">
                {porcentaje}% de respuestas correctas
              </p>
            </div>

            {aprobado ? (
              <div className="mt-6">
                <p className="text-emerald-700">
                  Felicitaciones! Aprobaste el examen final.
                </p>
                <Button className="mt-4" onClick={() => window.location.href = '/alumno/certificado'}>
                  Ver mi certificado
                </Button>
              </div>
            ) : (
              <div className="mt-6">
                <p className="text-red-700">
                  Necesitás 70% para aprobar. Podés volver a intentarlo.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setExamenState('disponible')}
                >
                  Volver a intentar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
