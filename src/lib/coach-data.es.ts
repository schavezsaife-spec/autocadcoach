// Spanish translations for lesson & project content, keyed by the same id
// as the English source in coach-data.ts. Any missing field falls back to
// English via the merge helpers.

import type { Lesson, Project, RichLesson, LessonQuizQ, TroubleshootItem } from "./coach-data";

export type LessonEs = Partial<Pick<Lesson, "title" | "description" | "objective" | "steps" | "mistake" | "challenge" | "tag">>;
export type ProjectEs = Partial<Pick<Project, "title" | "description" | "steps" | "difficulty">>;

export type RichLessonEs = Partial<{
  learningObjective: string;
  whatItIs: string;
  whyWhen: string;
  whereToFind: Partial<RichLesson["whereToFind"]>;
  vocab: RichLesson["vocab"];
  beforeYouStart: string[];
  detailedSteps: Array<Partial<Pick<RichLesson["detailedSteps"][number], "title" | "instruction" | "explanation">>>;
  commonMistakes: RichLesson["commonMistakes"];
  troubleshooting: RichLesson["troubleshooting"];
  practiceExercise: Partial<RichLesson["practiceExercise"]>;
  proTips: string[];
  relatedCommands: Array<Partial<RichLesson["relatedCommands"][number]>>;
}>;

export type QuizEs = Partial<Pick<LessonQuizQ, "q" | "choices" | "explanation">>;

// ─────────────────────────── LESSONS (basic fields) ───────────────────────────

export const lessonsEs: Record<string, LessonEs> = {
  interface: {
    title: "Interfaz + Navegación",
    tag: "Básicos",
    description: "Familiarízate con el espacio de trabajo de AutoCAD.",
    objective: "Aprende la cinta, la línea de comandos y a hacer pan/zoom con confianza.",
    steps: [
      "Abre AutoCAD y crea un dibujo nuevo con la plantilla acad.dwt.",
      "Identifica la cinta, la línea de comandos, la barra de estado y el área de dibujo.",
      "Usa la rueda del ratón para hacer ZOOM y arrastra la rueda para hacer PAN.",
      "Escribe Z, luego E y pulsa Enter para hacer ZOOM EXTENTS.",
    ],
    mistake: "Hacer clic en iconos al azar de la cinta. Concéntrate en la línea de comandos — es tu mapa.",
    challenge: "Haz pan y zoom a las cuatro esquinas de un dibujo vacío en menos de 30 segundos.",
  },
  line: {
    title: "LINE (Línea)",
    tag: "Dibujo",
    description: "Dibuja tu primer segmento recto con coordenadas escritas.",
    objective: "Usa el comando LINE con una coordenada relativa escrita.",
    steps: [
      "Escribe LINE, pulsa Enter. Haz clic en un punto inicial.",
      "Escribe @100,0 y pulsa Enter para dibujar una línea horizontal de 100 unidades.",
      "Pulsa Enter otra vez para terminar el comando LINE.",
      "Guarda el archivo como Leccion02-LINE.dwg.",
    ],
    mistake: "Olvidar la @ antes de las coordenadas relativas.",
    challenge: "Dibuja un rectángulo de 200×100 usando solo LINE y la opción C (cerrar).",
  },
  circle: {
    title: "CIRCLE (Círculo)",
    tag: "Dibujo",
    description: "Dibuja un círculo preciso indicando centro y radio.",
    objective: "Usa el comando CIRCLE con un radio escrito.",
    steps: [
      "Escribe CIRCLE (o C) y pulsa Enter.",
      "Haz clic en un punto central del área de dibujo.",
      "Escribe 50 y pulsa Enter para el radio.",
      "Ejecuta LIST y haz clic en el círculo para verificar que el radio = 50.",
    ],
    mistake: "Estimar el radio con un clic en vez de escribir un número.",
    challenge: "Dibuja tres círculos concéntricos de radio 10, 30 y 50.",
  },
  rectangle: {
    title: "RECTANGLE (Rectángulo)",
    tag: "Dibujo",
    description: "Dibuja una polilínea cerrada de cuatro lados con un solo comando.",
    objective: "Usa el comando RECTANGLE con una segunda esquina relativa escrita.",
    steps: [
      "Escribe REC y pulsa Enter.",
      "Haz clic en una primera esquina.",
      "Escribe @200,100 y pulsa Enter para la esquina opuesta.",
      "Haz clic en cualquier borde para confirmar que es una polilínea cerrada.",
    ],
    mistake: "Dibujar cuatro segmentos con LINE cuando REC habría creado una sola polilínea cerrada.",
    challenge: "Construye un marco de 400×250 con un rótulo de 400×40 anclado en la esquina inferior izquierda.",
  },
  trim: {
    title: "TRIM (Recortar)",
    tag: "Edición",
    description: "Limpia tu geometría como un profesional.",
    objective: "Usa TRIM para eliminar sobrantes entre objetos que se cruzan.",
    steps: [
      "Dibuja dos líneas que se crucen.",
      "Escribe TR y pulsa Enter.",
      "Haz clic en el segmento (o segmentos) que quieras eliminar.",
      "Pulsa Enter o Esc al terminar.",
    ],
    mistake: "En modo Estándar, pulsar Enter una sola vez — TRIM Estándar espera primero los bordes de corte, así que pulsa Enter dos veces.",
    challenge: "Dibuja una cuadrícula de tres en raya y recórtala hasta dejar un signo +.",
  },
  "move-copy": {
    title: "MOVE + COPY (Mover + Copiar)",
    tag: "Edición",
    description: "Reposiciona y duplica objetos.",
    objective: "Usa MOVE (M) y COPY (CO) con puntos base.",
    steps: [
      "Selecciona un objeto. Escribe M y pulsa Enter.",
      "Haz clic en un punto base y luego en el destino.",
      "Repite con CO para COPY.",
    ],
    mistake: "Elegir un punto base al azar — usa siempre una esquina o un punto final.",
    challenge: "Copia un círculo 5 veces en una fila horizontal, separados por 100 unidades.",
  },
  osnap: {
    title: "Precisión con OSNAP",
    tag: "Precisión",
    description: "Ajústate a la geometría exacta siempre.",
    objective: "Activa OSNAP para puntos finales, medios y centros.",
    steps: [
      "Pulsa F3 para activar OSNAP.",
      "Haz clic derecho en el icono OSNAP de la barra de estado.",
      "Activa Endpoint, Midpoint, Center e Intersection.",
      "Pasa el cursor sobre la geometría — verás marcadores de colores cuando enganches.",
    ],
    mistake: "Dibujar sin OSNAP — tu geometría nunca conectará bien.",
    challenge: "Dibuja un triángulo con los vértices anclados a tres centros de círculos existentes.",
  },
  layers: {
    title: "Fundamentos de capas",
    tag: "Organización",
    description: "Organiza tu dibujo por capas.",
    objective: "Crea capas con colores y asigna objetos a ellas.",
    steps: [
      "Escribe LA y pulsa Enter para abrir las Propiedades de capa.",
      "Crea nuevas capas: Muros (blanco), Puertas (cian), Cotas (rojo).",
      "Selecciona un objeto y elige una capa en el desplegable.",
    ],
    mistake: "Dibujar todo en la capa 0. Cambia siempre de capa primero.",
    challenge: "Mueve 3 objetos existentes a una capa nueva distinta cada uno.",
  },
  "dim-text": {
    title: "Cotas + Texto",
    tag: "Anotación",
    description: "Anota tu dibujo de forma profesional.",
    objective: "Usa DIM y TEXT para etiquetar los dibujos.",
    steps: [
      "Escribe DIM y pulsa Enter.",
      "Haz clic en dos puntos finales para acotar una línea.",
      "Escribe TEXT, elige una ubicación, pon altura 10 y escribe tu etiqueta.",
    ],
    mistake: "Texto tan pequeño que desaparece al alejar el zoom — aumenta la altura.",
    challenge: "Acota totalmente un rectángulo de 100×200 con un cuadro de rotulación.",
  },
  hatch: {
    title: "HATCH (Sombreado)",
    tag: "Relleno",
    description: "Rellena áreas cerradas con patrones.",
    objective: "Usa HATCH para rellenar regiones cerradas.",
    steps: [
      "Escribe H y pulsa Enter.",
      "Elige un patrón (por ejemplo, ANSI31).",
      "Haz clic dentro de un contorno cerrado.",
      "Pulsa Enter para confirmar.",
    ],
    mistake: "HATCH falla en formas abiertas — cierra todos los huecos primero.",
    challenge: "Sombrea un rectángulo con ANSI31 a 45 grados.",
  },
  blocks: {
    title: "BLOCKS (Bloques)",
    tag: "Reutilización",
    description: "Reutiliza geometría como un solo objeto.",
    objective: "Crea e inserta BLOCKs.",
    steps: [
      "Selecciona los objetos que quieras agrupar.",
      "Escribe B y pulsa Enter.",
      "Nombra tu bloque, elige un punto base y haz clic en OK.",
      "Escribe I para insertarlo en otro sitio.",
    ],
    mistake: "Olvidar el punto base — el bloque se insertará descentrado.",
    challenge: "Crea un bloque de silla e insértalo 4 veces alrededor de una mesa.",
  },
  join: {
    title: "JOIN (Unir)",
    tag: "Edición",
    description: "Combina segmentos separados en una sola polilínea.",
    objective: "Usa JOIN (J) para unir líneas conectadas.",
    steps: [
      "Escribe J y pulsa Enter.",
      "Selecciona todos los segmentos conectados.",
      "Pulsa Enter — se convertirán en una sola polilínea.",
    ],
    mistake: "JOIN dice '0 unidos' cuando los extremos no se tocan — usa OSNAP primero.",
    challenge: "Dibuja 4 líneas que formen un cuadrado y únelas en una sola polilínea con JOIN.",
  },
  extrude: {
    title: "EXTRUDE (Extruir)",
    tag: "3D",
    description: "Convierte formas 2D en sólidos 3D.",
    objective: "Usa EXTRUDE sobre una polilínea cerrada.",
    steps: [
      "Cambia el espacio de trabajo a Modelado 3D.",
      "Dibuja una polilínea cerrada o usa un círculo.",
      "Escribe EXT, pulsa Enter y selecciona el objeto.",
      "Escribe una altura como 50 y pulsa Enter.",
      "Escribe VS y luego C para la vista Conceptual.",
    ],
    mistake: "EXTRUDE solo funciona en formas CERRADAS — usa JOIN primero.",
    challenge: "Extruye un hexágono a 100 unidades de altura.",
  },
  "polyline-rect": {
    title: "POLYLINE en profundidad",
    tag: "Dibujo",
    description: "Dibuja geometría conectada como un solo objeto usando las opciones de PLINE.",
    objective: "Usa PL con las opciones Arco, Cerrar y Ancho.",
    steps: [
      "Escribe PL, pulsa Enter y haz clic en varios puntos para dibujar.",
      "Escribe C para cerrar de vuelta al inicio.",
      "Prueba la opción A (Arco) a mitad de la polilínea para añadir un tramo curvo.",
    ],
    mistake: "Usar LINE cuando necesitas una sola forma cerrada — mejor usa PLINE.",
    challenge: "Dibuja una forma en L con POLYLINE y ciérrala.",
  },
  "offset-mirror": {
    title: "OFFSET + MIRROR (Desplazar + Simetría)",
    tag: "Edición",
    description: "Duplica copias paralelas o reflejadas.",
    objective: "Usa OFFSET (O) y MIRROR (MI).",
    steps: [
      "Escribe O, pulsa Enter y escribe una distancia como 10.",
      "Selecciona un objeto y haz clic hacia qué lado desplazarlo.",
      "Escribe MI, selecciona los objetos y haz clic en dos puntos para definir el eje.",
    ],
    mistake: "Olvidar definir la distancia antes de seleccionar en OFFSET.",
    challenge: "Refleja medio dibujo de una mariposa para completar una simétrica.",
  },
  "fillet-chamfer": {
    title: "FILLET + CHAMFER (Empalmar + Chaflán)",
    tag: "Edición",
    description: "Redondea o bisela esquinas.",
    objective: "Usa FILLET (F) y CHAMFER (CHA).",
    steps: [
      "Escribe F, pulsa Enter, escribe R para radio y define el valor.",
      "Haz clic en dos líneas que se cruzan.",
      "Repite con CHA para esquinas biseladas.",
    ],
    mistake: "Poner radio 0 por error — la esquina simplemente queda en pico.",
    challenge: "Empalma las 4 esquinas de un rectángulo con radio 15.",
  },
  "array-review": {
    title: "ARRAY + Repaso de cotas",
    tag: "Repaso",
    description: "Domina ARRAY y repasa las cotas.",
    objective: "Usa ARRAY (AR) y revisa tu estilo de cota.",
    steps: [
      "Escribe AR, selecciona el objeto y elige Rectangular o Polar.",
      "Define filas, columnas y espaciado.",
      "Revisa el estilo de cota con el comando D.",
    ],
    mistake: "Espaciado negativo en ARRAY — se solapa todo.",
    challenge: "Haz un array polar de un círculo 8 veces alrededor de un centro.",
  },
};

// ─────────────────────────── PROJECTS ───────────────────────────

