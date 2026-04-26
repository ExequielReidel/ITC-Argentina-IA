import { ClaseSeccion } from './types'

// Clase 01 - La IA en tu Vida Cotidiana
export const clase01Secciones: ClaseSeccion[] = [
  {
    tipo: 'bienvenida',
    titulo: 'Antes de arrancar, respiremos hondo',
    duracion: 10,
    contenido: `Si estás leyendo esto, ya diste el paso más difícil: **decidiste aprender algo nuevo**. No importa si tenés 14 o 65 años, si tenés un kiosco en Chivilcoy o trabajás en una oficina de Córdoba. El próximo medio año vamos a transformar tu forma de trabajar.

### Lo que necesitás saber:

- **No hace falta saber nada** — Si manejás un celular y Word básico, alcanza y sobra.
- **Aprendemos juntos** — Todo el recorrido es guiado. Nadie se queda atrás.
- **Aplicado a tu realidad** — Usamos ejemplos reales de negocios argentinos.`
  },
  {
    tipo: 'teoria',
    titulo: '¿Qué es la IA y por qué cambia todo?',
    duracion: 20,
    contenido: `La **Inteligencia Artificial** es un programa de computadora que aprendió a entender lo que le pedís en lenguaje natural (como si le hablaras a un humano) y te responde con texto, imágenes o ideas. Hasta hace 3 años, esto era ciencia ficción. Hoy lo tenés gratis en tu celular.

> 💡 **Analogía para entenderlo:** Imaginate que tenés un **empleado súper capacitado** que sabe de todo: leyó miles de libros, vio millones de casos, pero nunca trabajó en tu negocio. Vos le das instrucciones y él hace el trabajo. Eso es la IA: un empleado que te atiende 24 horas, no se cansa y no pide aumento.

### Mitos y realidades

| Mito | Realidad |
|------|----------|
| "La IA piensa como una persona y siente emociones." | Es un programa que predice qué palabra viene después, basándose en patrones. Muy potente, pero no tiene conciencia. |
| "La IA me va a dejar sin trabajo." | Las personas que sepan usar IA van a reemplazar a las que no sepan. Por eso estás acá. |
| "La IA siempre dice la verdad." | A veces "alucina": inventa datos. Siempre verificá lo importante (precios, leyes, datos médicos). |

### Los 3 modelos principales: ¿cuál uso?

**ChatGPT (OpenAI):** El más popular del mundo. Excelente para escribir, analizar y conversar. Cuándo usarlo: redactar textos, responder mensajes, generar ideas.

**Gemini (Google):** Integrado con Gmail, Drive y YouTube. Buenísimo para datos actualizados. Cuándo usarlo: buscar info reciente, trabajar con tus documentos de Google.

**Copilot (Microsoft):** Viene en Windows, Word y Excel. Ideal si trabajás con Office. Cuándo usarlo: dentro de tus planillas de Excel o documentos de Word.

> ℹ️ **En este curso vamos a usar ChatGPT** como herramienta principal porque tiene la versión gratis más completa y es la que más vas a encontrar explicada en Internet si necesitás ayuda.

### Gratis vs. Paga: ¿qué conviene?

| Característica | Versión Gratis | Versión Plus (USD 20/mes) |
|----------------|----------------|---------------------------|
| Chatear / escribir textos | ✅ Suficiente | ✅ Igual, más rápida |
| Subir archivos (Excel, PDF) | ⚠ Limitada | ✅ Sin límite |
| Generar imágenes | ⚠ Pocas por día | ✅ Sin límite práctico |
| Crear GPTs personalizados | ✅ Podés usar | ✅ Podés crear |

*Recomendación: arrancá con la gratis. Si a los 2 meses sentís que la usás todos los días, pagás la Plus. No antes.*

### Palabras clave que vas a escuchar

- **Modelo:** El "cerebro" de la IA. Ej: GPT-4o, Gemini 2.5.
- **Prompt:** La instrucción que vos le escribís a la IA.
- **Respuesta:** Lo que la IA te devuelve.
- **Contexto:** La info previa de la conversación que la IA recuerda.
- **Token:** Cada pedacito de palabra. La IA cobra por token (en la paga).
- **Chat / Conversación:** Una charla completa. Podés tener muchas en paralelo.`
  },
  {
    tipo: 'practica',
    titulo: 'Tu primera conversación con una IA',
    duracion: 40,
    contenido: `Vamos a hacerlo todos juntos. El profe va a ir paso a paso en la pantalla y vos lo replicás en tu celular o computadora. Si te quedás atrás, levantá la mano: nadie avanza sin todos.

### Paso 1: Entrá a ChatGPT
Abrí el navegador (Chrome, Edge o Safari) y andá a [chat.openai.com](https://chat.openai.com). Desde el celular podés instalar la app oficial de OpenAI buscándola en Play Store o App Store.

### Paso 2: Creá tu cuenta
Hacé clic en "Sign up". Podés registrarte con tu mail de Google (lo más rápido) o crear una cuenta nueva con cualquier correo.

### Paso 3: Tu primer prompt
Ya adentro, vas a ver un recuadro que dice "Message ChatGPT...". Ahí escribí tu primer mensaje. Copiá esto tal cual:

\`\`\`
Hola, soy [tu nombre] y tengo un negocio de [tu rubro] en [tu ciudad]. Dame 5 ideas simples para usar inteligencia artificial en mi trabajo diario.
\`\`\`

### Paso 4: Leé la respuesta
La IA te va a devolver 5 ideas. Leelas tranquilo. Algunas te van a parecer obvias, otras te van a sorprender. **Esa es la gracia: la IA te tira opciones que vos no se te ocurrían.**

### Paso 5: Pedile que profundice
Elegí la idea que más te gustó y escribile:

\`\`\`
Me interesa la idea número [X]. Explicame paso a paso cómo la podría implementar en mi negocio.
\`\`\`

> 💡 **Truco:** La IA recuerda toda la conversación. No hace falta repetirle quién sos o de qué hablaron antes. Podés seguir preguntando.`
  },
  {
    tipo: 'ejercicio',
    titulo: 'Tu tarea para la semana',
    duracion: 15,
    contenido: `### Ejercicio obligatorio (para entregar antes de la próxima clase):

1. **Hablá con ChatGPT 10 minutos por día** durante esta semana. Puede ser sobre lo que quieras: tu negocio, una receta, una duda de Excel, lo que se te ocurra. El objetivo es que le pierdas el miedo y entiendas cómo funciona.

2. **Probá las 5 ideas que te dio** (o al menos 2). Anotá en tu cuaderno qué funcionó y qué no.

3. **Traé una consulta real de WhatsApp** de un cliente (borrá datos sensibles). La semana que viene la vamos a usar para practicar.

> ⚠️ **Importante:** Si te trabás en algún paso, mandá tu duda al grupo de WhatsApp del curso. No te quedes con la duda.`
  },
  {
    tipo: 'cierre',
    titulo: 'Lo que te llevás hoy',
    duracion: 5,
    contenido: `### Resumen de la clase:

✅ Sabés qué es la IA y qué no es (no piensa, no siente, pero es muy útil).

✅ Conocés los 3 modelos principales: ChatGPT, Gemini, Copilot.

✅ Tenés tu cuenta de ChatGPT creada y funcionando.

✅ Hiciste tu primera conversación real con una IA.

✅ Sabés que la calidad de la respuesta depende de cómo le pedís las cosas.

### Próxima clase:
**Prompt Engineering: Fundamentos** — Vamos a aprender a estructurar instrucciones que la IA entienda perfecto a la primera. Es la clase más importante de todo el curso.`
  }
]

