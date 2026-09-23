/* ------------------------------------------------------------------
   pwa.js — Instalacion del Portal como app

   Registra el service worker y ofrece instalar la app cuando el
   navegador lo permite. En iOS no existe la invitacion automatica:
   Safari solo instala desde Compartir > Agregar a inicio, asi que ahi
   se muestran las instrucciones.

   El aviso aparece una sola vez por dispositivo: si lo cierran, no
   vuelve a molestar.
   ------------------------------------------------------------------ */

(() => {
  'use strict';

  const RECHAZADO = 'cap-instalar-rechazado';

  const yaEstaInstalada = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const esIOS = () =>
    /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;

  const fueRechazado = () => {
    try { return localStorage.getItem(RECHAZADO) === '1'; }
    catch (e) { return false; }
  };

  const recordarRechazo = () => {
    try { localStorage.setItem(RECHAZADO, '1'); } catch (e) { /* modo privado */ }
  };

  /* --- Estado de toque en iPhone ------------------------------------
     Safari de iOS no aplica :active al tocar si la pagina no escucha
     toques. Sin esto no se ve ninguna respuesta al presionar (sombreado
     del menu, hundido de botones de animaciones.css). */

  document.addEventListener('touchstart', () => {}, { passive: true });

  /* --- Service worker ---------------------------------------------- */

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* Sin service worker el sitio funciona igual, solo pierde el
           modo sin conexion. No hay nada que informarle al socio. */
      });
    });
  }

  /* --- Invitacion a instalar --------------------------------------- */

  const construirAviso = (texto, alInstalar) => {
    const aviso = document.createElement('div');
    aviso.className = 'instalar-app';
    aviso.setAttribute('role', 'region');
    aviso.setAttribute('aria-label', 'Instalar la aplicación');

    const cuerpo = document.createElement('div');
    cuerpo.className = 'instalar-app__texto';
    cuerpo.innerHTML =
      '<strong>Tené tu carnet a mano</strong>' +
      `<span>${texto}</span>`;

    const acciones = document.createElement('div');
    acciones.className = 'instalar-app__acciones';

    if (alInstalar) {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'instalar-app__ok';
      boton.textContent = 'Instalar';
      boton.addEventListener('click', alInstalar);
      acciones.appendChild(boton);
    }

    const cerrar = document.createElement('button');
    cerrar.type = 'button';
    cerrar.className = 'instalar-app__cerrar';
    cerrar.textContent = 'Ahora no';
    cerrar.addEventListener('click', () => {
      aviso.remove();
      recordarRechazo();
    });
    acciones.appendChild(cerrar);

    aviso.append(cuerpo, acciones);
    document.body.appendChild(aviso);
    return aviso;
  };

  if (yaEstaInstalada() || fueRechazado()) return;

  /* Android y escritorio: el navegador avisa cuando se puede instalar. */
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    const aviso = construirAviso(
      'Instalá el portal y abrí tu credencial de una, aunque no tengas señal.',
      async () => {
        aviso.remove();
        e.prompt();
        await e.userChoice;
        recordarRechazo();
      }
    );
  });

  /* iOS: no hay invitacion automatica, se explica el camino. */
  if (esIOS()) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (fueRechazado()) return;
        construirAviso(
          'Tocá Compartir y después "Agregar a inicio" para instalar el portal.',
          null
        );
      }, 2500);
    });
  }
})();
