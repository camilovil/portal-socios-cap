/* ------------------------------------------------------------------
   prototipo.js
   Capa exclusiva del prototipo publico. Agrega el distintivo de "no
   oficial" y da afordancia a los enlaces que todavia no tienen destino.

   Ya no hay desvio por dispositivo: home.html es responsive y se
   reacomoda sola. Mantener dos archivos hacia que la version mobile
   quedara vieja (ver DECISION-013).

   No pertenece al Portal ni a CleverSoft. Si este trabajo se integra,
   se elimina este archivo y las plantillas quedan intactas.
   ------------------------------------------------------------------ */

(() => {
  'use strict';

  const pageName = () => {
    const last = window.location.pathname.split('/').pop() || '';
    return last.replace(/\.html$/, '') || 'index';
  };

  /**
   * Marca los enlaces sin destino para que no parezcan rotos.
   * No se les cambia el href: se anula el salto y se muestra el
   * estado real de la seccion.
   */
  const flagPendingLinks = () => {
    const pending = document.querySelectorAll('a[href="#"]:not(.proto-badge)');

    pending.forEach((link) => {
      link.classList.add('proto-soon');
      link.setAttribute('aria-disabled', 'true');

      const label = (link.getAttribute('aria-label') || link.textContent || '').trim();
      if (label) link.setAttribute('title', `${label} — próximamente`);

      link.addEventListener('click', (event) => event.preventDefault());
    });
  };

  /** Distintivo permanente de prototipo no oficial. */
  const mountBadge = () => {
    if (document.querySelector('.proto-badge')) return;

    const badge = document.createElement('a');
    badge.className = 'proto-badge';
    badge.href = 'aviso-legal.html';
    badge.setAttribute(
      'aria-label',
      'Prototipo no oficial, hecho por un socio. Ver el aviso legal.'
    );
    badge.innerHTML =
      '<span class="proto-badge__dot" aria-hidden="true"></span>' +
      '<span class="proto-badge__text"><strong>Prototipo no oficial</strong>' +
      '<span> · hecho por un socio</span></span>';

    document.body.appendChild(badge);
  };

  const init = () => {
    if (!document.body) return;
    flagPendingLinks();
    mountBadge();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
