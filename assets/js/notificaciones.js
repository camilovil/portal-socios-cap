/* ------------------------------------------------------------------
   notificaciones.js — Campana de notificaciones del socio

   Antes la campana existia solo en home.html: al entrar a cualquier
   otra seccion desaparecia. Ahora se construye una sola vez aca y se
   inyecta en la barra de utilidades de cada pagina con sesion, igual
   que el menu lateral (menu-socios.js).

   NOTIFICACIONES es el punto donde CleverSoft inyectaria los avisos
   reales. "Marcar todas como leidas" se recuerda en el dispositivo
   para que el contador no reaparezca al cambiar de seccion.
   ------------------------------------------------------------------ */

(() => {
  'use strict';

  const LEIDAS = 'cap-notif-leidas';

  const NOTIFICACIONES = [
    {
      tipo: 'pago',
      titulo: 'Tu cuota de julio vence el 10',
      texto: 'Pagala antes del vencimiento y evitá el recargo.',
      accion: 'Pagar ahora',
      href: 'pagos-pendientes.html',
      cuando: 'hace 2 h',
      nueva: true
    },
    {
      tipo: 'turno',
      titulo: 'Turno confirmado: Pileta, sábado 14 h',
      texto: 'Presentá tu carnet digital en el acceso.',
      accion: 'Ver mis turnos',
      href: 'turnos.html',
      cuando: 'ayer',
      nueva: true
    },
    {
      tipo: 'calamar',
      titulo: 'Nuevo beneficio en Zona Calamar',
      texto: '30% de descuento en gastronomía del barrio.',
      accion: 'Ver beneficios',
      href: 'beneficios.html',
      cuando: 'hace 3 d',
      nueva: true
    },
    {
      tipo: 'info',
      titulo: 'Se abrió la inscripción a Fútbol Infantil',
      texto: 'Cupos limitados por categoría.',
      accion: 'Inscribirme',
      href: 'inscripciones.html',
      cuando: 'hace 1 sem',
      nueva: false
    }
  ];

  const ICONOS = {
    pago: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    turno: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    calamar: '<path d="M20 12V8H6a2 2 0 0 1 0-4h12v4"/><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>',
    info: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/>'
  };

  const CAMPANA =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
    '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>';

  const yaLeidas = () => {
    try { return localStorage.getItem(LEIDAS) === '1'; }
    catch (e) { return false; }
  };

  const recordarLeidas = () => {
    try { localStorage.setItem(LEIDAS, '1'); } catch (e) { /* modo privado */ }
  };

  /* --- Construccion -------------------------------------------------- */

  const item = (n, leidas) =>
    '<li class="notif-item' + (n.nueva && !leidas ? ' notif-item--unread' : '') + '">' +
      '<span class="notif-ico notif-ico--' + n.tipo + '" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
        ICONOS[n.tipo] + '</svg>' +
      '</span>' +
      '<div class="notif-body">' +
        '<p class="notif-title">' + n.titulo + '</p>' +
        '<p class="notif-text">' + n.texto + '</p>' +
        '<a class="notif-cta" href="' + n.href + '">' + n.accion + '</a>' +
      '</div>' +
      '<span class="notif-time">' + n.cuando + '</span>' +
    '</li>';

  const construir = () => {
    const leidas = yaLeidas();
    const nuevas = leidas ? 0 : NOTIFICACIONES.filter((n) => n.nueva).length;

    const wrap = document.createElement('div');
    wrap.className = 'notif-wrap';
    wrap.innerHTML =
      '<button type="button" class="notif-trigger" id="notification-icon" ' +
        'aria-label="Notificaciones" aria-expanded="false" aria-controls="notifDropdown">' +
        CAMPANA +
        (nuevas ? '<span class="notification-dot" id="notifDot" aria-hidden="true">' + nuevas + '</span>' : '') +
      '</button>' +
      '<div class="notif-dropdown" id="notifDropdown" role="region" aria-label="Tus notificaciones">' +
        '<div class="notif-head">' +
          '<strong>Notificaciones</strong>' +
          '<button type="button" class="notif-clear">Marcar todas como leídas</button>' +
        '</div>' +
        '<ul class="notif-list" id="notifList">' +
          NOTIFICACIONES.map((n) => item(n, leidas)).join('') +
        '</ul>' +
      '</div>';
    return wrap;
  };

  /* --- Montaje -------------------------------------------------------- */

  const barra = document.querySelector('.utility-bar .right');
  if (!barra || document.body.classList.contains('sin-sesion')) return;

  const wrap = construir();
  barra.prepend(wrap);

  const boton = wrap.querySelector('.notif-trigger');
  const panel = wrap.querySelector('.notif-dropdown');

  const cerrar = () => {
    panel.classList.remove('open');
    boton.setAttribute('aria-expanded', 'false');
  };

  boton.addEventListener('click', (e) => {
    e.stopPropagation();
    const abierto = panel.classList.toggle('open');
    boton.setAttribute('aria-expanded', String(abierto));
    const perfil = document.getElementById('profileDropdown');
    if (perfil) perfil.classList.remove('open');
  });

  /* Los clics dentro del panel no deben cerrarlo. */
  panel.addEventListener('click', (e) => e.stopPropagation());

  wrap.querySelector('.notif-clear').addEventListener('click', () => {
    panel.querySelectorAll('.notif-item--unread')
      .forEach((el) => el.classList.remove('notif-item--unread'));
    const punto = document.getElementById('notifDot');
    if (punto) punto.remove();
    recordarLeidas();
  });

  document.addEventListener('click', cerrar);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrar();
  });
})();