// Clase 02 - Prompt Engineering para Negocios
export const clase02Secciones: ClaseSeccion[] = [
  {
    tipo: 'repaso',
    titulo: '¿Qué vimos la clase pasada?',
    duracion: 10,
    contenido: `En la Clase 1 abriste tu cuenta de ChatGPT y tuviste tu primera conversación con una IA. Aprendimos que la IA es **"un empleado muy capacitado"**, conocimos ChatGPT, Gemini y Copilot, y entendimos que la calidad de la respuesta depende de cómo le pidas las cosas.

### Antes de arrancar, comentemos entre todos:
- ¿Cumpliste la tarea de hablar 10 minutos por día con ChatGPT?
- ¿Qué fue lo que más te sorprendió? ¿En qué te falló?
- ¿Probaste las 5 ideas que te dio para tu negocio? ¿Cómo salió?

> 💡 **Seguro notaste algo:** a veces la IA te respondía cualquier cosa, o muy genérico. No es que esté rota. Es que le faltó dirección. Hoy vamos a arreglar eso de raíz.`
  },
  {
    tipo: 'teoria',
    titulo: '¿Qué es un prompt y por qué la estructura importa?',
    duracion: 25,
    contenido: `Un **prompt** es la instrucción que le das a la IA. Parece simple, pero acá está el 80% del juego: **un buen prompt es la diferencia entre perder 30 minutos corrigiendo una respuesta genérica o tener el trabajo listo en 20 segundos**.

> 💡 **Analogía para entenderlo:** Pensá el prompt como **las instrucciones que le darías a un empleado nuevo**. Si le decís "hacé algo con los clientes", va a hacer cualquier cosa. Si le decís "llamá a los 10 clientes que no compraron en los últimos 60 días, ofreceles el descuento del 15% y anotá las respuestas en esta planilla", sabe exactamente qué hacer. La IA es igual: **cuanto más clara sea la orden, mejor el resultado**.

### El mismo pedido, dos resultados distintos

**❌ Prompt genérico:**
\`\`\`
"Escribime una publicación para Instagram."
\`\`\`
→ La IA te devuelve algo plano, que sirve para cualquier negocio y para ninguno en particular. Te toca reescribirlo.

**✅ Prompt con estructura:**
\`\`\`
"Actuá como community manager. Escribí una publicación de Instagram para mi panadería de barrio en Rosario, anunciando pan dulce artesanal para Navidad. Tono cálido y familiar, con llamada a reservar por WhatsApp."
\`\`\`
→ La IA te devuelve algo publicable, con tu voz y tu contexto. Copiás y pegás.

---

## Fórmula RTF: la más simple y efectiva

Tu primera herramienta. Memorizala porque la vas a usar todos los días. Se arma con tres letras:

| Letra | Significado | Ejemplo |
|-------|-------------|---------|
| **R** | **Rol** — Decile quién es. Le das una personalidad profesional. | "Actuá como contador especializado en monotributo..." |
| **T** | **Tarea** — Qué tiene que hacer. Sé específico con el verbo. | "...redactá un mensaje de recordatorio de pago..." |
| **F** | **Formato** — Cómo querés que te lo devuelva. | "...en formato WhatsApp, máximo 80 palabras, cordial." |

### Ejemplo RTF completo:
\`\`\`
[Rol] Actuá como contador especializado en monotributo.
[Tarea] Redactá un mensaje de recordatorio de pago para un cliente que se atrasó 2 días con la cuota mensual.
[Formato] Formato WhatsApp, máximo 80 palabras, tono cordial pero firme.
\`\`\`

---

## Fórmula TAFEC: cuando necesitás precisión quirúrgica

Para tareas más complejas (campañas, análisis, comunicaciones delicadas), agregás 2 letras más:

| Letra | Significado |
|-------|-------------|
| **T** | **Tarea** — Qué hacer |
| **A** | **Audiencia** — Para quién |
| **F** | **Formato** — Cómo entregarlo |
| **E** | **Estilo** — Con qué tono |
| **C** | **Contexto** — La info clave |

### Ejemplo TAFEC completo:
\`\`\`
[Tarea] Redactá un mail promocional para el sorteo del Día del Padre.
[Audiencia] Clientes de mi ferretería de Córdoba, hombres 35-65 años, barrio trabajador.
[Formato] Email corto, asunto + 3 párrafos + botón de CTA.
[Estilo] Cercano, sin palabras rebuscadas, con humor argentino moderado.
[Contexto] El sorteo es una caja de herramientas Stanley. Participan quienes compren más de $30.000 entre el 1 y el 15 de junio.
\`\`\`

---

## Técnica Chain of Thought: "pensá paso a paso"

Cuando el problema es complejo (decidir un precio, analizar un caso, elegir entre opciones), agregale esta frase mágica al final del prompt:

> **"Antes de responderme, pensá paso a paso y explicame tu razonamiento."**

¿Por qué funciona? Porque **obligás a la IA a no tirar la primera respuesta que se le ocurra**. La hacés "mostrar el cálculo", como cuando la maestra te pedía que escribieras el procedimiento. Las respuestas mejoran muchísimo.

---

## Técnica Few-Shot: enseñarle con ejemplos

Si querés que la IA respete un estilo muy particular (el tuyo, el de tu marca), **dale 2 o 3 ejemplos** de cómo sería el resultado ideal. Es como cuando entrenás a un empleado nuevo mostrándole casos anteriores.

### Ejemplo Few-Shot:
\`\`\`
Actuá como redactor de mi peluquería. Te paso 2 ejemplos de cómo escribo yo las publicaciones. Seguí ese mismo estilo para crear una nueva sobre el servicio de mechas.

EJEMPLO 1: "¿Ya te viste al espejo hoy? 👀 Si la respuesta es 'meh', reservate un turno. Te esperamos con mate y música buena 💇‍♀️"

EJEMPLO 2: "Lunes de energía nueva ⚡ Cortes a partir de $8.500. WhatsApp 11-xxxx-xxxx. Estamos sobre Av. San Martín 432, Moreno."
\`\`\`

---

## Los 5 errores más comunes (y cómo arreglarlos)

1. **Pedir sin dar contexto.** ❌ "Hacé un cartel de promo." ✅ Agregá rubro, producto, precio, público.

2. **No especificar el formato.** ❌ "Dame ideas." ✅ "Dame una lista numerada de 5 ideas, cada una con máximo 2 renglones."

3. **Aceptar la primera respuesta.** La IA no se ofende. Pedile: "Reescribilo más corto" o "Dame otra versión más informal".

4. **No darle el rol.** Un prompt sin rol es como hablarle a cualquiera. Siempre empezá con "Actuá como..."

5. **Olvidar el tono.** No es lo mismo "profesional" que "amigable". Decíselo explícitamente.`
  },
  {
    tipo: 'practica',
    titulo: 'Hagamos prompts para tu negocio',
    duracion: 35,
    contenido: `Vamos a practicar las dos fórmulas con casos reales. Abrí ChatGPT y seguí estos ejemplos. Adaptá el rubro al tuyo.

### Ejercicio 1: Recordatorio de pago (RTF)

**Caso:** Sos contador y tenés un cliente que se atrasó 3 días con el pago mensual. Necesitás mandarle un WhatsApp firme pero cordial.

**Prompt:**
\`\`\`
Actuá como contador especializado en monotributo y autónomos en Argentina. Redactá un mensaje de WhatsApp para un cliente que se atrasó 3 días con el pago de tu servicio mensual ($45.000). El tono debe ser cordial pero firme, recordando que el atraso genera complicaciones en la gestión. Máximo 60 palabras. Cerrá con una pregunta concreta para que responda.
\`\`\`

---

### Ejercicio 2: Email de promoción (TAFEC)

**Caso:** Tenés una ferretería y querés anunciar el sorteo del Día del Padre por email.

**Prompt:**
\`\`\`
[Tarea] Redactá un mail promocional para el sorteo del Día del Padre.
[Audiencia] Clientes de mi ferretería de Córdoba, hombres 35-65 años, barrio trabajador.
[Formato] Email corto: asunto atractivo + 3 párrafos + botón de CTA "Quiero participar".
[Estilo] Cercano, sin palabras rebuscadas, con humor argentino moderado.
[Contexto] El sorteo es una caja de herramientas Stanley valorada en $180.000. Participan automáticamente quienes compren más de $30.000 entre el 1 y el 15 de junio. El sorteo es el 17 de junio en vivo por Instagram.
\`\`\`

---

### Ejercicio 3: Análisis con Chain of Thought

**Caso:** Querés decidir si subir los precios un 15% o mantenerlos. Le pedís a la IA que te ayude a pensar.

**Prompt:**
\`\`\`
Actuá como consultor de negocios para pymes argentinas. Mi negocio es una dietética en Tucumán. Estoy evaluando si subir los precios un 15% este mes. Mis costos subieron 12%, la competencia subió 10%, y mis clientes son de nivel socioeconómico medio-bajo. Antes de darme una recomendación, pensá paso a paso y explicame tu razonamiento con pros y contras.
\`\`\`

> 💡 **Truco:** Cuando termines cada ejercicio, pedile a la IA que te dé **una versión alternativa** con otro enfoque. Vas a ver cómo mejora tu capacidad de elegir.`
  },
  {
    tipo: 'ejercicio',
    titulo: 'Tu tarea para la semana',
    duracion: 15,
    contenido: `### Ejercicio obligatorio (para entregar antes de la próxima clase):

1. **Escribí 3 prompts usando RTF** para situaciones reales de tu negocio. Pueden ser:
   - Un mensaje de WhatsApp para un cliente
   - Una publicación de Instagram
   - Un email de seguimiento

2. **Escribí 1 prompt usando TAFEC** para algo más complejo (una campaña, un análisis, una propuesta).

3. **Traé una consulta real de WhatsApp** de un cliente (sin datos sensibles). La vamos a usar en la Clase 3 para practicar respuestas con IA.

4. **Bonus:** Probá la técnica de "pensá paso a paso" en alguna decisión que tengas pendiente.

> 📤 **Entrega:** Subí tus 4 prompts al grupo de WhatsApp del curso antes del viernes.`
  },
  {
    tipo: 'cierre',
    titulo: 'Lo que te llevás hoy',
    duracion: 5,
    contenido: `### Resumen de la clase:

✅ Entendés por qué la estructura del prompt importa tanto.

✅ Dominás la fórmula **RTF** (Rol, Tarea, Formato) para prompts rápidos.

✅ Conocés la fórmula **TAFEC** para situaciones más complejas.

✅ Sabés usar "pensá paso a paso" para mejorar análisis.

✅ Aprendiste a dar ejemplos (Few-Shot) para que la IA respete tu estilo.

### Próxima clase:
**IA para Ventas y Atención al Cliente** — Vamos a bajar todo esto al WhatsApp de tu negocio. Plantillas para responder consultas, manejar reclamos, superar objeciones de precio y pedir reseñas.`
  }
]

