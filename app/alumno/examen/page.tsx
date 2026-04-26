'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Lock, Clock, ChevronRight, ChevronLeft, Check, AlertCircle, Trophy, XCircle, KeyRound } from 'lucide-react'
import { cn } from '@/lib/utils'

type ExamenState = 'cargando' | 'bloqueado' | 'password' | 'en_curso' | 'resultado'

interface Pregunta { id: number; enunciado: string; opcionA: string; opcionB: string; opcionC: string; opcionD: string }
interface Resultado { puntaje: number; total: number; aprobado: boolean; puntajeMinimo: number }

export default function ExamenPage() {
  const [estado, setEstado] = useState<ExamenState>('cargando')
  const [config, setConfig] = useState<any>(null)
  const [resultadosPrevios, setResultadosPrevios] = useState<any[]>([])
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [intentoId, setIntentoId] = useState<number | null>(null)
  const [preguntas, setPreguntas] = useState<Pregunta[]>([])
  const [respuestas, setRespuestas] = useState<Record<number, string>>({})
  const [preguntaActual, setPreguntaActual] = useState(0)
  const [tiempoRestante, setTiempoRestante] = useState(0)
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [intentoInfo, setIntentoInfo] = useState<any>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const cargarDatos = async () => {
    const [cfgRes, resRes] = await Promise.all([
      fetch('/api/examen/config').then(r => r.json()),
      fetch('/api/examen/resultados').then(r => r.json()),
    ])
    setConfig(cfgRes)
    setResultadosPrevios(Array.isArray(resRes) ? resRes : [])
    const yaAprobo = Array.isArray(resRes) && resRes.some((r: any) => r.aprobado)
    const intentosUsados = Array.isArray(resRes) ? resRes.length : 0
    if (yaAprobo) {
      const mejor = resRes.find((r: any) => r.aprobado)
      setResultado({ puntaje: mejor.puntaje, total: mejor.totalPreguntas, aprobado: true, puntajeMinimo: cfgRes.puntajeMinimo ?? 9 })
      setEstado('resultado')
    } else if (cfgRes.habilitado && intentosUsados < (cfgRes.intentosPermitidos ?? 3)) {
      setEstado(cfgRes.tienePassword ? 'password' : 'bloqueado')
    } else {
      setEstado('bloqueado')
    }
  }

  useEffect(() => { cargarDatos() }, [])

  const iniciarExamen = async (pwd: string) => {
    setPasswordError('')
    const res = await fetch('/api/examen/iniciar', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd }),
    })
    const data = await res.json()
    if (!res.ok) { setPasswordError(data.error ?? 'Error al iniciar'); return }
    setIntentoId(data.intentoId)
    setPreguntas(data.preguntas)
    setIntentoInfo(data)
    setTiempoRestante((data.tiempoLimiteMin ?? 45) * 60)
    setRespuestas({})
    setPreguntaActual(0)
    setEstado('en_curso')
  }

  const finalizarExamen = useCallback(async () => {
    if (!intentoId) return
    setEnviando(true)
    if (timerRef.current) clearInterval(timerRef.current)
    const res = await fetch('/api/examen/finalizar', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intentoId, respuestas }),
    })
    const data = await res.json()
    setResultado(data)
    setEstado('resultado')
    setEnviando(false)
    const resRes = await fetch('/api/examen/resultados').then(r => r.json())
    setResultadosPrevios(Array.isArray(resRes) ? resRes : [])
  }, [intentoId, respuestas])

  useEffect(() => {
    if (estado === 'en_curso' && tiempoRestante > 0) {
      timerRef.current = setInterval(() => {
        setTiempoRestante(t => {
          if (t <= 1) { clearInterval(timerRef.current!); finalizarExamen(); return 0 }
          return t - 1
        })
      }, 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [estado, finalizarExamen])

  const formatTiempo = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  if (estado === 'cargando') return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  )

  if (estado === 'bloqueado') {
    const intentosUsados = resultadosPrevios.length
    const maxIntentos = config?.intentosPermitidos ?? 3
    const agotados = intentosUsados >= maxIntentos
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div><h1 className="font-heading text-2xl font-bold">Examen Final</h1><p className="text-muted-foreground mt-1">Evaluación del Curso IA + Automatizaciones 2026</p></div>
        <Card className="shadow-itc"><CardContent className="p-8 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
            {agotados ? <XCircle className="h-10 w-10 text-red-400" /> : <Lock className="h-10 w-10 text-slate-400" />}
          </div>
          <h2 className="font-heading text-xl font-bold">{agotados ? 'Intentos agotados' : 'Examen no disponible aún'}</h2>
          <p className="text-muted-foreground">{agotados ? `Usaste los ${maxIntentos} intentos sin aprobar. Hablá con tu profesor.` : 'Tu profesor aún no habilitó el examen. Te avisará cuando esté disponible.'}</p>
          {intentosUsados > 0 && <p className="text-sm text-muted-foreground">Intentos usados: {intentosUsados} / {maxIntentos}</p>}
        </CardContent></Card>
        {resultadosPrevios.length > 0 && (
          <Card className="shadow-itc"><CardContent className="p-4">
            <p className="font-medium mb-3 text-sm">Tus intentos anteriores</p>
            {resultadosPrevios.map((r: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm text-muted-foreground">Intento {r.intentoNumero}</span>
                <Badge className={r.aprobado ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>{r.puntaje}/{r.totalPreguntas} — {r.aprobado ? '✓ Aprobado' : '✗ Reprobado'}</Badge>
              </div>
            ))}
          </CardContent></Card>
        )}
      </div>
    )
  }

  if (estado === 'password') return (
    <div className="max-w-md mx-auto space-y-6">
      <div><h1 className="font-heading text-2xl font-bold">Examen Final</h1><p className="text-muted-foreground mt-1">Ingresá la contraseña que te dio tu profesor</p></div>
      <Card className="shadow-itc"><CardContent className="p-8 space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto"><KeyRound className="h-8 w-8 text-amber-600" /></div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Contraseña del examen</label>
          <Input type="password" placeholder="Contraseña..." value={password}
            onChange={e => { setPassword(e.target.value); setPasswordError('') }}
            className="h-12 rounded-xl text-center text-lg tracking-widest"
            onKeyDown={e => e.key === 'Enter' && iniciarExamen(password)} />
          {passwordError && <div className="flex items-center gap-2 text-red-600 text-sm"><AlertCircle className="h-4 w-4" />{passwordError}</div>}
        </div>
        <Button className="w-full h-12" onClick={() => iniciarExamen(password)} disabled={!password}>Comenzar Examen</Button>
        <p className="text-xs text-muted-foreground text-center">Tenés {config?.intentosPermitidos ?? 3} intentos de {config?.tiempoLimiteMin ?? 45} minutos. Necesitás {config?.puntajeMinimo ?? 9}/15 para aprobar.</p>
      </CardContent></Card>
    </div>
  )

  if (estado === 'en_curso' && preguntas.length > 0) {
    const pregunta = preguntas[preguntaActual]
    const respuesta = respuestas[pregunta.id]
    const tiempoWarning = tiempoRestante < 300
    const opciones = [{ key: 'a', texto: pregunta.opcionA }, { key: 'b', texto: pregunta.opcionB }, { key: 'c', texto: pregunta.opcionC }, { key: 'd', texto: pregunta.opcionD }]
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="font-heading text-lg font-bold">Examen Final</h1><p className="text-sm text-muted-foreground">Pregunta {preguntaActual + 1} de {preguntas.length} · Intento {intentoInfo?.intentoNumero}</p></div>
          <div className={cn('flex items-center gap-2 font-mono text-lg font-bold', tiempoWarning && 'text-red-500 animate-pulse')}><Clock className="h-5 w-5" />{formatTiempo(tiempoRestante)}</div>
        </div>
        <Progress value={Math.round((preguntaActual / preguntas.length) * 100)} className="h-2" />
        <Card className="shadow-itc"><CardContent className="p-6 space-y-6">
          <p className="text-lg font-semibold text-foreground leading-relaxed">{pregunta.enunciado}</p>
          <div className="space-y-3">
            {opciones.map(({ key, texto }) => (
              <button key={key} onClick={() => setRespuestas(prev => ({ ...prev, [pregunta.id]: key }))}
                className={cn('w-full text-left p-4 rounded-xl border-2 transition-all duration-200 text-sm',
                  respuesta === key ? 'border-primary bg-primary/10 font-medium' : 'border-border hover:border-primary/50 hover:bg-muted/50')}>
                <span className={cn('inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mr-3',
                  respuesta === key ? 'bg-primary text-white' : 'bg-muted text-muted-foreground')}>{key.toUpperCase()}</span>
                {texto}
              </button>
            ))}
          </div>
        </CardContent></Card>
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setPreguntaActual(p => p - 1)} disabled={preguntaActual === 0} className="gap-2"><ChevronLeft className="h-4 w-4" />Anterior</Button>
          <div className="flex gap-1 flex-wrap justify-center">
            {preguntas.map((_, i) => (
              <button key={i} onClick={() => setPreguntaActual(i)}
                className={cn('w-7 h-7 rounded-full text-xs font-medium transition-colors',
                  i === preguntaActual ? 'bg-primary text-white' : respuestas[preguntas[i].id] ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground')}>{i + 1}</button>
            ))}
          </div>
          {preguntaActual < preguntas.length - 1
            ? <Button onClick={() => setPreguntaActual(p => p + 1)} className="gap-2">Siguiente<ChevronRight className="h-4 w-4" /></Button>
            : <Button onClick={finalizarExamen} disabled={enviando || Object.keys(respuestas).length < preguntas.length} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              {enviando ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="h-4 w-4" />}Finalizar</Button>}
        </div>
        {Object.keys(respuestas).length < preguntas.length && preguntaActual === preguntas.length - 1 &&
          <p className="text-sm text-amber-600 text-center">Respondé todas las preguntas antes de finalizar ({Object.keys(respuestas).length}/{preguntas.length} respondidas)</p>}
      </div>
    )
  }

  if (estado === 'resultado' && resultado) {
    const pct = Math.round((resultado.puntaje / resultado.total) * 100)
    const intentosUsados = resultadosPrevios.length
    const puedeReintentar = !resultado.aprobado && intentosUsados < (config?.intentosPermitidos ?? 3)
    const frases = ['¡El conocimiento que adquiriste es tuyo para siempre!', '¡Demostraste que la IA ya es parte de tu futuro!', '¡Sos parte de la nueva generación que lidera con tecnología!', '¡Tu esfuerzo y dedicación dieron resultado!']
    const frase = frases[Math.floor(Math.random() * frases.length)]
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <Card className={cn('shadow-itc-lg overflow-hidden', resultado.aprobado ? 'border-emerald-200' : 'border-red-200')}>
          <CardContent className={cn('p-8 text-center space-y-4', resultado.aprobado ? 'bg-gradient-to-b from-emerald-50 to-white' : 'bg-gradient-to-b from-red-50 to-white')}>
            {resultado.aprobado ? (
              <>
                <div className="text-6xl">🎉</div>
                <h2 className="font-heading text-3xl font-bold text-emerald-700">¡Aprobaste!</h2>
                <p className="text-5xl font-bold text-emerald-600">{resultado.puntaje}<span className="text-2xl text-muted-foreground">/{resultado.total}</span></p>
                <p className="text-lg text-emerald-600 font-medium">{pct}% de respuestas correctas</p>
                <div className="bg-white rounded-2xl p-6 border border-emerald-100 space-y-3">
                  <Trophy className="h-10 w-10 text-yellow-500 mx-auto" />
                  <p className="font-heading text-xl font-bold">¡Felicitaciones!</p>
                  <p className="text-muted-foreground">Completaste el Curso IA + Automatizaciones 2026 de ITC Argentina.</p>
                  <p className="text-primary font-medium italic">"{frase}"</p>
                  <p className="text-sm text-muted-foreground">Tu certificado será entregado de manera presencial por tu profesor en la próxima clase.</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-5xl">😔</div>
                <h2 className="font-heading text-2xl font-bold">Por esta vez no alcanzó</h2>
                <p className="text-4xl font-bold text-red-500">{resultado.puntaje}<span className="text-xl text-muted-foreground">/{resultado.total}</span></p>
                <p className="text-muted-foreground">Necesitabas {resultado.puntajeMinimo}/{resultado.total}. ¡Repasá el material y volvé a intentarlo!</p>
                {puedeReintentar
                  ? <Button onClick={() => { setEstado('password'); setPassword('') }}>Intentar nuevamente</Button>
                  : <p className="text-sm text-red-600">Agotaste los {config?.intentosPermitidos ?? 3} intentos. Hablá con tu profesor.</p>}
              </>
            )}
          </CardContent>
        </Card>
        {resultadosPrevios.length > 0 && (
          <Card className="shadow-itc"><CardContent className="p-4">
            <p className="font-medium mb-3 text-sm">Historial de intentos</p>
            {resultadosPrevios.map((r: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm text-muted-foreground">Intento {r.intentoNumero}</span>
                <Badge className={r.aprobado ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>{r.puntaje}/{r.totalPreguntas} — {r.aprobado ? '✓ Aprobado' : '✗ Reprobado'}</Badge>
              </div>
            ))}
          </CardContent></Card>
        )}
      </div>
    )
  }

  return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
}
