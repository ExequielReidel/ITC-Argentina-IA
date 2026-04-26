# PROMPT PARA V0.DEV / VERCEL AI
## Plataforma Educativa: Curso IA + Automatizaciones — ITC Argentina

---

> **Cómo usarlo:** Copiá este prompt completo y pegalo en [v0.dev](https://v0.dev) o en el chat de Vercel AI para generar el componente/página inicial. Podés pedirle secciones por separado si el output es muy largo.

---

## PROMPT PRINCIPAL

```
Creá una plataforma web educativa completa para ITC Argentina (Informatic Training Center), 
una red de capacitaciones presenciales con +65.000 alumnos en Argentina. 
La plataforma sirve para que alumnos y profesores accedan al curso "IA + Automatizaciones 2026".

---

## IDENTIDAD VISUAL

La plataforma debe transmitir: PROFESIONAL, CERCANO, FEDERAL (no elitista).

- **Fuentes:** DM Sans (títulos) + Nunito (cuerpo) — importar desde Google Fonts
- **Paleta principal:**
  - Azul oscuro:    #1E3A8A  (blue-900)
  - Azul medio:     #1D4ED8  (blue-700)
  - Índigo:         #4338CA  (indigo-700)
  - Fondo neutro:   #F8FAFC  (slate-50)
  - Blanco puro:    #FFFFFF
  - Texto principal:#1E293B  (slate-900)
  - Texto secundario:#64748B (slate-500)
- **Acentos por módulo:**
  - IA Aplicada:      #2563EB (azul)
  - Diseño con IA:    #DB2777 (rosa)
  - Estrategia:       #7C3AED (violeta)
  - Automatización:   #9333EA (púrpura)
  - Proyectos:        #059669 (esmeralda)
  - Alertas/Examen:   #D97706 (ámbar)
- **Border radius:** rounded-2xl para cards, rounded-full para badges
- **Sombras:** shadow-lg con box-shadow suave azulada
- **Animaciones:** transiciones suaves 300ms ease, hover con translateY(-4px)

---

## ARQUITECTURA DE LA PLATAFORMA

La app tiene TRES VISTAS PRINCIPALES según el rol del usuario:

### VISTA A: PANTALLA DE LOGIN (pública)
### VISTA B: DASHBOARD DEL ALUMNO (privada)
### VISTA C: DASHBOARD DEL PROFESOR (privada)

---

## VISTA A — PANTALLA DE LOGIN

### Layout
- Pantalla dividida en 2 columnas en desktop (50/50):
  - **Columna izquierda:** Panel visual de marca ITC
  - **Columna derecha:** Formulario de login
- En mobile: solo formulario, logo arriba

### Columna izquierda (branding)
- Fondo con gradiente: `from-blue-900 via-indigo-800 to-blue-700`
- Logo de ITC Argentina (texto estilizado: "ITC" en fuente bold + "Argentina" en regular)
- Tagline: *"Capacitaciones presenciales en tu ciudad"*
- Debajo del tagline, 3 stats en cards pequeñas con efecto glassmorphism:
  - `+65.000 alumnos`
  - `+200 ciudades`
  - `22 clases` (este curso)
- Abajo del todo: `"Curso IA + Automatizaciones 2026"` como badge destacado

### Columna derecha (formulario)
- Título: **"Bienvenido/a"** (DM Sans, grande)
- Subtítulo: *"Ingresá con tu cuenta para continuar"*
- Campo: Email (con ícono de sobre)
- Campo: Contraseña (con ícono de candado, toggle para mostrar/ocultar)
- Checkbox: "Recordarme"
- Botón primario: **"Ingresar"** (ancho completo, azul, con loading state)
- Link: "¿Olvidaste tu contraseña?"
- Separador visual "o"
- **Selector de rol:** dos cards clickeables elegantes:
  - 🎓 **Soy alumno** (card con borde azul cuando seleccionada)
  - 👨‍🏫 **Soy profesor** (card con borde índigo cuando seleccionada)
- Nota al pie: *"¿No tenés cuenta? Pedile el acceso a tu sede ITC."*

---

## VISTA B — DASHBOARD DEL ALUMNO

### Layout general
- Sidebar izquierdo fijo (colapsable en mobile): 260px de ancho
- Área de contenido principal: resto del ancho
- Header superior sticky con: avatar, nombre, notificaciones

### SIDEBAR DE NAVEGACIÓN (alumno)
Ítems del menú con íconos:
1. 🏠 **Mi Inicio** (dashboard home)
2. 📚 **Mis Clases** (listado de las 22 clases)
3. 📝 **Examen Final** (bloqueado hasta clase 21)
4. 📊 **Mi Progreso** (estadísticas personales)
5. 🎓 **Mi Certificado** (disponible al aprobar)
6. ⚙️ **Mi Perfil**

Badge de progreso circular en el sidebar: "Clase X / 22" con porcentaje.

### SECCIÓN: MI INICIO (home del alumno)

**Card de bienvenida personalizada:**
- "¡Hola, [Nombre]! 👋"
- Subtítulo con sede: *"Sede [Ciudad] · Turno [mañana/tarde/noche]"*
- Barra de progreso grande y animada: "Completaste X de 22 clases"

**Próxima clase (card destacada):**
- Badge "PRÓXIMA CLASE"
- Número y título: "Clase 03 · IA para Ventas y Atención al Cliente"
- Categoría con color: badge "APLICACIÓN COMERCIAL" en azul cielo
- Duración: "90 minutos"
- Botón grande: **"▶ Abrir clase"** — este botón abre el HTML de la clase en un iframe o modal fullscreen

**Grid de métricas (4 cards):**
- Clases completadas: [N] de 22
- Racha de asistencia: [N] semanas seguidas
- Promedio de ejercicios: [N]%
- Estado del examen: "Pendiente" / "Aprobado"

### SECCIÓN: MIS CLASES (listado)

**Estructura:**
- Dos tabs: `Fase 1 — IA Aplicada (15 clases)` | `Fase 2 — Automatización (7 clases)`
- Grilla de cards (3 columnas en desktop, 1 en mobile) por cada clase:

**Card de clase:**
- Número de clase (grande, en color de la categoría)
- Título de la clase
- Badge de categoría con color correspondiente
- Duración: "90 min"
- Estado:
  - ✅ Verde "Completada" — con ícono de check
  - 🔵 Azul "En curso" — con ícono de play (clase actual)
  - 🔒 Gris "Bloqueada" — (clases futuras, con ícono de candado)
- Botón de acción que cambia según estado:
  - Completada: "Repasar" (outline)
  - En curso: "▶ Continuar" (filled, azul)
  - Bloqueada: "Próximamente" (disabled)

**Sistema de desbloqueo:**
Las clases se desbloquean secuencialmente. La clase N se desbloquea cuando el profesor la marca como dictada. El alumno puede rever clases ya completadas en cualquier momento.

**Visualizador de clases (iframe modal):**
Al clickear "Abrir clase", se abre un modal fullscreen (95vw × 95vh) con:
- Header del modal: título de la clase + botón X para cerrar
- Iframe que carga el HTML correspondiente de la clase (ej: `/clases/Clase_03_IA_Ventas.html`)
- Botón inferior: "✔ Marcar como vista" (solo aparece si la clase fue habilitada por el profesor)
- Navegación: flechas para ir a la clase anterior / siguiente

### SECCIÓN: EXAMEN FINAL

**Estado bloqueado (antes de clase 21):**
- Card con candado animado
- Texto: *"El examen se habilita cuando tu profesor marque la Clase 21 como completada."*
- Barra de progreso hacia el desbloqueo

**Estado habilitado:**
- Banner: "🎯 ¡Tu examen está disponible!"
- Info del examen:
  - 30 preguntas de opción múltiple
  - Tiempo límite: 45 minutos
  - Intentos permitidos: 2
  - Aprobación: 70% (21/30 correctas)
- Botón grande: **"Comenzar Examen"**

**Vista del examen activo:**
- Pantalla completa limpia (sin sidebar)
- Header con: pregunta X/30 + cronómetro regresivo (45:00)
- Barra de progreso en la parte superior
- Enunciado de la pregunta (texto grande, claro)
- 4 opciones de respuesta (cards clickeables con estado selected)
- Botón: "Siguiente →"
- Permite volver atrás a preguntas sin responder
- Al finalizar: pantalla de "Enviando respuestas..." con spinner

**Vista de resultado:**
- Si aprueba (≥70%): 
  - Animación de confetti
  - "🎉 ¡Aprobaste! [N]/30 correctas — [N]%"
  - Botón: "📄 Ver mi certificado"
- Si no aprueba:
  - "Obtuviste [N]/30 — [N]%. Necesitás 70% para aprobar."
  - Cuándo puede reintentar: "Podés volver a intentarlo desde el [fecha]"
  - Botón: "Ver respuestas incorrectas"

### SECCIÓN: MI PROGRESO

**Gráficos visuales:**
- Línea de progreso semanal (últimas 8 semanas de asistencia)
- Gráfico de torta: Clases completadas vs. restantes
- Lista de logros desbloqueados (badges gamificados):
  - "🔥 Primera clase completada"
  - "⚡ 5 clases seguidas"
  - "🎨 Terminé el módulo de Diseño"
  - "🤖 Domino el Prompt Engineering"
  - "🏆 ¡Aprobé el examen!"

### SECCIÓN: MI CERTIFICADO

**Estado pendiente:**
- Preview borrosa/watermarked del certificado
- Requisitos para obtenerlo:
  - ✅ / ⬜ 75% de asistencia (X/22 clases)
  - ✅ / ⬜ Proyecto Final entregado
  - ✅ / ⬜ Examen aprobado (70%+)

**Estado disponible:**
- Preview nítida del certificado
- Certificado generado dinámicamente con:
  - Logo ITC Argentina
  - Nombre completo del alumno
  - Título: "Curso IA + Automatizaciones para Negocios"
  - Fecha de finalización
  - Código único de verificación
  - Aval: UDEMM (Universidad de la Marina Mercante)
- Botón: "⬇ Descargar PDF"
- Botón: "🔗 Compartir en LinkedIn"

---

## VISTA C — DASHBOARD DEL PROFESOR

### SIDEBAR DE NAVEGACIÓN (profesor)
Ítems del menú:
1. 🏠 **Panel General**
2. 👥 **Mis Alumnos** (gestión completa)
3. 📚 **Gestión de Clases** (desbloquear, marcar como dictadas)
4. 📝 **Exámenes** (ver resultados de todos)
5. 📊 **Reportes** (estadísticas del grupo)
6. ➕ **Agregar Alumno**
7. ⚙️ **Configuración del Curso**

### SECCIÓN: PANEL GENERAL (home del profesor)

**Métricas del grupo (4 cards grandes):**
- Total de alumnos activos: [N]
- Clase en curso: "Clase [N] — [Título]"
- Promedio de asistencia del grupo: [N]%
- Alumnos que aprobaron el examen: [N] de [N]

**Tabla de estado rápido:**
- Última clase dictada: "Clase [N]"
- Próxima clase a dictar: "Clase [N] — [Título] — [Fecha]"
- Botón rápido: **"✔ Marcar clase [N] como dictada"**

**Alertas activas (si las hay):**
- Alumnos con +3 clases de ausencia
- Alumnos con examen pendiente de más de 7 días

### SECCIÓN: MIS ALUMNOS

**Header con buscador y filtros:**
- Buscador por nombre
- Filtro por estado: Todos / Al día / Atrasados / Aprobaron examen
- Botón: "+ Agregar alumno"

**Tabla de alumnos (responsive):**
Columnas:
- Avatar + Nombre completo
- Email
- Progreso (barra visual + "X/22 clases")
- Asistencia (porcentaje con color: verde >75%, amarillo 50-75%, rojo <50%)
- Examen (Pendiente / En curso / Aprobado [N%] / Reprobado [N%])
- Certificado (Emitido / Pendiente)
- Acciones: [👁 Ver detalle] [✉ Contactar] [✏ Editar]

**Modal de detalle del alumno:**
Al clickear "Ver detalle":
- Nombre, email, teléfono, sede
- Barra de progreso general
- Historial clase por clase (check/X por cada una)
- Historial del examen (intentos, puntajes, fechas)
- Botones: "Habilitar examen manualmente" / "Resetear progreso"

### SECCIÓN: GESTIÓN DE CLASES

**Vista principal:**
Lista de las 22 clases con estado:
- ✅ Dictada (con fecha en que se marcó)
- 🔵 En curso (clase actual, desbloqueada para alumnos)
- ⬜ Pendiente (no dictada aún)

**Cada clase tiene:**
- Número + Título
- Categoría + Fase
- Estado actual
- Cuántos alumnos la visualizaron (ej: "12/18 alumnos la vieron")
- Botón: **"Marcar como dictada y desbloquear siguiente"**
- Link: "Vista previa del HTML" (abre el material en una pestaña nueva)

**Notas de clase (solo para el profesor):**
- Campo de texto libre por clase para anotar: "Temas que costaron más", "Preguntas frecuentes del grupo", etc.

### SECCIÓN: EXÁMENES

**Tabs:**
1. **Configuración del examen**
2. **Resultados**

**Tab 1 — Configuración:**
- Toggle: "Habilitar examen para todos" / "Habilitar manualmente por alumno"
- Campo: Fecha de apertura del examen
- Campo: Intentos permitidos (1 o 2)
- Campo: Tiempo límite en minutos (default: 45)
- Banco de preguntas: tabla con las 30 preguntas predefinidas (editable)
  - Cada pregunta: enunciado + 4 opciones + respuesta correcta marcada
  - Botón: "Editar pregunta"

**Tab 2 — Resultados:**
- Tabla de resultados:
  - Alumno
  - Intento N°
  - Fecha y hora
  - Puntaje: X/30 (N%)
  - Resultado: ✅ Aprobado / ❌ Reprobado
  - Duración (minutos usados)
- Botón: "Exportar resultados CSV"
- Gráfico de distribución de puntajes (histograma)

### SECCIÓN: AGREGAR ALUMNO

**Formulario:**
- Nombre completo *
- Email *
- Teléfono (opcional)
- Sede / ciudad
- Turno (mañana / tarde / noche / sábados)
- Contraseña temporal (auto-generada, copiable)
- Toggle: "Enviar email de bienvenida automático"
- Botón: **"Crear cuenta de alumno"**

**Carga masiva:**
- Área de drag & drop para subir CSV
- Formato esperado: nombre, email, teléfono, sede
- Vista previa antes de confirmar
- Botón: "Importar [N] alumnos"

### SECCIÓN: REPORTES

**Reportes disponibles:**
- Asistencia general del grupo (línea de tiempo semanal)
- Distribución de progreso (quién va adelante/atrás)
- Clases con mayor abandono (baja tasa de visualización)
- Tiempo promedio de visualización por clase
- Tasa de aprobación del examen

**Exportación:** Botón "Exportar reporte PDF" (genera un PDF con todos los gráficos).

---

## SISTEMA DE ARCHIVOS DE CLASES

Las clases son archivos HTML estáticos ubicados en `/public/clases/`:
- `/public/clases/Clase_01_IA_En_Tu_Vida.html`
- `/public/clases/Clase_02_Prompt_Engineering.html`
- ... (hasta Clase_22)

Cuando el alumno abre una clase, se carga en un iframe dentro del modal fullscreen.
Los HTML son completamente autocontenidos (usan CDNs de Tailwind + FontAwesome).

---

## BANCO DE PREGUNTAS DEL EXAMEN (30 preguntas)

Las preguntas cubren las 22 clases del curso. Aquí un sample de 5 (el sistema debe tener las 30):

1. ¿Qué es un "prompt" en el contexto de la IA?
   a) Un tipo de hardware especial
   b) Las instrucciones que le das a una IA para obtener un resultado
   c) Un virus informático
   d) Una marca de software
   → Correcta: b

2. ¿Cuál de estas herramientas sirve para automatizar flujos entre aplicaciones SIN programar?
   a) Microsoft Word
   b) Photoshop
   c) Make (Integromat)
   d) Excel
   → Correcta: c

3. En la analogía del temario, una API es como:
   a) El cocinero de un restaurante
   b) El menú del restaurante: pedís algo y te lo traen
   c) La caja registradora
   d) El local físico
   → Correcta: b

4. ¿Qué significa "trigger" en Make?
   a) Un botón de eliminar
   b) Un tipo de error del sistema
   c) El evento que dispara o inicia una automatización
   d) La pantalla de inicio
   → Correcta: c

5. ¿Cuál es el objetivo principal del "Prompt Engineering"?
   a) Programar apps desde cero
   b) Estructurar instrucciones claras para obtener mejores resultados de la IA
   c) Diseñar logos con inteligencia artificial
   d) Configurar redes WiFi
   → Correcta: b

[El sistema debe tener las 30 preguntas completas cubriendo todos los temas del curso]

---

## COMPONENTES UI DETALLADOS

### Navbar superior (autenticado)
- Logo ITC a la izquierda
- Nombre del curso en el centro: "IA + Automatizaciones 2026"
- A la derecha: avatar del usuario + nombre + dropdown con "Mi perfil" y "Cerrar sesión"
- En mobile: solo avatar y hamburger

### Estados de loading
- Skeleton screens para cards (no spinners genéricos)
- Shimmer effect en gris claro al cargar listas

### Notificaciones toast
- Verde: acciones exitosas ("Clase marcada como completada ✅")
- Azul: información ("Tu examen fue habilitado 🎯")
- Ámbar: advertencias ("Revisá tu asistencia")
- Rojo: errores ("No se pudo guardar el cambio")

### Responsive breakpoints
- Mobile (< 768px): sidebar colapsado, grillas de 1 columna, tablas con scroll horizontal
- Tablet (768–1024px): sidebar con iconos solamente (sin texto), grillas de 2 columnas
- Desktop (> 1024px): layout completo

---

## PÁGINAS / RUTAS A IMPLEMENTAR

- `/` → Redirige a `/login`
- `/login` → Vista A (pública)
- `/alumno/inicio` → Vista B — Home del alumno
- `/alumno/clases` → Vista B — Listado de clases
- `/alumno/clases/[id]` → Vista B — Clase individual en modal
- `/alumno/examen` → Vista B — Examen
- `/alumno/progreso` → Vista B — Progreso y logros
- `/alumno/certificado` → Vista B — Certificado
- `/alumno/perfil` → Vista B — Perfil
- `/profesor/inicio` → Vista C — Panel del profesor
- `/profesor/alumnos` → Vista C — Gestión de alumnos
- `/profesor/clases` → Vista C — Gestión de clases
- `/profesor/examenes` → Vista C — Exámenes y resultados
- `/profesor/nuevo-alumno` → Vista C — Alta de alumno
- `/profesor/reportes` → Vista C — Reportes del grupo

---

## DATOS DE DEMO (para preview)

Usá estos datos hardcodeados para la demo visual:

**Alumno demo:**
- Nombre: Valentina Rodríguez
- Sede: Rafaela, Santa Fe
- Turno: Sábados 10:00hs
- Progreso: 7/22 clases
- Asistencia: 82%
- Examen: Pendiente

**Profesor demo:**
- Nombre: Lic. Marcos Giménez
- Sede: Rafaela, Santa Fe
- Alumnos a cargo: 18

**Alumnos del grupo (para tabla):**
- Valentina Rodríguez — 7/22 — 82% — Pendiente
- Juan Herrera — 7/22 — 100% — Pendiente
- Marta Giordano — 6/22 — 73% — Pendiente
- Santiago López — 4/22 — 45% — ⚠ Atrasado
- Lucía Pereyra — 7/22 — 91% — Pendiente
... (completar con 13 alumnos más para llegar a 18)

---

## STACK TECNOLÓGICO SUGERIDO

- **Framework:** Next.js 14 (App Router)
- **Estilos:** Tailwind CSS
- **Componentes:** shadcn/ui como base (customizados con la paleta ITC)
- **Iconos:** Lucide React
- **Gráficos:** Recharts
- **Autenticación:** NextAuth.js (o Clerk)
- **Base de datos:** Supabase (PostgreSQL)
- **Almacenamiento de HTML de clases:** Vercel Blob o carpeta /public
- **Deploy:** Vercel
- **Generación de PDF (certificados):** react-pdf o html2canvas + jsPDF

---

## TONO Y MICROCOPY

Todo el texto de la UI en español rioplatense (vos, tenés, podés):
- "¡Bienvenido/a de vuelta!"
- "Continuá desde donde dejaste"
- "¡Excelente! Completaste la clase"
- "Todavía no podés acceder a esta clase"
- "Tu profesor aún no habilitó el examen"
- "¿Seguro que querés cerrar sesión?"
- "Algo salió mal, intentá de nuevo"
- "¡Aprobaste! Podés descargar tu certificado"

---

Generá primero la pantalla de LOGIN y el DASHBOARD DEL ALUMNO completo con todos los estados 
descriptos. Usá datos demo para visualizar el estado real de la plataforma.
Después podemos continuar con el dashboard del profesor.
```

---

## INSTRUCCIONES DE USO

### Paso 1 — Generación inicial en v0.dev
1. Ir a [v0.dev](https://v0.dev)
2. Pegar el **prompt completo** (la sección marcada entre triple backtick)
3. Pedir primero: *"Generá el login y el dashboard del alumno"*
4. Iterar sección por sección

### Paso 2 — Continuaciones sugeridas
Después del output inicial, podés pedir:
- *"Ahora generá el dashboard del profesor con la tabla de alumnos"*
- *"Agregá la vista del examen activo con el cronómetro"*
- *"Creá el componente del visualizador de clases (iframe modal fullscreen)"*
- *"Generá el certificado descargable con el logo de ITC"*

### Paso 3 — Integración con los HTML de las clases
Los archivos HTML de cada clase se colocan en `/public/clases/`.
El visualizador los carga via `<iframe src="/clases/Clase_01_IA_En_Tu_Vida.html" />`.

### Paso 4 — Backend sugerido
Para el backend, usá **Supabase** con estas tablas:
```sql
-- Tabla de usuarios
users (id, email, password_hash, role: 'alumno'|'profesor', 
       nombre, telefono, sede, created_at)

-- Tabla de progreso por alumno
progreso (id, user_id, clase_numero, estado: 'completada'|'en_curso', 
          fecha_completada, tiempo_visualizacion_min)

-- Tabla de clases habilitadas por el profesor
clases_habilitadas (id, profesor_id, clase_numero, fecha_dictada, notas_docente)

-- Tabla de exámenes
examenes (id, user_id, intento_numero, puntaje, fecha_inicio, 
          fecha_fin, aprobado: boolean, respuestas_json)

-- Tabla de preguntas del examen
preguntas (id, enunciado, opcion_a, opcion_b, opcion_c, opcion_d, 
           respuesta_correcta: 'a'|'b'|'c'|'d', clase_relacionada)
```

---

## PREGUNTAS COMPLETAS DEL EXAMEN (banco de 30)

| N° | Pregunta | A | B | C | D | Correcta |
|----|----------|---|---|---|---|----------|
| 1 | ¿Qué es un "prompt" en IA? | Hardware especial | Instrucciones para la IA | Virus informático | Marca de software | B |
| 2 | ¿Qué herramienta automatiza flujos SIN programar? | Word | Photoshop | Make | Excel | C |
| 3 | En la analogía, una API es como... | El cocinero | El menú del restaurante | La caja registradora | El local físico | B |
| 4 | ¿Qué es un "trigger" en Make? | Botón eliminar | Tipo de error | Evento que inicia una automatización | Pantalla de inicio | C |
| 5 | Objetivo del Prompt Engineering: | Programar apps | Estructurar instrucciones para mejores resultados | Diseñar logos | Configurar WiFi | B |
| 6 | ¿Qué es un GPT personalizado? | Red de computadoras | Modelo entrenado con datos de tu negocio | Tipo de virus | App de diseño | B |
| 7 | ¿Qué formato usa Make para pasar datos entre módulos? | DOC | MP4 | JSON | ZIP | C |
| 8 | ChatGPT fue creado por: | Google | Microsoft | Apple | OpenAI | D |
| 9 | ¿Qué hace el módulo "Iterator" en Make? | Crea PDFs | Envía emails | Separa elementos de una lista para procesarlos uno a uno | Genera imágenes | C |
| 10 | ¿Qué significa ROI? | Tipo de software | Retorno de la inversión | Red de internet | Registro de operaciones | B |
| 11 | ¿Cuál es la función de Canva en el curso? | Automatización | Diseño gráfico con asistencia de IA | Análisis de datos | Atención al cliente | B |
| 12 | El framework RTF para prompts significa: | Red, Token, Formato | Rol, Tarea, Formato | Resultado, Tiempo, Función | Registro, Tono, Fondo | B |
| 13 | ¿Para qué sirve Remove.bg? | Crear videos | Eliminar fondos de imágenes | Escribir emails | Hacer presentaciones | B |
| 14 | ¿Qué herramienta se recomienda para edición de video con IA? | Photoshop | Word | CapCut | Google Maps | C |
| 15 | Un "buyer persona" es: | Un tipo de anuncio | El perfil ideal del cliente | Una herramienta de IA | Un formato de imagen | B |
| 16 | ¿Qué es Make (Integromat)? | Red social | Motor de búsqueda | Plataforma de automatización sin código | Herramienta de diseño | C |
| 17 | ¿Cuántas apps conecta Make aproximadamente? | 10 | 150 | 1.500+ | 50 | C |
| 18 | En Make, ¿qué es un "escenario"? | Imagen de fondo | El flujo completo de automatización | Tipo de usuario | Error del sistema | B |
| 19 | ¿Qué herramienta ayuda a analizar datos de Excel con IA? | Instagram | ChatGPT con archivo adjunto (Plus) | TikTok | Canva | B |
| 20 | ¿Para qué sirve Gemini de Google? | Editar fotos | Alternativa a ChatGPT integrada con G Suite | Hacer videos | Comprar online | B |
| 21 | En automatización, ¿qué es un "Router"? | Dispositivo de red | Módulo que divide el flujo en múltiples caminos | Tipo de imagen | Herramienta de traducción | B |
| 22 | ¿Qué mínimo de asistencia requiere el certificado ITC? | 50% | 60% | 75% | 90% | C |
| 23 | ¿Qué es un "agente de IA"? | Vendedor humano | Sistema que ejecuta tareas de forma autónoma | Tipo de contraseña | Herramienta de diseño | B |
| 24 | ¿Qué hace la función "Magic Write" de Canva? | Elimina errores | Genera texto con IA | Borra fondos | Crea videos | B |
| 25 | ¿Qué herramienta sirve para crear subtítulos automáticos? | Word | CapCut con IA | Paint | Excel | B |
| 26 | El módulo "Aggregator" en Make... | Elimina datos | Une múltiples flujos en uno solo | Envía SMS | Traduce texto | B |
| 27 | ¿Qué significa "SOP" en el contexto de productividad? | Software de pago | Procedimiento operativo estándar | Sistema online privado | Servidor de operaciones | B |
| 28 | Para conectar WhatsApp con Make, se puede usar... | Google Maps | UltraMsg o WhatsApp Business API | Adobe Photoshop | Microsoft Office | B |
| 29 | ¿Cuál es la diferencia principal entre Zapier y Make? | Zapier es más barato siempre | Make tiene interfaz visual en red, más flexible para flujos complejos | No hay diferencia | Make es solo para grandes empresas | B |
| 30 | El Proyecto Final del curso debe incluir... | Solo un video | Al menos 3 módulos en Make + uso de IA en alguna etapa | Un sitio web completo | Solo texto escrito | B |

---

*Documento preparado para el equipo técnico de ITC Argentina · Uso interno · 2026*
*Informatic Training Center® · itcargentina.com*