// Clase 03 - IA para Ventas y Atención al Cliente
export const clase03Secciones: ClaseSeccion[] = [
  {
    tipo: 'repaso',
    titulo: '¿Qué vimos la clase pasada?',
    duracion: 10,
    contenido: `En la Clase 2 aprendiste **a construir prompts profesionales**. Te llevaste dos fórmulas: **RTF** (Rol, Tarea, Formato) para lo rápido y **TAFEC** (Tarea, Audiencia, Formato, Estilo, Contexto) para lo preciso. Además, la magia del *"pensá paso a paso"* y la técnica de *dar ejemplos*.

### Mini-ronda rápida:
- ¿Hiciste los 3 prompts de tarea? ¿Cuál te funcionó mejor?
- ¿Trajiste la consulta real de WhatsApp que te pedí la semana pasada?

> 💡 **Hoy bajamos todo a tierra:** vamos a aplicar los prompts a la situación más común del comercio argentino: **el WhatsApp del negocio**. Ese que no para de sonar y que a veces te agarra desprevenido.`
  },
  {
    tipo: 'teoria',
    titulo: 'Por qué la IA te hace vender más (sin ser pesado)',
    duracion: 20,
    contenido: `En un comercio típico argentino, el WhatsApp concentra el **80% de las consultas**. El problema no es tener mensajes: es **responder a tiempo, con la voz correcta y sin perder la paciencia**. La IA no reemplaza tu trato humano: te da las palabras cuando estás desbordado.

> 💡 **Pensalo así:** La IA es como **un empleado de atención al cliente que nunca duerme, nunca se enoja y siempre tiene el guión a mano**. Vos le pasás el mensaje que te llegó, él te redacta 3 versiones de respuesta, vos elegís la mejor y la mandás. En 20 segundos. Sin dolor de cabeza.

### Los 6 escenarios que vamos a cubrir hoy

Son las situaciones más comunes del WhatsApp de cualquier comercio. Al final de la clase vas a tener una plantilla para cada una:

1. **Mensaje de venta** — Ofrecer sin parecer spam.
2. **Consulta frecuente** — "¿Cuánto sale?" "¿Tienen stock?"
3. **Reclamo** — Cliente enojado, sin echar leña al fuego.
4. **Objeción de precio** — "Está caro" sin bajar precio.
5. **Seguimiento** — El cliente dejó el mensaje en visto.
6. **Pedido de reseña** — Que el cliente te deje 5 estrellas.

### Las 3 reglas de oro del WhatsApp comercial

**1. Responder rápido, aunque sea para avisar que vas a responder.**
Un *"¡Hola! Ahora te contesto en detalle"* en 5 minutos vale más que la respuesta perfecta 3 horas después.

**2. Cerrar cada mensaje con una pregunta o una acción.**
No dejes el balón en el aire. Terminá con *"¿Te reservo uno?"* o *"¿Pasás hoy o mañana?"*. La conversación tiene que avanzar.

**3. Hablar como hablás vos, no como "empresa".**
Nada de *"Estimado cliente, nos complace informarle"*. El WhatsApp es cercano: *"¡Hola Marcela! Tenemos eso, sí"* vende mucho más.`
  },
  {
    tipo: 'practica',
    titulo: 'Resolvamos los 6 escenarios juntos',
    duracion: 40,
    contenido: `En cada paso vas a ver: **el mensaje del cliente**, **el prompt que le pasás a ChatGPT** y **la respuesta tipo que te devuelve**. Copialos en tu ChatGPT y adaptalos a tu rubro.

---

### 1. Venta sin ser invasivo — Peluquería

**Situación:** Querés mandar una oferta de descuento en mechas a las clientas que no vinieron en 2 meses.

**El prompt:**
\`\`\`
Actuá como copywriter de WhatsApp para una peluquería de barrio. Escribime un mensaje breve (máximo 60 palabras) para enviarle a clientas que no vienen hace 2 meses. Ofrecele 15% off en coloración durante esta semana. Tono cálido, cercano, como si le escribiera una amiga. Terminá con una pregunta concreta para que responda. Usá 1 o 2 emojis suaves.
\`\`\`

**Respuesta tipo:**
> ¡Hola Rocío! 💕 Te extrañamos por acá. Esta semana tengo un 15% off en color para vos, así volvés a brillar. ¿Te armo un turno para el jueves o preferís el sábado?

---

### 2. Consulta frecuente — Ferretería

**Cliente escribe:** "Hola, tenés taladro percutor? Cuánto sale?"

**El prompt:**
\`\`\`
Actuá como vendedor de una ferretería. Un cliente me pregunta por WhatsApp si tengo taladro percutor y cuánto sale. Tengo el modelo Black+Decker HD455 a $68.000 y el Bosch GSB 550 a $95.000. Redactá una respuesta breve y clara que: (1) confirme stock, (2) dé los dos precios con una diferencia clave de cada uno, y (3) cierre con una pregunta para que compre. Tono amable, sin palabras rebuscadas.
\`\`\`

**Respuesta tipo:**
> ¡Hola! Sí, tengo dos opciones:
> 🔹 Black+Decker HD455 — $68.000 (ideal para uso hogareño, bien rendidor)
> 🔹 Bosch GSB 550 — $95.000 (más potente, para laburo intenso)
> ¿Para qué lo vas a usar? Así te recomiendo el que mejor te sirve.

---

### 3. Reclamo sin echar leña — Taller mecánico

**Cliente escribe (enojado):** "Me cambiaron el embrague la semana pasada y anda peor que antes!!! Esto es una vergüenza."

**El prompt:**
\`\`\`
Actuá como mecánico dueño de un taller, con experiencia en atención al cliente. Recibí este mensaje de un cliente enojado: "Me cambiaron el embrague la semana pasada y anda peor que antes, esto es una vergüenza". Redactá una respuesta que: (1) no se ponga a la defensiva, (2) reconozca el problema sin aceptar culpa ciega, (3) ofrezca una revisión sin cargo lo antes posible, (4) cierre coordinando fecha. Tono tranquilo, profesional, humano. Máximo 80 palabras.
\`\`\`

**Respuesta tipo:**
> Hola Juan, lamento mucho que estés pasando por esto. Entiendo tu frustración. Te propongo que traigas el auto mañana a primera hora así lo revisamos sin cargo y encontramos qué está pasando. Si hay algo que ajustar de nuestro lado, lo solucionamos. ¿Te sirve mañana a las 8? Avisame y te reservo el turno.

---

### 4. Objeción de precio — Tienda de ropa

**Cliente escribe:** "Me encanta la campera pero $85.000 es mucho para mí..."

**El prompt:**
\`\`\`
Actuá como vendedor de una tienda de ropa femenina. Una clienta me dice que le encanta una campera pero que $85.000 es mucho para ella. No quiero bajar el precio, pero sí quiero darle opciones. Redactá una respuesta que: (1) valide su interés, (2) mencione la calidad y durabilidad, (3) ofrezca cuotas sin interés o un beneficio alternativo, (4) cierre preguntando si quiere que se la reserve. Tono amable, sin presión. Máximo 70 palabras.
\`\`\`

**Respuesta tipo:**
> ¡Gracias por escribirme! Esa campera es una de las más elegidas porque dura temporadas. Te la puedo dejar en 3 cuotas sin interés de $28.333 con tarjeta. Y si la llevás esta semana, te regalo un pañuelo para combinarla. ¿Querés que te la reserve?

---

### 5. Seguimiento — Coaching / Servicios

**Situación:** El cliente preguntó por tu servicio hace 3 días y no volvió a escribir.

**El prompt:**
\`\`\`
Actuá como coach de desarrollo personal. Un potencial cliente me consultó hace 3 días sobre mis sesiones de coaching pero nunca respondió mi mensaje con los precios. Redactá un mensaje de seguimiento que: (1) sea breve y no invasivo, (2) recuerde el tema sin repetir todo, (3) ofrezca una pequeña acción (responder "sí" o "no" para cerrar el tema). Tono cálido, sin presión. Máximo 50 palabras.
\`\`\`

**Respuesta tipo:**
> Hola Martín, ¿cómo estás? Te escribo porque quedó pendiente lo de las sesiones. Si te interesa, genial, coordinamos. Si no es el momento, no pasa nada, me avisás y listo. ¿Qué te parece?

---

### 6. Pedido de reseña — Restaurant

**Situación:** Un cliente comió en tu restaurant y se fue contento. Querés pedirle una reseña en Google.

**El prompt:**
\`\`\`
Actuá como dueño de un restaurant familiar en Buenos Aires. Un cliente acaba de comer y se fue muy contento. Redactá un mensaje de WhatsApp pidiéndole que deje una reseña en Google. El mensaje debe: (1) agradecerle, (2) explicar por qué las reseñas ayudan, (3) incluir el link de Google Maps, (4) no sonar desesperado. Tono cercano, agradecido. Máximo 60 palabras.
\`\`\`

**Respuesta tipo:**
> ¡Hola! Gracias por venir hoy, fue un gusto atenderte. Si tenés 1 minutito, nos ayudaría mucho que dejes tu opinión en Google: [link]. Las reseñas nos ayudan a que más gente nos conozca. ¡Gracias de nuevo y te esperamos pronto! 🙌`
  },
  {
    tipo: 'ejercicio',
    titulo: 'Tu tarea para la semana',
    duracion: 15,
    contenido: `### Ejercicio obligatorio:

1. **Elegí 3 de los 6 escenarios** que más apliquen a tu negocio.

2. **Adaptá los prompts** a tu rubro, producto y estilo.

3. **Usá al menos 2 de las plantillas** en conversaciones reales de WhatsApp esta semana.

4. **Anotá los resultados:** ¿El cliente respondió? ¿Compraste tiempo? ¿Cerraste una venta?

> 📤 **Entrega:** Compartí en el grupo de WhatsApp 1 captura (sin datos sensibles) de cómo te fue usando una plantilla.`
  },
  {
    tipo: 'cierre',
    titulo: 'Lo que te llevás hoy',
    duracion: 5,
    contenido: `### Resumen de la clase:

✅ Tenés **6 plantillas listas** para copiar y adaptar a tu negocio.

✅ Sabés las **3 reglas de oro** del WhatsApp comercial.

✅ Entendés que la IA te ayuda a **responder mejor, no a reemplazarte**.

✅ Aprendiste a manejar reclamos sin ponerte a la defensiva.

✅ Sabés cómo superar la objeción de precio sin bajar el precio.

### Próxima clase:
**IA para Copywriting y Contenido** — Nunca más vas a mirar Instagram pensando "¿y qué subo hoy?". De 1 sola idea vas a salir con 30.`
  }
]

