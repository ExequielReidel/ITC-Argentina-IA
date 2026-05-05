'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { HelpCircle, Mail, Send } from 'lucide-react'

interface Profesor { nombre: string; email: string }

export default function SoportePage() {
  const { data: session } = useSession()
  const [profesores, setProfesores] = useState<Profesor[]>([])
  const [profesorEmail, setProfesorEmail] = useState('')
  const [asunto, setAsunto] = useState('')
  const [detalles, setDetalles] = useState('')

  const nombre = (session?.user as any)?.name ?? ''

  useEffect(() => {
    fetch('/api/soporte')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProfesores(data)
          if (data.length === 1) setProfesorEmail(data[0].email)
        }
      })
      .catch(() => {})
  }, [])

  const enviar = () => {
    if (!profesorEmail || !asunto) return
    const cuerpo = `Hola, soy ${nombre}.\n\n${detalles}`
    const url = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(profesorEmail)}&su=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold">Soporte</h1>
        <p className="text-muted-foreground mt-1">Contactá a tu profesor/a por email</p>
      </div>

      <Card className="shadow-itc">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <HelpCircle className="h-5 w-5 text-primary" />
            Enviar consulta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profesores.length > 1 && (
            <div>
              <Label className="text-sm">Profesor/a</Label>
              <Select value={profesorEmail} onValueChange={setProfesorEmail}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccioná tu profesor/a" />
                </SelectTrigger>
                <SelectContent>
                  {profesores.map(p => (
                    <SelectItem key={p.email} value={p.email}>{p.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="text-sm">Tu nombre</Label>
            <Input value={nombre} disabled className="bg-muted" />
          </div>

          <div>
            <Label className="text-sm">Asunto *</Label>
            <Input
              placeholder="Ej: Consulta sobre la clase 5"
              value={asunto}
              onChange={e => setAsunto(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-sm">Detalles</Label>
            <Textarea
              placeholder="Describí tu consulta o problema..."
              value={detalles}
              onChange={e => setDetalles(e.target.value)}
              rows={5}
            />
          </div>

          <Button
            className="w-full gap-2"
            onClick={enviar}
            disabled={!profesorEmail || !asunto}
          >
            <Send className="h-4 w-4" />
            Abrir Gmail para enviar
          </Button>

          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
            <Mail className="h-3 w-3" />
            Se abrirá Gmail con el mensaje pre-completado
          </p>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4 text-sm text-blue-800">
          <p className="font-medium mb-1">¿Tenés otro problema?</p>
          <p>Si no podés iniciar sesión o tenés inconvenientes con tu cuenta, acercate al salón y hablá con tu profesor/a directamente.</p>
        </CardContent>
      </Card>
    </div>
  )
}