export const projectsEs: Record<string, ProjectEs> = {
  keychain: {
    title: "Llavero",
    description: "Construye tu primera forma 2D — el contorno simple de un llavero.",
    steps: [
      "Dibuja un rectángulo de 60×25 con REC.",
      "Aplica FILLET a todas las esquinas con radio 8.",
      "Añade un círculo de radio 4 cerca de un borde para el agujero de la anilla.",
      "Guarda como Keychain.dwg.",
    ],
  },
  wheel: {
    title: "Silueta de rueda",
    description: "Boceta una rueda usando círculos y ARRAY.",
    steps: [
      "Dibuja un círculo central de radio 50.",
      "Aplica OFFSET de 10 hacia afuera para la llanta.",
      "Dibuja otro círculo desde el mismo centro con radio 30.",
      "Haz un ARRAY polar de 6 círculos pequeños para los pernos.",
    ],
  },
  "phone-stand": {
    title: "Soporte para móvil",
    description: "Diseña el perfil lateral 2D de un soporte para móvil.",
    steps: [
      "Dibuja el perfil lateral triangular con POLYLINE.",
      "Aplica FILLET a la esquina trasera.",
      "Acota todos los lados.",
    ],
  },
  "car-outline": {
    title: "Silueta de coche",
    description: "Traza el perfil lateral simple de un coche.",
    steps: [
      "Dibuja el perfil de la carrocería con POLYLINE y ARC.",
      "Añade dos círculos para las ruedas.",
      "Usa MIRROR para las ventanas si hace falta.",
    ],
  },
  room: {
    title: "Plano de habitación",
    description: "Plano de planta de un dormitorio pequeño.",
    steps: [
      "Usa RECTANGLE para dibujar las paredes exteriores de la habitación.",
      "Usa TRIM para recortar un pequeño hueco en una pared para la puerta.",
      "Usa ARC para dibujar el barrido curvo de la puerta desde un lado del hueco.",
      "Inserta BLOCKS de mobiliario: cama, escritorio, silla y armario.",
      "Usa DIM para añadir las medidas alrededor de la habitación.",
    ],
  },
  bracket: {
    title: "Placa de soporte",
    description: "Placa mecánica de soporte con agujeros.",
    steps: [
      "Dibuja una placa de 200×100.",
      "Aplica FILLET a todas las esquinas con R10.",
      "Haz un ARRAY rectangular de 4 agujeros de montaje de radio 5.",
    ],
  },
};

// ─────────────────────────── RICH LESSONS ───────────────────────────