// Clase 04 - IA para Copywriting y Contenido
export const clase04Secciones: ClaseSeccion[] = [
  {
    tipo: 'repaso',
    titulo: '¿Qué vimos la clase pasada?',
    duracion: 10,
    contenido: `En la Clase 3 aprendiste a **responder WhatsApp como un pro**: ventas sin ser pesado, manejo de reclamos, objeciones de precio, seguimientos y pedido de reseñas. Te llevaste 6 plantillas listas para copiar y pegar.

### Mini-ronda rápida:
- ¿Usaste alguna plantilla esta semana en tu WhatsApp real?
- ¿Cuánto tiempo calculás que te ahorraste?
- ¿Algún mensaje difícil que quieras compartir con el grupo?

> 💡 **Pasamos del "responder" al "atraer".** Si la Clase 3 fue sobre clientes que ya te escribieron, hoy es sobre cómo **hacer que te encuentren y te elijan** antes de que te escriban.`
  },
  {
    tipo: 'teoria',
    titulo: 'Texto genérico vs. texto con voz de marca',
    duracion: 20,
    contenido: `El error más común cuando la gente empieza a usar IA para contenido es **aceptar la primera respuesta sin darle "tu voz"**. El resultado: posts que parecen escritos por un robot, iguales a los de cualquier otro negocio. Hoy aprendemos a evitarlo.

> 💡 **Pensalo así:** La voz de marca es **cómo hablarías si tu negocio fuera una persona**. ¿Es un amigo que te tira una broma? ¿Un profesional serio que te tranquiliza? ¿Un vecino que te recomienda algo? La IA, sin indicaciones, habla en tono "corporativo neutro". Tu trabajo es **sacarla de ahí** y llevarla a tu voz.

### Ejemplo: 2 posts para una nutricionista

**❌ Texto genérico:**
> "La alimentación saludable es fundamental para nuestro bienestar. Consumir frutas, verduras y alimentos naturales aporta nutrientes esenciales. Te invitamos a agendar una consulta para recibir un plan personalizado."

*Suena a folleto de sala de espera. Nadie se identifica.*

**✅ Con voz de marca:**
> "Te lo digo con cariño: no necesitás una dieta imposible. Necesitás que alguien te ayude a elegir qué meter al carrito del súper cada semana. Eso hago yo. Si estás cansada de empezar el lunes, escribime. 🥬"

*Suena a una persona real. La gente se identifica, comenta, comparte.*

---

### Los 4 ingredientes de un buen copy

1. **Gancho (primer renglón)** — La frase que hace que la gente pare el scroll. Pregunta, dato impactante, o algo que roza el nervio del cliente.

2. **Beneficio, no característica** — No digas "100% algodón". Decí "la remera que te ponés y no te saca más el marido".

3. **Hablale a una sola persona** — "Vos" en singular, no "ustedes". Aunque lo lean mil, cada uno debe sentir que le hablás a él.

4. **Llamada a la acción (CTA)** — Terminá diciendo qué querés que haga: "Mandame mensaje", "Reservá tu lugar", "Pasá por el local".

---

### Las 3 redes principales (y cómo cambia el mismo post)

| Red | Largo ideal | Tono | Detalle clave |
|-----|-------------|------|---------------|
| **Instagram** | 80-150 palabras | Visual, emotivo | Primer renglón gancho + emojis |
| **Facebook** | 100-200 palabras | Conversacional | Genera debate y comentarios |
| **LinkedIn** | 150-300 palabras | Profesional, reflexivo | Aporta aprendizaje / insight |

*Un mismo mensaje podés publicarlo en las 3 redes, pero **reescrito para cada una**. La IA hace esa traducción en segundos.*`
  },
  {
    tipo: 'practica',
    titulo: 'Hagamos el trabajo de 1 semana en 40 minutos',
    duracion: 40,
    contenido: `Vamos a pasar por tres bloques: **descripción de producto**, **el famoso ejercicio de las 30 ideas** (atentos, que es la parte que impresiona), y **adaptación a 3 redes**. Copiá los prompts en tu ChatGPT.

---

### 1. Descripción de producto — Emprendimiento de indumentaria

**Caso:** Sofía vende buzos oversize tejidos a mano. Tiene 4 fotos y quiere publicar en su Instagram + en Mercado Libre.

**El prompt:**
\`\`\`
Actuá como copywriter de moda. Te describo un producto y necesito 2 descripciones distintas del mismo:

Producto: Buzo oversize tejido a mano, lana merino, color mostaza, talles S/M/L, $48.000.

Versión 1: para Instagram. 100 palabras, tono cálido y emocional, que apele a "sentirse cómoda y abrigada en casa un domingo". Primer renglón como gancho. Terminá con CTA para escribir por DM.

Versión 2: para Mercado Libre. 80 palabras, tono informativo pero cercano, priorizando composición del material, talles y cuidado de la prenda. CTA para comprar.
\`\`\`

> 💡 **Truco:** pedí siempre *2 versiones al mismo tiempo*. Te sale una sola consulta y te llevás el doble de material.

---

### 2. El ejercicio estrella: 30 ideas desde 1 tema

**Caso:** Diego tiene una dietética en San Miguel de Tucumán. Dice: *"No sé qué subir a Instagram. Ya publiqué 4 veces sobre los beneficios de la palta y se me acabaron las ideas"*. En 2 minutos vamos a generarle material para 1 mes entero.

**El prompt:**
\`\`\`
Actuá como estratega de contenidos de redes sociales. Mi negocio es una dietética en Tucumán que vende almendras, quinoa, frutos secos y productos sin TACC.

A partir del tema central "beneficios de la palta", generame 30 ideas de publicaciones distintas para Instagram, cada una desde un ángulo diferente. Variá entre: recetas, mitos, datos curiosos, comparaciones, tips, errores comunes, testimonios, humor, estacionalidad, combinaciones con otros productos.

Formato: lista numerada. Cada idea debe tener (a) título atractivo de máximo 8 palabras y (b) breve descripción de qué se muestra (1 renglón). Tono argentino, cálido, sin ser aburrido.
\`\`\`

**Lo que ChatGPT te devuelve (muestra parcial):**

1. **"5 errores que arruinan tu palta"** — Carrusel con fotos de palta oxidada, mal cortada, etc.
2. **"Palta: ¿engorda o adelgaza?"** — Reel corto desmintiendo el mito.
3. **"El desayuno de 3 minutos con palta"** — Video paso a paso de tostada con palta.
4. **"¿Sabías que la palta tiene más potasio que la banana?"** — Imagen con dato curioso.
5. **"3 recetas con palta que no conocías"** — Carrusel con fotos de cada receta.
...y así hasta 30.

> 🤯 **Esto es lo que impresiona:** de 1 solo tema, la IA te genera material para 1 mes. Repetí el ejercicio con otros 3 productos y tenés contenido para 4 meses.

---

### 3. Adaptación a 3 redes

**Caso:** Querés publicar sobre un nuevo servicio de manicuría express. Necesitás el mismo mensaje para Instagram, Facebook y LinkedIn (sí, LinkedIn, porque tenés clientas que son profesionales).

**El prompt:**
\`\`\`
Actuá como community manager de un centro de estética en Buenos Aires. Voy a lanzar un servicio de "manicuría express en 20 minutos" ideal para profesionales con poco tiempo. El precio es $8.500.

Redactame el mismo anuncio adaptado a 3 redes:

1. Instagram: 100 palabras, tono joven y fresco, emojis, primer renglón gancho, CTA para reservar por DM.

2. Facebook: 120 palabras, tono conversacional, invitá a comentar experiencias, CTA para reservar por inbox.

3. LinkedIn: 150 palabras, tono profesional, hablá de optimizar el tiempo y la imagen personal, CTA para agendar.
\`\`\`

> 💡 **Resultado:** 3 posts listos para copiar y pegar. En 2 minutos. Sin reescribir nada a mano.`
  },
  {
    tipo: 'ejercicio',
    titulo: 'Tu tarea para la semana',
    duracion: 15,
    contenido: `### Ejercicio obligatorio:

1. **Hacé el ejercicio de las 30 ideas** con un tema central de tu negocio. Elegí el producto o servicio que más vendés.

2. **Escribí 2 descripciones de producto** (1 para redes, 1 para venta online) usando el prompt de la práctica.

3. **Adaptá 1 mensaje a 3 redes** distintas (Instagram, Facebook y LinkedIn o WhatsApp).

4. **Publicá al menos 3 de las ideas** esta semana y anotá cuál tuvo más interacción.

> 📤 **Entrega:** Compartí en el grupo de WhatsApp tu lista de 30 ideas y 1 post que hayas publicado.`
  },
  {
    tipo: 'cierre',
    titulo: 'Lo que te llevás hoy',
    duracion: 5,
    contenido: `### Resumen de la clase:

✅ Sabés diferenciar **texto genérico** de **texto con voz de marca**.

✅ Conocés los **4 ingredientes** de un buen copy: gancho, beneficio, "vos", CTA.

✅ Podés generar **30 ideas de contenido** de un solo tema en 2 minutos.

✅ Sabés adaptar el mismo mensaje a **Instagram, Facebook y LinkedIn**.

✅ Tenés plantillas para **descripciones de producto** en redes y e-commerce.

### Próxima clase:
**GPTs Personalizados para tu Negocio** — Vamos a crear tu propio asistente de IA entrenado con los datos de tu negocio. Vendedor automático 24/7.`
  }
]

