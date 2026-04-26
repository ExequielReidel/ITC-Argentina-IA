import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, examenConfig, preguntasExamen } from '@/lib/db/schema'
import bcrypt from 'bcryptjs'

const SEED_KEY = process.env.SEED_KEY || 'itc-seed-2026'

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('key') !== SEED_KEY) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // Crear cuenta del profesor
  const hash = await bcrypt.hash('ITC2026!', 12)
  await db.insert(users).values({
    nombre: 'Profesor ITC',
    email: 'profe@itcargentina.com',
    passwordHash: hash,
    role: 'profesor',
    turno: 'Administrador',
    activo: true,
  }).onConflictDoNothing()

  // Config inicial del examen
  await db.insert(examenConfig).values({
    habilitado: false,
    passwordExamen: null,
    intentosPermitidos: 3,
    tiempoLimiteMin: 45,
    puntajeMinimo: 9,
  }).onConflictDoNothing()

  // Banco de 50 preguntas
  const preguntas = [
    { enunciado: '¿Qué es un "prompt" en el contexto de la IA?', opcionA: 'Un tipo de hardware especial', opcionB: 'Las instrucciones que le das a una IA para obtener un resultado', opcionC: 'Un virus informático', opcionD: 'Una marca de software', respuestaCorrecta: 'b', claseRelacionada: 2 },
    { enunciado: '¿Cuál de estas herramientas sirve para automatizar flujos entre aplicaciones SIN programar?', opcionA: 'Microsoft Word', opcionB: 'Photoshop', opcionC: 'Make (Integromat)', opcionD: 'Excel', respuestaCorrecta: 'c', claseRelacionada: 16 },
    { enunciado: 'En la analogía del temario, una API es como:', opcionA: 'El cocinero de un restaurante', opcionB: 'El menú del restaurante: pedís algo y te lo traen', opcionC: 'La caja registradora', opcionD: 'El local físico', respuestaCorrecta: 'b', claseRelacionada: 18 },
    { enunciado: '¿Qué significa "trigger" en Make?', opcionA: 'Un botón de eliminar', opcionB: 'Un tipo de error del sistema', opcionC: 'El evento que dispara o inicia una automatización', opcionD: 'La pantalla de inicio', respuestaCorrecta: 'c', claseRelacionada: 16 },
    { enunciado: '¿Cuál es el objetivo principal del "Prompt Engineering"?', opcionA: 'Programar apps desde cero', opcionB: 'Estructurar instrucciones claras para obtener mejores resultados de la IA', opcionC: 'Diseñar logos con inteligencia artificial', opcionD: 'Configurar redes WiFi', respuestaCorrecta: 'b', claseRelacionada: 2 },
    { enunciado: '¿Qué es un GPT personalizado?', opcionA: 'Una red de computadoras', opcionB: 'Un modelo entrenado con datos específicos de tu negocio', opcionC: 'Un tipo de virus', opcionD: 'Una app de diseño', respuestaCorrecta: 'b', claseRelacionada: 11 },
    { enunciado: '¿Qué formato usa Make para pasar datos entre módulos?', opcionA: 'DOC', opcionB: 'MP4', opcionC: 'JSON', opcionD: 'ZIP', respuestaCorrecta: 'c', claseRelacionada: 18 },
    { enunciado: 'ChatGPT fue creado por:', opcionA: 'Google', opcionB: 'Microsoft', opcionC: 'Apple', opcionD: 'OpenAI', respuestaCorrecta: 'd', claseRelacionada: 1 },
    { enunciado: '¿Qué hace el módulo "Iterator" en Make?', opcionA: 'Crea PDFs', opcionB: 'Envía emails', opcionC: 'Separa elementos de una lista para procesarlos uno a uno', opcionD: 'Genera imágenes', respuestaCorrecta: 'c', claseRelacionada: 17 },
    { enunciado: '¿Qué significa ROI?', opcionA: 'Tipo de software', opcionB: 'Retorno de la inversión', opcionC: 'Red de internet', opcionD: 'Registro de operaciones', respuestaCorrecta: 'b', claseRelacionada: 12 },
    { enunciado: '¿Cuál es la función de Canva en el curso?', opcionA: 'Automatización', opcionB: 'Diseño gráfico con asistencia de IA', opcionC: 'Análisis de datos', opcionD: 'Atención al cliente', respuestaCorrecta: 'b', claseRelacionada: 6 },
    { enunciado: 'El framework RTF para prompts significa:', opcionA: 'Red, Token, Formato', opcionB: 'Rol, Tarea, Formato', opcionC: 'Resultado, Tiempo, Función', opcionD: 'Registro, Tono, Fondo', respuestaCorrecta: 'b', claseRelacionada: 2 },
    { enunciado: '¿Para qué sirve Remove.bg?', opcionA: 'Crear videos', opcionB: 'Eliminar fondos de imágenes', opcionC: 'Escribir emails', opcionD: 'Hacer presentaciones', respuestaCorrecta: 'b', claseRelacionada: 5 },
    { enunciado: '¿Qué herramienta se recomienda para edición de video con IA?', opcionA: 'Photoshop', opcionB: 'Word', opcionC: 'CapCut', opcionD: 'Google Maps', respuestaCorrecta: 'c', claseRelacionada: 7 },
    { enunciado: 'Un "buyer persona" es:', opcionA: 'Un tipo de anuncio', opcionB: 'El perfil ideal del cliente', opcionC: 'Una herramienta de IA', opcionD: 'Un formato de imagen', respuestaCorrecta: 'b', claseRelacionada: 9 },
    { enunciado: '¿Qué es Make (Integromat)?', opcionA: 'Red social', opcionB: 'Motor de búsqueda', opcionC: 'Plataforma de automatización sin código', opcionD: 'Herramienta de diseño', respuestaCorrecta: 'c', claseRelacionada: 16 },
    { enunciado: '¿Cuántas apps conecta Make aproximadamente?', opcionA: '10', opcionB: '150', opcionC: '1.500+', opcionD: '50', respuestaCorrecta: 'c', claseRelacionada: 16 },
    { enunciado: 'En Make, ¿qué es un "escenario"?', opcionA: 'Imagen de fondo', opcionB: 'El flujo completo de automatización', opcionC: 'Tipo de usuario', opcionD: 'Error del sistema', respuestaCorrecta: 'b', claseRelacionada: 17 },
    { enunciado: '¿Qué herramienta ayuda a analizar datos de Excel con IA?', opcionA: 'Instagram', opcionB: 'ChatGPT con archivo adjunto (Plus)', opcionC: 'TikTok', opcionD: 'Canva', respuestaCorrecta: 'b', claseRelacionada: 10 },
    { enunciado: '¿Para qué sirve Gemini de Google?', opcionA: 'Editar fotos', opcionB: 'Alternativa a ChatGPT integrada con G Suite', opcionC: 'Hacer videos', opcionD: 'Comprar online', respuestaCorrecta: 'b', claseRelacionada: 10 },
    { enunciado: 'En automatización, ¿qué es un "Router"?', opcionA: 'Dispositivo de red', opcionB: 'Módulo que divide el flujo en múltiples caminos', opcionC: 'Tipo de imagen', opcionD: 'Herramienta de traducción', respuestaCorrecta: 'b', claseRelacionada: 17 },
    { enunciado: '¿Qué mínimo de asistencia requiere el certificado ITC?', opcionA: '50%', opcionB: '60%', opcionC: '75%', opcionD: '90%', respuestaCorrecta: 'c', claseRelacionada: 22 },
    { enunciado: '¿Qué es un "agente de IA"?', opcionA: 'Vendedor humano', opcionB: 'Sistema que ejecuta tareas de forma autónoma', opcionC: 'Tipo de contraseña', opcionD: 'Herramienta de diseño', respuestaCorrecta: 'b', claseRelacionada: 14 },
    { enunciado: '¿Qué hace la función "Magic Write" de Canva?', opcionA: 'Elimina errores', opcionB: 'Genera texto con IA', opcionC: 'Borra fondos', opcionD: 'Crea videos', respuestaCorrecta: 'b', claseRelacionada: 6 },
    { enunciado: '¿Qué herramienta sirve para crear subtítulos automáticos en videos?', opcionA: 'Word', opcionB: 'CapCut con IA', opcionC: 'Paint', opcionD: 'Excel', respuestaCorrecta: 'b', claseRelacionada: 7 },
    { enunciado: 'El módulo "Aggregator" en Make...', opcionA: 'Elimina datos', opcionB: 'Une múltiples flujos en uno solo', opcionC: 'Envía SMS', opcionD: 'Traduce texto', respuestaCorrecta: 'b', claseRelacionada: 17 },
    { enunciado: '¿Qué significa "SOP" en el contexto de productividad?', opcionA: 'Software de pago', opcionB: 'Procedimiento operativo estándar', opcionC: 'Sistema online privado', opcionD: 'Servidor de operaciones', respuestaCorrecta: 'b', claseRelacionada: 8 },
    { enunciado: 'Para conectar WhatsApp con Make, se puede usar...', opcionA: 'Google Maps', opcionB: 'UltraMsg o WhatsApp Business API', opcionC: 'Adobe Photoshop', opcionD: 'Microsoft Office', respuestaCorrecta: 'b', claseRelacionada: 19 },
    { enunciado: '¿Cuál es la diferencia principal entre Zapier y Make?', opcionA: 'Zapier es más barato siempre', opcionB: 'Make tiene interfaz visual en red, más flexible para flujos complejos', opcionC: 'No hay diferencia', opcionD: 'Make es solo para grandes empresas', respuestaCorrecta: 'b', claseRelacionada: 16 },
    { enunciado: 'El Proyecto Final del curso debe incluir...', opcionA: 'Solo un video', opcionB: 'Al menos 3 módulos en Make + uso de IA en alguna etapa', opcionC: 'Un sitio web completo', opcionD: 'Solo texto escrito', respuestaCorrecta: 'b', claseRelacionada: 22 },
    { enunciado: '¿Qué es el "contexto" en un prompt de IA?', opcionA: 'El color del texto', opcionB: 'La información de fondo que le dás a la IA para que entienda tu pedido', opcionC: 'El idioma de respuesta', opcionD: 'El tamaño de la respuesta', respuestaCorrecta: 'b', claseRelacionada: 2 },
    { enunciado: '¿Para qué sirve la herramienta "Perplexity AI"?', opcionA: 'Diseñar logos', opcionB: 'Motor de búsqueda con IA que cita las fuentes', opcionC: 'Editar videos', opcionD: 'Automatizar emails', respuestaCorrecta: 'b', claseRelacionada: 1 },
    { enunciado: '¿Qué es el "hallucination" (alucinación) en una IA?', opcionA: 'Un bug del navegador', opcionB: 'Cuando la IA inventa información falsa con total seguridad', opcionC: 'Un tipo de imagen generada', opcionD: 'Una función de Make', respuestaCorrecta: 'b', claseRelacionada: 1 },
    { enunciado: 'En Canva, ¿para qué sirve la función "Eliminar fondo"?', opcionA: 'Borrar el historial', opcionB: 'Quitar el color de texto', opcionC: 'Remover el fondo de una imagen automáticamente con IA', opcionD: 'Cerrar el proyecto', respuestaCorrecta: 'c', claseRelacionada: 6 },
    { enunciado: '¿Qué es un "webhook" en automatización?', opcionA: 'Una herramienta de diseño', opcionB: 'Un tipo de error', opcionC: 'Una URL que recibe datos automáticamente cuando ocurre un evento', opcionD: 'Una red social', respuestaCorrecta: 'c', claseRelacionada: 18 },
    { enunciado: '¿Cuál es la ventaja principal de usar IA para atención al cliente?', opcionA: 'Reemplaza a todos los empleados', opcionB: 'Responde 24/7 sin cansarse y escala sin costo adicional', opcionC: 'Es más cara que contratar humanos', opcionD: 'Solo funciona en inglés', respuestaCorrecta: 'b', claseRelacionada: 3 },
    { enunciado: '¿Qué significa "automatización de alto volumen" en Make?', opcionA: 'Subir el volumen de un video', opcionB: 'Procesar miles de operaciones automáticas sin intervención humana', opcionC: 'Diseñar gráficos a gran escala', opcionD: 'Enviar muchos emails manualmente', respuestaCorrecta: 'b', claseRelacionada: 16 },
    { enunciado: '¿Cuál es la diferencia entre ChatGPT y un GPT personalizado?', opcionA: 'No hay diferencia', opcionB: 'ChatGPT es de pago y el GPT personalizado es gratis', opcionC: 'Un GPT personalizado tiene instrucciones y datos específicos de tu negocio', opcionD: 'Solo funciona en desktop', respuestaCorrecta: 'c', claseRelacionada: 11 },
    { enunciado: '¿Para qué sirve el "análisis de sentimiento" con IA?', opcionA: 'Colorear imágenes', opcionB: 'Detectar si un texto expresa emociones positivas, negativas o neutras', opcionC: 'Medir el volumen de un audio', opcionD: 'Crear presentaciones', respuestaCorrecta: 'b', claseRelacionada: 9 },
    { enunciado: 'En marketing digital, ¿qué es un "funnel" (embudo)?', opcionA: 'Tipo de imagen', opcionB: 'El recorrido del cliente desde que conoce tu producto hasta que compra', opcionC: 'Una herramienta de Make', opcionD: 'Un tipo de prompt', respuestaCorrecta: 'b', claseRelacionada: 4 },
    { enunciado: '¿Qué es ElevenLabs?', opcionA: 'Una empresa de contabilidad', opcionB: 'Herramienta para generar voz sintética realista con IA', opcionC: 'Red de distribución', opcionD: 'Sistema de base de datos', respuestaCorrecta: 'b', claseRelacionada: 7 },
    { enunciado: '¿Cuántas operaciones gratuitas ofrece Make en su plan free mensual?', opcionA: '100', opcionB: '500', opcionC: '1.000', opcionD: '10.000', respuestaCorrecta: 'c', claseRelacionada: 16 },
    { enunciado: '¿Qué es un "token" en los modelos de lenguaje?', opcionA: 'Una contraseña', opcionB: 'Una moneda digital', opcionC: 'La unidad mínima de texto que la IA procesa (aprox. 3/4 de una palabra)', opcionD: 'Un tipo de error', respuestaCorrecta: 'c', claseRelacionada: 1 },
    { enunciado: '¿Cuál es la diferencia entre Canva Gratis y Canva Pro?', opcionA: 'No hay diferencia', opcionB: 'Canva Pro incluye más herramientas de IA como Background Remover y Magic Studio', opcionC: 'Canva Pro solo funciona en desktop', opcionD: 'Canva Gratis tiene más plantillas', respuestaCorrecta: 'b', claseRelacionada: 6 },
    { enunciado: '¿Qué es "Make.com" antes de su cambio de nombre?', opcionA: 'Zapier', opcionB: 'HubSpot', opcionC: 'Integromat', opcionD: 'Airtable', respuestaCorrecta: 'c', claseRelacionada: 16 },
    { enunciado: '¿Para qué sirve la función "Data Store" en Make?', opcionA: 'Editar imágenes', opcionB: 'Almacenar datos temporalmente entre ejecuciones de escenarios', opcionC: 'Enviar mensajes de voz', opcionD: 'Crear formularios', respuestaCorrecta: 'b', claseRelacionada: 20 },
    { enunciado: '¿Qué tipo de archivos acepta ChatGPT Plus para análisis?', opcionA: 'Solo imágenes', opcionB: 'Solo texto', opcionC: 'PDFs, Excel, imágenes, Word y más', opcionD: 'Solo archivos CSV', respuestaCorrecta: 'c', claseRelacionada: 10 },
    { enunciado: '¿Cuál es el primer paso para implementar IA en un negocio según el curso?', opcionA: 'Comprar el mejor hardware', opcionB: 'Contratar un equipo de programadores', opcionC: 'Identificar las tareas repetitivas que más tiempo consumen para automatizarlas', opcionD: 'Crear una app desde cero', respuestaCorrecta: 'c', claseRelacionada: 13 },
    { enunciado: '¿Qué es Midjourney?', opcionA: 'Plataforma de automatización', opcionB: 'Herramienta de IA para generar imágenes a partir de texto', opcionC: 'Red social para diseñadores', opcionD: 'Plugin de Word', respuestaCorrecta: 'b', claseRelacionada: 5 },
    { enunciado: 'En el contexto del copywriting con IA, ¿qué es el "tono de voz"?', opcionA: 'El volumen del audio', opcionB: 'La forma en que una marca se comunica (formal, cercano, técnico, etc.)', opcionC: 'La fuente tipográfica', opcionD: 'El color del texto', respuestaCorrecta: 'b', claseRelacionada: 4 },
    { enunciado: '¿Qué es la integración IA + Make?', opcionA: 'Usar Excel con IA', opcionB: 'Conectar modelos de IA como ChatGPT dentro de flujos de automatización en Make', opcionC: 'Diseñar con Canva', opcionD: 'Crear videos con CapCut', respuestaCorrecta: 'b', claseRelacionada: 20 },
  ]

  await db.insert(preguntasExamen).values(preguntas).onConflictDoNothing()

  return NextResponse.json({
    ok: true,
    mensaje: 'Seed completado. Profesor: profe@itcargentina.com / ITC2026!',
    preguntas: preguntas.length,
  })
}
