'use client'

import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

export default function AyudaPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">Guía de Uso</h1>
          <p className="text-muted-foreground mt-1">Manual del profesor — ITC Argentina · IA + Automatizaciones 2026</p>
        </div>
        <Button variant="outline" className="gap-2 print:hidden" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          Descargar como PDF
        </Button>
      </div>

      {/* Contenido imprimible */}
      <div id="guia-contenido" className="bg-white rounded-2xl shadow-itc p-8 space-y-10 print:shadow-none print:rounded-none print:p-0">

        {/* Intro */}
        <InfoBox color="blue">
          <strong>¿Qué es esta plataforma?</strong> Es el panel de control del curso. Desde acá podés gestionar alumnos, habilitar clases, tomar asistencia y administrar el examen final — todo en un solo lugar, sin necesidad de conocimientos técnicos.
        </InfoBox>

        {/* PASO 1 */}
        <Section numero={1} titulo="Ingreso al Sistema" emoji="🔐">
          <Steps>
            <Step n={1}>Abrí el navegador y entrá a la dirección del sistema (tu administrador te va a dar el enlace).</Step>
            <Step n={2}>Ingresá tu <strong>correo electrónico</strong> y tu <strong>contraseña</strong>.</Step>
            <Step n={3}>Hacé clic en <strong>Iniciar sesión</strong>. Si los datos son correctos, entrás al panel automáticamente.</Step>
          </Steps>
          <WarnBox>Si no podés ingresar, verificá que el correo no tenga errores tipográficos. Si el problema persiste, contactá al administrador.</WarnBox>
        </Section>

        {/* PASO 2 */}
        <Section numero={2} titulo="Conociendo el Panel" emoji="🏠">
          <p className="text-slate-700 mb-4">En el menú lateral izquierdo vas a encontrar las siguientes secciones:</p>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="text-left px-4 py-2 border border-blue-200 text-blue-800 font-bold">Sección</th>
                <th className="text-left px-4 py-2 border border-blue-200 text-blue-800 font-bold">Para qué sirve</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Panel General', 'Métricas del curso, alertas y acceso rápido para habilitar la próxima clase.'],
                ['Mis Alumnos', 'Ver, agregar, editar, pausar o eliminar alumnos del curso.'],
                ['Gestión de Clases', 'Habilitar o deshabilitar el acceso de los alumnos a cada clase.'],
                ['Asistencia', 'Registrar qué alumnos estuvieron presentes en cada clase.'],
                ['Exámenes', 'Configurar el examen final y ver los resultados de los alumnos.'],
                ['Guía de Uso', 'Este manual que estás leyendo ahora.'],
              ].map(([sec, desc], i) => (
                <tr key={i} className={i % 2 === 1 ? 'bg-slate-50' : ''}>
                  <td className="px-4 py-2 border border-slate-200 font-semibold text-slate-800">{sec}</td>
                  <td className="px-4 py-2 border border-slate-200 text-slate-700">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* PASO 3 */}
        <Section numero={3} titulo="Panel General" emoji="📊">
          <p className="text-slate-700 mb-3">Al entrar al sistema, lo primero que ves es el <strong>Panel General</strong>. Desde acá podés ver de un vistazo cómo va el curso:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700 text-sm">
            <li><strong>Alumnos activos</strong> — cuántos alumnos están inscriptos y activos.</li>
            <li><strong>Clases habilitadas</strong> — cuántas de las 22 clases ya abriste.</li>
            <li><strong>Asistencia promedio</strong> — porcentaje general de presencia en el curso.</li>
            <li><strong>Aprobados</strong> — cuántos alumnos aprobaron el examen final.</li>
          </ul>
          <TipBox>También aparece un <strong>botón rápido para habilitar la próxima clase</strong> y alertas sobre alumnos con baja asistencia.</TipBox>
        </Section>

        {/* PASO 4 */}
        <Section numero={4} titulo="Gestión de Alumnos" emoji="👥">
          <p className="text-slate-700 mb-4">Hacé clic en <strong>Mis Alumnos</strong> en el menú. Vas a ver la lista de todos los inscriptos con su nombre, turno y estado.</p>

          <p className="font-semibold text-slate-800 mb-2">Agregar un alumno nuevo:</p>
          <Steps>
            <Step n={1}>Hacé clic en el botón <strong>"+ Nuevo Alumno"</strong>.</Step>
            <Step n={2}>Completá el formulario con los datos (ver tabla abajo).</Step>
            <Step n={3}>Hacé clic en <strong>Guardar</strong>. El alumno ya puede ingresar con el correo y la contraseña que le asignaste.</Step>
          </Steps>

          <table className="w-full text-sm border-collapse mt-4">
            <thead>
              <tr className="bg-blue-50">
                <th className="text-left px-4 py-2 border border-blue-200 text-blue-800 font-bold">Campo</th>
                <th className="text-left px-4 py-2 border border-blue-200 text-blue-800 font-bold">Descripción</th>
                <th className="text-left px-4 py-2 border border-blue-200 text-blue-800 font-bold">Ejemplo</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Nombre completo', 'Nombre y apellido del alumno', 'María García'],
                ['Correo electrónico', 'Es el usuario para iniciar sesión', 'maria@gmail.com'],
                ['Contraseña', 'La primera que va a usar para entrar', 'itc2026'],
                ['Día', 'Día de su turno de clase', 'Lunes / Miércoles'],
                ['Horario', 'Hora de inicio de su turno', '18:00 / 20:00'],
              ].map(([campo, desc, ej], i) => (
                <tr key={i} className={i % 2 === 1 ? 'bg-slate-50' : ''}>
                  <td className="px-4 py-2 border border-slate-200 font-semibold text-slate-800">{campo}</td>
                  <td className="px-4 py-2 border border-slate-200 text-slate-700">{desc}</td>
                  <td className="px-4 py-2 border border-slate-200 text-slate-500 italic">{ej}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="font-semibold text-slate-800 mt-5 mb-3">Otras acciones disponibles para cada alumno:</p>
          <ul className="space-y-2 text-sm text-slate-700">
            <li><Badge color="blue">✏️ Editar</Badge> Modificar cualquier dato, incluyendo correo y contraseña. Si un alumno olvidó su contraseña, cambiala desde acá.</li>
            <li><Badge color="amber">⏸ Pausar</Badge> Desactiva temporalmente el acceso sin borrar los datos. Ideal si un alumno deja de asistir por un tiempo.</li>
            <li><Badge color="green">▶ Activar</Badge> Reactiva el acceso de un alumno que estaba pausado.</li>
            <li><Badge color="red">🗑 Eliminar</Badge> Borra al alumno de forma permanente. El sistema va a pedir confirmación antes de proceder.</li>
          </ul>
          <TipBox>Usá <strong>Pausar</strong> en vez de <strong>Eliminar</strong> cuando un alumno deje el curso — así conservás su historial por si vuelve más adelante.</TipBox>
        </Section>

        {/* PASO 5 */}
        <Section numero={5} titulo="Habilitar Clases" emoji="📚">
          <p className="text-slate-700 mb-3">Los alumnos <strong>no pueden ver el contenido de una clase hasta que vos la habilites</strong>. Esto te permite ir abriendo el material a medida que avanzan las clases presenciales.</p>
          <Steps>
            <Step n={1}>Hacé clic en <strong>Gestión de Clases</strong> en el menú lateral.</Step>
            <Step n={2}>Vas a ver la lista de las 22 clases del curso, organizadas por fase.</Step>
            <Step n={3}>Buscá la clase del día y hacé clic en el botón <strong>"Habilitar"</strong>.</Step>
            <Step n={4}>Desde ese momento, todos los alumnos activos pueden acceder a esa clase y a su práctica correspondiente.</Step>
          </Steps>
          <TipBox>
            <ul className="space-y-1">
              <li>Al habilitar la <strong>Clase 3</strong>, automáticamente también se habilita la <strong>Práctica 3</strong>.</li>
              <li>Podés deshabilitar una clase con el mismo botón si necesitás quitarla temporalmente.</li>
              <li>Lo ideal es habilitar cada clase unos minutos antes de que empiece.</li>
            </ul>
          </TipBox>
        </Section>

        {/* PASO 6 */}
        <Section numero={6} titulo="Tomar Asistencia" emoji="✅">
          <Steps>
            <Step n={1}>Hacé clic en <strong>Asistencia</strong> en el menú lateral.</Step>
            <Step n={2}>Seleccioná la clase que se está dictando hoy.</Step>
            <Step n={3}>Vas a ver la lista de alumnos. Marcá a cada uno como <strong>Presente</strong> o <strong>Ausente</strong>.</Step>
            <Step n={4}>Guardá los cambios. Los alumnos ausentes verán una alerta en su panel para recuperar el material.</Step>
          </Steps>
          <InfoBox color="blue">
            <strong>¿Qué ve el alumno si faltó?</strong> La clase aparece marcada como "Pendiente" en su panel, con acceso al material para recuperarla por su cuenta.
          </InfoBox>
        </Section>

        {/* PASO 7 */}
        <Section numero={7} titulo="Examen Final" emoji="📝">
          <p className="text-slate-700 mb-3">Hacé clic en <strong>Exámenes</strong> para configurar el examen final y ver los resultados de tus alumnos.</p>

          <p className="font-semibold text-slate-800 mb-2">Configuración del examen:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700 text-sm mb-4">
            <li><strong>Habilitado:</strong> si el examen está activo para los alumnos o no.</li>
            <li><strong>Contraseña:</strong> opcional. Si la ponés, el alumno la necesita para arrancar el examen.</li>
            <li><strong>Intentos permitidos:</strong> cuántas veces puede rendir cada alumno (por defecto 3).</li>
            <li><strong>Tiempo límite:</strong> minutos disponibles para completarlo (por defecto 45 min).</li>
            <li><strong>Puntaje mínimo:</strong> respuestas correctas necesarias para aprobar (por defecto 9 de 15).</li>
          </ul>

          <p className="font-semibold text-slate-800 mb-2">Ver resultados:</p>
          <p className="text-slate-700 text-sm">En la misma pantalla vas a ver una tabla con todos los alumnos que rindieron: nombre, intento, puntaje, estado (aprobado/desaprobado) y fecha.</p>
          <TipBox>Habilitá el examen recién cuando el curso esté terminado o cerca del final. Una vez que un alumno aprueba, se desbloquea su certificado.</TipBox>
        </Section>

        {/* PASO 8 */}
        <Section numero={8} titulo="Consultas de los Alumnos" emoji="💬">
          <p className="text-slate-700">Los alumnos pueden enviarte consultas desde su panel. Cuando lo hacen, la plataforma <strong>abre automáticamente un correo en Gmail</strong> pre-completado con su nombre, asunto y mensaje, dirigido a tu casilla de correo.</p>
          <p className="text-slate-700 mt-2">Las consultas llegán directamente a tu <strong>bandeja de Gmail</strong> — no tenés que hacer nada adicional en la plataforma para recibirlas.</p>
        </Section>

        {/* CONSEJOS */}
        <Section numero={9} titulo="Consejos Generales" emoji="🌟">
          <ul className="space-y-3 text-sm text-slate-700">
            {[
              ['Habilitá las clases con anticipación', 'Unos 5 o 10 minutos antes de que empiece, para que los alumnos puedan entrar sin problemas.'],
              ['Tomá asistencia durante la clase', 'Así los alumnos que llegan un poco tarde igual quedan registrados.'],
              ['Cambiá la contraseña desde el panel', 'Si un alumno olvidó su contraseña, podés editarla vos desde Mis Alumnos → Editar.'],
              ['Funciona en cualquier dispositivo', 'Computadora, tablet y celular, sin instalar nada.'],
              ['Las prácticas son opcionales', 'Se habilitan automáticamente con cada clase. No afectan la nota final del alumno.'],
            ].map(([titulo, desc], i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">→</span>
                <span><strong>{titulo}:</strong> {desc}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Footer del manual */}
        <div className="border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
          ITC Argentina · IA + Automatizaciones 2026 · Guía de uso interno — Profesores y Ayudantes
        </div>
      </div>

      {/* Estilos de impresión */}
      <style>{`
        @media print {
          nav, header, aside, .print\\:hidden { display: none !important; }
          body { background: white !important; }
          #guia-contenido { box-shadow: none !important; padding: 0 !important; }
          h1 { font-size: 22pt !important; }
        }
      `}</style>
    </div>
  )
}

/* ── Componentes internos ── */

function Section({ numero, titulo, emoji, children }: { numero: number; titulo: string; emoji: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-blue-700 border-b-2 border-blue-100 pb-2 mb-4">
        {emoji} Paso {numero}: {titulo}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="space-y-2">{children}</ol>
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="min-w-[26px] h-[26px] rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
        {n}
      </span>
      <span className="text-sm text-slate-700">{children}</span>
    </li>
  )
}

function InfoBox({ color = 'blue', children }: { color?: 'blue'; children: React.ReactNode }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
      {children}
    </div>
  )
}

function WarnBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
      ⚠️ <strong>Importante:</strong> {children}
    </div>
  )
}

function TipBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-900">
      💡 <strong>Tip:</strong> {typeof children === 'string' ? children : <span className="ml-1">{children}</span>}
    </div>
  )
}

function Badge({ color, children }: { color: 'blue' | 'amber' | 'green' | 'red'; children: React.ReactNode }) {
  const styles = {
    blue:  'bg-blue-100 text-blue-800',
    amber: 'bg-amber-100 text-amber-800',
    green: 'bg-emerald-100 text-emerald-800',
    red:   'bg-red-100 text-red-800',
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mr-2 ${styles[color]}`}>
      {children}
    </span>
  )
}
