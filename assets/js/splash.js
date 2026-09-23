/* ------------------------------------------------------------------
   splash.js — Pantalla de carga de la app instalada

   Se carga sincronico en el <head> para decidir antes de que se pinte
   la pagina. Solo actua si el Portal se abrio desde el icono del
   telefono, y una vez por arranque: navegar entre secciones no la
   repite.

   Para probarla en el navegador sin instalar: agregar ?splash=1 a la URL.
   ------------------------------------------------------------------ */

(() => {
  'use strict';

  const VISTO = 'cap-splash-visto';
  const DURACION = 1600;
  const DURACION_SIN_MOVIMIENTO = 900;
  const SALIDA = 300;

  const forzado = new URLSearchParams(window.location.search).get('splash') === '1';

  const esApp =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const yaSeVio = () => {
    try { return sessionStorage.getItem(VISTO) === '1'; }
    catch (e) { return false; }
  };

  if (!forzado && (!esApp || yaSeVio())) return;

  try { sessionStorage.setItem(VISTO, '1'); } catch (e) { /* modo privado */ }

  const raiz = document.documentElement;
  raiz.classList.add('cap-splash-activo');

  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const construir = () => {
    const splash = document.createElement('div');
    splash.className = 'cap-splash';
    splash.setAttribute('aria-hidden', 'true');
    splash.innerHTML =
      '<img class="cap-splash__escudo" src="/assets/img/escudo-cap-oficial.png" alt="">' +
      '<p class="cap-splash__marca">SOCIOS <span class="cap-splash__cap">CAP</span></p>';
    document.body.prepend(splash);
    return splash;
  };

  const cerrar = (splash) => {
    if (splash.classList.contains('cap-splash--saliendo')) return;
    raiz.classList.remove('cap-splash-activo');
    splash.classList.add('cap-splash--saliendo');
    setTimeout(() => splash.remove(), SALIDA);
  };

  document.addEventListener('DOMContentLoaded', () => {
    const splash = construir();
    splash.addEventListener('pointerdown', () => cerrar(splash));
    setTimeout(() => cerrar(splash), sinMovimiento ? DURACION_SIN_MOVIMIENTO : DURACION);
  });
})();
