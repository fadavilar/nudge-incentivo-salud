/* ============================================================
   DATA — Nudge o incentivo: guiar o recompensar la conducta en salud
   Única fuente de contenido de la app. Las citas usan la clave
   «Autor, año» y se resuelven contra DATA.studies (js/studies.js,
   generado desde la base verificada de la revisión de alcance).
   ============================================================ */
const DATA = {
  meta: {
    title: "Nudge o incentivo: guiar o recompensar la conducta en salud",
    shortTitle: "Nudge o incentivo · Salud",
    subtitle: "Qué diferencia a un empujón de una recompensa, qué dice la evidencia 2021–2026, cuánto cuesta ganar un punto de adherencia y qué ejemplos reales tiene Colombia.",
    framework: "Contenido docente · Semana 4 · Economía del bienestar y el comportamiento",
    period: "Evidencia 2021–2026 · revisión de alcance del 18 oct. 2026",
    author: "Fabian Dávila Ramírez",
    credentials: "MD, MBA, PhD",
    affiliation: "Fundación Universitaria de Ciencias de la Salud (FUCS) · Universidad de Navarra · Universidad de Bogotá Jorge Tadeo Lozano",
    disclaimer: "Contenido docente y de divulgación. Sintetiza una revisión de alcance propia (marco PCC, PRISMA-ScR; 174 documentos) cuyo cribado hizo un único revisor asistido por IA, con verificación del autor. La calculadora usa fórmulas aritméticas simples y datos por defecto de un caso real y de un ejercicio ilustrativo; no reemplaza una evaluación económica formal.",
    license: {
      name: "Creative Commons Atribución 4.0 Internacional (CC BY 4.0)",
      url: "https://creativecommons.org/licenses/by/4.0/deed.es",
      text: "Puedes copiar, redistribuir y adaptar este contenido para cualquier propósito, incluso comercial, siempre que reconozcas la autoría y enlaces a la licencia."
    },
    relatedWorks: [
      { title: "Fundamentos de economía aplicada a la salud (semana 1)", text: "Explorador hermano: agentes, fallos de mercado y equidad-eficiencia. Allí se presenta la economía conductual como una de las razones por las que los agentes no eligen como predice la teoría clásica.", url: "https://fadavilar.github.io/fundamentos-economia-salud/" }
    ]
  },

  citation: {
    text: "Dávila Ramírez, F. (2026). Nudge o incentivo: guiar o recompensar la conducta en salud. Explorador interactivo con calculadora del costo de un punto de adherencia. Basado en una revisión de alcance de economía del bienestar y del comportamiento aplicada a la salud (2021–2026).",
    url: "https://github.com/fadavilar/nudge-incentivo-salud",
    linkLabel: "Repositorio y código fuente"
  },

  heroCards: [
    { label: "La diferencia", value: "Guiar o pagar", detail: "Seis dimensiones para distinguir un nudge de un incentivo.", sec: "diferencia" },
    { label: "La evidencia", value: "174 documentos", detail: "Qué funciona, cuánto y por cuánto tiempo (2021–2026).", sec: "evidencia" },
    { label: "La calculadora", value: "Costo por punto", detail: "Plantilla interactiva con un caso real colombiano por defecto.", sec: "calculadora" },
    { label: "Colombia", value: "8 ejemplos", detail: "Normas y programas reales, verificados en fuente oficial.", sec: "colombia" }
  ],

  keyMessages: [
    { title: "Un nudge guía; un incentivo recompensa", text: "El nudge cambia la arquitectura de la elección sin prohibir opciones ni cambiar los incentivos económicos; el incentivo añade un pago externo a cambio de la conducta. Ambos cambian la conducta, por mecanismos distintos.", refs: ["Cesareo et al., 2022", "Bolívar et al., 2021"] },
    { title: "Funcionan, pero con efectos modestos y que decaen", text: "Los incentivos mejoran a corto plazo la abstinencia, el testeo, el tamizaje y la actividad física; los defaults son el nudge más consistente. El efecto del incentivo suele caer al retirarlo, y tras corregir el sesgo de publicación el efecto medio de estas intervenciones es pequeño.", refs: ["Krishnamoorthy et al., 2021", "Lumia et al., 2026", "Taylor et al., 2022", "Abellán-Perpiñán et al., 2025", "Kaiser et al., 2025"] },
    { title: "Hay que evaluarlos como cualquier tecnología", text: "Cuánto cuesta cada punto de adherencia ganado, cuánto dura el efecto y a quién beneficia son preguntas de evaluación económica. En Colombia ya hay un caso real con datos: mensajes de texto para la vacunación contra el VPH a un costo cercano a 1.600 pesos por niño vacunado adicional.", refs: [] }
  ],

  audiences: [
    { who: "Estudiantes de administración en salud", path: "Lee la diferencia (02), luego la evidencia (03) y termina con los ejemplos colombianos (05). El glosario (07) resuelve los términos técnicos.", jump: ["diferencia", "evidencia", "colombia"] },
    { who: "Equipos de evaluación económica", path: "Ve directo a la calculadora (04): reproduce el caso real, cambia los supuestos y compara el costo por persona adicional con un valor de referencia, igual que una RCEI frente a un umbral.", jump: ["calculadora", "metodos"] },
    { who: "Gestores de programas y aseguradores", path: "Revisa los ejemplos colombianos (05) y la lista de chequeo de diseño y ética (06) antes de lanzar una intervención conductual en tu institución.", jump: ["colombia", "etica"] }
  ],

  /* ---------------- 02 DIFERENCIA ---------------- */
  difference: {
    intro: "Los dos instrumentos buscan que una persona haga algo que le conviene —tomar su medicamento, vacunarse, hacerse un tamizaje— pero lo logran por caminos distintos. El nudge actúa sobre cómo se presenta la decisión; el incentivo, sobre lo que la persona recibe al tomarla.",
    definitions: [
      { term: "Nudge (empujón)", text: "Cambio en la arquitectura de la elección —el entorno en el que las personas deciden— que orienta la decisión hacia una opción, sin restringir alternativas ni cambiar los incentivos financieros.", refs: ["Cesareo et al., 2022"], level: "verificado" },
      { term: "Incentivo financiero", text: "Recompensa explícita (dinero, bono, premio de lotería, descuento) o penalidad que se entrega a cambio de una conducta verificable. El manejo de contingencias es su forma clásica en salud.", refs: ["Bolívar et al., 2021"], level: "verificado" },
      { term: "Boost (impulso de capacidades)", text: "Tercera familia de intervenciones conductuales: en lugar de guiar o pagar, fortalece la capacidad de la persona para decidir por sí misma (por ejemplo, alfabetización en riesgos).", refs: ["Kaiser et al., 2025"], level: "verificado" }
    ],
    table: [
      { dim: "Cómo actúa", nudge: "Señal sutil que orienta la elección", incentive: "Recompensa explícita a cambio de la acción" },
      { dim: "Qué ofrece", nudge: "Sin pago: no cambia los incentivos económicos", incentive: "Un beneficio externo: dinero, bono, puntos" },
      { dim: "Opciones", shared: "Ninguno prohíbe opciones: la persona sigue eligiendo" },
      { dim: "Funciona mejor en", nudge: "Decisiones rutinarias y repetidas", incentive: "Acciones que exigen esfuerzo o implican riesgo" },
      { dim: "Al retirarlo", nudge: "El efecto del default tiende a persistir", incentive: "El efecto suele caer y vuelve la conducta previa" },
      { dim: "En salud", nudge: "Default de tamizaje, recordatorio de citas", incentive: "Pago por adherencia, lotería, transferencias" }
    ],
    tableNote: "Síntesis del autor. La definición de nudge sigue a Cesareo et al. (2022); la diferencia en la persistencia del efecto, a Abellán-Perpiñán et al. (2025); los ejemplos de default y de incentivo, a Taylor et al. (2022) y Bolívar et al. (2021). Las filas «Funciona mejor en» y «Qué ofrece» son lectura del autor.",
    tableRefs: ["Cesareo et al., 2022", "Abellán-Perpiñán et al., 2025", "Taylor et al., 2022", "Bolívar et al., 2021"],
    families: [
      { name: "Incentivos financieros", kind: "incentive", examples: "Manejo de contingencias, loterías, depósitos de compromiso, transferencias condicionadas.", refs: ["Bolívar et al., 2021", "Phillips-Chantelois et al., 2025"] },
      { name: "Arquitectura de la elección", kind: "nudge", examples: "Defaults (opt-out), posición y saliencia de las opciones, tamaño de las porciones.", refs: ["Taylor et al., 2022", "Gynell et al., 2022", "Almeida et al., 2024"] },
      { name: "Recordatorios y simplificación", kind: "nudge", examples: "Mensajes de texto, resurtido automático, planes de acción, menos pasos en el trámite.", refs: ["Werner et al., 2023", "Yu et al., 2025"] },
      { name: "Encuadre y normas sociales", kind: "nudge", examples: "Mensajes en ganancias o pérdidas, comparación con pares, mensajeros confiables.", refs: ["Waheed, 2023", "Sanny et al., 2026"] }
    ],
    frameworks: "Para elegir y reportar intervenciones conductuales se usan marcos como MINDSPACE —ampliado a 34 insights en nueve principios— y EAST (fácil, atractivo, social y oportuno).",
    frameworkRefs: ["Hodson et al., 2025", "Long et al., 2023"],
    /* Diagrama: dos rutas desde la decisión hasta el resultado */
    diagram: {
      nodes: [
        { id: "decision", label: "Decisión de salud", x: 430, y: 60, kind: "neutral", detail: "La persona decide si toma su medicamento, se vacuna o asiste al tamizaje. Sesgos como el del presente hacen que el beneficio futuro pese menos que la molestia de hoy.", refs: ["Reed et al., 2021", "Siegel et al., 2021"] },
        { id: "arquitectura", label: "Arquitectura de la elección", x: 220, y: 190, kind: "nudge", detail: "El nudge modifica cómo se presenta la decisión: opción por defecto, recordatorio, orden, mensajero. No cambia lo que la persona recibe.", refs: ["Cesareo et al., 2022"] },
        { id: "pagos", label: "Pagos de la decisión", x: 640, y: 190, kind: "incentive", detail: "El incentivo agrega un pago externo verificable (dinero, bono, premio). Cambia el balance costo-beneficio que percibe la persona.", refs: ["Bolívar et al., 2021"] },
        { id: "conducta", label: "Conducta", x: 430, y: 310, kind: "neutral", detail: "Ambas rutas pueden aumentar la conducta deseada. En adherencia a medicamentos, los nudges muestran un efecto g = 0,68 con heterogeneidad muy alta; los incentivos aumentan la adherencia antirretroviral (RR 1,30).", refs: ["Zhou et al., 2025", "Krishnamoorthy et al., 2021"] },
        { id: "resultado", label: "Resultado en salud", x: 430, y: 430, kind: "neutral", detail: "Que la conducta cambie no garantiza que el resultado clínico cambie: la adherencia puede subir de forma estadísticamente significativa pero clínicamente irrelevante.", refs: ["Winberg et al., 2025", "Farooque et al., 2026"] },
        { id: "persiste", label: "¿Persiste al retirar?", x: 820, y: 370, kind: "warn", detail: "El efecto de los incentivos tiende a decaer cuando terminan; el de los defaults persiste. En actividad física, el efecto de los incentivos deja de ser significativo en el seguimiento.", refs: ["Abellán-Perpiñán et al., 2025", "Reisgies et al., 2023", "Luong et al., 2021"] }
      ],
      edges: [
        { from: "decision", to: "arquitectura", label: "nudge" },
        { from: "decision", to: "pagos", label: "incentivo" },
        { from: "arquitectura", to: "conducta" },
        { from: "pagos", to: "conducta" },
        { from: "conducta", to: "resultado" },
        { from: "conducta", to: "persiste" }
      ]
    }
  },

  /* ---------------- 03 EVIDENCIA ---------------- */
  evidence: {
    intro: "Síntesis de los metaanálisis y revisiones sistemáticas incluidos en la revisión de alcance (eje 2: 81 documentos, 61 de ellos revisiones sistemáticas o metaanálisis). Cada cifra enlaza al documento original.",
    groups: [
      { id: "incentivos", title: "Incentivos financieros", color: "cat-c", items: [
        { stat: "d = 0,58", text: "Efecto mediano del manejo de contingencias sobre la abstinencia (y d = 0,62 sobre la adherencia).", refs: ["Bolívar et al., 2021"] },
        { stat: "RR 2,42", text: "Más testeo de VIH con incentivos; la adherencia antirretroviral mejora con RR 1,30 y la continuidad de la atención con RR 1,24.", refs: ["Krishnamoorthy et al., 2021"] },
        { stat: "RR 2,69", text: "Más mujeres se tamizan para cáncer al mes con un incentivo (RR 1,57 al año); los montos de USD 10–25 fueron frecuentes.", refs: ["Lumia et al., 2026"] },
        { stat: "OR 2,78", text: "Mayor inscripción en programas de promoción de la salud (y OR 2,54 en retención), con heterogeneidad alta.", refs: ["Michaud et al., 2022"] },
        { stat: "↑ vacunación", text: "Los incentivos aumentan significativamente la vacunación contra la hepatitis B en usuarios de sustancias.", refs: ["Wang et al., 2024"] },
        { stat: "≥ 1.000 pasos", text: "Los incentivos de corto plazo aumentan la actividad física en al menos 1.000 pasos al día; el tamaño, la duración y el uso de dispositivos moderan el efecto.", refs: ["Salmani et al., 2025"] },
        { stat: "Tabaco y peso", text: "Promueven la cesación tabáquica y una pérdida de peso modesta, sin efecto sobre el colesterol LDL ni la presión arterial.", refs: ["Prigozin et al., 2026"] }
      ]},
      { id: "nudges", title: "Nudges", color: "cat-d", items: [
        { stat: "Default", text: "Las intervenciones basadas en defaults fueron las más efectivas para el tamizaje colorrectal; los incentivos mostraron evidencia mixta.", refs: ["Taylor et al., 2022"] },
        { stat: "Equitativo", text: "Los defaults en elecciones alimentarias funcionan de forma similar entre grupos de edad, género y educación.", refs: ["Lemken et al., 2026"] },
        { stat: "g = 0,68", text: "Mejora de la adherencia a medicamentos con nudges, con heterogeneidad muy alta (I² = 96 %).", refs: ["Zhou et al., 2025"] },
        { stat: "HbA1c −0,50", text: "Recordatorios y resurtido automático mejoran el automonitoreo y reducen la HbA1c y la presión sistólica (−4,47 mmHg).", refs: ["Yu et al., 2025"] },
        { stat: "↓ inasistencia", text: "Los recordatorios reducen la inasistencia a citas; casi todos los demás enfoques conductuales siguen sin probarse en ese desenlace.", refs: ["Werner et al., 2023"] },
        { stat: "Vacunación", text: "Los nudges muestran potencial para aumentar la confianza y la cobertura de vacunación, pero su efecto varía sustancialmente según el contexto.", refs: ["Reñosa et al., 2021"] },
        { stat: "EPOC", text: "Mejoran el autocuidado en la EPOC, sobre todo la adherencia, la técnica inhalatoria y la vacunación.", refs: ["Wu et al., 2024"] },
        { stat: "Higiene de manos", text: "La mayoría de los nudges para la higiene de manos tuvo un efecto positivo.", refs: ["Tzikas et al., 2023"] }
      ]},
      { id: "tensiones", title: "Tensiones y advertencias", color: "cat-b", items: [
        { stat: "Persistencia", text: "Sin efecto en el seguimiento de la actividad física tras retirar el incentivo, aunque en diabetes el cambio se mantuvo en adultos.", refs: ["Reisgies et al., 2023", "Zhang et al., 2024b"] },
        { stat: "Relevancia clínica", text: "La adherencia sube de forma significativa pero quizá irrelevante en lo clínico; en peso, un metaanálisis no encuentra efecto y otro sí, a corto plazo.", refs: ["Winberg et al., 2025", "Farooque et al., 2026", "Hondmann et al., 2026"] },
        { stat: "Encuadre", text: "El encuadre en pérdidas está entre lo más consistente en una revisión, pero no supera al de ganancias para dejar de fumar.", refs: ["Sanny et al., 2026", "Waheed, 2023"] },
        { stat: "0,063", text: "Efecto medio de incentivos, nudges y boosts tras corregir el sesgo de publicación (meta-metaanálisis, preprint).", refs: ["Kaiser et al., 2025"] },
        { stat: "Efectos adversos", text: "Habituación, efectos contraproducentes y efecto techo; sesgo de publicación significativo en el tamizaje colorrectal.", refs: ["Lee et al., 2024", "Ahadinezhad et al., 2024"] },
        { stat: "No todos responden igual", text: "La respuesta a los nudges varía con la personalidad y el género, aunque el tipo de nudge y la conducta objetivo pesan más que esas tendencias.", refs: ["Wagler et al., 2024"] },
        { stat: "Nudges oscuros", text: "Algunas características de los juegos de azar funcionan como «nudges oscuros» que explotan las decisiones de los jugadores: la misma técnica sirve para ayudar o para dañar.", refs: ["Fortier et al., 2024"] }
      ]}
    ],
    economics: "La evidencia económica es escasa: el diseño de seguros basado en valor mejora la adherencia con una elasticidad-precio modesta y sin ahorros garantizados, y solo una revisión estima el retorno de la inversión de incentivos a la actividad física.",
    economicsRefs: ["Jana-Valencia et al., 2026", "Aoki et al., 2026"]
  },

  /* ---------------- 04 CALCULADORA ---------------- */
  calculator: {
    intro: "Plantilla para estimar cuánto cuesta ganar un punto porcentual de adherencia (o de cualquier conducta medida como proporción: vacunación, tamizaje, asistencia) con una intervención conductual. Trae dos escenarios por defecto —un caso real colombiano y el ejercicio de clase— y un tercero para tus propios datos.",
    fields: [
      { id: "n", label: "Personas intervenidas", unit: "personas", step: 1, min: 1, help: "Número de personas que reciben el nudge o el incentivo." },
      { id: "costPerson", label: "Costo variable por persona intervenida", unit: "COP", step: 0.1, min: 0, help: "Mensajes, pagos, bonos o premios por persona durante la intervención." },
      { id: "fixed", label: "Costo fijo del programa", unit: "COP", step: 1000, min: 0, help: "Diseño, plataforma, personal o auditoría que no dependen del número de personas. Déjalo en 0 si no aplica." },
      { id: "base", label: "Tasa sin la intervención (grupo de comparación)", unit: "%", step: 0.01, min: 0, max: 100, help: "Proporción con la conducta en quienes no reciben la intervención." },
      { id: "treat", label: "Tasa con la intervención", unit: "%", step: 0.01, min: 0, max: 100, help: "Proporción con la conducta en quienes la reciben, al final del periodo." },
      { id: "sustained", label: "Tasa sostenida tras retirar la intervención (opcional)", unit: "%", step: 0.01, min: 0, max: 100, optional: true, help: "Si se midió el efecto después de terminar, escríbelo aquí. Déjalo vacío si no hay dato." },
      { id: "wtp", label: "Valor de referencia por persona adicional (opcional)", unit: "COP", step: 1000, min: 0, optional: true, help: "Cuánto estaría dispuesto a pagar tu programa por cada persona adicional con la conducta. Funciona como el umbral frente a una RCEI." }
    ],
    presets: [
      { id: "compensar", name: "Caso real · SMS para vacunación contra el VPH", short: "SMS VPH (caso real)", level: "verificado",
        values: { n: 3265, costPerson: 45.3, fixed: 0, base: 4.05, treat: 6.83, sustained: null, wtp: null },
        note: "Compensar EPS con la American Cancer Society: 6.915 padres de niños y niñas de 9 años sin vacunar se asignaron al azar a control (3.650, sin mensajes) o a intervención (3.265, 8 mensajes de texto con elementos conductuales durante 10 semanas). Vacunación: 6,83 % frente a 4,05 % (+2,78 puntos). Se enviaron cerca de 29.600 mensajes a unos 5 pesos cada uno; el costo por persona (≈45,3 pesos) es un cálculo del autor: 29.600 × 5 / 3.265. El reporte estima un costo de ≈1.626 pesos por niño vacunado adicional; la calculadora da ≈1.630 por redondeo. Es un reporte de caso, no un artículo revisado por pares, y el análisis estadístico formal estaba pendiente.",
        source: { label: "Compensar EPS y American Cancer Society. Aumentando la vacunación contra el VPH en Colombia: caso de estudio (2026).", url: "https://preventglobalhpvcancers.org/wp-content/uploads/2026/07/Compensar_Case-Study_Espanol-1.pdf" } },
      { id: "clase", name: "Ejercicio de clase · incentivo financiero a la adherencia", short: "Incentivo (ilustrativo)", level: "nota-autor",
        values: { n: 500, costPerson: 240000, fixed: 0, base: 50, treat: 62, sustained: 52, wtp: null },
        note: "Datos ficticios del ejercicio de la semana 4: un incentivo de 240.000 pesos por paciente durante seis meses sube la adherencia del 50 % al 62 %, y al retirarlo vuelve al 52 %. Sirve para ver cómo la persistencia del efecto, más que el pago, define si vale la pena.",
        source: null },
      { id: "propio", name: "Mi programa", short: "Mi programa", level: "nota-autor",
        values: { n: 1000, costPerson: 10000, fixed: 5000000, base: 40, treat: 45, sustained: null, wtp: 500000 },
        note: "Escenario editable con valores de ejemplo para que escribas los de tu institución. Los números por defecto no provienen de ninguna fuente.",
        source: null }
    ],
    formulas: [
      { name: "Diferencia (puntos porcentuales)", f: "Δ = tasa con intervención − tasa sin intervención" },
      { name: "Personas adicionales con la conducta", f: "n × Δ / 100" },
      { name: "Costo total", f: "costo fijo + n × costo variable por persona" },
      { name: "Costo de un punto de adherencia", f: "costo total / Δ (pesos por cada punto porcentual ganado en la cohorte intervenida)" },
      { name: "Personas a intervenir por cada adicional (NNT)", f: "100 / Δ" },
      { name: "Costo por persona adicional", f: "costo total / personas adicionales (equivale a costo por persona × NNT cuando no hay costo fijo)" },
      { name: "Con persistencia", f: "Δ sostenida = tasa sostenida − tasa sin intervención; costo por persona adicional sostenida = costo total / (n × Δ sostenida / 100)" },
      { name: "Frente al valor de referencia", f: "Si el costo por persona adicional es menor que el valor de referencia, la intervención queda por debajo del umbral (análogo a una RCEI)" }
    ],
    caveats: [
      "La diferencia entre tasas solo es un efecto atribuible a la intervención si el grupo de comparación es válido (idealmente, asignación aleatoria).",
      "El costo de un punto depende del tamaño de la cohorte: compara escenarios con la misma población o usa el costo por persona adicional.",
      "No incluye los costos ni los ahorros posteriores (consultas evitadas, complicaciones), ni los resultados en salud: para eso se necesita una evaluación económica completa.",
      "Más conducta no siempre significa mejor resultado clínico: contrasta con la evidencia de relevancia clínica de la sección 03."
    ]
  },

  /* ---------------- 05 COLOMBIA ---------------- */
  colombia: {
    intro: "Normas y programas reales del escenario colombiano, clasificados según el mecanismo que usan. Cada ejemplo enlaza a su fuente oficial o al reporte original. La clasificación como nudge o incentivo es lectura del autor.",
    examples: [
      { id: "donacion", name: "Presunción legal de donación de órganos", kind: "nudge", mech: "Default (opt-out)", year: "2016",
        text: "Se presume que una persona es donante si en vida no ejerció su derecho a oponerse a la extracción de órganos y tejidos después de su fallecimiento. La opción por defecto es donar; quien no quiera, debe expresarlo.",
        why: "Es el ejemplo clásico de default: no prohíbe ni paga, solo cambia qué ocurre si la persona no hace nada.",
        source: { label: "Ley 1805 de 2016, artículo 3 (modifica el artículo 2 de la Ley 73 de 1988)", url: "https://normograma.supersalud.gov.co/compilacion/docs/ley_1805_2016.htm" } },
      { id: "afiliacion", name: "Afiliación de oficio al sistema de salud", kind: "nudge", mech: "Default administrativo", year: "2020",
        text: "Las personas que no están afiliadas al SGSSS, o cuya afiliación terminó, son inscritas de oficio en una EPS cuando buscan atención, sin depender de que hagan el trámite por su cuenta.",
        why: "Convierte la afiliación en la opción por defecto y elimina fricción administrativa («sludge») en el acceso.",
        source: { label: "Decreto 064 de 2020 (Ministerio de Salud y Protección Social)", url: "https://www.cancilleria.gov.co/sites/default/files/Normograma/docs/pdf/decreto_0064_2020.pdf" },
        extra: { label: "Ministerio de Salud y Protección Social: afiliación de oficio", url: "https://minsalud.gov.co/Proteccion-Social/Paginas/Afiliacion-Oficio.aspx" } },
      { id: "sellos", name: "Sellos frontales de advertencia en alimentos", kind: "nudge", mech: "Saliencia de la información", year: "2021–2022",
        text: "Los productos con exceso de azúcares, sodio o grasas llevan sellos octagonales de advertencia «Exceso en» en el tercio superior del empaque, además de sellos para grasas trans y edulcorantes.",
        why: "No prohíbe la compra ni cambia el precio: hace saliente una información que antes estaba oculta en la tabla nutricional.",
        source: { label: "Resolución 2492 de 2022, que desarrolla la Ley 2120 de 2021", url: "https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_2492_2022.htm" },
        extra: { label: "Ley 2120 de 2021 (entornos alimentarios saludables)", url: "https://normograma.invima.gov.co/normograma/compilacion/docs/ley_2120_2021.htm" } },
      { id: "tabaco", name: "Pictogramas en las cajetillas de tabaco", kind: "nudge", mech: "Saliencia y afecto", year: "2009",
        text: "Las frases de advertencia y los pictogramas deben ocupar el 30 % del área de cada una de las dos caras principales de los empaques de productos de tabaco.",
        why: "Usa la emoción y la saliencia para que el riesgo se perciba en el momento de la decisión.",
        source: { label: "Resolución 3961 de 2009, que desarrolla el artículo 13 de la Ley 1335 de 2009", url: "https://faolex.fao.org/docs/pdf/col90792.pdf" } },
      { id: "vph-compensar", name: "Mensajes de texto para la vacunación contra el VPH (Compensar EPS)", kind: "nudge", mech: "Recordatorio, mensajero y respaldo médico", year: "Reporte 2026",
        text: "Ocho mensajes de texto en diez semanas a padres de niños y niñas de 9 años sin vacunar, con la recomendación médica y el respaldo de la autoridad de salud. La vacunación fue de 6,83 % frente a 4,05 % en el grupo de control (+2,78 puntos; +68 % relativo), a un costo cercano a 1.626 pesos por niño vacunado adicional.",
        why: "Caso colombiano con grupo de control aleatorio y costos reportados: es el escenario por defecto de la calculadora.",
        source: { label: "Compensar EPS y American Cancer Society: caso de estudio (2026)", url: "https://preventglobalhpvcancers.org/wp-content/uploads/2026/07/Compensar_Case-Study_Espanol-1.pdf" }, calc: "compensar" },
      { id: "vph-bogota-cali", name: "Pruebas de mensajes para el VPH en Bogotá y Cali", kind: "nudge", mech: "Mensajes basados en evidencia conductual", year: "Presentado en 2025",
        text: "Las secretarías de salud de Bogotá y Cali, con el BID, la American Cancer Society y la Universidad del Rosario, probaron paquetes de mensajes de texto; en Cali se probaron cuatro paquetes con 15.231 acudientes. Entre las prácticas recomendadas: presentar la vacuna como prevención del cáncer, comunicar la recomendación médica y aclarar que es gratuita.",
        why: "Muestra cómo el sistema colombiano empieza a usar ensayos controlados para elegir qué mensaje funciona mejor.",
        source: { label: "ACEMI y American Cancer Society: «Impulsando la vacunación contra el VPH en Colombia», presentación de seminario web", url: "https://preventglobalhpvcancers.org/wp-content/uploads/2025/04/SELAC_Evidencia-Experimental-a-la-Implementacion-Nacional.pdf" }, level: "verificado", caveat: "Presentación de un seminario web, no un artículo revisado por pares." },
      { id: "impuestos", name: "Impuestos saludables a bebidas azucaradas y ultraprocesados", kind: "incentive", mech: "Incentivo de precio (impuesto)", year: "2022",
        text: "La reforma tributaria creó un impuesto a las bebidas ultraprocesadas azucaradas y a los comestibles ultraprocesados con altos niveles de azúcares, sodio o grasas saturadas, con tarifas progresivas desde noviembre de 2023.",
        why: "Contraejemplo: no es un nudge, porque cambia el precio. Es un incentivo negativo que opera sobre los pagos de la decisión.",
        source: { label: "Ley 2277 de 2022, artículo 54 (Título X «Impuestos saludables» del Estatuto Tributario)", url: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=199883" } },
      { id: "familias", name: "Familias en Acción: transferencias condicionadas", kind: "incentive", mech: "Transferencia monetaria condicionada", year: "Ley 1532 de 2012 – 2023",
        text: "El programa entregaba apoyos monetarios a familias en pobreza para fomentar, entre otros, la asistencia a los controles de crecimiento y desarrollo de la primera infancia y la permanencia escolar. La Ley 1948 de 2019 que lo regulaba fue derogada por el artículo 10 del Decreto 1960 de 2023.",
        why: "Contraejemplo: incentivo financiero condicionado a una conducta de salud, comparable con Bolsa Família en Brasil.",
        source: { label: "Ley 1948 de 2019 (Gestor Normativo de Función Pública, con nota de derogatoria)", url: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma_pdf.php?i=90183" }, related: ["Magalhães et al., 2024"] }
    ],
    evidenceNote: "En la revisión de alcance, solo 12 de 174 documentos tienen autoría o contenido latinoamericano verificado, y solo uno es colombiano (un ensayo sin método declarado). Los ejemplos de esta sección vienen de normas y reportes, no de esa revisión: la evidencia sintetizada sobre su efecto en Colombia está por construirse.",
    evidenceRefs: ["Saldías Fernández et al., 2023", "BID, 2022", "Magalhães et al., 2024", "Arrieta Marrugo et al., 2023"],
    ideas: {
      title: "Ideas para tu institución",
      note: "Propuestas del autor derivadas de la evidencia internacional. No se han evaluado en Colombia: cualquiera de ellas debería probarse con un grupo de comparación y medirse con la calculadora.",
      items: [
        { name: "Resurtido automático de medicamentos crónicos", mech: "Default", basis: "Recordatorios y resurtido automático mejoraron el control metabólico en diabetes.", refs: ["Yu et al., 2025"] },
        { name: "Cita de control agendada por defecto al salir de consulta", mech: "Default", basis: "Los defaults fueron la intervención más efectiva en tamizaje.", refs: ["Taylor et al., 2022"] },
        { name: "Recordatorio por mensaje de texto 48 horas antes de la cita", mech: "Recordatorio", basis: "Los recordatorios reducen la inasistencia a citas.", refs: ["Werner et al., 2023"] },
        { name: "Mensaje firmado por el médico tratante para vacunación o tamizaje", mech: "Mensajero", basis: "La recomendación médica fue uno de los elementos de los mensajes probados en Colombia para el VPH.", refs: [] },
        { name: "Opción saludable por defecto en la cafetería del hospital", mech: "Default y posición", basis: "El default es la intervención implícita más prometedora en menús.", refs: ["Gynell et al., 2022"] },
        { name: "Incentivo pequeño, cierto e inmediato por completar un esquema", mech: "Incentivo", basis: "Incentivos pequeños, ciertos y de ganancia mejoraron conductas de manejo del asma.", refs: ["Hine et al., 2023"] }
      ]
    }
  },

  /* ---------------- 06 ÉTICA ---------------- */
  ethics: {
    intro: "La controversia sobre los nudges es normativa: unos los aceptan si cumplen transparencia, proporcionalidad y respeto a la autonomía; otros advierten que pueden desplazar la atención de los determinantes estructurales e individualizar el riesgo.",
    positions: [
      { who: "A favor, con condiciones", text: "Los nudges deben ser transparentes, no arbitrarios y eficientes, y complementar —no sustituir— la regulación; se proponen principios de gobernanza explícitos.", refs: ["Abellán-Perpiñán et al., 2022b", "Shang et al., 2025", "Vande Velde et al., 2021", "Correa et al., 2022"] },
      { who: "En contra o con reservas", text: "Los nudges dirigidos a clínicos pueden distraer de los determinantes estructurales, y el nudging en enfermedades crónicas puede individualizar el riesgo y reproducir desigualdades.", refs: ["Last et al., 2024", "Ramos-Zaga, 2026"] },
      { who: "Sobre los incentivos", text: "Pagar por la adherencia es aceptable en ciertas circunstancias, con atención a la capacidad, la autonomía y la motivación intrínseca; pagos de 2,5 veces el salario mínimo aumentaron la adherencia a antipsicóticos y abrieron ese debate.", refs: ["Kassam et al., 2026", "Hodson et al., 2022"] }
    ],
    verdict: "Lectura del autor: los nudges y los incentivos son un complemento útil, no un sustituto de la política fiscal, regulatoria y estructural.",
    verdictRefs: ["Reisch, 2021", "Kaiser et al., 2025"],
    checklist: {
      intro: "Lista práctica para revisar una intervención antes de lanzarla. La redactó el autor a partir de los criterios que aparecen en la literatura incluida; no es un instrumento validado.",
      items: [
        { q: "¿Se justifican la magnitud, la inmediatez y la forma del incentivo o del nudge?", basis: "Los estudios rara vez reportan la justificación, magnitud e inmediatez de los incentivos.", refs: ["Miranda et al., 2021", "Klemperer et al., 2023"] },
        { q: "¿Se medirá el efecto después de retirar la intervención?", basis: "El efecto de los incentivos suele decaer al terminar.", refs: ["Reisgies et al., 2023", "Abellán-Perpiñán et al., 2025"] },
        { q: "¿El diseño permite atribuir el cambio a la intervención (grupo de comparación)?", basis: "El caso colombiano del VPH usó asignación aleatoria a control e intervención.", refs: [] },
        { q: "¿Se analizarán los efectos por subgrupos (edad, sexo, nivel socioeconómico, zona)?", basis: "Los análisis de equidad por subgrupos son la excepción; los defaults pueden funcionar igual entre grupos.", refs: ["Lemken et al., 2026"] },
        { q: "¿Es transparente y la persona puede elegir otra opción con facilidad?", basis: "Transparencia y respeto a la autonomía son las condiciones de legitimidad más citadas.", refs: ["Shang et al., 2025", "Abellán-Perpiñán et al., 2022b"] },
        { q: "¿Complementa, sin reemplazar, la acción sobre barreras estructurales (acceso, oferta, pago oportuno)?", basis: "Riesgo de desplazamiento de la atención hacia el individuo.", refs: ["Last et al., 2024", "Ramos-Zaga, 2026"] }
      ]
    }
  },

  /* ---------------- 07 GLOSARIO ---------------- */
  glossaryNote: "Términos usados en la app. Las definiciones son síntesis del autor apoyadas en los documentos citados. Para un vocabulario normalizado de insights conductuales en salud pública, consulta el glosario de la OMS.",
  glossaryRefs: ["OMS, 2026"],
  glossary: [
    { t: "Adherencia", en: "Adherence", cat: "evaluacion", d: "Grado en que la conducta de una persona —tomar el medicamento, asistir a controles— coincide con lo acordado con el equipo de salud. En la calculadora se mide como proporción de personas adherentes.", refs: [] },
    { t: "Arquitectura de la elección", en: "Choice architecture", cat: "concepto", d: "Forma en que se presentan las opciones de una decisión: orden, opción por defecto, información visible. Cambiarla sin prohibir opciones es un nudge.", refs: ["Cesareo et al., 2022"] },
    { t: "Aversión a la pérdida", en: "Loss aversion", cat: "concepto", d: "Tendencia a sentir más una pérdida que una ganancia del mismo tamaño. Se usa para diseñar incentivos encuadrados en pérdidas.", refs: ["Reed et al., 2021"] },
    { t: "Boost", en: "Boost", cat: "herramienta", d: "Intervención que fortalece la capacidad de decidir (por ejemplo, alfabetización en riesgos) en lugar de guiar o pagar.", refs: ["Kaiser et al., 2025"] },
    { t: "Costo de un punto de adherencia", en: "Cost per percentage point", cat: "evaluacion", d: "Costo total de la intervención dividido por los puntos porcentuales de adherencia ganados en la cohorte intervenida.", refs: [] },
    { t: "Costo por persona adicional", en: "Cost per additional responder", cat: "evaluacion", d: "Costo total dividido por el número de personas adicionales que adoptan la conducta gracias a la intervención.", refs: [] },
    { t: "Default (opción por defecto)", en: "Default", cat: "herramienta", d: "Lo que ocurre si la persona no hace nada. Es el nudge más consistente en la evidencia revisada.", refs: ["Taylor et al., 2022", "Gynell et al., 2022"] },
    { t: "Descuento por demora", en: "Delay discounting", cat: "concepto", d: "Pérdida de valor subjetivo de un beneficio a medida que se aleja en el tiempo. Explica por qué la prevención pesa poco frente a la molestia de hoy.", refs: [] },
    { t: "EAST", en: "Easy, Attractive, Social, Timely", cat: "herramienta", d: "Marco para diseñar intervenciones conductuales: que la conducta sea fácil, atractiva, social y oportuna.", refs: ["Long et al., 2023"] },
    { t: "Efecto techo", en: "Ceiling effect", cat: "evaluacion", d: "Situación en la que una intervención ya no puede mejorar la conducta porque la tasa de partida es muy alta.", refs: ["Lee et al., 2024"] },
    { t: "Encuadre", en: "Framing", cat: "concepto", d: "Presentar la misma información de formas distintas (ganancias o pérdidas) cambia la decisión.", refs: ["Waheed, 2023"] },
    { t: "Heterogeneidad (I²)", en: "Heterogeneity", cat: "evaluacion", d: "Proporción de la variabilidad entre estudios que no se explica por azar. Un I² de 96 % indica efectos muy distintos entre estudios.", refs: ["Zhou et al., 2025"] },
    { t: "Incentivo financiero", en: "Financial incentive", cat: "herramienta", d: "Recompensa o penalidad monetaria condicionada a una conducta verificable.", refs: ["Bolívar et al., 2021"] },
    { t: "Lotería de incentivos", en: "Lottery incentive", cat: "herramienta", d: "Incentivo en el que cumplir la conducta da la oportunidad de ganar un premio. Usa el atractivo de las probabilidades pequeñas.", refs: ["Ahmed et al., 2023"] },
    { t: "Manejo de contingencias", en: "Contingency management", cat: "herramienta", d: "Entrega sistemática de recompensas cuando se verifica la conducta objetivo (por ejemplo, abstinencia). Forma clásica del incentivo en salud.", refs: ["Bolívar et al., 2021", "Phillips-Chantelois et al., 2025"] },
    { t: "Mensajero", en: "Messenger effect", cat: "concepto", d: "El peso de un mensaje depende de quién lo envía; la recomendación médica es un mensajero potente en vacunación.", refs: [] },
    { t: "MINDSPACE", en: "MINDSPACE", cat: "herramienta", d: "Marco de nueve principios conductuales (mensajero, incentivos, normas, defaults, saliencia, priming, afecto, compromisos y ego), ampliado a 34 insights.", refs: ["Hodson et al., 2025"] },
    { t: "NNT", en: "Number needed to treat", cat: "evaluacion", d: "Número de personas que hay que intervenir para lograr una persona adicional con la conducta: 100 dividido por la diferencia en puntos porcentuales.", refs: [] },
    { t: "Normas sociales", en: "Social norms", cat: "concepto", d: "Información sobre lo que hacen o aprueban los demás, usada para orientar la conducta.", refs: [] },
    { t: "Nudge", en: "Nudge", cat: "herramienta", d: "Cambio en la arquitectura de la elección que orienta la decisión sin restringir opciones ni cambiar los incentivos financieros.", refs: ["Cesareo et al., 2022"] },
    { t: "Opt-out / opt-in", en: "Opt-out / opt-in", cat: "herramienta", d: "En opt-out la persona queda incluida salvo que se retire (como la presunción de donación); en opt-in debe inscribirse activamente.", refs: [] },
    { t: "Paternalismo libertario", en: "Libertarian paternalism", cat: "concepto", d: "Postura que justifica orientar las decisiones hacia el bienestar de la persona preservando su libertad de elegir; es el fundamento normativo de los nudges y su principal fuente de crítica.", refs: ["Quintas, 2024", "Shang et al., 2025"] },
    { t: "Persistencia del efecto", en: "Persistence", cat: "evaluacion", d: "Si el cambio de conducta se mantiene después de retirar la intervención. Es la principal debilidad de los incentivos.", refs: ["Abellán-Perpiñán et al., 2025", "Reisgies et al., 2023"] },
    { t: "Saliencia", en: "Salience", cat: "concepto", d: "Qué tan visible o llamativa es una información en el momento de decidir. Los sellos de advertencia aumentan la saliencia.", refs: ["Almeida et al., 2024"] },
    { t: "Sesgo de publicación", en: "Publication bias", cat: "evaluacion", d: "Tendencia a publicar más los estudios con resultados positivos, que infla el efecto promedio estimado.", refs: ["Kaiser et al., 2025", "Ahadinezhad et al., 2024"] },
    { t: "Sesgo del presente", en: "Present bias", cat: "concepto", d: "Preferencia desproporcionada por los costos y beneficios inmediatos sobre los futuros. Explica buena parte de la no adherencia.", refs: ["Reed et al., 2021", "Sanny et al., 2026"] },
    { t: "Sludge", en: "Sludge", cat: "concepto", d: "Fricción administrativa que dificulta decisiones convenientes, como cambiar de plan o completar un trámite. Es lo opuesto a un nudge.", refs: ["Hodson et al., 2026", "Krishnan et al., 2022"] },
    { t: "Transferencia monetaria condicionada", en: "Conditional cash transfer", cat: "herramienta", d: "Pago a hogares condicionado a conductas como asistir a controles de salud o a la escuela. Ejemplos: Familias en Acción y Bolsa Família.", refs: ["Magalhães et al., 2024"] },
    { t: "Valor de referencia (umbral)", en: "Willingness-to-pay threshold", cat: "evaluacion", d: "Cuánto está dispuesto a pagar un decisor por cada resultado adicional. En la calculadora se compara con el costo por persona adicional, como una RCEI frente a un umbral.", refs: [] }
  ],
  glossaryCats: [
    { id: "concepto", label: "Conceptos conductuales", color: "cat-a" },
    { id: "herramienta", label: "Herramientas", color: "cat-d" },
    { id: "evaluacion", label: "Evaluación y medición", color: "cat-c" }
  ],

  /* ---------------- 08 MÉTODOS ---------------- */
  methods: {
    review: "La app se apoya en una revisión de alcance propia sobre economía del bienestar y del comportamiento aplicada a la salud (marco PCC, reporte según PRISMA-ScR), con búsquedas del 18 de octubre de 2026 en PubMed/MEDLINE, Embase, Cochrane Library, SciELO, RePEc/IDEAS y Google Scholar, más literatura gris de la OMS y el BID. De 929 registros se incluyeron 174 documentos de 2021 a 2026, en tres ejes: sesgos y marcos de bienestar (53), promoción de la salud y adherencia (81) y estudios observacionales con perspectiva económica (50).",
    lilacs: "LILACS no se pudo ejecutar en la fecha de la búsqueda porque el portal estaba en mantenimiento; su incorporación está en curso. Es la base más pertinente para la producción latinoamericana, por lo que la evidencia regional citada aquí probablemente está subestimada.",
    flow: [
      { label: "Registros identificados en bases", n: 929 },
      { label: "Registros examinados", n: 792 },
      { label: "Buscados a texto completo", n: 179 },
      { label: "Incluidos (172 de bases + 2 de literatura gris)", n: 174 },
      { label: "Citados en esta app", n: null }
    ],
    extraSources: "Los ejemplos colombianos (sección 05) no provienen de la revisión: se identificaron de forma dirigida en fuentes oficiales (normogramas de la Superintendencia de Salud, el INVIMA y la Cancillería, el Gestor Normativo de Función Pública, FAOLEX) y en reportes del programa de prevención del VPH de la American Cancer Society. Cada enlace se comprobó antes de publicar.",
    labels: [
      { level: "verificado", text: "La cifra o el hecho proviene de un documento con enlace verificado." },
      { level: "nota-autor", text: "Síntesis, clasificación, propuesta o dato ilustrativo del autor." }
    ],
    limitations: [
      "El cribado y la extracción los hizo un solo revisor asistido por IA, con verificación del autor; la extracción se basó en los resúmenes.",
      "La calculadora es aritmética simple: no ajusta por inflación, no descuenta ni modela costos evitados o resultados en salud.",
      "El caso real de la calculadora es un reporte de programa, no un artículo revisado por pares.",
      "La clasificación de las normas colombianas como nudge o incentivo es interpretación del autor."
    ],
    methodRefs: [
      { label: "Tricco AC et al. PRISMA Extension for Scoping Reviews (PRISMA-ScR). Ann Intern Med. 2018;169(7):467-473.", url: "https://doi.org/10.7326/M18-0850" }
    ]
  },

  conclusion: "Nudges e incentivos cambian conductas de salud por caminos distintos: uno guía y el otro recompensa. La evidencia 2021–2026 muestra efectos reales pero modestos, que en el caso de los incentivos suelen desaparecer al retirarlos. En Colombia ya existen defaults poderosos en la norma —donación de órganos, afiliación de oficio— y un caso medido de mensajes de texto que gana vacunaciones a muy bajo costo. El paso siguiente es evaluar cada intervención como cualquier tecnología sanitaria: cuánto cuesta cada punto ganado, cuánto dura y a quién beneficia."
};