export const richLessonsEs: Record<string, RichLessonEs> = {
  interface: {
    learningObjective:
      "Al terminar esta lección podrás abrir AutoCAD, identificar cada área del espacio de trabajo y desplazarte con pan y zoom por un dibujo vacío con confianza.",
    whatItIs:
      "La interfaz de AutoCAD es el conjunto de paneles y barras que rodean el área de dibujo: la cinta (arriba), la línea de comandos (abajo), la barra de estado (muy abajo) y la propia área de dibujo. Aún no dibujarás nada — solo aprenderás dónde estás.",
    whyWhen:
      "Todos los comandos que ejecutarás viven en una de estas áreas. Si no sabes dónde está escuchando AutoCAD, harás clics al azar y sentirás que el programa se resiste. Aprende primero el mapa y después los comandos.",
    whereToFind: {
      ribbon: "Parte superior de la ventana — la banda ancha con pestañas Inicio, Insertar, Anotar, etc.",
      menu: "Menú de aplicación (la A roja grande arriba a la izquierda) para Archivo / Nuevo / Abrir / Guardar.",
      commandLine: "Anclada en la parte inferior del área de dibujo. Siempre muestra lo que AutoCAD está esperando.",
      alias: "Pulsa F2 para expandir el historial de la línea de comandos en cualquier momento.",
    },
    vocab: [
      { term: "Espacio de trabajo", definition: "Una disposición predeterminada de cinta, paneles y herramientas. Los principiantes usan 'Dibujo y anotación'." },
      { term: "Cinta", definition: "La barra de herramientas con pestañas en la parte superior. Cada pestaña agrupa comandos relacionados en paneles." },
      { term: "Línea de comandos", definition: "Una pequeña zona de texto abajo donde escribes comandos y lees los avisos." },
      { term: "Barra de estado", definition: "La barra fina de iconos conmutables en la parte muy inferior (Rejilla, Snap, OSNAP, Orto…)." },
      { term: "Área de dibujo", definition: "El gran espacio oscuro en el centro donde se dibuja la geometría." },
      { term: "Cruceta", definition: "El cursor dentro del área de dibujo, formado por dos líneas perpendiculares largas." },
      { term: "Pan (encuadre)", definition: "Deslizar la vista lateralmente sin cambiar el nivel de zoom." },
      { term: "Zoom", definition: "Acercar o alejar la cámara del dibujo." },
    ],
    beforeYouStart: [
      "Abre AutoCAD y espera a que aparezca la pestaña de Inicio.",
      "Usa un ratón con rueda de scroll funcional — el pan y el zoom dependen de ella.",
      "Cierra cualquier pop-up de tutorial para que el espacio de trabajo quede limpio.",
    ],
    detailedSteps: [
      { title: "Abrir un dibujo nuevo con la plantilla acad", instruction: "En la pestaña de Inicio, haz clic en 'Comenzar dibujo'. Si aparece un selector de plantillas, elige 'acad.dwt'.", explanation: "acad.dwt es la plantilla imperial por defecto que viene con AutoCAD. Usar una plantilla conocida hace que las lecciones coincidan con las capturas." },
      { title: "Identificar las cuatro regiones principales de la pantalla", instruction: "Mira la ventana y nombra en silencio: cinta (arriba), área de dibujo (centro), línea de comandos (justo debajo del dibujo) y barra de estado (abajo).", explanation: "Señalar cada región y nombrarla en voz alta construye memoria espacial. Aún no ejecutas ningún comando — es pura orientación." },
      { title: "Mover la vista con la rueda del ratón (PAN)", instruction: "Presiona y MANTÉN la rueda (no la gires), luego arrastra el ratón. El dibujo se desliza bajo el cursor.", explanation: "Mantener la rueda activa el PAN en tiempo real. Soltarla lo termina. Tu nivel de zoom no cambia." },
      { title: "Acercar y alejar con la rueda (ZOOM)", instruction: "Gira la rueda hacia adelante para acercar hacia el cursor. Gírala hacia atrás para alejar.", explanation: "AutoCAD hace zoom hacia la posición de la cruceta, no hacia el centro de la pantalla. Donde apuntes es adonde vas." },
      { title: "Encuadrar todo con ZOOM EXTENTS", instruction: "Haz clic dentro del área de dibujo. Escribe Z, pulsa Enter, escribe E y pulsa Enter.", explanation: "ZOOM EXTENTS (Z → E) recentra y escala la vista para que todos los objetos entren. Memorízalo — es tu botón 'estoy perdido'." },
    ],
    commonMistakes: [
      { mistake: "Hacer clic al azar en iconos de la cinta esperando que pase algo.", fix: "Lee primero la línea de comandos — te dice qué está esperando AutoCAD." },
      { mistake: "Girar la rueda esperando hacer PAN.", fix: "Girar = ZOOM. MANTENER la rueda + arrastrar = PAN." },
      { mistake: "Perder el dibujo fuera de la pantalla.", fix: "Escribe Z y luego E (ZOOM EXTENTS) para reencuadrar todo." },
    ],
    troubleshooting: [
      { problem: "La cruceta no se mueve con fluidez.", cause: "El cursor está fuera del área de dibujo.", fix: "Haz un clic dentro del área de dibujo oscura y vuelve a intentarlo." },
      { problem: "La rueda del ratón no hace nada.", cause: "MBUTTONPAN está desactivado o el controlador de la rueda está mal configurado.", fix: "Escribe MBUTTONPAN, pulsa Enter, pon el valor a 1 y pulsa Enter." },
      { problem: "Falta la línea de comandos.", cause: "Se cerró por accidente.", fix: "Pulsa Ctrl + 9 para volver a mostrarla." },
    ],
    practiceExercise: {
      title: "Recorrido por el espacio de trabajo en 60 segundos",
      steps: [
        "Abre un dibujo nuevo con acad.dwt.",
        "Señala y nombra en silencio: cinta, área de dibujo, línea de comandos y barra de estado.",
        "Mantén la rueda y haz pan hasta la esquina superior derecha.",
        "Gira la rueda hacia atrás cinco clics para alejar.",
        "Ejecuta ZOOM EXTENTS (Z → E) para recentrar.",
      ],
      success: "Puedes navegar a cualquier parte de un dibujo vacío y volver a una vista centrada en menos de un minuto.",
    },
    proTips: [
      "Haz doble clic en la rueda del ratón para ejecutar ZOOM EXTENTS sin escribir.",
      "Pulsa F2 para desplegar el historial de la línea de comandos en una ventana redimensionable — útil cuando los avisos pasan muy rápido.",
      "Pulsa Esc dos veces para cancelar cualquier comando a medias y volver a un prompt limpio.",
    ],
    relatedCommands: [
      { what: "Cambia cuánto ves del dibujo." },
      { what: "Desliza la vista sin cambiar el zoom." },
      { what: "Regenera el dibujo si las curvas se ven dentadas tras hacer zoom." },
    ],
  },

  line: {
    learningObjective:
      "Al terminar esta lección podrás ejecutar el comando LINE y dibujar un segmento horizontal preciso usando coordenadas escritas.",
    whatItIs:
      "LINE crea uno o varios segmentos rectos. Cada clic (o coordenada escrita) coloca un extremo; AutoCAD sigue pidiendo el siguiente punto hasta que pulses Enter o Esc.",
    whyWhen:
      "LINE es el comando de dibujo más común. Úsalo cuando necesites geometría recta de un solo segmento — límites, líneas auxiliares, bocetos.",
    whereToFind: {
      ribbon: "Pestaña Inicio → panel Dibujo → botón Línea (el icono del segmento diagonal).",
      menu: "Menú Dibujo → Línea.",
      commandLine: "Escribe LINE y pulsa Enter.",
      alias: "L (y luego Enter).",
    },
    vocab: [
      { term: "Punto final (endpoint)", definition: "Cualquiera de los dos extremos de un segmento." },
      { term: "Coordenada absoluta", definition: "Un punto medido desde el origen 0,0. Se escribe como X,Y — por ejemplo 100,50." },
      { term: "Coordenada relativa", definition: "Un punto medido desde el punto anterior. Se escribe con @ delante — por ejemplo @100,0." },
      { term: "Entrada dinámica", definition: "Un tooltip en pantalla junto a la cruceta que te deja escribir distancia + ángulo directamente." },
      { term: "Rastreo polar", definition: "Guía de alineación en pantalla que ancla el cursor a ángulos fijos (0°, 90°, 45°…)." },
    ],
    beforeYouStart: [
      "Empieza un dibujo nuevo con la plantilla acad.dwt.",
      "Pulsa F12 una vez si la entrada dinámica está desactivada (el tooltip debe aparecer junto a la cruceta).",
      "Asegúrate de que ORTO esté activado — pulsa F8 si hace falta (el icono de la barra de estado se pone azul).",
    ],
    detailedSteps: [
      { title: "Iniciar el comando LINE", instruction: "Escribe LINE, pulsa Enter (o L, Enter).", explanation: "La línea de comandos ahora dice 'LINE Precise primer punto:'." },
      { title: "Haz clic en el punto inicial", instruction: "Haz clic en cualquier parte del área de dibujo para colocar el primer punto.", explanation: "AutoCAD ahora te pide 'Precise siguiente punto:' y una vista previa de la línea sigue al cursor." },
      { title: "Escribe una coordenada relativa", instruction: "Escribe @100,0 y pulsa Enter.", explanation: "@100,0 significa 'muévete 100 unidades a la derecha y 0 hacia arriba desde el punto anterior'. Se dibuja una línea horizontal exacta." },
      { title: "Terminar el comando", instruction: "Pulsa Enter otra vez para terminar LINE.", explanation: "Enter en un prompt limpio de LINE finaliza el comando. Un segundo Enter repetiría el último comando." },
      { title: "Guarda tu trabajo", instruction: "Pulsa Ctrl + S. Nombra el archivo Leccion02-LINE.dwg.", explanation: "Guardar temprano y a menudo evita pérdidas por cierres inesperados." },
    ],
    commonMistakes: [
      { mistake: "Olvidar la @ y obtener una línea en un lugar inesperado.", fix: "Escribe siempre @ antes de una coordenada relativa, por ejemplo @100,0." },
      { mistake: "Hacer clic en vez de escribir coordenadas.", fix: "Escribe números para dimensiones exactas — nunca confíes en el ojo para geometría de ingeniería." },
      { mistake: "Dibujar cuatro líneas cuando necesitas una polilínea cerrada.", fix: "Usa RECTANG o cierra con la opción C dentro de LINE." },
    ],
    troubleshooting: [
      { problem: "La línea no se ve.", cause: "Estás fuera del zoom, o la línea es muy pequeña.", fix: "Ejecuta ZOOM EXTENTS (Z → E)." },
      { problem: "La línea sale en un ángulo raro.", cause: "ORTO está desactivado y arrastraste con el ratón.", fix: "Pulsa F8 para activar ORTO o escribe coordenadas precisas." },
      { problem: "Enter dibuja otra línea.", cause: "Enter en un prompt limpio repite el último comando.", fix: "Pulsa Esc para limpiar y comienza el siguiente comando." },
    ],
    practiceExercise: {
      title: "Rectángulo con LINE",
      steps: [
        "Ejecuta LINE. Haz clic en un punto inicial.",
        "Escribe @200,0 Enter.",
        "Escribe @0,100 Enter.",
        "Escribe @-200,0 Enter.",
        "Escribe C Enter para cerrar el rectángulo.",
      ],
      success: "Un rectángulo de 200×100 dibujado con precisión usando solo LINE y la opción Cerrar.",
    },
    proTips: [
      "Dentro de LINE, escribe U para deshacer solo el último segmento sin salir del comando.",
      "Usa la entrada dinámica (F12) para escribir distancia y ángulo en el propio prompt sin la @.",
      "Combina F8 (ORTO) con distancias escritas para líneas ortogonales rápidas.",
    ],
    relatedCommands: [
      { what: "Dibuja una polilínea de segmentos y arcos como un solo objeto." },
      { what: "Dibuja un rectángulo cerrado en un solo comando." },
      { what: "Dibuja una línea auxiliar infinita." },
    ],
  },

  circle: {
    learningObjective:
      "Al terminar esta lección podrás ejecutar el comando CIRCLE y dibujar un círculo con un radio exacto alrededor de un centro elegido.",
    whatItIs:
      "CIRCLE crea un único objeto circular. Por defecto pide primero el centro y luego el radio. Existen otras opciones (2 puntos, 3 puntos, tangente-tangente-radio) pero el flujo centro-radio es la base.",
    whyWhen:
      "Usa CIRCLE para agujeros, ruedas, tornillos, arcos decorativos y cualquier forma redonda cerrada.",
    whereToFind: {
      ribbon: "Pestaña Inicio → panel Dibujo → menú Círculo → 'Centro, Radio'.",
      menu: "Menú Dibujo → Círculo → Centro, Radio.",
      commandLine: "Escribe CIRCLE y pulsa Enter.",
      alias: "C (y luego Enter).",
    },
    vocab: [
      { term: "Centro", definition: "El punto medio exacto del círculo, equidistante de cada punto de la curva." },
      { term: "Radio", definition: "La distancia del centro al borde." },
      { term: "Diámetro", definition: "La distancia a través del círculo pasando por el centro. Diámetro = 2 × radio." },
      { term: "Cuadrante", definition: "Uno de los cuatro puntos cardinales de un círculo (0°, 90°, 180°, 270°). OSNAP puede engancharlos." },
    ],
    beforeYouStart: [
      "Abre un dibujo nuevo con acad.dwt.",
      "Confirma que OSNAP está activo (F3) para poder enganchar el centro a un punto existente si lo necesitas.",
      "Decide si quieres especificar radio o diámetro — esta lección usa radio.",
    ],
    detailedSteps: [
      { title: "Iniciar el comando CIRCLE", instruction: "Escribe CIRCLE y pulsa Enter (o C, Enter).", explanation: "La línea de comandos dice 'CIRCLE Precise el centro o [3P/2P/Ttr]:'." },
      { title: "Haz clic en el centro", instruction: "Haz clic en cualquier parte del área de dibujo para colocar el centro.", explanation: "AutoCAD pide 'Precise el radio o [Diámetro]:' y una vista previa sigue al cursor." },
      { title: "Escribe el radio", instruction: "Escribe 50 y pulsa Enter.", explanation: "AutoCAD dibuja un círculo con radio de 50 unidades alrededor del centro y termina el comando." },
      { title: "Confirma el tamaño con LIST", instruction: "Escribe LIST, pulsa Enter, haz clic en el círculo, pulsa Enter.", explanation: "LIST imprime las propiedades del objeto en el historial (F2). Verás RADIUS = 50.0000 y las coordenadas del centro." },
    ],
    commonMistakes: [
      { mistake: "Escribir el diámetro cuando AutoCAD pide el radio.", fix: "Divide el valor por dos, o escribe D en el prompt del radio, Enter, y luego el diámetro." },
      { mistake: "Elegir un centro con OSNAP desactivado y obtener un círculo desalineado.", fix: "Pulsa F3 para activar OSNAP y engancha a un endpoint, midpoint o intersección existente." },
      { mistake: "Hacer clic en vez de escribir el radio y obtener un tamaño aleatorio.", fix: "Siempre escribe un radio numérico — no confíes en el ojo para geometría de ingeniería." },
    ],
    troubleshooting: [
      { problem: "El círculo es enorme o microscópico.", cause: "El nivel de zoom hizo que el radio escrito no coincida con lo esperado.", fix: "Ejecuta ZOOM EXTENTS (Z → E) para reencuadrar." },
      { problem: "AutoCAD pide diámetro en vez de radio.", cause: "El último CIRCLE cambió el valor por defecto a Diámetro.", fix: "En el prompt escribe R y pulsa Enter para volver a radio." },
      { problem: "Pulsar Enter dibuja otro círculo.", cause: "Enter en un prompt limpio repite el último comando.", fix: "Pulsa Esc para limpiar y comienza deliberadamente el siguiente comando." },
    ],
    practiceExercise: {
      title: "Círculos concéntricos",
      steps: [
        "Dibuja un círculo de radio 50 en cualquier punto.",
        "Ejecuta CIRCLE de nuevo. En el prompt del centro, engancha al centro del primer círculo (OSNAP → Center).",
        "Escribe radio 30 y pulsa Enter.",
        "Repite con radio 10.",
      ],
      success: "Ves tres círculos perfectamente concéntricos (10, 30, 50). Ejecuta LIST en cualquiera para confirmar el radio.",
    },
    proTips: [
      "En el prompt del radio, escribe D y Enter para cambiar a modo Diámetro solo para ese círculo.",
      "Dentro de CIRCLE, escribe 2P para dibujar un círculo por dos puntos (los dos clics forman el diámetro).",
      "Usa la opción Ttr para dibujar un círculo tangente a dos objetos existentes con un radio dado.",
    ],
    relatedCommands: [
      { what: "Dibuja una porción de un círculo." },
      { what: "Dibuja un óvalo definido por dos ejes." },
      { what: "Dibuja un anillo relleno (dos círculos concéntricos)." },
    ],
  },

  rectangle: {
    learningObjective:
      "Al terminar esta lección podrás ejecutar el comando RECTANGLE y dibujar un rectángulo con dimensiones exactas como una sola polilínea cerrada.",
    whatItIs:
      "RECTANGLE (alias REC, comando RECTANG) crea una polilínea rectangular cerrada preguntando por dos esquinas opuestas. Como el resultado es una polilínea, puedes empalmar, sombrear y desplazar todo en un clic.",
    whyWhen:
      "Usa RECTANGLE siempre que necesites una forma cerrada de cuatro lados limpia — muros, placas, cajetines, viewports — sin coser cuatro segmentos LINE.",
    whereToFind: {
      ribbon: "Pestaña Inicio → panel Dibujo → botón Rectángulo.",
      menu: "Menú Dibujo → Rectángulo.",
      commandLine: "Escribe RECTANG (o REC) y pulsa Enter.",
      alias: "REC (y luego Enter).",
    },
    vocab: [
      { term: "Polilínea", definition: "Un objeto único formado por segmentos rectos y/o arcos conectados." },
      { term: "Forma cerrada", definition: "Una forma cuyo final coincide con su inicio, sin huecos. Necesaria para HATCH, EXTRUDE y cálculo de área." },
      { term: "Primera esquina", definition: "Cualquier esquina del rectángulo — normalmente la inferior izquierda." },
      { term: "Esquina opuesta", definition: "La esquina diagonalmente opuesta que define ancho y alto." },
      { term: "Opción Dimensiones", definition: "Una opción dentro de RECTANG que te deja escribir largo y ancho en lugar de elegir la segunda esquina." },
    ],
    beforeYouStart: [
      "Empieza un dibujo nuevo con acad.dwt.",
      "Pulsa F3 para asegurar OSNAP activo — útil si vas a enganchar la primera esquina a geometría existente.",
      "Decide el ancho y alto. Esta lección usa 200 × 100.",
    ],
    detailedSteps: [
      { title: "Iniciar el comando RECTANGLE", instruction: "Escribe REC y pulsa Enter.", explanation: "La línea de comandos dice 'RECTANG Precise primer punto de esquina o [Chaflán/Elevación/eMpalme/Grosor/Anchura]:'." },
      { title: "Elige la primera esquina", instruction: "Haz clic en cualquier lugar del área de dibujo para colocar la primera esquina.", explanation: "AutoCAD ahora pide 'Precise esquina opuesta o [Área/Dimensiones/Rotación]:' y una vista previa sigue al cursor." },
      { title: "Escribe la segunda esquina relativa", instruction: "Escribe @200,100 y pulsa Enter.", explanation: "@200,100 significa 'vete 200 unidades a la derecha y 100 hacia arriba desde la primera esquina'. El rectángulo se cierra como una sola polilínea." },
      { title: "Verifica que es una polilínea cerrada", instruction: "Pasa el cursor por cualquier borde — todo el rectángulo debería resaltarse a la vez. Haz clic para confirmar.", explanation: "Si solo se resalta un borde, dibujaste cuatro líneas separadas por error. RECTANGLE siempre produce una sola polilínea." },
    ],
    commonMistakes: [
      { mistake: "Olvidar el símbolo @ y obtener un rectángulo en el sitio equivocado.", fix: "Escribe siempre @ antes de desplazamientos relativos, por ejemplo @200,100." },
      { mistake: "Usar LINE cuatro veces en vez de REC.", fix: "Usa REC para que el resultado sea una sola polilínea cerrada — mucho más fácil de empalmar, sombrear y desplazar." },
      { mistake: "Elegir esquinas con el ratón en vez de escribir dimensiones.", fix: "Dentro de REC, escribe D, Enter, y luego largo y ancho para un tamaño exacto." },
    ],
    troubleshooting: [
      { problem: "Los bordes salen achaflanados en vez de rectos.", cause: "La opción Chaflán estaba activa de un RECTANG anterior.", fix: "Reinicia REC, escribe C, Enter, y pon ambas distancias de chaflán a 0." },
      { problem: "Las esquinas salen redondeadas.", cause: "La opción eMpalme estaba activa.", fix: "Reinicia REC, escribe F, Enter, y pon el radio de empalme a 0." },
      { problem: "Los bordes son inesperadamente gruesos.", cause: "La opción Anchura tenía un valor distinto de cero.", fix: "Reinicia REC, escribe W, Enter, y pon la anchura a 0." },
    ],
    practiceExercise: {
      title: "Marco con rotulación",
      steps: [
        "Dibuja un rectángulo de 400 × 250 como el borde exterior.",
        "Ejecuta REC de nuevo. Engancha la primera esquina al endpoint inferior izquierdo del rectángulo exterior.",
        "Escribe @400,40 y Enter para crear un rótulo de 400 × 40 en la parte inferior.",
      ],
      success: "Dos polilíneas cerradas limpias: un marco exterior y un rótulo apilado abajo a la izquierda, perfectamente alineados.",
    },
    proTips: [
      "Dentro de REC, escribe D para Dimensiones y así introducir largo y ancho en prompts separados.",
      "Dentro de REC, escribe R para Rotación y dibujar el rectángulo en cualquier ángulo sin girarlo después.",
      "EXPLODE un rectángulo solo cuando de verdad necesites editar un lado por separado — pierdes la polilínea única.",
    ],
    relatedCommands: [
      { what: "Dibuja un polígono regular (5, 6, 8 lados…) por centro y radio." },
      { what: "Dibuja una polilínea conectada arbitraria." },
      { what: "Crea una copia paralela del rectángulo por dentro o por fuera." },
    ],
  },

  trim: {
    learningObjective:
      "Al terminar esta lección podrás ejecutar el comando TRIM y eliminar limpiamente los sobrantes entre objetos que se cruzan.",
    whatItIs:
      "TRIM acorta un objeto para que termine exactamente en un borde de corte — otro objeto que lo cruza. Lo que hagas clic entre (o más allá, según el modo) de los bordes de corte se elimina.",
    whyWhen:
      "Usa TRIM cuando líneas, arcos o círculos sobresalen — un caso típico es limpiar una cuadrícula de tres en raya hasta dejar un +, o cortar una puerta en una pared.",
    whereToFind: {
      ribbon: "Pestaña Inicio → panel Modificar → botón Recortar.",
      menu: "Menú Modificar → Recortar.",
      commandLine: "Escribe TRIM y pulsa Enter.",
      alias: "TR (y luego Enter).",
    },
    vocab: [
      { term: "Borde de corte", definition: "Un objeto que define dónde ocurre el recorte. Cualquier objeto que cruce el segmento vale." },
      { term: "Objeto a recortar", definition: "La parte de geometría en la que haces clic para eliminarla. Debe estar entre bordes (modo Estándar) o en cualquier parte (modo Rápido)." },
      { term: "Modo Rápido", definition: "El predeterminado en AutoCAD moderno: todos los objetos visibles actúan como borde; solo haces clic en lo que quieres borrar." },
      { term: "Modo Estándar", definition: "Comportamiento clásico: primero eliges los bordes de corte, pulsas Enter y luego haces clic en los segmentos." },
      { term: "EXTEND", definition: "El inverso de TRIM — alarga un objeto para que llegue a otro." },
    ],
    beforeYouStart: [
      "Abre un dibujo nuevo y dibuja dos LINEs que se crucen claramente.",
      "Confirma que OSNAP está activo (F3) para que los clics futuros se comporten bien.",
      "Comprueba en qué modo TRIM estás. El predeterminado en AutoCAD 2024+ es Rápido.",
    ],
    detailedSteps: [
      { title: "Preparar dos líneas que se cruzan", instruction: "Escribe LINE, Enter. Dibuja una línea horizontal. Enter para terminar. Ejecuta LINE otra vez y dibuja una línea vertical que cruce la primera.", explanation: "TRIM necesita dos objetos que se corten. Sin nada contra qué cortar, el comando no hace nada." },
      { title: "Iniciar el comando TRIM", instruction: "Escribe TR y pulsa Enter.", explanation: "En modo Rápido, todo objeto visible ya actúa como borde de corte. La línea de comandos pide qué segmento eliminar." },
      { title: "Haz clic en los segmentos a eliminar", instruction: "Haz clic en la parte de la línea horizontal que sobresale por la línea vertical. Repite en el otro lado.", explanation: "Cada clic elimina el segmento entre los bordes más cercanos. El resto de la geometría se queda." },
      { title: "Terminar el comando", instruction: "Pulsa Enter o Esc.", explanation: "TRIM sigue activo para que puedas seguir haciendo clic. Pulsa Enter (o Esc) para terminar." },
      { title: "Cambiar a modo Estándar si lo necesitas", instruction: "Dentro de TRIM, escribe O (moDo), Enter, luego S (Estándar), Enter.", explanation: "El modo Estándar es el flujo clásico: elige bordes primero, Enter y luego clic en segmentos. Útil con muchos objetos superpuestos." },
    ],
    commonMistakes: [
      { mistake: "En modo Estándar, pulsar Enter una sola vez y no obtener resultado.", fix: "Pulsa Enter DOS veces — el segundo Enter selecciona todos los objetos visibles como bordes de corte." },
      { mistake: "Hacer clic en un segmento que no tiene borde que lo cruce.", fix: "Asegúrate de que otro objeto cruce el segmento, o usa EXTEND si querías alargar en vez de recortar." },
      { mistake: "Recortar el lado equivocado.", fix: "Pulsa Ctrl + Z para deshacer solo el último recorte sin salir del comando, y clic en la pieza correcta." },
    ],
    troubleshooting: [
      { problem: "No pasa nada al hacer clic.", cause: "El cursor no está sobre un segmento recortable o no hay borde de corte.", fix: "Pasa el cursor hasta que el segmento se marque en gris, o añade un objeto que lo cruce." },
      { problem: "TRIM eliminó demasiado o una línea entera desapareció.", cause: "No había bordes de corte entre el inicio y el final de la línea.", fix: "Pulsa Ctrl + Z dentro del comando para deshacer y dibuja primero el objeto de corte." },
      { problem: "Estoy en el modo equivocado y quiero el comportamiento clásico.", cause: "AutoCAD recuerda el último modo usado.", fix: "Dentro de TRIM escribe O, Enter, S, Enter para cambiar a Estándar." },
    ],
    practiceExercise: {
      title: "De tres en raya a signo +",
      steps: [
        "Dibuja cuatro LINEs que formen un # (tres en raya).",
        "Ejecuta TRIM (TR, Enter).",
        "Haz clic en cada uno de los ocho sobrantes alrededor del cuadrado central.",
        "Pulsa Enter para terminar.",
      ],
      success: "Solo queda el signo + central — sin sobrantes, sin huecos, sin líneas sueltas.",
    },
    proTips: [
      "Mantén Shift al hacer clic dentro de TRIM para EXTENDER en vez de recortar — un comando, dos comportamientos.",
      "Usa la opción Cerca (escribe F dentro de TRIM) para dibujar una línea que recorte todo lo que cruce en un arrastre.",
      "Usa la opción Captura (escribe C) para seleccionar muchos segmentos a la vez con un rectángulo.",
    ],
    relatedCommands: [
      { what: "Alarga un objeto para que llegue a otro — el inverso de TRIM." },
      { what: "Borra un objeto entero directamente." },
      { what: "Parte un objeto en uno o dos puntos indicados." },
    ],
  },

  "move-copy": {
    learningObjective:
      "Al terminar esta lección podrás reposicionar y duplicar cualquier objeto con precisión usando un punto base enganchado y un desplazamiento escrito.",
    whatItIs:
      "MOVE traslada uno o varios objetos seleccionados desde un punto base a un destino. COPY hace lo mismo pero deja el original y puede repetir varias copias en el mismo comando.",
    whyWhen:
      "Usa MOVE cuando la geometría está en el sitio equivocado. Usa COPY cuando necesites un duplicado idéntico — una segunda ventana, una fila de tornillos, un detalle repetido.",
    whereToFind: {
      ribbon: "Pestaña Inicio → panel Modificar → botones Mover / Copiar.",
      menu: "Menú Modificar → Mover; Menú Modificar → Copiar.",
      commandLine: "Escribe MOVE o COPY y pulsa Enter.",
      alias: "M para MOVE, CO para COPY.",
    },
    vocab: [
      { term: "Punto base", definition: "El asa por la que 'coges' el objeto al mover o copiar." },
      { term: "Segundo punto / desplazamiento", definition: "Dónde termina el punto base tras el movimiento." },
      { term: "Conjunto de selección", definition: "La colección de objetos que tienes seleccionados." },
    ],
    beforeYouStart: [
      "Ten al menos un objeto dibujado en pantalla.",
      "Activa OSNAP (F3) para que el punto base caiga sobre un endpoint o esquina real.",
      "Pulsa Esc dos veces para limpiar cualquier selección previa antes de empezar.",
    ],
    detailedSteps: [
      { title: "Inicia el comando MOVE", instruction: "Escribe M y pulsa Enter.", explanation: "La línea de comandos dice 'Precise punto base o [Desplazamiento]:'. AutoCAD espera el asa." },
      { title: "Selecciona el objeto que quieres mover", instruction: "Haz clic en el objeto una vez para que muestre los grips azules.", explanation: "Seleccionar primero hace que MOVE use el conjunto actual en vez de pedir uno." },
      { title: "Elige un punto base enganchado", instruction: "Pasa el cursor sobre una esquina o endpoint hasta que aparezca el marcador verde y haz clic.", explanation: "Enganchar a geometría real te da un desplazamiento preciso y repetible — no un ajuste visual." },
      { title: "Especifica el destino", instruction: "Haz clic en la nueva ubicación, o escribe una coordenada relativa como @100,0 y pulsa Enter.", explanation: "Las coordenadas escritas mueven una distancia exacta; los puntos clicados te dejan enganchar a geometría existente." },
      { title: "Duplica con COPY", instruction: "Pulsa Esc, selecciona el objeto otra vez, escribe CO, Enter. Repite los pasos 3 y 4 — COPY sigue pidiendo más destinos hasta que pulses Enter.", explanation: "COPY replica el flujo de MOVE pero sin destruir el original y puede colocar múltiples copias en un mismo comando." },
    ],
    commonMistakes: [
      { mistake: "Elegir un punto vacío al azar como punto base.", fix: "Engancha siempre a una esquina, endpoint, midpoint o centro para que el movimiento sea preciso." },
      { mistake: "Usar MOVE cuando querías conservar el original.", fix: "Pulsa Ctrl + Z y vuelve a ejecutar con COPY (CO)." },
      { mistake: "Pulsar Enter demasiado pronto dentro de COPY.", fix: "Dentro de COPY, Enter termina el comando — sigue haciendo clic en destinos para colocar más copias." },
    ],
    troubleshooting: [
      { problem: "AutoCAD pide 'Selecciona objetos' aunque ya elegí uno.", cause: "La selección se perdió al iniciar el comando.", fix: "Haz clic en el objeto, LUEGO escribe M. O selecciónalo otra vez en el prompt." },
      { problem: "El objeto saltó a una ubicación extraña.", cause: "La entrada dinámica interpretó un clic como coordenada absoluta.", fix: "Escribe @x,y para un desplazamiento relativo, o engancha a un punto conocido." },
    ],
    practiceExercise: {
      title: "Cinco círculos en fila, separados 100",
      steps: [
        "Dibuja un círculo de radio 20.",
        "Escribe CO, Enter. Selecciona el círculo. Pulsa Enter.",
        "Elige su centro como punto base.",
        "Escribe @100,0 Enter, @200,0 Enter, @300,0 Enter, @400,0 Enter.",
        "Pulsa Enter para terminar COPY.",
      ],
      success: "Cinco círculos idénticos forman una fila horizontal perfectamente espaciada.",
    },
    proTips: [
      "Dentro de COPY escribe A (Array) para soltar copias con un espaciado fijo automáticamente.",
      "Mantén Ctrl al arrastrar los grips azules para un movimiento visual rápido sin escribir.",
      "Usa 0,0 como base y una coordenada real como destino para colocar objetos de forma absoluta.",
    ],
    relatedCommands: [
      { what: "Mueve una parte de un objeto manteniendo la conexión con el resto." },
      { what: "Rota los objetos seleccionados alrededor de un punto base." },
      { what: "Refleja una copia a través de una línea." },
    ],
  },

  osnap: {
    learningObjective:
      "Al terminar podrás activar Object Snap, elegir los modos correctos y colocar el cursor sobre geometría exacta de forma consistente.",
    whatItIs:
      "OSNAP (Object Snap) hace que el cursor salte a puntos significativos de la geometría existente — endpoints, midpoints, centros, intersecciones — en vez de a un píxel aproximado.",
    whyWhen:
      "Todo dibujo necesita geometría que realmente conecte. Sin OSNAP, los extremos caen ligeramente desalineados y TRIM, JOIN, HATCH y EXTRUDE fallan más tarde.",
    whereToFind: {
      ribbon: "Barra de estado → icono Object Snap (un cuadrado con un punto).",
      menu: "Clic derecho en el icono Object Snap → Configuración de Object Snap.",
      commandLine: "Escribe OSNAP y pulsa Enter para abrir el diálogo.",
      alias: "F3 activa/desactiva OSNAP.",
    },
    vocab: [
      { term: "Endpoint", definition: "Cualquier extremo de una línea, arco o polilínea." },
      { term: "Midpoint", definition: "El punto medio exacto de un segmento." },
      { term: "Center", definition: "El centro de un círculo, arco o elipse." },
      { term: "Intersection", definition: "El punto donde dos objetos se cruzan." },
      { term: "Marcador", definition: "El glifo de color que aparece bajo el cursor cuando encuentra un snap." },
    ],
    beforeYouStart: [
      "Ten varias líneas y círculos ya dibujados que se corten.",
      "Pulsa F3 una vez y observa el icono de la barra de estado — debe iluminarse en azul cuando OSNAP está activo.",
      "Pulsa F12 para que la entrada dinámica muestre el tooltip de snap junto a la cruceta.",
    ],
    detailedSteps: [
      { title: "Activar OSNAP", instruction: "Pulsa F3. El icono de Object Snap en la barra de estado se pone azul.", explanation: "F3 es el interruptor maestro. Sin él, ningún modo de snap dispara." },
      { title: "Abrir la configuración de snap", instruction: "Clic derecho en el icono Object Snap y elige 'Configuración de Object Snap…'.", explanation: "El diálogo muestra cada modo de snap disponible con una casilla." },
      { title: "Activar los esenciales", instruction: "Marca Endpoint, Midpoint, Center e Intersection. Haz clic en OK.", explanation: "Estos cuatro cubren el 90 % de los snaps y rara vez chocan entre sí." },
      { title: "Pasa el cursor y observa el marcador", instruction: "Inicia cualquier comando (por ejemplo LINE) y pasa el cursor cerca de un endpoint existente. Aparece un cuadrado de color.", explanation: "Cada modo tiene una forma distinta — cuadrado para endpoint, triángulo para midpoint, círculo para centro." },
      { title: "Haz clic para confirmar el snap", instruction: "Haz clic mientras el marcador esté visible. El punto cae exactamente sobre esa geometría.", explanation: "Si haces clic sin marcador, confirmas el píxel del cursor — no el punto enganchado." },
    ],
    commonMistakes: [
      { mistake: "Dibujar sin F3 y luego preguntarte por qué JOIN falla.", fix: "Revisa siempre el icono Object Snap antes de empezar." },
      { mistake: "Activar todos los modos de snap a la vez.", fix: "Demasiados modos se pelean. Deja cuatro: Endpoint, Midpoint, Center, Intersection." },
      { mistake: "Hacer clic antes de que aparezca el marcador.", fix: "Espera al marcador de color. Si no está, no hiciste snap." },
    ],
    troubleshooting: [
      { problem: "No aparecen marcadores.", cause: "OSNAP está desactivado o ningún modo está marcado.", fix: "Pulsa F3 y en la configuración marca al menos Endpoint y Midpoint." },
      { problem: "El marcador aparece en el punto equivocado.", cause: "Varios modos coinciden en geometría densa.", fix: "Pulsa Tab para ciclar entre candidatos cercanos." },
    ],
    practiceExercise: {
      title: "Triángulo enganchado a tres círculos",
      steps: [
        "Dibuja tres círculos en posiciones aleatorias.",
        "Pulsa F3 para confirmar OSNAP activo.",
        "Ejecuta LINE y engancha el primer punto al centro del primer círculo.",
        "Engancha los otros dos puntos a los otros dos centros.",
        "Escribe C, Enter para cerrar el triángulo.",
      ],
      success: "Un triángulo cuyos tres vértices caen exactamente en los tres centros — sin desalineaciones.",
    },
    proTips: [
      "Mantén Shift + clic derecho durante cualquier comando para un menú de snap de un solo uso.",
      "Pulsa Tab al pasar cerca de geometría superpuesta para ciclar entre candidatos.",
      "Activa el rastreo Polar (F10) junto con OSNAP para snaps precisos en ángulos.",
    ],
    relatedCommands: [
      { what: "Abre directamente el diálogo de configuración de snap." },
      { what: "Rastreo de object snap — extiende las alineaciones por la pantalla." },
      { what: "Bloquea el cursor a horizontal o vertical." },
    ],
  },

  layers: {
    learningObjective:
      "Al terminar podrás crear capas con nombre, asignarles color y meter objetos en ellas para que tu dibujo esté organizado y bajo control.",
    whatItIs:
      "Una capa es un contenedor con nombre para la geometría. Cada capa tiene color, tipo de línea, grosor y estado de visibilidad. Todo objeto en AutoCAD pertenece a exactamente una capa.",
    whyWhen:
      "Las capas te dejan mostrar/ocultar categorías enteras de geometría, cambiar su color globalmente o bloquearlas. Sin capas, los dibujos complejos son inmanejables.",
    whereToFind: {
      ribbon: "Pestaña Inicio → panel Capas → botón Propiedades de capa.",
      menu: "Menú Formato → Capa.",
      commandLine: "Escribe LAYER y pulsa Enter.",
      alias: "LA (y luego Enter).",
    },
    vocab: [
      { term: "Capa", definition: "Un grupo con nombre que controla color, tipo de línea y visibilidad de los objetos que contiene." },
      { term: "Capa actual", definition: "La capa en la que aterrizan los objetos recién dibujados." },
      { term: "Inutilizar (Freeze)", definition: "Ocultar y saltarse una capa por completo — más rápido que desactivarla." },
      { term: "Bloquear (Lock)", definition: "Hace la capa visible pero no editable." },
      { term: "Capa 0", definition: "La capa inicial por defecto. Resérvala para bloques, no para geometría normal." },
    ],
    beforeYouStart: [
      "Abre un dibujo con al menos varios objetos.",
      "Decide qué categorías tienes — muros, puertas, cotas, texto…",
      "Elige un color para cada categoría antes de empezar para que sea consistente.",
    ],
    detailedSteps: [
      { title: "Abrir el Administrador de propiedades de capa", instruction: "Escribe LA y pulsa Enter.", explanation: "Se abre un panel anclado con todas las capas del dibujo." },
      { title: "Crear una nueva capa", instruction: "Haz clic en el icono 'Nueva capa' (estrella amarilla). Escribe un nombre como Muros y pulsa Enter.", explanation: "La capa nueva hereda las propiedades por defecto — luego cambias color y tipo de línea." },
      { title: "Asignar un color", instruction: "Haz clic en el cuadro de color junto a Muros. Elige blanco. Haz clic en OK.", explanation: "El color es cómo separas visualmente las capas en pantalla y al plotear." },
      { title: "Repite para más capas", instruction: "Crea Puertas (cian) y Cotas (rojo) del mismo modo.", explanation: "Unas pocas capas bien nombradas superan a decenas de vagas." },
      { title: "Asignar un objeto a una capa", instruction: "Cierra el panel. Haz clic en un muro. En el desplegable de Capa de la pestaña Inicio, elige Muros.", explanation: "El objeto adopta el color, tipo de línea y visibilidad de esa capa." },
      { title: "Establece la capa actual", instruction: "Con nada seleccionado, elige Muros en el desplegable. La geometría nueva caerá en Muros.", explanation: "Establece siempre la capa actual ANTES de dibujar — corregirlo después es tedioso." },
    ],
    commonMistakes: [
      { mistake: "Dibujar todo en la capa 0.", fix: "Establece primero una capa actual con significado, o mueve los objetos a una después." },
      { mistake: "Nombrar capas Capa1, Capa2…", fix: "Usa nombres de categoría — Muros, Puertas, Sombreado, Texto — tu yo futuro te lo agradecerá." },
      { mistake: "Aplicar colores 'porobjeto' que ignoran la capa.", fix: "Deja el color como PorCapa para que cambiar el color de la capa actualice todo junto." },
    ],
    troubleshooting: [
      { problem: "Veo una capa pero no puedo editarla.", cause: "La capa está bloqueada.", fix: "Haz clic en el icono del candado junto a la capa en Propiedades de capa." },
      { problem: "Asigné una capa pero el color no cambió.", cause: "El color del objeto está anulado directamente, no PorCapa.", fix: "Selecciona el objeto, abre Propiedades (Ctrl + 1) y pon Color = PorCapa." },
    ],
    practiceExercise: {
      title: "Limpieza en tres capas",
      steps: [
        "Abre un dibujo o dibuja tres categorías de objetos en la capa 0.",
        "Crea Muros (blanco), Puertas (cian), Cotas (rojo).",
        "Selecciona cada objeto y asígnalo a la capa correcta.",
        "Apaga Puertas — solo deben verse muros y cotas.",
      ],
      success: "Cada objeto vive en una capa con nombre, y activar/desactivar una capa oculta o muestra solo esa categoría.",
    },
    proTips: [
      "Escribe LAYISO y elige un objeto para aislar al instante solo su capa.",
      "Usa LAYMCH para copiar la capa de un objeto a otro haciendo clic.",
      "Bloquea las capas de fondo (por ejemplo, un xref) para que se vean pero no puedan moverse por accidente.",
    ],
    relatedCommands: [
      { what: "Aísla la capa del objeto elegido — oculta las demás." },
      { what: "Mueve objetos a la capa de otro objeto elegido." },
      { what: "Apaga la capa del objeto elegido." },
    ],
  },

  "dim-text": {
    learningObjective:
      "Al terminar podrás acotar una línea medida y añadir una etiqueta de texto legible en un dibujo.",
    whatItIs:
      "DIM crea objetos de cota que muestran automáticamente la distancia medida entre dos puntos. TEXT coloca una línea única de texto en una altura y ubicación elegidas.",
    whyWhen:
      "La geometría por sí sola no es un plano — fabricantes, constructores y revisores necesitan números y etiquetas. DIM y TEXT convierten un boceto en un documento comunicable.",
    whereToFind: {
      ribbon: "Pestaña Anotar → panel Cotas → botón Cota; panel Anotación → botón Texto.",
      menu: "Menú Cotas → Cota; Menú Dibujo → Texto → Una línea.",
      commandLine: "Escribe DIM o TEXT y pulsa Enter.",
      alias: "DIM para cota, TEXT para texto de una línea.",
    },
    vocab: [
      { term: "Estilo de cota", definition: "Un paquete guardado con tamaño de flechas, altura de texto y unidades que usa DIM." },
      { term: "Línea de extensión", definition: "Las dos líneas cortas que conectan la geometría con la línea de cota." },
      { term: "Altura de texto", definition: "Cuánto miden las letras en unidades de dibujo." },
      { term: "Escala de anotación", definition: "Un multiplicador que mantiene la anotación legible a diferentes escalas de trazado." },
    ],
    beforeYouStart: [
      "Abre un dibujo con al menos una línea o rectángulo para acotar.",
      "Confirma que OSNAP está activo para que las cotas cojan los endpoints reales.",
      "Crea o establece una capa llamada Cotas para los objetos de cota.",
    ],
    detailedSteps: [
      { title: "Inicia el comando DIM", instruction: "Escribe DIM y pulsa Enter.", explanation: "DIM es la cota inteligente — detecta si estás midiendo longitud, ángulo o radio." },
      { title: "Elige el primer endpoint", instruction: "Engancha a un extremo de la línea que quieras medir y haz clic.", explanation: "OSNAP garantiza que la cota se ancle a la esquina exacta." },
      { title: "Elige el segundo endpoint", instruction: "Engancha al otro extremo y haz clic.", explanation: "AutoCAD muestra una vista previa de la cota siguiendo el cursor." },
      { title: "Coloca la línea de cota", instruction: "Aleja el cursor de la geometría y haz clic para fijar la posición de la línea de cota.", explanation: "La distancia a la geometría controla la legibilidad. Mantenla consistente en todo el plano." },
      { title: "Añade una etiqueta de texto de una línea", instruction: "Escribe TEXT, Enter. Haz clic en una ubicación. Escribe 10 y Enter para la altura. Escribe tu etiqueta y Enter dos veces.", explanation: "La altura va en unidades de dibujo — 10 mm en un layout 1:1 es adecuado para una A3." },
    ],
    commonMistakes: [
      { mistake: "Poner una altura de texto demasiado pequeña.", fix: "El texto pequeño desaparece al plotear. Empieza en 5–10 y ajusta según la escala." },
      { mistake: "Acotar con clics 'a ojo' en vez de endpoints enganchados.", fix: "Activa OSNAP para que la cota lea la longitud real de la geometría." },
      { mistake: "Poner cotas en la misma capa que la geometría.", fix: "Usa una capa Cotas para poder ocultar o inutilizar todas las cotas de un clic." },
    ],
    troubleshooting: [
      { problem: "DIM muestra el número equivocado.", cause: "Enganchaste a un punto que no era el endpoint real.", fix: "Deshaz, activa Endpoint y vuelve a elegir." },
      { problem: "El texto sale enorme o invisible.", cause: "Altura de texto inadecuada para la escala.", fix: "Selecciona el texto, abre Propiedades (Ctrl + 1) y ajusta Altura." },
    ],
    practiceExercise: {
      title: "Acota un rectángulo 100×200",
      steps: [
        "Dibuja un rectángulo 100×200 con REC.",
        "Ejecuta DIM y acota los cuatro lados.",
        "Ejecuta TEXT, altura 10, etiqueta 'Placa A'.",
      ],
      success: "Cada lado del rectángulo tiene una cota y una etiqueta clara al lado.",
    },
    proTips: [
      "Escribe D para abrir el Administrador de estilos de cota y afinar flechas, altura y unidades para todo el dibujo.",
      "Usa Escala de anotación para que el texto crezca al plotear a distintas escalas.",
      "Agrupa cotas en una capa dedicada para poder inutilizarlas al plotear si hace falta.",
    ],
    relatedCommands: [
      { what: "Cota lineal explícita entre dos endpoints." },
      { what: "Texto multilínea con formato en un cuadro." },
      { what: "Editar cualquier texto existente." },
    ],
  },

  hatch: {
    learningObjective:
      "Al terminar podrás usar HATCH para rellenar una región cerrada con un patrón de tu elección.",
    whatItIs:
      "HATCH añade un patrón repetitivo dentro de un contorno cerrado. AutoCAD detecta el contorno cuando haces clic dentro de él.",
    whyWhen:
      "Usa HATCH para representar materiales (hormigón, acero), sombreados de secciones o rellenos decorativos.",
    whereToFind: {
      ribbon: "Pestaña Inicio → panel Dibujo → botón Sombreado.",
      menu: "Menú Dibujo → Sombreado.",
      commandLine: "Escribe HATCH y pulsa Enter.",
      alias: "H (y luego Enter).",
    },
    vocab: [
      { term: "Patrón", definition: "La textura del sombreado (ANSI31, SOLID, DOTS…)." },
      { term: "Contorno", definition: "La forma cerrada que contiene el sombreado." },
      { term: "Escala", definition: "Multiplicador que agranda o encoge el patrón." },
      { term: "Ángulo", definition: "Rotación del patrón en grados." },
    ],
    beforeYouStart: [
      "Ten al menos un contorno cerrado dibujado (rectángulo, círculo o polilínea cerrada).",
      "Piensa qué patrón quieres — ANSI31 es un buen punto de partida.",
    ],
    detailedSteps: [
      { title: "Inicia el comando HATCH", instruction: "Escribe H y pulsa Enter.", explanation: "Aparece la pestaña contextual Sombreado con opciones de patrón y escala." },
      { title: "Elige un patrón", instruction: "En el panel Patrón, elige ANSI31.", explanation: "ANSI31 es el diagonal clásico para muchos materiales." },
      { title: "Establece la escala y el ángulo", instruction: "Haz clic dentro de la forma cerrada que quieras rellenar.", explanation: "AutoCAD detecta el contorno automáticamente y muestra una vista previa." },
      { title: "Haz clic dentro de la región cerrada", instruction: "Pulsa Enter para cerrar el comando.", explanation: "El sombreado queda como un solo objeto asociado al contorno." },
      { title: "Finaliza el comando" },
    ],
    commonMistakes: [
      { mistake: "Intentar sombrear un contorno abierto.", fix: "Cierra los huecos con TRIM/EXTEND o convierte a polilínea cerrada con JOIN." },
      { mistake: "Escala mal ajustada — el patrón se ve como un cuadrado sólido o invisible.", fix: "Ajusta la escala hasta que el patrón sea legible." },
    ],
    troubleshooting: [
      { problem: "AutoCAD dice 'Contorno cerrado no válido'.", cause: "Hay huecos en el contorno.", fix: "Usa OSNAP y JOIN para cerrar el contorno." },
      { problem: "El patrón sale al revés (sólido negro).", cause: "Escala demasiado pequeña.", fix: "Aumenta la escala de sombreado a 10 o 50." },
    ],
    practiceExercise: {
      title: "Rectángulo sombreado",
      steps: [
        "Dibuja un rectángulo con REC.",
        "Ejecuta H, elige ANSI31.",
        "Haz clic dentro del rectángulo.",
        "Pulsa Enter.",
      ],
      success: "El rectángulo queda relleno con líneas diagonales.",
    },
    proTips: [
      "Cambia el ángulo del sombreado en la propia pestaña para distinguir materiales.",
      "Usa Sombreado asociativo para que el patrón se actualice si mueves el contorno.",
    ],
    relatedCommands: [
      { what: "Rellena una región con color sólido." },
      { what: "Recortar un sombreado existente." },
    ],
  },

  blocks: {
    learningObjective:
      "Al terminar podrás definir un BLOCK a partir de geometría y reutilizarlo insertándolo múltiples veces.",
    whatItIs:
      "Un BLOCK es una agrupación con nombre que AutoCAD trata como un solo objeto. Puedes insertar copias que comparten la misma definición.",
    whyWhen:
      "Usa BLOCKs para elementos que se repiten (sillas, tornillos, ventanas). Editar la definición actualiza todas las inserciones.",
    whereToFind: {
      ribbon: "Pestaña Inicio → panel Bloque → Crear bloque.",
      menu: "Menú Dibujo → Bloque → Definir.",
      commandLine: "Escribe BLOCK y pulsa Enter.",
      alias: "B para definir, I para insertar.",
    },
    vocab: [
      { term: "Definición de bloque", definition: "La 'plantilla' interna con la geometría del bloque." },
      { term: "Referencia de bloque", definition: "Cada inserción visible del bloque en el dibujo." },
      { term: "Punto base", definition: "El punto por el que AutoCAD inserta el bloque." },
    ],
    beforeYouStart: [
      "Ten geometría dibujada que quieras convertir en bloque.",
      "Decide un punto base útil (una esquina o el centro)." ,
    ],
    detailedSteps: [
      { title: "Selecciona los objetos para agrupar", instruction: "Escribe B y pulsa Enter.", explanation: "Se abre el diálogo Definición de bloque." },
      { title: "Inicia el comando BLOCK", instruction: "Escribe un nombre descriptivo como 'Silla'.", explanation: "Los nombres claros hacen fácil localizarlo al insertar." },
      { title: "Nombra el bloque", instruction: "Haz clic en 'Especificar punto' y engancha a una esquina útil.", explanation: "Ese punto será el punto de inserción cada vez que uses el bloque." },
      { title: "Establece el punto base", instruction: "Haz clic en 'Seleccionar objetos', elige la geometría y pulsa Enter.", explanation: "Los objetos se convierten en la definición del bloque." },
      { title: "Confirma y convierte", instruction: "Escribe I, Enter. Elige el bloque y haz clic donde quieras insertarlo.", explanation: "Cada inserción es una referencia; editar la definición actualiza todas." },
      { title: "Inserta el bloque en otro lugar" },
    ],
    commonMistakes: [
      { mistake: "Olvidar el punto base — el bloque se inserta descentrado.", fix: "Elige siempre un punto base significativo antes de crear el bloque." },
      { mistake: "Bloques anidados con el mismo nombre.", fix: "Usa nombres únicos para evitar conflictos." },
    ],
    troubleshooting: [
      { problem: "El bloque no aparece en Insertar.", cause: "No se guardó la definición.", fix: "Vuelve a ejecutar BLOCK y confirma con OK." },
      { problem: "Al insertar sale gigante o minúsculo.", cause: "Escala de inserción incorrecta.", fix: "Establece la escala X=Y=Z=1 en el diálogo de inserción." },
    ],
    practiceExercise: {
      title: "Silla alrededor de una mesa",
      steps: [
        "Dibuja una silla con LINE y CIRCLE.",
        "Ejecuta B, nómbrala 'Silla', elige un punto base y selecciona la geometría.",
        "Inserta la silla 4 veces alrededor de un rectángulo (mesa).",
      ],
      success: "Cuatro sillas idénticas rodean la mesa; editar la definición cambia todas a la vez.",
    },
    proTips: [
      "Usa BEDIT para editar la definición de un bloque en su propio contexto.",
      "Los bloques dinámicos permiten parámetros (estiramiento, rotación) sin duplicar definiciones.",
    ],
    relatedCommands: [
      { what: "Inserta una referencia de bloque en el dibujo." },
      { what: "Rompe una referencia de bloque en su geometría." },
      { what: "Edita la definición de un bloque." },
    ],
  },

  join: {
    learningObjective:
      "Al terminar podrás unir varios segmentos conectados en una sola polilínea con JOIN.",
    whatItIs:
      "JOIN combina objetos alineados y conectados (líneas, arcos, polilíneas) en un único objeto.",
    whyWhen:
      "Usa JOIN antes de EXTRUDE, HATCH o OFFSET para tratar un contorno como una sola entidad.",
    whereToFind: {
      ribbon: "Pestaña Inicio → panel Modificar → botón Unir.",
      menu: "Menú Modificar → Unir.",
      commandLine: "Escribe JOIN y pulsa Enter.",
      alias: "J (y luego Enter).",
    },
    vocab: [
      { term: "Endpoint compartido", definition: "El punto donde los extremos de dos objetos coinciden exactamente." },
      { term: "Polilínea", definition: "Objeto único formado por segmentos y arcos conectados." },
      { term: "Colinealidad", definition: "Dos líneas alineadas en la misma dirección." },
    ],
    beforeYouStart: [
      "Ten varios segmentos conectados por sus extremos.",
      "Activa OSNAP (F3) para asegurar que los endpoints se tocan exactamente.",
    ],
    detailedSteps: [
      { title: "Inicia JOIN", instruction: "Escribe J y pulsa Enter.", explanation: "AutoCAD pide seleccionar objetos." },
      { title: "Selecciona el primer segmento", instruction: "Haz clic en todos los segmentos que quieras unir.", explanation: "Pueden ser líneas, arcos o polilíneas siempre que compartan endpoints." },
      { title: "Selecciona los segmentos restantes", instruction: "Pulsa Enter para ejecutar la unión.", explanation: "AutoCAD muestra cuántos objetos se unieron y en qué." },
      { title: "Verifica el resultado" },
    ],
    commonMistakes: [
      { mistake: "JOIN dice '0 unidos' porque los extremos no se tocan.", fix: "Usa OSNAP y ajusta los endpoints antes de reintentar." },
      { mistake: "Intentar unir objetos no colineales que no conectan.", fix: "Verifica que los objetos comparten un punto exacto." },
    ],
    troubleshooting: [
      { problem: "'0 items joined' aunque parece que se tocan.", cause: "Hay una separación mínima invisible.", fix: "Selecciona uno y muévelo con OSNAP Endpoint al otro." },
      { problem: "Se une pero como polilínea abierta.", cause: "El circuito no está cerrado en algún punto.", fix: "Cierra el último tramo antes de unir." },
    ],
    practiceExercise: {
      title: "Cuadrado con JOIN",
      steps: [
        "Dibuja cuatro líneas que formen un cuadrado (con OSNAP).",
        "Ejecuta JOIN y selecciona las cuatro.",
        "Pulsa Enter y confirma que resulta una sola polilínea cerrada.",
      ],
      success: "Un solo objeto polilínea al hacer clic en cualquier lado.",
    },
    proTips: [
      "Usa PEDIT si necesitas más control (por ejemplo, unir con tolerancia).",
      "Convierte líneas colineales pequeñas en una sola polilínea limpia antes de EXTRUDE.",
    ],
    relatedCommands: [
      { what: "Editar propiedades avanzadas de polilíneas." },
      { what: "Rompe una polilínea en sus segmentos." },
    ],
  },

  extrude: {
    learningObjective:
      "Al terminar podrás usar EXTRUDE para convertir una polilínea cerrada 2D en un sólido 3D.",
    whatItIs:
      "EXTRUDE toma una región o polilínea cerrada y la 'empuja' perpendicularmente para crear un sólido 3D con la altura que indiques.",
    whyWhen:
      "Es el punto de entrada al modelado 3D — muros extruidos desde el plano, piezas mecánicas desde su perfil, etc.",
    whereToFind: {
      ribbon: "Espacio Modelado 3D → pestaña Inicio → panel Modelado → botón Extrusión.",
      menu: "Menú Dibujar → Modelado → Extrusión.",
      commandLine: "Escribe EXTRUDE y pulsa Enter.",
      alias: "EXT (y luego Enter).",
    },
    vocab: [
      { term: "Perfil", definition: "La forma 2D cerrada que se va a extruir." },
      { term: "Altura", definition: "Distancia perpendicular al plano del perfil que se aplica al empuje." },
      { term: "Modelado 3D", definition: "El espacio de trabajo con herramientas 3D activadas." },
      { term: "Vista Conceptual", definition: "Modo de sombreado que muestra los sólidos con color y bordes." },
    ],
    beforeYouStart: [
      "Cambia al espacio Modelado 3D.",
      "Dibuja una polilínea cerrada o un círculo.",
      "Verifica con LIST que sea 'CLOSED'.",
    ],
    detailedSteps: [
      { title: "Cambia al espacio Modelado 3D", instruction: "En la esquina inferior derecha, elige 'Modelado 3D'.", explanation: "Activa las herramientas y vista adecuadas para 3D." },
      { title: "Dibuja un perfil cerrado", instruction: "Escribe EXT y pulsa Enter.", explanation: "AutoCAD pide seleccionar objetos." },
      { title: "Inicia el comando EXTRUDE", instruction: "Haz clic en la polilínea cerrada y pulsa Enter.", explanation: "Debe ser una forma cerrada para que EXTRUDE funcione." },
      { title: "Selecciona el perfil", instruction: "Escribe 50 y pulsa Enter.", explanation: "Se crea un sólido de 50 unidades de altura." },
      { title: "Introduce la altura", instruction: "Escribe VS, Enter, C, Enter.", explanation: "Verás el sólido sombreado con bordes visibles." },
      { title: "Cambia el estilo visual a Conceptual" },
    ],
    commonMistakes: [
      { mistake: "EXTRUDE en una polilínea abierta.", fix: "Cierra el contorno con JOIN o dibuja con la opción C." },
      { mistake: "Extruir en el espacio 2D y no ver el resultado.", fix: "Cambia a Modelado 3D y ejecuta ZOOM EXTENTS." },
    ],
    troubleshooting: [
      { problem: "AutoCAD dice 'Objeto no válido para extrusión'.", cause: "Es un contorno abierto.", fix: "Ejecuta JOIN para cerrar y reintenta." },
      { problem: "El sólido se ve plano.", cause: "Estás en vista superior 2D.", fix: "Cambia a vista SW isométrica y a Vista Conceptual." },
    ],
    practiceExercise: {
      title: "Hexágono extruido",
      steps: [
        "Dibuja un hexágono con POLYGON.",
        "Cambia a Modelado 3D.",
        "Ejecuta EXT, selecciona el hexágono, altura 100.",
        "Cambia a Vista Conceptual con VS → C.",
      ],
      success: "Un prisma hexagonal sólido de 100 unidades de altura, visible en vista sombreada.",
    },
    proTips: [
      "Usa la opción Dirección para extruir a lo largo de una línea guía en vez de perpendicular.",
      "Usa PRESSPULL para empujar/tirar caras sin usar EXTRUDE.",
    ],
    relatedCommands: [
      { what: "Girar un perfil alrededor de un eje para crear un sólido de revolución." },
      { what: "Barrer un perfil a lo largo de una ruta." },
      { what: "Empujar o tirar de caras existentes." },
    ],
  },

  "polyline-rect": {
    learningObjective:
      "Al terminar podrás dibujar geometría conectada como una sola polilínea usando las opciones Arco, Cerrar y Ancho.",
    whatItIs:
      "PLINE es como LINE pero mantiene los segmentos unidos como un solo objeto. También permite añadir arcos y variar el ancho.",
    whyWhen:
      "Usa PLINE cuando quieras una forma cerrada o continua que trataras como un solo objeto para HATCH, OFFSET o EXTRUDE.",
    whereToFind: {
      ribbon: "Pestaña Inicio → panel Dibujo → botón Polilínea.",
      menu: "Menú Dibujo → Polilínea.",
      commandLine: "Escribe PLINE y pulsa Enter.",
      alias: "PL (y luego Enter).",
    },
    vocab: [
      { term: "Segmento", definition: "Cada tramo recto o arco de la polilínea." },
      { term: "Cerrar (C)", definition: "Opción que une el último punto con el primero." },
      { term: "Arco (A)", definition: "Cambia el modo para dibujar arcos dentro de la misma polilínea." },
      { term: "Ancho (W)", definition: "Cambia el grosor de los siguientes segmentos." },
    ],
    beforeYouStart: [
      "Empieza un dibujo limpio.",
      "Activa OSNAP si vas a enganchar a geometría existente.",
    ],
    detailedSteps: [
      { title: "Inicia PLINE", instruction: "Escribe PL y pulsa Enter.", explanation: "AutoCAD pide el primer punto." },
      { title: "Haz clic en el punto inicial", instruction: "Haz clic en varios puntos para dibujar segmentos.", explanation: "Cada clic añade un segmento conectado al anterior." },
      { title: "Dibuja segmentos rectos", instruction: "Escribe A y pulsa Enter, luego dibuja un arco.", explanation: "El modo Arco añade tramos curvos manteniendo la polilínea." },
      { title: "Añade un segmento curvo con la opción Arco", instruction: "Escribe C y pulsa Enter para cerrar de vuelta al inicio.", explanation: "La polilínea se convierte en cerrada — lista para HATCH o EXTRUDE." },
      { title: "Cierra la polilínea" },
    ],
    commonMistakes: [
      { mistake: "Usar LINE en vez de PLINE cuando necesitas una sola forma.", fix: "Reemplaza con PLINE desde el principio." },
      { mistake: "Olvidar cambiar de vuelta a modo línea después de un arco.", fix: "Escribe L dentro de PLINE para volver a segmentos rectos." },
    ],
    troubleshooting: [
      { problem: "No puedo cerrar con C.", cause: "Solo hay dos puntos, se necesita al menos tres.", fix: "Añade un punto más antes de cerrar." },
      { problem: "El ancho no cambia lo que veo.", cause: "El zoom está muy alejado.", fix: "Haz ZOOM EXTENTS o aumenta el ancho." },
    ],
    practiceExercise: {
      title: "Forma en L",
      steps: [
        "Ejecuta PL. Haz clic para trazar 5 tramos que formen una L.",
        "Escribe C, Enter para cerrar.",
      ],
      success: "Una polilínea cerrada en forma de L, seleccionable como un solo objeto.",
    },
    proTips: [
      "Usa PEDIT para editar polilíneas existentes o convertir líneas en polilínea.",
      "Combina tramos rectos y arcos para siluetas complejas en un solo comando.",
    ],
    relatedCommands: [
      { what: "Editar propiedades de polilíneas existentes." },
      { what: "Convertir polilíneas 2D en spline suavizada." },
    ],
  },

  "offset-mirror": {
    learningObjective:
      "Al terminar podrás usar OFFSET para crear copias paralelas y MIRROR para crear copias reflejadas.",
    whatItIs:
      "OFFSET crea una copia paralela de un objeto a una distancia dada. MIRROR crea una copia reflejada a través de un eje.",
    whyWhen:
      "OFFSET es útil para muros con grosor, contornos concéntricos y desplazamientos precisos. MIRROR es ideal para simetrías (mitad de un dibujo).",
    whereToFind: {
      ribbon: "Pestaña Inicio → panel Modificar → botones Desplazamiento / Simetría.",
      menu: "Menú Modificar → Desplazar / Simetría.",
      commandLine: "Escribe OFFSET o MIRROR y pulsa Enter.",
      alias: "O para OFFSET, MI para MIRROR.",
    },
    vocab: [
      { term: "Distancia de desplazamiento", definition: "La separación entre el original y la copia paralela." },
      { term: "Lado de desplazamiento", definition: "Hacia dónde se genera la copia (dentro o fuera)." },
      { term: "Eje de simetría", definition: "La línea imaginaria a través de la cual se refleja el objeto." },
    ],
    beforeYouStart: [
      "Ten un objeto dibujado (línea, círculo o polilínea).",
      "Decide la distancia de OFFSET o el eje de MIRROR antes de empezar.",
    ],
    detailedSteps: [
      { title: "Inicia OFFSET", instruction: "Escribe O, Enter, y escribe una distancia (por ejemplo 10).", explanation: "AutoCAD pide seleccionar el objeto a desplazar." },
      { title: "Escribe la distancia de OFFSET", instruction: "Haz clic en el objeto y luego haz clic hacia el lado deseado.", explanation: "Se crea la copia paralela; el comando sigue activo para más desplazamientos." },
      { title: "Selecciona el objeto para hacer OFFSET", instruction: "Pulsa Enter para terminar.", explanation: "Sales del comando." },
      { title: "Haz clic en el lado", instruction: "Escribe MI y pulsa Enter.", explanation: "AutoCAD pide seleccionar objetos." },
      { title: "Inicia MIRROR", instruction: "Selecciona los objetos, Enter, haz clic en dos puntos que definan el eje.", explanation: "AutoCAD pregunta si borrar el original — normalmente responde N." },
      { title: "Define la línea de simetría" },
    ],
    commonMistakes: [
      { mistake: "Olvidar definir la distancia antes de seleccionar en OFFSET.", fix: "Escribe primero la distancia, luego selecciona." },
      { mistake: "Elegir un eje de simetría mal alineado en MIRROR.", fix: "Usa OSNAP para enganchar el eje a endpoints existentes." },
    ],
    troubleshooting: [
      { problem: "OFFSET no genera copia.", cause: "Distancia demasiado grande o pequeña.", fix: "Comprueba la distancia y el lado del clic." },
      { problem: "MIRROR pregunta 'borrar objetos de origen' y borra el original.", cause: "Respondiste 'Y'.", fix: "Deshaz con Ctrl + Z y responde 'N'." },
    ],
    practiceExercise: {
      title: "Media mariposa reflejada",
      steps: [
        "Dibuja la mitad de una mariposa con POLYLINE.",
        "Ejecuta MIRROR, selecciónala, define el eje central vertical.",
        "Responde 'N' para conservar el original.",
      ],
      success: "Una mariposa simétrica completa formada por la mitad original y su reflejo.",
    },
    proTips: [
      "Usa OFFSET con la opción M (Múltiple) para varias copias paralelas seguidas.",
      "Combina MIRROR con COPY para crear patrones simétricos rápidos.",
    ],
    relatedCommands: [
      { what: "Rotar objetos alrededor de un punto." },
      { what: "Escalar objetos manteniendo proporciones." },
    ],
  },

  "fillet-chamfer": {
    learningObjective:
      "Al terminar podrás redondear esquinas con FILLET y biselarlas con CHAMFER usando radios y distancias exactos.",
    whatItIs:
      "FILLET sustituye una esquina afilada por un arco tangente de radio dado. CHAMFER sustituye la esquina por un segmento recto con distancias definidas.",
    whyWhen:
      "Usa FILLET para transiciones suaves (piezas mecánicas, elementos decorativos). Usa CHAMFER para biseles funcionales o estéticos.",
    whereToFind: {
      ribbon: "Pestaña Inicio → panel Modificar → botones Empalme / Chaflán.",
      menu: "Menú Modificar → Empalme / Chaflán.",
      commandLine: "Escribe FILLET o CHAMFER y pulsa Enter.",
      alias: "F para FILLET, CHA para CHAMFER.",
    },
    vocab: [
      { term: "Radio", definition: "Radio del arco que sustituirá la esquina en FILLET." },
      { term: "Distancia", definition: "Longitud del corte en cada lado para CHAMFER." },
      { term: "Esquina", definition: "El punto donde dos segmentos se encuentran." },
    ],
    beforeYouStart: [
      "Ten dos líneas o segmentos que se corten (o casi).",
      "Piensa el radio o distancia que quieres antes de empezar.",
    ],
    detailedSteps: [
      { title: "Inicia FILLET", instruction: "Escribe F y pulsa Enter.", explanation: "AutoCAD pide seleccionar el primer objeto o cambiar opciones." },
      { title: "Define el radio", instruction: "Escribe R, Enter, y luego el radio (por ejemplo 15). Enter.", explanation: "El radio queda guardado para el siguiente empalme." },
      { title: "Haz clic en dos líneas", instruction: "Haz clic en las dos líneas que forman la esquina.", explanation: "AutoCAD sustituye la esquina por un arco tangente de ese radio." },
      { title: "Repite con CHAMFER", instruction: "Escribe CHA, Enter, define distancias con D, y elige dos líneas.", explanation: "En lugar de un arco, se crea un segmento recto biselado." },
      { title: "Establece las distancias" },
      { title: "Selecciona las dos líneas para el chaflán" },
    ],
    commonMistakes: [
      { mistake: "Poner radio 0 sin querer — la esquina queda en pico.", fix: "Comprueba el radio con R antes de hacer clic." },
      { mistake: "Aplicar FILLET a líneas paralelas — no hace nada.", fix: "FILLET necesita líneas que se cortan o se pueden extender para cortarse." },
    ],
    troubleshooting: [
      { problem: "El arco sale demasiado grande y come parte de las líneas.", cause: "El radio es mayor que la longitud disponible.", fix: "Reduce el radio o alarga las líneas." },
      { problem: "CHAMFER produce un resultado inesperado.", cause: "Las distancias no están definidas.", fix: "Dentro de CHAMFER, D, Enter, y define ambas distancias." },
    ],
    practiceExercise: {
      title: "Rectángulo con esquinas redondeadas",
      steps: [
        "Dibuja un rectángulo con REC.",
        "Ejecuta F, define radio 15.",
        "Aplica FILLET a las 4 esquinas.",
      ],
      success: "Un rectángulo con las 4 esquinas redondeadas al mismo radio.",
    },
    proTips: [
      "Dentro de FILLET, escribe P para aplicar el empalme a todos los vértices de una polilínea en un solo paso.",
      "CHAMFER con distancias diferentes en cada lado crea biseles asimétricos.",
    ],
    relatedCommands: [
      { what: "Recortar objetos hasta un borde." },
      { what: "Alargar objetos hasta un borde." },
    ],
  },

  "array-review": {
    learningObjective:
      "Al terminar podrás usar ARRAY para copiar objetos en patrones rectangulares, polares o de camino, y repasar los estilos de cota.",
    whatItIs:
      "ARRAY crea múltiples copias de un objeto en un patrón regular: rectangular, polar (circular) o siguiendo una ruta.",
    whyWhen:
      "Úsalo para elementos repetitivos (tornillos, muebles, pilares) con espaciado uniforme, en lugar de copiar uno a uno.",
    whereToFind: {
      ribbon: "Pestaña Inicio → panel Modificar → menú Matriz (Rectangular / Polar / de Camino).",
      menu: "Menú Modificar → Matriz.",
      commandLine: "Escribe ARRAY y pulsa Enter.",
      alias: "AR (y luego Enter).",
    },
    vocab: [
      { term: "Filas", definition: "Número de repeticiones en dirección vertical (rectangular)." },
      { term: "Columnas", definition: "Número de repeticiones en dirección horizontal (rectangular)." },
      { term: "Centro polar", definition: "El punto alrededor del cual giran las copias en un array polar." },
      { term: "Ruta", definition: "La curva a lo largo de la cual se colocan las copias en un array de camino." },
    ],
    beforeYouStart: [
      "Ten un objeto de origen dibujado.",
      "Decide el tipo de patrón y las cantidades antes de empezar.",
    ],
    detailedSteps: [
      { title: "Inicia ARRAY", instruction: "Escribe AR y pulsa Enter.", explanation: "AutoCAD pide seleccionar los objetos." },
      { title: "Selecciona el objeto", instruction: "Haz clic en el objeto y pulsa Enter.", explanation: "AutoCAD pregunta qué tipo de matriz quieres." },
      { title: "Elige tipo", instruction: "Escribe R (Rectangular) o PO (Polar) y pulsa Enter.", explanation: "Cada tipo tiene sus parámetros específicos." },
      { title: "Revisa Rectangular, Ruta y Polar", instruction: "Define filas, columnas y espaciado en la cinta contextual.", explanation: "La vista previa se actualiza en tiempo real." },
      { title: "Ajusta el conteo y el espaciado", instruction: "Haz clic fuera o pulsa Enter para cerrar la cinta.", explanation: "El array queda creado, editable con seleccionarlo." },
      { title: "Finaliza la matriz" },
      { title: "Agrega y revisa las cotas" },
    ],
    commonMistakes: [
      { mistake: "Espaciado negativo — las copias se solapan.", fix: "Usa valores positivos o verifica la dirección." },
      { mistake: "Confundir array polar con rectangular.", fix: "Elige PO para giros alrededor de un punto; R para filas y columnas." },
    ],
    troubleshooting: [
      { problem: "El array no se ve completo.", cause: "Espaciado o número muy alto.", fix: "Reduce parámetros y haz ZOOM EXTENTS." },
      { problem: "No puedo editar el array.", cause: "Está asociado — necesita seleccionarse.", fix: "Selecciona el array y usa los controles en la cinta contextual." },
    ],
    practiceExercise: {
      title: "Array polar de 8 círculos",
      steps: [
        "Dibuja un círculo pequeño.",
        "Ejecuta AR, selecciónalo, elige PO.",
        "Elige un centro, define 8 elementos y ángulo total 360°.",
      ],
      success: "Ocho círculos idénticos distribuidos uniformemente alrededor del centro.",
    },
    proTips: [
      "Los arrays son asociativos: editar el original actualiza todas las copias.",
      "Usa DIMSTYLE (D) para revisar y ajustar el estilo de cota antes de plotear.",
    ],
    relatedCommands: [
      { what: "Copiar objetos uno a uno." },
      { what: "Editar el estilo de cota." },
    ],
  },
};

