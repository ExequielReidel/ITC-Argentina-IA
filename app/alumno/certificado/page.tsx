'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Download, 
  Share2, 
  CheckCircle2, 
  Circle,
  Award,
  Lock
} from 'lucide-react'
import { alumnoDemo } from '@/lib/data'
import { cn } from '@/lib/utils'

export default function CertificadoPage() {
  const alumno = alumnoDemo
  const totalClases = 22
  
  // Requisitos del certificado
  const requisitos = [
    {
      id: 'asistencia',
      titulo: '75% de asistencia',
      descripcion: `${alumno.progreso} de ${totalClases} clases`,
      cumplido: alumno.asistencia >= 75,
      progreso: alumno.asistencia
    },
    {
      id: 'proyecto',
      titulo: 'Proyecto Final entregado',
      descripcion: 'Automatización con Make + IA',
      cumplido: false,
      progreso: 0
    },
    {
      id: 'examen',
      titulo: 'Examen aprobado (70%+)',
      descripcion: alumno.examenEstado === 'aprobado' ? `Aprobado con ${alumno.examenPuntaje}%` : 'Pendiente',
      cumplido: alumno.examenEstado === 'aprobado',
      progreso: alumno.examenEstado === 'aprobado' ? 100 : 0
    },
  ]

  const certificadoDisponible = requisitos.every(r => r.cumplido)
  const codigoVerificacion = 'ITC-2026-IA-' + alumno.id.padStart(6, '0')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
          Mi Certificado
        </h1>
        <p className="text-muted-foreground mt-1">
          Certificado oficial del curso IA + Automatizaciones
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Preview del certificado */}
        <Card className={cn(
          'shadow-itc-lg overflow-hidden',
          !certificadoDisponible && 'relative'
        )}>
          {/* Overlay si no está disponible */}
          {!certificadoDisponible && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center">
                <Lock className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <p className="font-medium text-slate-600">Certificado bloqueado</p>
                <p className="text-sm text-slate-500">Completá los requisitos</p>
              </div>
            </div>
          )}
          
          {/* Certificado */}
          <div className="aspect-[1.414/1] bg-gradient-to-br from-slate-50 to-white p-8 border-8 border-primary/10">
            <div className="h-full flex flex-col justify-between border-2 border-primary/20 rounded-lg p-6">
              {/* Header del certificado */}
              <div className="text-center">
                <div className="font-heading font-bold text-2xl text-primary">
                  ITC <span className="font-normal">Argentina</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Informatic Training Center
                </p>
              </div>

              {/* Contenido */}
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground uppercase tracking-wider">
                  Certificamos que
                </p>
                <p className="font-heading text-2xl font-bold text-foreground">
                  {alumno.nombre}
                </p>
                <p className="text-sm text-muted-foreground">
                  ha completado satisfactoriamente el curso
                </p>
                <p className="font-heading text-xl font-bold text-primary">
                  IA + Automatizaciones para Negocios
                </p>
                <p className="text-xs text-muted-foreground">
                  22 clases presenciales - 33 horas de formación
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end text-xs text-muted-foreground">
                <div>
                  <p>Fecha: {new Date().toLocaleDateString('es-AR')}</p>
                  <p>Código: {codigoVerificacion}</p>
                </div>
                <div className="text-right">
                  <p>Con el aval de</p>
                  <p className="font-semibold">UDEMM</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Requisitos y acciones */}
        <div className="space-y-6">
          {/* Requisitos */}
          <Card className="shadow-itc">
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Requisitos del certificado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {requisitos.map((req) => (
                <div 
                  key={req.id}
                  className={cn(
                    'p-4 rounded-xl border transition-all',
                    req.cumplido 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-slate-50 border-slate-200'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {req.cumplido ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={cn(
                        'font-medium',
                        req.cumplido ? 'text-emerald-800' : 'text-slate-700'
                      )}>
                        {req.titulo}
                      </p>
                      <p className={cn(
                        'text-sm',
                        req.cumplido ? 'text-emerald-600' : 'text-slate-500'
                      )}>
                        {req.descripcion}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Acciones */}
          {certificadoDisponible && (
            <Card className="shadow-itc bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-heading font-bold text-lg text-foreground mb-4">
                  Tu certificado está listo!
                </h3>
                <div className="space-y-3">
                  <Button className="w-full gap-2 shadow-itc">
                    <Download className="h-4 w-4" />
                    Descargar PDF
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Share2 className="h-4 w-4" />
                    Compartir en LinkedIn
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Código de verificación: {codigoVerificacion}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Info adicional */}
          <Card className="shadow-itc">
            <CardContent className="p-6">
              <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                Sobre el certificado
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  Certificado oficial de ITC Argentina
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  Avalado por UDEMM (Universidad de la Marina Mercante)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  Código QR de verificación único
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  Válido para currículum y LinkedIn
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
