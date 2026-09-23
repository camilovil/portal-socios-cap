/* ------------------------------------------------------------------
   sw.js — Service Worker del Portal de Socios

   Objetivo concreto: que la credencial digital funcione sin señal.
   En la puerta de la cancha no hay datos, y es justo donde el socio
   necesita mostrar el QR.

   Estrategias, elegidas para que nadie quede con una version vieja:

   - Navegacion (HTML): red primero, cache como respaldo. Con señal
     siempre ves lo ultimo publicado; sin señal ves lo ultimo que
     visitaste.
   - Assets propios (css/js/fuentes/imagenes): se sirve del cache al
     instante y se revalida en segundo plano. La proxima carga ya tiene
     lo nuevo. Evita quedar clavado en un CSS viejo para siempre.
   - Todo lo que no sea de este origen no se toca.

   Al publicar cambios que deban aplicarse de inmediato, subir VERSION.
   ------------------------------------------------------------------ */

const VERSION = 'v7';
const CACHE = `cap-socios-${VERSION}`;

/* Lo minimo para que la credencial se abra sin conexion. */
const SHELL = [
  '/home',
  '/assets/css/tipografias.css',
  '/assets/css/componentes.css',
  '/assets/css/prototipo.css',
  '/assets/js/prototipo.js',
  '/assets/css/splash.css',
  '/assets/js/splash.js',
  '/assets/css/animaciones.css',
  '/assets/js/menu-socios.js',
  '/assets/js/notificaciones.js',
  '/assets/fonts/montserrat-300-latin.woff2',
  '/assets/fonts/montserrat-500-latin.woff2',
  '/assets/fonts/montserrat-800-latin.woff2',
  '/assets/fonts/playfair-italic-500-latin.woff2',
  '/assets/img/escudo-cap-oficial.png',
  '/assets/img/carnet/logo-clasico.webp',
  '/assets/img/carnet/qr-code.png',
  '/assets/img/carnet/tentaculos-dorado.webp',
  '/assets/img/calamar-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // addAll falla entero si un solo recurso falla: se agregan de a uno
      // para que un asset renombrado no rompa toda la instalacion.
      .then((cache) => Promise.allSettled(SHELL.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(
        claves.filter((c) => c.startsWith('cap-socios-') && c !== CACHE)
              .map((c) => caches.delete(c))
      ))
      .then(() => self.clients.claim())
  );
});

/** Red primero: el HTML publicado manda sobre lo guardado. */
const redPrimero = async (request) => {
  try {
    const respuesta = await fetch(request);
    const cache = await caches.open(CACHE);
    cache.put(request, respuesta.clone());
    return respuesta;
  } catch (e) {
    const guardada = await caches.match(request);
    if (guardada) return guardada;
    return (await caches.match('/home')) || Response.error();
  }
};

/** Cache al instante, revalidacion en segundo plano. */
const cacheYRevalida = async (request) => {
  const cache = await caches.open(CACHE);
  const guardada = await cache.match(request);

  const enRed = fetch(request)
    .then((respuesta) => {
      if (respuesta && respuesta.ok) cache.put(request, respuesta.clone());
      return respuesta;
    })
    .catch(() => guardada);

  return guardada || enRed;
};

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(redPrimero(request));
    return;
  }

  event.respondWith(cacheYRevalida(request));
});