// ─────────────────────────── QUIZZES ───────────────────────────

export const lessonQuizzesEs: Record<string, QuizEs[]> = {
  interface: [
    { q: "¿Qué combinación de teclas hace zoom a toda la geometría del dibujo?", choices: ["Z y luego E", "Z y luego A", "F2", "Ctrl + 0"], explanation: "ZOOM EXTENTS (Z luego E) encuadra todos los objetos visibles del dibujo." },
    { q: "¿Dónde lees lo que AutoCAD espera que hagas a continuación?", choices: ["La cinta", "La barra de estado", "La línea de comandos", "La barra de título"], explanation: "La línea de comandos es tu mapa — te dice exactamente qué entrada espera AutoCAD." },
  ],
  line: [
    { q: "¿Cómo confirmas una coordenada escrita en AutoCAD?", choices: ["Espacio y Tab", "Pulsa Enter", "Haz clic otra vez", "Pulsa Esc"], explanation: "AutoCAD confirma una coordenada escrita al pulsar Enter (o Espacio)." },
    { q: "¿Qué significa @100,0 como siguiente punto dentro de LINE?", choices: ["Punto absoluto 100,0 desde el origen", "100 unidades a la derecha del punto anterior", "Radio 100, ángulo 0", "Diámetro 100"], explanation: "El prefijo @ hace que la coordenada sea relativa al punto anterior." },
    { q: "¿Qué opción termina LINE cerrando la cadena hasta el primer punto?", choices: ["E", "U", "C", "X"], explanation: "Dentro de LINE, escribir C y pulsar Enter cierra la cadena hasta el primer punto." },
  ],
  circle: [
    { q: "Tras CIRCLE, ¿qué pide primero AutoCAD?", choices: ["Radio", "Punto central", "Diámetro", "Una capa"], explanation: "CIRCLE pide primero el centro y luego el radio o diámetro." },
    { q: "En el prompt del radio, ¿cómo cambias a escribir un diámetro?", choices: ["Escribe X y Enter", "Escribe D y Enter", "Pulsa Esc", "Pulsa Tab"], explanation: "Escribe D y pulsa Enter para cambiar ese círculo a modo Diámetro." },
    { q: "¿Qué opción dibuja un círculo por dos clics que forman un diámetro?", choices: ["2P", "3P", "Ttr", "C"], explanation: "Dentro de CIRCLE, la opción 2P usa dos puntos como extremos de un diámetro." },
  ],
  rectangle: [
    { q: "REC pide dos entradas, ¿cuáles?", choices: ["Centro y radio", "Dos esquinas opuestas", "Tres esquinas", "Solo una longitud"], explanation: "RECTANG se define con dos esquinas diagonalmente opuestas." },
    { q: "¿Cómo se comporta el resultado de REC?", choices: ["Cuatro líneas separadas", "Una sola polilínea cerrada", "Una línea auxiliar infinita", "Un bloque"], explanation: "RECTANG produce una sola polilínea cerrada — útil para HATCH, FILLET y OFFSET." },
    { q: "Dentro de REC, ¿qué opción te deja escribir largo y ancho por separado?", choices: ["A (Área)", "D (Dimensiones)", "R (Rotación)", "F (Empalme)"], explanation: "La opción Dimensiones pide largo y ancho en vez de la segunda esquina." },
  ],
  trim: [
    { q: "En modo Estándar, ¿cuántas veces pulsas Enter para seleccionar 'todos' como bordes?", choices: ["Una", "Dos", "Tres", "Mantén Shift+Enter"], explanation: "En TRIM Estándar, escribe TR y pulsa Enter dos veces — el segundo Enter selecciona todo lo visible como bordes." },
    { q: "En modo Rápido (por defecto en AutoCAD moderno), ¿qué actúa como borde de corte?", choices: ["Nada — debes elegir bordes", "Solo objetos en la capa actual", "Todo objeto visible", "Solo objetos bloqueados"], explanation: "El modo Rápido trata todo objeto visible como borde automáticamente — solo haces clic en lo que eliminar." },
    { q: "Mantener Shift al hacer clic dentro de TRIM hace ¿qué?", choices: ["Borra el objeto entero", "Cambia a EXTEND para ese clic", "Cancela el comando", "Selecciona una capa"], explanation: "Shift + clic dentro de TRIM extiende en vez de recortar, sin cambiar de comando." },
  ],
  "move-copy": [
    { q: "¿Cuál es el alias de teclado para COPY?", choices: ["C", "CO", "CP", "MV"], explanation: "CO es el alias estándar para COPY. C está reservado para CIRCLE." },
    { q: "¿Por qué elegir un punto base enganchado?", choices: ["Para poder borrar el objeto", "Para que el movimiento sea preciso y repetible", "Para cambiar su color", "Para inutilizarlo"], explanation: "Elegir una esquina/endpoint como base da un desplazamiento determinista y repetible." },
  ],
  osnap: [
    { q: "¿Qué tecla de función activa/desactiva OSNAP?", choices: ["F1", "F3", "F7", "F11"], explanation: "F3 activa el snap. F11 activa el rastreo de object snap." },
    { q: "Dibujar sin OSNAP suele causar ¿qué problema?", choices: ["Zoom lento", "Geometría que en realidad no conecta", "Capas bloqueadas", "Objetos ocultos"], explanation: "Sin snap, los endpoints caen ligeramente desalineados — lo que rompe TRIM, JOIN y EXTRUDE." },
  ],
  layers: [
    { q: "¿Qué comando abre las Propiedades de capa?", choices: ["L", "LA", "LP", "LAY"], explanation: "LA es el alias de LAYER, que abre el Administrador de propiedades de capa." },
    { q: "¿Cuál es el propósito principal de las capas?", choices: ["Acelerar el guardado", "Organizar y controlar objetos", "Redondear esquinas", "Cambiar unidades"], explanation: "Las capas agrupan geometría relacionada para colorearla, inutilizarla o bloquearla en conjunto." },
  ],
  "dim-text": [
    { q: "¿Qué espera DIM que hagas clic?", choices: ["Una capa", "Dos endpoints entre los que medir", "Un color", "Un patrón"], explanation: "DIM mide la distancia entre dos puntos elegidos." },
    { q: "¿Por qué aumentar la altura del texto?", choices: ["Zoom más rápido", "Para que siga siendo legible al alejar", "Para guardar el archivo", "Para permitir sombreado"], explanation: "La escala de trazado importa — el texto pequeño desaparece en el papel." },
  ],
  hatch: [
    { q: "HATCH necesita que la región objetivo esté…", choices: ["Abierta", "Cerrada", "En la capa 0", "En 3D"], explanation: "Los patrones solo rellenan un contorno cerrado. Cierra los huecos primero." },
    { q: "¿Dónde haces clic tras elegir un patrón?", choices: ["Un borde del contorno", "Dentro de la región cerrada", "Fuera de la región", "En cualquier sitio"], explanation: "Haz clic dentro del área cerrada — HATCH detecta el contorno alrededor de tu clic." },
  ],
  blocks: [
    { q: "¿Qué comando crea un bloque?", choices: ["B", "BL", "BLK", "BC"], explanation: "B (BLOCK) abre el diálogo de Definición de bloque." },
    { q: "¿Para qué sirve el punto base?", choices: ["Asignación de capa", "Alineación de inserción", "Color", "Modo de snap"], explanation: "El punto base es el asa que AutoCAD usa cada vez que insertas el bloque." },
  ],
  join: [
    { q: "JOIN falla con '0 unidos'. ¿Causa más probable?", choices: ["Capa equivocada", "Los endpoints no se tocan", "El bloque está bloqueado", "Sombreado"], explanation: "Los segmentos deben compartir un endpoint exacto. Ajústalos primero con OSNAP." },
    { q: "Tras un JOIN exitoso, el resultado es…", choices: ["Un bloque", "Una sola polilínea", "Un sombreado", "Una cota"], explanation: "Las líneas colineales unidas se convierten en una sola polilínea editable como una." },
  ],
  extrude: [
    { q: "EXTRUDE solo funciona con ¿qué tipo de forma?", choices: ["Abierta", "Cerrada", "Sombreada", "Acotada"], explanation: "Necesitas una región 2D cerrada (polilínea, círculo, región) antes de que EXTRUDE funcione." },
    { q: "¿Qué espacio de trabajo permite ver sólidos 3D fácilmente?", choices: ["Dibujo y anotación", "Modelado 3D", "AutoCAD clásico", "Conjunto de planos"], explanation: "Cambia a Modelado 3D para tener la cinta, el ViewCube y el sombreado conceptual disponibles." },
  ],
  "polyline-rect": [
    { q: "Dentro de PL, ¿qué opción cierra la polilínea hasta el inicio?", choices: ["E", "C", "X", "L"], explanation: "Escribe C dentro de PL para cerrar la polilínea." },
    { q: "REC pide…", choices: ["Tres esquinas", "Dos esquinas opuestas", "Un radio", "Solo una longitud"], explanation: "El rectángulo se define con dos esquinas diagonalmente opuestas." },
  ],
  "offset-mirror": [
    { q: "¿Qué escribes primero dentro de OFFSET?", choices: ["Una capa", "Una distancia", "Un patrón", "Un radio"], explanation: "OFFSET pide la distancia de desplazamiento antes de seleccionar el objeto." },
    { q: "MIRROR necesita ¿qué entrada?", choices: ["Un radio", "Dos puntos (eje de simetría)", "Un ángulo", "Una escala"], explanation: "Dos puntos elegidos definen el eje sobre el que se refleja la geometría." },
  ],
  "fillet-chamfer": [
    { q: "¿Qué hace FILLET?", choices: ["Añade texto", "Redondea una esquina con un radio", "Une capas", "Refleja objetos"], explanation: "FILLET sustituye una esquina afilada por un arco tangente de un radio dado." },
    { q: "Si el radio de FILLET es 0, la esquina queda…", choices: ["Como un círculo perfecto", "Una esquina afilada de 90°", "Sombreada", "Borrada"], explanation: "Radio 0 esencialmente TRIM/EXTEND las dos líneas hasta una esquina limpia." },
  ],
  "array-review": [
    { q: "ARRAY admite ¿qué patrones?", choices: ["Solo rectangular", "Solo polar", "Rectangular, polar o de camino", "Solo a lo largo de una línea"], explanation: "ARRAY moderno admite copias rectangulares, polares (circulares) y por camino." },
    { q: "¿Qué pasa si el espaciado es negativo en un ARRAY rectangular?", choices: ["Hace espejo", "Las copias se solapan / retroceden", "Borra el origen", "Nada"], explanation: "El espaciado negativo invierte la dirección: las copias crecen hacia el origen y se solapan." },
  ],
};

