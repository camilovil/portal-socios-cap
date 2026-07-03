# PROJECT_CONTEXT

## Proyecto

Portal de Socios 2026
Club Atlético Platense

---

## Objetivo

Este proyecto tiene como finalidad modernizar completamente la experiencia visual del Portal de Socios del Club Atlético Platense.

NO se está desarrollando un nuevo sistema.
NO se reemplaza CleverSoft.
NO se modifica la lógica de negocio.

Todo el desarrollo se realiza sobre la capa de presentación (Frontend).

---

## Plataforma

El Portal funciona sobre CleverSoft / MiClub.
CleverSoft seguirá siendo el motor del sistema.
El proyecto únicamente reemplaza la experiencia visual.

---

## Stack técnico

- Backend: PHP (CleverSoft / CleverKiosk v3.0.0), sin modificaciones. Patrón confirmado: cada `.php` actúa como controlador único, enrutando por un parámetro `action` vía POST a la misma URL (no hay endpoints REST separados).
- Frontend: HTML + CSS + JavaScript, sin build step (no npm/Webpack/Vite salvo autorización expresa).
- Framework CSS: Bootstrap 4.6, servido local (no CDN) — se mantiene, no se migra (ver DECISION-004).
- jQuery 2.1.1 (confirmado, cargado desde code.jquery.com) — no actualizar de versión sin autorización.
- Otras librerías ya presentes que pueden seguir usándose: Font Awesome 6.7.2, SweetAlert2 v11, Summernote 0.9.0, bs-custom-file-input, Google Fonts (Roboto, Material Icons).
- Multi-tenant: el mismo codebase sirve a varios clubes; el club activo se determina por `data-empresa` y clase `empresa-{club}` en el `<body>`.
- Sin frameworks de componentes (React/Vue/Angular).
- Posible legacy a revisar (no tocar sin permiso): Google Analytics Universal Analytics (`UA-46092108-1`), deprecado por Google desde 2023.

---

## Contrato con CleverSoft

Confirmado por inspección del código fuente real de `login.php` (2026-07-03):

- **Renderizado:** no hay bloques `<?php ?>` visibles en el HTML que llega al navegador (se resuelven en servidor). Pero hay evidencia directa de generación por PHP: el comentario `<!-- Esto Funca porque arriba se crea la variable $order -->` en el sidebar, y los bloques de menú (Mis Datos, Mis Pagos Pendientes, etc.) repetidos dos veces con espaciado irregular idéntico — consistente con un `foreach` de PHP iterando un array de items. Esos bloques repetidos se tratan como generados dinámicamente, no como HTML estático a mano.
- **Patrón de backend:** el form de login (`#lform`) no tiene `action` — postea a la misma URL. Todas las llamadas AJAX (`$.post("", {action: "..."})`) también postean a la página actual con un parámetro `action` (`getCaptcha`, `enviarCodigoLogin`, `validateCodigo`, `deleteCodigoAcceso`, `loginUsuarioSeleccionado`). Cada `.php` es un controlador único que enruta por `action` — cualquier JS nuevo debe seguir este mismo patrón, no asumir endpoints REST separados.
- **IDs/names intocables** (leídos por JS o por el backend): `frm_user`, `frm_password`, `frm_captcha`, `captchaImg`, `btnReloadCatpcha`, `loginBtn`, `btnEnviarCodigo`, `lform`, `myTab`, `tab-sesion-password`, `tab-sesion-email`, `contentSessionPassword`, `contentSessionEmail`, `modalTimerLoginEmail` (+ sub-ids), `modalClientesEmail` (+ sub-ids), `notification-icon`, `close-sidebar`. El hidden `debug` se preserva tal cual.
- **Multi-tenant confirmado:** `data-empresa="clubplatense"` en `<main>` y `class="empresa-clubplatense"` en `<body>` deciden el branding/tema activo. El mismo archivo trae CSS hardcodeado de otro club (`.empresa-clubitaliano` en el `<head>`) — confirma por qué la regla de "nunca tocar Themes de otros clubes ni archivos compartidos" (CLAUDE.md) es necesaria, no solo teórica.
- `data-idcliente` se setea dinámicamente por JS al listar clientes con el mismo email — no es un valor fijo del HTML.
- **Kiosco físico:** funciones globales `appCloseWindow()`, `appGoTo()`, `appLogin()` sugieren que este HTML también corre embebido en un kiosco (CleverKiosk, según el footer). No renombrar ni eliminar estas funciones.
- **Versiones confirmadas:** jQuery 2.1.1 (code.jquery.com), Bootstrap 4.6 servido local (`css_v2/bootstrap4.min.css`, `js_v2/bootstrap4.min.js`). Otras libs presentes en esta página: Summernote 0.9.0, Font Awesome 6.7.2, SweetAlert2 v11, bs-custom-file-input, Google Fonts, Google Analytics Universal (`UA-46092108-1` — propiedad deprecada por Google desde 2023, posible tracker muerto a confirmar).

