export type UserRole = 'alumno' | 'profesor'

export interface User {
  id: string
  email: string
  nombre: string
  telefono?: string
  sede: string
  turno: 'mañana' | 'tarde' | 'noche' | 'sábados'
  role: UserRole
  avatar?: string
  createdAt: Date
}

export interface Alumno extends User {
  role: 'alumno'
  progreso: number // número de clases completadas
  asistencia: number // porcentaje
  examenEstado: 'pendiente' | 'en_curso' | 'aprobado' | 'reprobado'
  examenPuntaje?: number
  certificadoEmitido: boolean
  rachaAsistencia: number // semanas seguidas
  promedioEjercicios: number
}

export interface Profesor extends User {
  role: 'profesor'
  alumnosACargo: number
}

export type ClaseCategoria = 
  | 'ia-aplicada' 
  | 'diseno-ia' 
  | 'estrategia' 
  | 'automatizacion' 
  | 'proyectos'

export type ClaseFase = 1 | 2

export type ClaseEstado = 'completada' | 'en_curso' | 'bloqueada'

export interface ClaseSeccion {
  tipo: 'objetivo' | 'repaso' | 'teoria' | 'practica' | 'ejercicio' | 'cierre' | 'bienvenida'
  titulo: string
  duracion?: number
  contenido: string
}

export interface Clase {
  id: number
  numero: number
  titulo: string
  subtitulo: string
  categoria: ClaseCategoria
  categoriaLabel: string
  fase: ClaseFase
  duracion: number // minutos
  estado: ClaseEstado
  fechaCompletada?: Date
  htmlPath: string
  objetivo?: string
  secciones?: ClaseSeccion[]
}

export interface PreguntaExamen {
  id: number
  enunciado: string
  opciones: {
    a: string
    b: string
    c: string
    d: string
  }
  respuestaCorrecta: 'a' | 'b' | 'c' | 'd'
  claseRelacionada: number
}

export interface ResultadoExamen {
  id: string
  alumnoId: string
  alumnoNombre: string
  intentoNumero: number
  puntaje: number
  totalPreguntas: number
  porcentaje: number
  aprobado: boolean
  fechaInicio: Date
  fechaFin: Date
  duracionMinutos: number
  respuestas: Record<number, 'a' | 'b' | 'c' | 'd'>
}

export interface Logro {
  id: string
  titulo: string
  descripcion: string
  icono: string
  desbloqueado: boolean
  fechaDesbloqueo?: Date
}

export interface NotaClase {
  claseId: number
  profesorId: string
  contenido: string
  fechaActualizacion: Date
}
