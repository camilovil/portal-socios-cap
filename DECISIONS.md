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