**Nota (no es un bug):** las imágenes de WhatsApp/Email del footer apuntan a `modules/user/clubcasla/img/...` en ambas páginas. No es un error de Platense — son íconos genéricos (no llevan branding de club) servidos desde una carpeta de módulo compartida entre clubes dentro del mismo sistema multi-tenant CleverSoft. Se documenta igual porque confirma que no todos los assets de un club viven necesariamente en su propia carpeta `modules/user/{club}/` — al tocar rutas de imágenes hay que verificar primero si son específicas del club o compartidas entre todos.

**Confirmado por inspección de `index.php` (post-login, 2026-07-03):**

- **Header/footer compartido:** jQuery 2.1.1, Bootstrap 4.6, Font Awesome, Summernote, Google Fonts, Google Analytics (`UA-46092108-1`) y las funciones de kiosco (`appCloseWindow`, `appGoTo`, `appLogin`) aparecen idénticas en `login.php` e `index.php` — confirma que salen de un header/footer PHP compartido (probablemente `header.php`/`footer.php` incluidos en cada página), no copiados a mano. Cualquier cambio a esa zona impacta todas las páginas del portal a la vez.
- **Variables JS inicializadas por PHP (sin tag `<?php?>` visible porque ya se resolvieron):** en `index.php` aparecen `var cancelParam`, `asunto`, `descripcion`, `id_contacto`, `modo`, `cant` con valores vacíos/0 en este render — son placeholders que en el archivo fuente real seguramente se completan con `<?php echo ...; ?>`. Es el mismo patrón que los `<?php ?>` inline: buscar declaraciones `var` al inicio de un `<script>` como posible punto de inyección de PHP, no asumir que un script sin tags visibles es 100% estático.
- **El parámetro de ruteo POST no es siempre `action`:** en `login.php` se usa `action` (`getCaptcha`, `validateCodigo`, etc.); en `index.php` el POST a sí mismo usa `grabar: 1` en cambio. Confirma que cada página define su propio contrato de parámetros — no generalizar un nombre fijo al agregar JS nuevo, hay que revisar cada página antes de tocar sus llamadas AJAX.
- **Grid de accesos rápidos** (`#main-container__contentItemsMenu`, futura "Área Calamar"): se genera con el mismo array de items que el menú de navegación (ícono + título + subtítulo + link), vía el mismo `foreach` marcado por el comentario `$order`. Hay huecos/espacios vacíos entre algunos items en el HTML crudo — sugiere que el loop puede omitir u ocultar ítems según permisos del socio. Al tocar este grid, no asumir una cantidad fija de tarjetas (hoy son 6, pero el layout debe tolerar menos).
- Comentario `<!-- $flag_index_banner -> path desde user/... -->`: confirma que existe un banner condicional en la home controlado por una variable de configuración por club. No se ve renderizado en este capture (probablemente desactivado para este club/sesión).
- Estilos puntuales sueltos en `<style>` inline dentro de la propia página (overrides de SweetAlert2, `.notification-dot`) en vez de estar en los `.css` compartidos — patrón a tener en cuenta para una futura limpieza de CSS, no urgente.

Pendiente:
- [ ] Confirmar si existe entorno de staging antes de producción.
- [ ] Inspeccionar la plantilla de Credencial Digital.
- [ ] Inspeccionar Zona Calamar — hoy es una página propia y separada (no vive dentro de `index.php`), así que puede tener su propio patrón de datos/backend distinto al ya relevado acá. El plan a futuro es integrarla como sección del home (ver DECISION-009), pero esa migración todavía no ocurrió.

Hasta resolver los pendientes, todo elemento no reconocible como HTML/CSS/JS estándar, y todo `<script>` con variables inicializadas vacías al principio, se trata como potencial punto de inyección de PHP y por lo tanto intocable por defecto.

---

## Estado actual

Ya existe un conjunto completo de plantillas HTML diseñadas específicamente para este proyecto.
Estas plantillas representan la versión oficial del Portal.
Se consideran aprobadas.

Claude nunca debe generar nuevas pantallas salvo que el desarrollador lo solicite explícitamente.

---

## Filosofía

El objetivo no es crear otro portal.
El objetivo es que el socio sienta que CleverSoft evolucionó.
Toda mejora debe parecer una evolución natural del sistema.
Nunca una ruptura.

---

## Alcance

El proyecto incluye:
- Área Calamar
- Credencial Digital
- Zona Calamar

No incluye noticias institucionales.
La web pública del club seguirá siendo el medio oficial para noticias.

---

## Rol de Claude

Claude actúa como Lead Frontend Engineer.
No actúa como diseñador.
No toma decisiones de UX sin autorización.
No modifica layouts.
No cambia la identidad visual.

Su función consiste en mejorar la calidad técnica del proyecto.

---

## Objetivo técnico

Lograr que el código sea:
- limpio
- mantenible
- escalable
- reutilizable
- compatible con CleverSoft
- accesible (WCAG 2.1 AA como mínimo)
- compatible con las últimas 2 versiones de los navegadores principales (desktop y mobile)

---

## Objetivo final

Si mañana CleverSoft quisiera adoptar oficialmente este trabajo, el código debería poder integrarse con el mínimo esfuerzo posible.
