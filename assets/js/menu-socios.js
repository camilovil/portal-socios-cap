/* ------------------------------------------------------------------
   menu-socios.js — Menu lateral del Portal de Socios

   Portado del diseño de MenuSocios.jsx a vanilla, porque el proyecto no
   usa React (DECISION-003): no hay build step, router ni componentes.
   Se conserva la estructura en secciones, el escalonado de entrada, el
   cierre por swipe y el estado activo del original.

   Se construye una sola vez y se inyecta en el <nav id="navDrawer"> que
   ya existe en cada pagina, asi el menu deja de estar duplicado en ocho
   archivos. El toggleNav() de cada plantilla sigue funcionando sin
   cambios: solo togglea la clase .open, que es lo que este componente
   observa.

   SOCIO y PENDIENTE de abajo son el punto donde CleverSoft inyectaria
   los valores reales.
   ------------------------------------------------------------------ */

(() => {
  'use strict';

  const SOCIO = { nombre: 'Camilo', numero: '955' };

  /* null cuando el socio esta al dia: la tarjeta desaparece sola. */
  const PENDIENTE = {
    cantidad: 1,
    detalle: 'Cuota de julio · $ 31.500',
    href: 'pagos-pendientes.html'
  };

  const SECCIONES = [
    {
      titulo: 'MI CUENTA',
      items: [
        { label: 'Inicio', href: 'home.html', icono: 'home' },
        { label: 'Mis Datos', href: 'mis-datos.html', icono: 'user' },
        { label: 'Mi carnet digital', href: 'home.html?ver=credencial', icono: 'card' }
      ]
    },
    {
      titulo: 'CUOTAS Y PAGOS',
      items: [
        { label: 'Mis Pagos Pendientes', href: 'pagos-pendientes.html', icono: 'card' },
        { label: 'Mis Pagos Realizados', href: 'pagos-realizados.html', icono: 'doc' },
        { label: 'Débito automático', href: 'inscripciones.html', icono: 'bank' }
      ]
    },
    {
      titulo: 'EL CLUB',
      items: [
        { label: 'Mis Turnos', href: 'turnos.html', icono: 'clock' },
        { label: 'Beneficios', href: 'beneficios.html', icono: 'gift' },
        { label: 'Sugerencias', href: '#', icono: 'chat' }
      ]
    }
  ];

  const TRAZOS = {
    home: 'M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z',
    user: 'M12 4.6a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8M5 20c1.4-3.6 4-5 7-5s5.6 1.4 7 5',
    card: 'M5.5 6h13a2.5 2.5 0 0 1 2.5 2.5v7A2.5 2.5 0 0 1 18.5 18h-13A2.5 2.5 0 0 1 3 15.5v-7A2.5 2.5 0 0 1 5.5 6M3 10.5h18',
    doc: 'M7.5 3.5h9a2.5 2.5 0 0 1 2.5 2.5v12a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 18V6a2.5 2.5 0 0 1 2.5-2.5M9 9h6M9 13h6M9 17h3',
    bank: 'M4 8h16v11H4zM4 8l8-4 8 4',
    clock: 'M12 3.8a8.2 8.2 0 1 1 0 16.4 8.2 8.2 0 0 1 0-16.4M12 8v4.5l3 2',
    gift: 'M5.5 8h13a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2M3.5 12.5h17M12 8v11.5',
    chat: 'M20 12.5c0 3.6-3.6 6.5-8 6.5-1 0-2-.15-2.9-.43L5 20l1.2-3.1A6.3 6.3 0 0 1 4 12.5C4 8.9 7.6 6 12 6s8 2.9 8 6.5z',
    chevron: 'M9 5l7 7-7 7',
    close: 'M6 6l12 12M18 6L6 18',
    logout: 'M14 5H7v14h7M11 12h9M17 9l3 3-3 3',
    trophy: 'M8 4h8v4a4 4 0 0 1-8 0zM12 12v4M9 20h6',
    externo: 'M7 17 17 7M9 7h8v8'
  };

  const icono = (nombre, ancho) =>
    '<svg class="ms-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' +
    (ancho || 1.5) +
    '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' +
    TRAZOS[nombre] + '"/></svg>';

  const paginaActual = () =>
    window.location.pathname.split('/').pop() || 'home.html';

  const esActivo = (href) => {
    const destino = href.split('?')[0];
    return destino !== '#' && destino === paginaActual();
  };

  /* --- Construccion -------------------------------------------------- */

  let orden = 0;
  const paso = () => '--i:' + orden++;

  const construir = () => {
    const cabecera =
      '<div class="ms-head">' +
        '<img src="assets/img/escudo-cap-oficial.png" alt="">' +
        '<div class="ms-head__quien">' +
          '<p class="ms-head__nombre">' + SOCIO.nombre + '</p>' +
          '<p class="ms-head__numero">SOCIO ' + SOCIO.numero + '</p>' +
        '</div>' +
        '<button type="button" class="ms-head__cerrar" onclick="toggleNav(false)" ' +
          'aria-label="Cerrar menú">' + icono('close', 1.9) + '</button>' +
      '</div>';

    const pendiente = (PENDIENTE && PENDIENTE.cantidad > 0)
      ? '<a class="ms-pendiente ms-it" href="' + PENDIENTE.href + '" style="' + paso() + '">' +
          '<span class="ms-pendiente__n">' + PENDIENTE.cantidad + '</span>' +
          '<span class="ms-pendiente__txt">' +
            '<strong>' + (PENDIENTE.cantidad === 1
              ? '1 cuota pendiente'
              : PENDIENTE.cantidad + ' cuotas pendientes') + '</strong>' +
            '<span>' + PENDIENTE.detalle + '</span>' +
          '</span>' +
          icono('chevron', 2) +
        '</a>'
      : '';

    const secciones = SECCIONES.map((sec) =>
      '<div class="ms-sec">' +
        '<p class="ms-sec__titulo ms-it" style="' + paso() + '">' + sec.titulo + '</p>' +
        sec.items.map((it) => {
          const activo = esActivo(it.href);
          return '<a class="ms-row ms-it" href="' + it.href + '" style="' + paso() + '"' +
            (activo ? ' aria-current="page"' : '') + '>' +
            icono(it.icono, activo ? 1.7 : 1.5) +
            '<span>' + it.label + '</span></a>';
        }).join('') +
      '</div>'
    ).join('');

    const pie =
      '<div class="ms-foot ms-it" style="' + paso() + '">' +
        '<a class="ms-cta" href="beneficios.html">' +
          icono('trophy', 1.8) + ' Sumate a Zona Calamar</a>' +
        '<div class="ms-foot__row">' +
          '<a class="ms-salir" href="login.html">' +
            icono('logout', 1.7) + ' Cerrar sesión</a>' +
          '<a class="ms-sitio" href="https://cap.org.ar" target="_blank" rel="noopener">' +
            'cap.org.ar ' + icono('externo', 1.8) + '</a>' +
        '</div>' +
      '</div>';

    return cabecera + pendiente +
      '<div class="ms-scroll">' + secciones + '</div>' + pie;
  };

  /* --- Montaje -------------------------------------------------------- */

  /* Paginas sin sesion: el menu de socio no debe existir. Antes el
     login mostraba "Camilo / SOCIO 955" y toda la navegacion privada
     antes de que nadie ingresara. */
  const SIN_SESION = ['login.html', 'index.html', ''];

  const drawer = document.getElementById('navDrawer');
  if (!drawer) return;

  if (SIN_SESION.indexOf(paginaActual()) !== -1) {
    document.body.classList.add('sin-sesion');
    drawer.remove();
    const fondo = document.getElementById('navBackdrop');
    if (fondo) fondo.remove();
    document.querySelectorAll('.hamburger-btn').forEach((b) => b.remove());
    /* toggleNav() de la plantilla ya no tiene sobre que actuar: se
       neutraliza para que un llamado suelto no tire un error. */
    window.toggleNav = function () {};
    return;
  }

  drawer.classList.add('ms-panel');
  drawer.setAttribute('aria-label', 'Menú de socio');
  drawer.setAttribute('tabindex', '-1');
  drawer.innerHTML = construir();

  /* Sugerencias todavia no tiene pantalla: se rotula como pendiente en
     lugar de dejar un enlace que no lleva a ningun lado. El chip se ve
     siempre, tambien en celular, donde no existe el hover. */
  drawer.querySelectorAll('a[href="#"]').forEach((a) => {
    a.classList.add('ms-row--pendiente');
    a.setAttribute('aria-disabled', 'true');
    a.insertAdjacentHTML('beforeend', '<em class="ms-chip">Próximamente</em>');
    a.addEventListener('click', (e) => e.preventDefault());
  });

  /* --- Comportamiento -------------------------------------------------- */

  let scrollPrevio = '';

  const abierto = () => drawer.classList.contains('open');

  /* toggleNav() de cada pagina solo cambia la clase: se observa ese
     cambio en vez de reemplazar la funcion, asi las plantillas quedan
     intactas. */
  new MutationObserver(() => {
    document.body.classList.toggle('con-menu-abierto', abierto());

    if (abierto()) {
      scrollPrevio = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      /* El foco va al panel y no al boton de cerrar: iOS le dibujaba su
         anillo azul del sistema apenas se abria el menu. Con teclado,
         el primer Tab ya entra a las opciones. */
      drawer.focus({ preventScroll: true });
    } else {
      document.body.style.overflow = scrollPrevio;
    }
  }).observe(drawer, { attributes: true, attributeFilter: ['class'] });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && abierto()) window.toggleNav(false);
  });

  /* Cierre arrastrando hacia la derecha. */
  let arrastre = null;

  drawer.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    arrastre = { x: t.clientX, y: t.clientY, eje: null, dx: 0 };
  }, { passive: true });

  drawer.addEventListener('touchmove', (e) => {
    if (!arrastre) return;
    const t = e.touches[0];
    const dx = t.clientX - arrastre.x;
    const dy = t.clientY - arrastre.y;

    if (!arrastre.eje) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      arrastre.eje = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
    if (arrastre.eje !== 'x') return;

    arrastre.dx = Math.max(0, dx);
    drawer.dataset.arrastrando = 'true';
    drawer.style.transform = 'translateX(' + arrastre.dx + 'px)';
  }, { passive: true });

  drawer.addEventListener('touchend', () => {
    if (!arrastre) return;
    const recorrido = arrastre.dx;
    arrastre = null;
    drawer.dataset.arrastrando = 'false';
    drawer.style.transform = '';
    if (recorrido > 70) window.toggleNav(false);
  });
})();
