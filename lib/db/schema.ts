import { pgTable, serial, varchar, integer, boolean, text, timestamp, jsonb, unique } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  dni: varchar('dni', { length: 20 }),
  telefono: varchar('telefono', { length: 20 }),
  turno: varchar('turno', { length: 100 }),
  role: varchar('role', { length: 20 }).notNull().default('alumno'),
  activo: boolean('activo').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

export const clasesHabilitadas = pgTable('clases_habilitadas', {
  id: serial('id').primaryKey(),
  claseNumero: integer('clase_numero').notNull().unique(),
  fechaHabilitada: timestamp('fecha_habilitada').defaultNow(),
  notasDocente: text('notas_docente'),
})

export const progresoAlumnos = pgTable('progreso_alumnos', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  claseNumero: integer('clase_numero').notNull(),
  completada: boolean('completada').default(false),
  fechaCompletada: timestamp('fecha_completada'),
}, (t) => [unique().on(t.userId, t.claseNumero)])

export const asistencia = pgTable('asistencia', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  claseNumero: integer('clase_numero').notNull(),
  presente: boolean('presente').default(true),
  fecha: timestamp('fecha').defaultNow(),
}, (t) => [unique().on(t.userId, t.claseNumero)])

export const examenConfig = pgTable('examen_config', {
  id: serial('id').primaryKey(),
  habilitado: boolean('habilitado').default(false),
  passwordExamen: varchar('password_examen', { length: 100 }),
  intentosPermitidos: integer('intentos_permitidos').default(3),
  tiempoLimiteMin: integer('tiempo_limite_min').default(45),
  puntajeMinimo: integer('puntaje_minimo').default(9),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const examenesResultados = pgTable('examenes_resultados', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  intentoNumero: integer('intento_numero').notNull(),
  puntaje: integer('puntaje').notNull(),
  totalPreguntas: integer('total_preguntas').notNull(),
  aprobado: boolean('aprobado').notNull(),
  fechaInicio: timestamp('fecha_inicio').notNull(),
  fechaFin: timestamp('fecha_fin'),
  respuestas: jsonb('respuestas'),
  preguntasIds: jsonb('preguntas_ids'),
})

export const preguntasExamen = pgTable('preguntas_examen', {
  id: serial('id').primaryKey(),
  enunciado: text('enunciado').notNull(),
  opcionA: text('opcion_a').notNull(),
  opcionB: text('opcion_b').notNull(),
  opcionC: text('opcion_c').notNull(),
  opcionD: text('opcion_d').notNull(),
  respuestaCorrecta: varchar('respuesta_correcta', { length: 1 }).notNull(),
  claseRelacionada: integer('clase_relacionada'),
  activa: boolean('activa').default(true),
})
