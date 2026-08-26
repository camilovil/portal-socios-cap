# DECISIONES DEL PROYECTO

Cada decisión queda registrada con fecha y estado. Si una decisión reemplaza a otra, se anota en "Reemplaza / Reemplazada por".

---

## DECISION-001

**Fecha:** 2026-07-03

No modificar la lógica de CleverSoft.

**Estado:** Aceptada

---

## DECISION-002

**Fecha:** 2026-07-03

Las plantillas HTML existentes son definitivas.

**Estado:** Aceptada

---

## DECISION-003

**Fecha:** 2026-07-03

No utilizar React.

**Motivo:** Compatibilidad con CleverSoft (sin build step, sin dependencias de framework).

**Estado:** Aceptada

---

## DECISION-004

**Fecha:** 2026-07-03

Bootstrap 4 permanece. No se migra de framework.

**Estado:** Aceptada

---

## DECISION-005

**Fecha:** 2026-07-03

No se agregará una sección de Noticias.

**Motivo:** Ya existe la web institucional. El Portal debe brindar servicios al socio.

**Estado:** Aceptada

---

## DECISION-006

**Fecha:** 2026-07-03

Los tres pilares del Portal serán: Área Calamar, Credencial Digital, Zona Calamar.

**Estado:** Aceptada

---

## DECISION-007

**Fecha:** 2026-07-03

Vida Calamar queda postergado para una futura versión. No forma parte del MVP.

**Estado:** Aceptada

---

## DECISION-008

**Fecha:** 2026-07-03

El proyecto se desarrolla Desktop First (Desktop → Tablet → Mobile), siguiendo el orden en que fueron diseñadas las plantillas aprobadas.

**Estado:** Aceptada — *pendiente de confirmar contra datos reales de tráfico mobile/desktop de los socios. Si el tráfico es mayormente mobile, evaluar una decisión que invierta este orden.*

---

## DECISION-009

**Fecha:** 2026-07-03

Zona Calamar hoy existe como página separada (su propio `.php`, con navegación y template propios). El plan del proyecto es que pase a integrarse como una sección dentro de `index.php` (la Home), en vez de seguir siendo una página aparte.

**Motivo:** Consolidar la experiencia del socio en el home en lugar de fragmentarla en páginas independientes.

**Estado:** Aceptada — *implementación pendiente. Hasta que se ejecute la migración, tratar Zona Calamar como página independiente (no asumir que ya vive dentro de index.php).*

---

<!--
Plantilla para nuevas decisiones:

## DECISION-0XX

**Fecha:** AAAA-MM-DD

[Descripción de la decisión]

**Motivo:** [opcional]

**Estado:** Aceptada / Rechazada / Reemplazada por DECISION-0YY
-->

## DECISION-010

**Fecha:** 2026-08-26

El prototipo público se publica con una capa propia y separable
(`assets/css/prototipo.css`, `assets/js/prototipo.js`) que agrega el
distintivo de "no oficial", la afordancia de los enlaces sin destino y la
derivación a la maqueta mobile.

**Motivo:** el prototipo se comparte públicamente en redes, pero nada de
eso pertenece al diseño aprobado. Al integrar a CleverSoft se borran esos
dos archivos y sus dos `<link>`/`<script>`, y las plantillas quedan
exactamente como el diseño aprobado.

**Estado:** Aceptada

---

## DECISION-011

**Fecha:** 2026-08-26

Las tipografías Gotham y Awesome Serif se reemplazan por Montserrat y
Playfair Display Italic (ambas SIL OFL), self-hosteadas como woff2.

**Motivo:** Gotham y Awesome Serif son comerciales. Servir sus `.otf`
desde un servidor público las hace descargables por cualquiera, lo que
constituye redistribución del binario y viola la licencia con
independencia del carácter no comercial del proyecto. Es el único riesgo
del prototipo que es verificable con un `curl` y no admite interpretación.

**Consecuencia:** cambio tipográfico leve pero real en todas las páginas.
El alias `'Calamar'` se conserva como nombre semántico del proyecto.
Reversible: si se compra la licencia de webfont de Gotham, solo cambian
los `src` de `assets/css/tipografias.css`.

**Estado:** Aceptada — *reemplaza el uso de Gotham definido en el kit de marca.*

---

## DECISION-012

**Fecha:** 2026-08-26

El ingreso por email queda funcional en el prototipo, usando los IDs
reales de CleverSoft (`tab-sesion-email`, `contentSessionEmail`,
`btnEnviarCodigo`).

**Motivo:** doble. El tab existía y no hacía nada al tocarlo. Y el login
por contraseña exige credenciales fijas cuyo cartel se quitó en 344d1d7,
así que quien llegara desde redes no podía entrar a la demo. El ingreso
por email es ahora la puerta de entrada pública, y además replica el flujo
real de CleverSoft (`enviarCodigoLogin` → `validateCodigo`).

**Estado:** Aceptada

---

## DECISION-013

**Fecha:** 2026-08-26

El Portal tiene **una sola home responsive** (`home.html`). Se elimina el
desvío por dispositivo que mandaba los celulares a `mobile-home.html`.

**Motivo:** `mobile-home.html` nunca fue una versión responsive: es una
maqueta con marco de teléfono (`.device { width: 400px }` sobre fondo
oscuro) hecha para presentar el diseño mobile en una pantalla de
escritorio. Mantener dos archivos ya había producido divergencia real:
al agregarse Notificaciones y la sección de Zona Calamar en `home.html`,
la versión mobile quedó vieja y ofrecía 3 accesos contra 9.

**Verificación:** medido en navegador real a 390 px, `home.html` no
produce scroll horizontal (`scrollWidth` = `innerWidth` = 390) y sus
media queries reacomodan todo: grilla a una columna, tarjeta en
vertical, banda de Zona Calamar a una columna, hamburguesa visible.

**Ejecutado:** `mobile-home.html` fue eliminada del repositorio junto con
el código que la sostenía (la derivación en `prototipo.js`, la regla de
desenmarcado en `prototipo.css` y el comentario de `home.html` que
indicaba usarla en mobile). Queda en el historial de git si hiciera falta
recuperarla.

**Estado:** Aceptada

---