// ─────────────────────────── TROUBLESHOOTING ───────────────────────────

export const troubleshootingEs: TroubleshootItem[] = [
  { title: "TRIM no funciona", cause: "No seleccionaste bordes de corte o pulsaste Enter solo una vez.", fix: "Escribe TR, pulsa Enter dos veces para seleccionar todo como borde y luego haz clic en los segmentos." },
  { title: "JOIN dice 0 objetos unidos", cause: "Los endpoints no se tocan perfectamente.", fix: "Activa OSNAP (F3), reconecta los endpoints y vuelve a ejecutar JOIN." },
  { title: "No puedo pasar a 3D", cause: "Tu forma no está cerrada o estás en el espacio de Dibujo 2D.", fix: "Cambia al espacio Modelado 3D, une segmentos en una polilínea cerrada con JOIN y ejecuta EXTRUDE." },
  { title: "El dibujo desapareció", cause: "Hiciste zoom/pan muy lejos o la geometría está en una capa oculta.", fix: "Escribe Z y luego E (ZOOM EXTENTS). Luego revisa LAYERS y actívalas todas." },
];

// ─────────────────────────── MERGE HELPERS ───────────────────────────

export function mergeLesson(base: Lesson, es: LessonEs | undefined, richEs: RichLessonEs | undefined): Lesson {
  const merged: Lesson = {
    ...base,
    title: es?.title ?? base.title,
    tag: es?.tag ?? base.tag,
    description: es?.description ?? base.description,
    objective: es?.objective ?? base.objective,
    steps: es?.steps ?? base.steps,
    mistake: es?.mistake ?? base.mistake,
    challenge: es?.challenge ?? base.challenge,
  };
  if (base.rich && richEs) {
    merged.rich = mergeRich(base.rich, richEs);
  }
  return merged;
}