// Mapa de contenido por clase ID
export const clasesContenido: Record<number, { objetivo: string; secciones: ClaseSeccion[] }> = {
  1: {
    objetivo: 'Al finalizar esta clase vas a tener tu cuenta de ChatGPT creada y habrás hecho tu primera conversación con una IA, entendiendo qué es y qué no es la inteligencia artificial.',
    secciones: clase01Secciones
  },
  2: {
    objetivo: 'Al finalizar esta clase vas a saber redactar prompts profesionales usando las fórmulas RTF y TAFEC, y podrás transformar un pedido genérico en una instrucción que la IA ejecute perfecto a la primera.',
    secciones: clase02Secciones
  },
  3: {
    objetivo: 'Al finalizar esta clase vas a tener un arsenal de plantillas listas para responder WhatsApp: consultas frecuentes, reclamos, objeciones de precio, seguimiento de clientes y pedido de reseñas. Todo adaptado a tu rubro.',
    secciones: clase03Secciones
  },
  4: {
    objetivo: 'Al finalizar esta clase vas a salir con 30 ideas de contenido para tu negocio, saber generar descripciones de productos irresistibles y adaptar un mismo post a Instagram, Facebook y LinkedIn sin reescribir todo a mano.',
    secciones: clase04Secciones
  }
}
