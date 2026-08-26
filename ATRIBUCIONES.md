# Atribuciones y licencias

Estado de los assets de terceros que usa el prototipo público.
La versión legible para el público vive en `aviso-legal.html`; este archivo
es el detalle técnico para el desarrollo.

---

## Naturaleza del proyecto

Prototipo de diseño **no oficial**, sin fines comerciales, hecho por un socio
del club por iniciativa propia. Sin relación con la administración del Club
Atlético Platense ni con CleverSoft / MiClub.

Esto es lo que sostiene todo lo demás: el uso no comercial y claramente
rotulado como no oficial es lo que hace defendible mostrar la identidad
visual del club. Si en algún momento el proyecto pasa a tener fin comercial,
**todo este archivo hay que revisarlo de nuevo.**

---

## Escudo, nombre y signos distintivos del club

- **Titular:** Club Atlético Platense.
- **Archivos:** `assets/img/escudo-cap-oficial.png`, `assets/img/escudo.svg`,
  `assets/img/cap-wordmark.svg`, `assets/img/favicon-192.png`,
  `assets/img/calamar-icon.png`, `assets/img/zonacalamar-logo.png`.
- **Situación:** riesgo bajo. Uso ilustrativo, no comercial, en un sitio
  rotulado como no oficial en todas sus páginas y con aviso legal accesible.
  El derecho de marcas protege contra la confusión en el comercio; acá no hay
  actividad comercial ni se sugiere respaldo del club.
- **Mitigación aplicada:** distintivo permanente "Prototipo no oficial" en
  todas las páginas + `aviso-legal.html` + retiro inmediato a pedido.

## Imágenes de comercios adheridos (Zona Calamar)

- **Titulares:** cada comercio adherido (Pizza Alla Pala, Tostado, Ronda,
  Deragopyan, Appa, Platense Manía, entre otros).
- **Archivos:** `Zona Calamar/*.webp`, `assets/img/zona-calamar/`.
- **Situación:** riesgo bajo-medio. Son materiales promocionales de terceros
  que no dieron permiso para aparecer acá. El problema no es el copyright de
  la placa, es que su presencia puede leerse como que esos comercios
  participan del prototipo.
- **Mitigación aplicada:** cláusula específica en `aviso-legal.html`.
- **Pendiente:** si alguno pide la baja, se saca esa placa y listo.

## Fotografías de plantel e hinchada

- **Archivos:** `images/*.jpg`.
- **Situación:** **SIN RESOLVER.** Origen no documentado (los nombres de
  archivo sugieren descargas de redes sociales). No sabemos quién sacó esas
  fotos. Fotografía deportiva profesional suele tener titular identificable
  y es de los rubros que más reclama.
- **Pendiente:** determinar el origen. Si no se puede acreditar, reemplazar
  por fotos propias o de banco con licencia libre.

## Tipografías

- **Montserrat** (`assets/fonts/montserrat-*.woff2`) — SIL Open Font
  License 1.1. Permite uso web, modificacion y redistribucion.
- **Playfair Display Italic** (`assets/fonts/playfair-italic-*.woff2`) —
  SIL Open Font License 1.1. Sirve al alias `'Calamar'` del proyecto.
- **Situación:** **RESUELTO** (26/08/2026).
- **Qué pasaba:** el diseño aprobado especifica Gotham (Hoefler&Co) y
  Awesome Serif, ambas comerciales. Los `.otf` se servían crudos desde el
  servidor público y eran descargables por cualquiera, lo que constituye
  redistribución del binario. Además, una licencia de escritorio no
  habilita `@font-face`; eso requiere licencia de webfont aparte.
- **Qué se hizo:** se eliminaron los cuatro `.otf` del repositorio y del
  servidor, y se reemplazaron por equivalentes con licencia libre,
  self-hosteadas como woff2 (186 KB contra 536 KB de los .otf).
  Equivalencias en `assets/css/tipografias.css`.
- **Nota:** si en algún momento se compra la licencia de webfont de
  Gotham, alcanza con cambiar los `src` de ese archivo. Ninguna plantilla
  referencia archivos de fuente directamente.

---

## Datos personales

El prototipo no recolecta ningún dato: sin analítica, sin cookies, sin
almacenamiento en el navegador y sin ningún formulario que envíe información.
El formulario de ingreso es decorativo. Verificable: no hay una sola llamada
de red saliente en todo el código.

Los datos de socio que se muestran son de ejemplo. El número de socio 955
corresponde al autor del prototipo, por decisión propia.

---

## Retiro de contenido

Cualquier titular que quiera la baja total o parcial de su material la obtiene
sin discusión. Contacto publicado en `aviso-legal.html`.