function mergeRich(base: RichLesson, es: RichLessonEs): RichLesson {
  return {
    ...base,
    learningObjective: es.learningObjective ?? base.learningObjective,
    whatItIs: es.whatItIs ?? base.whatItIs,
    whyWhen: es.whyWhen ?? base.whyWhen,
    whereToFind: {
      ribbon: es.whereToFind?.ribbon ?? base.whereToFind.ribbon,
      menu: es.whereToFind?.menu ?? base.whereToFind.menu,
      commandLine: es.whereToFind?.commandLine ?? base.whereToFind.commandLine,
      alias: es.whereToFind?.alias ?? base.whereToFind.alias,
    },
    vocab: es.vocab ?? base.vocab,
    beforeYouStart: es.beforeYouStart ?? base.beforeYouStart,
    detailedSteps: base.detailedSteps.map((s, i) => ({
      ...s,
      title: es.detailedSteps?.[i]?.title ?? s.title,
      instruction: es.detailedSteps?.[i]?.instruction ?? s.instruction,
      explanation: es.detailedSteps?.[i]?.explanation ?? s.explanation,
    })),
    commonMistakes: es.commonMistakes ?? base.commonMistakes,
    troubleshooting: es.troubleshooting ?? base.troubleshooting,
    practiceExercise: {
      title: es.practiceExercise?.title ?? base.practiceExercise.title,
      steps: es.practiceExercise?.steps ?? base.practiceExercise.steps,
      success: es.practiceExercise?.success ?? base.practiceExercise.success,
    },
    proTips: es.proTips ?? base.proTips,
    relatedCommands: base.relatedCommands.map((c, i) => ({
      name: es.relatedCommands?.[i]?.name ?? c.name,
      alias: es.relatedCommands?.[i]?.alias ?? c.alias,
      what: es.relatedCommands?.[i]?.what ?? c.what,
    })),
  };
}

export function mergeProject(base: Project, es: ProjectEs | undefined): Project {
  if (!es) return base;
  return {
    ...base,
    title: es.title ?? base.title,
    description: es.description ?? base.description,
    steps: es.steps ?? base.steps,
    difficulty: es.difficulty ?? base.difficulty,
  };
}

export function mergeQuiz(base: LessonQuizQ[], es: QuizEs[] | undefined): LessonQuizQ[] {
  if (!es) return base;
  return base.map((q, i) => ({
    ...q,
    q: es[i]?.q ?? q.q,
    choices: es[i]?.choices ?? q.choices,
    explanation: es[i]?.explanation ?? q.explanation,
  }));
}
