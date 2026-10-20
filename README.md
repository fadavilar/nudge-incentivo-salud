# Nudge o incentivo: guiar o recompensar la conducta en salud

Explorador interactivo para estudiantes de administración en salud, equipos de evaluación económica y gestores de programas en Colombia. Explica qué diferencia a un *nudge* de un incentivo, resume la evidencia 2021–2026 y trae una calculadora del costo de un punto de adherencia con datos por defecto.

**Sitio:** https://fadavilar.github.io/nudge-incentivo-salud/

## Contenido

1. **Resumen**: tres mensajes clave y rutas de lectura según el perfil.
2. **La diferencia**: definiciones, seis dimensiones comparadas, un diagrama interactivo de las dos rutas hacia la conducta y cuatro familias de intervenciones.
3. **La evidencia**: incentivos, nudges y las tensiones de la literatura (persistencia, relevancia clínica, encuadre, sesgo de publicación).
4. **Calculadora**: costo de un punto de adherencia, personas a intervenir por cada adicional (NNT), costo por persona adicional (también con efecto sostenido) y comparación con un valor de referencia. Trae tres escenarios:
   - el caso real de mensajes de texto para la vacunación contra el VPH de Compensar EPS;
   - el ejercicio de clase, con datos ilustrativos;
   - un escenario editable para tu programa.

   Exporta a CSV, genera un enlace con los datos cargados y ofrece una plantilla Excel con fórmulas (`downloads/plantilla_costo_punto_adherencia.xlsx`).
5. **Colombia**: ocho normas y programas verificados en fuente oficial, clasificados como nudge o incentivo, más ideas para instituciones.
6. **Ética y diseño**: posiciones de la literatura y una lista de chequeo interactiva.
7. **Glosario**: 29 términos.
8. **Metodología y fuentes**: la revisión de alcance y los 60 documentos citados.
9. **Conclusión**.

## Fuentes y disciplina de contenido

- **Revisión de alcance de base:** marco PCC y reporte según PRISMA-ScR, con 174 documentos de 2021 a 2026. Las búsquedas se hicieron el 18 de octubre de 2026 en PubMed, Embase, Cochrane, SciELO, RePEc y Google Scholar, más literatura gris de la OMS y el BID. La incorporación de LILACS está en curso.
- **Estudios citados:** se generan en `js/studies.js` desde la base verificada de la revisión, con DOI o URL comprobados.
- **Ejemplos colombianos:** cada uno enlaza a su norma o reporte original.
- **Etiquetas de procedencia:** «Verificado en fuente» (documento con enlace verificado), «Síntesis del autor» (clasificación, propuesta o dato ilustrativo) y «Pendiente de verificación».
- **Calculadora:** es aritmética simple y transparente. No ajusta por inflación ni modela costos evitados o resultados en salud.

## Técnica

HTML, CSS y JavaScript sin dependencias ni paso de compilación, servido tal cual por GitHub Pages:

- `js/data.js` y `js/studies.js` guardan el contenido;
- `js/app.js` contiene el motor y los render;
- `css/style.css` es el sistema de diseño compartido con los exploradores hermanos;
- `css/app.css` reúne los componentes propios.

Explorador hermano: [Fundamentos de economía aplicada a la salud](https://fadavilar.github.io/fundamentos-economia-salud/) (semana 1).

## Autoría y licencia

Fabian Dávila Ramírez, MD, MBA, PhD · Fundación Universitaria de Ciencias de la Salud (FUCS) · Universidad de Navarra · Universidad de Bogotá Jorge Tadeo Lozano.

Contenido bajo [Creative Commons Atribución 4.0 Internacional (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/deed.es).
