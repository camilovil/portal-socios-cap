/* ------------------------------------------------------------------
   carnet-descarga.js — "Descargar carnet digital"

   Genera una imagen vertical del tamaño de la pantalla del celular
   (1080 x 1920) con el carnet, el QR grande y los datos del socio, para
   guardarla en Fotos y abrirla sin señal en el acceso.

   - Celular: abre el menu de compartir del sistema ("Guardar imagen").
   - Computadora: descarga directa del PNG.

   Los datos se leen de la tarjeta que ya muestra la pagina, que es donde
   CleverSoft inyecta nombre, numero y QR: no hay una segunda fuente.
   Se dibuja en canvas con los mismos assets del carnet, sin librerias.

   La imagen se prepara apenas carga la pagina. iOS solo permite abrir
   el menu de compartir inmediatamente despues del toque; si hubiera que
   esperar a dibujarla, el toque "vence" y el menu no se abre.
   ------------------------------------------------------------------ */

(() => {
  'use strict';

  const boton = document.querySelector('.carnet-descargar');
  if (!boton) return;

  const panel = boton.closest('.tab-panel') || document;

  /* La imagen se diseña sobre una base de 360 x 640 y se dibuja a x3. */
  const BASE_W = 360;
  const BASE_H = 640;
  const ESCALA = 3;

  const COLOR = {
    marron: '#4a2e15',
    marronOscuro: '#2a1a0d',
    marronProfundo: '#1c1108',
    dorado: '#bea15e',
    crema: '#efe2cf',
    blanco: '#ffffff'
  };

  const TRAMA = 'assets/img/carnet/tentaculos-dorado.webp';
  const ESCUDO = 'assets/img/escudo-cap-oficial.png';

  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
    'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  /* --- Datos del socio ------------------------------------------------ */

  const texto = (selector) => {
    const el = panel.querySelector(selector);
    return el ? el.textContent.trim() : '';
  };

  /* "12 de marzo de 2015" -> "12/03/2015" */
  const fechaCorta = (larga) => {
    const m = larga.match(/(\d{1,2}) de ([a-záéíóú]+) de (\d{4})/i);
    if (!m) return larga;
    const mes = MESES.indexOf(m[2].toLowerCase()) + 1;
    if (!mes) return larga;
    return m[1].padStart(2, '0') + '/' + String(mes).padStart(2, '0') + '/' + m[3];
  };

  const leerSocio = () => {
    const valores = panel.querySelectorAll('.socio-card__back-info .value');
    const linea = texto('.socio-card__socio-line');
    const categoria = (linea.match(/Categoría\s+(.+)$/i) || [])[1] || '';
    const desde = (texto('.socio-card-hint').match(/Socio desde (.+)$/i) || [])[1] || '';
    const logo = panel.querySelector('.socio-card__logo');
    const qr = panel.querySelector('.socio-card__qr-box img');

    return {
      nombre: texto('.socio-card__name'),
      linea,
      estado: texto('.socio-card__pill'),
      numero: valores[0] ? valores[0].textContent.trim() : '',
      validoHasta: valores[1] ? valores[1].textContent.trim() : '',
      categoria,
      desde: fechaCorta(desde),
      logo: logo ? logo.getAttribute('src') : '',
      qr: qr ? qr.getAttribute('src') : ''
    };
  };

  /* --- Utilidades de dibujo ------------------------------------------- */

  const cargarImagen = (src) => new Promise((ok, falla) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = falla;
    img.src = src;
  });

  const rectRedondeado = (ctx, x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  /* Degradado CSS con angulo (155deg, 170deg...) sobre un rectangulo. */
  const degradado = (ctx, x, y, w, h, grados, paradas) => {
    const rad = (grados - 90) * Math.PI / 180;
    const largo = Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad));
    const cx = x + w / 2;
    const cy = y + h / 2;
    const dx = Math.cos(rad) * largo / 2;
    const dy = Math.sin(rad) * largo / 2;
    const g = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
    paradas.forEach(([pos, color]) => g.addColorStop(pos, color));
    return g;
  };

  /* Canvas no tiene letter-spacing en todos los navegadores (Safari):
     se dibuja letra por letra. */
  const anchoEspaciado = (ctx, str, esp) =>
    [...str].reduce((a, c) => a + ctx.measureText(c).width + esp, 0) - esp;

  const textoEspaciado = (ctx, str, x, y, esp, alineacion) => {
    let cx = alineacion === 'center' ? x - anchoEspaciado(ctx, str, esp) / 2 : x;
    const previa = ctx.textAlign;
    ctx.textAlign = 'left';
    [...str].forEach((c) => {
      ctx.fillText(c, cx, y);
      cx += ctx.measureText(c).width + esp;
    });
    ctx.textAlign = previa;
  };

  const fuente = (peso, px) => peso + ' ' + px + "px 'Montserrat', system-ui, sans-serif";

  /* --- Partes de la imagen -------------------------------------------- */

  const dibujarFondo = (ctx, trama) => {
    ctx.fillStyle = degradado(ctx, 0, 0, BASE_W, BASE_H, 170, [
      [0, '#3a2412'], [0.45, COLOR.marronOscuro], [1, COLOR.marronProfundo]
    ]);
    ctx.fillRect(0, 0, BASE_W, BASE_H);

    const ancho = 620;
    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.drawImage(trama, -140, 300, ancho, ancho * trama.height / trama.width);
    ctx.restore();
  };

  const dibujarCabecera = (ctx, escudo) => {
    ctx.drawImage(escudo, 24, 18, 38, 38);
    ctx.fillStyle = COLOR.blanco;
    ctx.font = fuente(700, 12.5);
    ctx.fillText('Club Atlético Platense', 68, 35);
    ctx.fillStyle = COLOR.dorado;
    ctx.font = fuente(400, 10);
    textoEspaciado(ctx, 'CARNET DE SOCIO', 68, 50, 1.4);
  };

  const dibujarTarjeta = (ctx, socio, img) => {
    const x = 24;
    const y = 74;
    const w = 312;
    const h = w * 270 / 440;

    /* Sombra */
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 12;
    rectRedondeado(ctx, x, y, w, h, 14);
    ctx.fillStyle = COLOR.marronOscuro;
    ctx.fill();
    ctx.restore();

    ctx.save();
    rectRedondeado(ctx, x, y, w, h, 14);
    ctx.clip();

    ctx.fillStyle = degradado(ctx, x, y, w, h, 155, [
      [0, COLOR.marron], [0.6, COLOR.marronOscuro], [1, COLOR.marronProfundo]
    ]);
    ctx.fillRect(x, y, w, h);

    /* Trama: misma caja que en pantalla (inset -12% -8%, 380 px). */
    ctx.globalAlpha = 0.34;
    const ancho = 380;
    ctx.drawImage(img.trama, x - w * 0.08 - 12, y - h * 0.12 - 12,
      ancho, ancho * img.trama.height / img.trama.width);
    ctx.globalAlpha = 1;

    ctx.fillStyle = degradado(ctx, x, y, w, h, 115, [
      [0, 'rgba(255, 255, 255, 0.10)'], [0.42, 'rgba(255, 255, 255, 0)']
    ]);
    ctx.fillRect(x, y, w, h);

    /* Escudo clasico */
    const lado = h * 0.31;
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 2;
    ctx.drawImage(img.logo, x + w * 0.06, y + h * 0.05, lado, lado);
    ctx.restore();

    /* Estado */
    if (socio.estado) {
      ctx.font = fuente(700, 7);
      const tw = anchoEspaciado(ctx, socio.estado, 0.3);
      const pw = tw + 18;
      const px = x + w * 0.93 - pw;
      const py = y + h * 0.12;
      rectRedondeado(ctx, px, py, pw, 16, 8);
      ctx.fillStyle = 'rgba(239, 226, 207, 0.16)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(239, 226, 207, 0.35)';
      ctx.lineWidth = 0.7;
      ctx.stroke();
      ctx.fillStyle = COLOR.crema;
      textoEspaciado(ctx, socio.estado, px + 9, py + 10.6, 0.3);
    }

    /* Pie de la tarjeta */
    const pieX = x + w * 0.07;
    const pieY = y + h * 0.90;
    ctx.fillStyle = COLOR.blanco;
    ctx.font = fuente(700, 15);
    ctx.fillText(socio.nombre, pieX, pieY);
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = COLOR.crema;
    ctx.font = fuente(400, 7.5);
    ctx.fillText(socio.linea, pieX, pieY - 19);
    ctx.globalAlpha = 1;

    ctx.restore();
  };

  const dibujarQR = (ctx, qr) => {
    const w = 174;
    const h = 206;
    const x = (BASE_W - w) / 2;
    const y = 283;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 26;
    ctx.shadowOffsetY = 10;
    rectRedondeado(ctx, x, y, w, h, 16);
    ctx.fillStyle = COLOR.blanco;
    ctx.fill();
    ctx.restore();

    /* El QR se agranda sin suavizar: los modulos quedan nitidos y el
       lector del molinete los lee mejor. */
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(qr, x + 12, y + 12, 150, 150);
    ctx.imageSmoothingEnabled = true;

    ctx.fillStyle = COLOR.marronOscuro;
    ctx.font = fuente(700, 9);
    textoEspaciado(ctx, 'PRESENTALO EN EL', BASE_W / 2, y + 180, 1.45, 'center');
    textoEspaciado(ctx, 'ACCESO', BASE_W / 2, y + 192, 1.45, 'center');
  };

  const dibujarDatos = (ctx, socio) => {
    const columnas = [30, 188];
    const filas = [
      [['SOCIO N°', socio.numero], ['CATEGORÍA', socio.categoria]],
      [['SOCIO DESDE', socio.desde], ['VÁLIDO HASTA', socio.validoHasta]]
    ];

    filas.forEach((fila, i) => {
      const y = 514 + i * 40;
      fila.forEach(([etiqueta, valor], j) => {
        if (!valor) return;
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = COLOR.crema;
        ctx.font = fuente(400, 8);
        textoEspaciado(ctx, etiqueta, columnas[j], y, 1.1);
        ctx.globalAlpha = 1;
        ctx.fillStyle = COLOR.blanco;
        ctx.font = fuente(700, 13);
        ctx.fillText(valor, columnas[j], y + 16);
      });
    });
  };

  const dibujarPie = (ctx) => {
    const hoy = new Date();
    const fecha = String(hoy.getDate()).padStart(2, '0') + '/' +
      String(hoy.getMonth() + 1).padStart(2, '0') + '/' + hoy.getFullYear();

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(239, 226, 207, 0.5)';
    ctx.font = fuente(400, 8);
    ctx.fillText('Personal e intransferible · Presentalo junto a tu DNI', BASE_W / 2, 598);
    ctx.fillStyle = 'rgba(239, 226, 207, 0.8)';
    ctx.font = fuente(700, 8);
    ctx.fillText('Generado el ' + fecha, BASE_W / 2, 611);
    ctx.textAlign = 'left';
  };

  /* --- Generacion ----------------------------------------------------- */

  const generar = async () => {
    const socio = leerSocio();

    const [trama, escudo, logo, qr] = await Promise.all([
      cargarImagen(TRAMA),
      cargarImagen(ESCUDO),
      cargarImagen(socio.logo || ESCUDO),
      cargarImagen(socio.qr),
      document.fonts ? document.fonts.load(fuente(700, 20)) : null,
      document.fonts ? document.fonts.load(fuente(400, 20)) : null
    ]);

    const canvas = document.createElement('canvas');
    canvas.width = BASE_W * ESCALA;
    canvas.height = BASE_H * ESCALA;
    const ctx = canvas.getContext('2d');
    ctx.scale(ESCALA, ESCALA);
    ctx.textBaseline = 'alphabetic';

    dibujarFondo(ctx, trama);
    dibujarCabecera(ctx, escudo);
    dibujarTarjeta(ctx, socio, { trama, logo });
    dibujarQR(ctx, qr);
    dibujarDatos(ctx, socio);
    dibujarPie(ctx);

    const blob = await new Promise((ok) => canvas.toBlob(ok, 'image/png'));
    const nombre = 'carnet-cap-' + (socio.numero || 'socio') + '.png';
    return new File([blob], nombre, { type: 'image/png' });
  };

  /* --- Entrega -------------------------------------------------------- */

  const descargar = (archivo) => {
    const url = URL.createObjectURL(archivo);
    const a = document.createElement('a');
    a.href = url;
    a.download = archivo.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const esCelular = () => window.matchMedia('(pointer: coarse)').matches;

  const entregar = async (archivo) => {
    const compartible = esCelular() && navigator.canShare &&
      navigator.canShare({ files: [archivo] });

    if (!compartible) {
      descargar(archivo);
      return;
    }

    try {
      await navigator.share({ files: [archivo], title: 'Carnet de socio CAP' });
    } catch (e) {
      /* AbortError: el socio cerro el menu de compartir. No es un error. */
      if (e.name !== 'AbortError') descargar(archivo);
    }
  };

  let preparado = null;
  const preparar = () => {
    if (!preparado) {
      preparado = generar().catch((e) => {
        preparado = null;
        throw e;
      });
    }
    return preparado;
  };

  const TEXTO_ORIGINAL = boton.textContent;

  boton.addEventListener('click', async () => {
    boton.disabled = true;
    boton.setAttribute('aria-busy', 'true');
    boton.textContent = 'Preparando…';
    try {
      await entregar(await preparar());
    } catch (e) {
      boton.textContent = 'No se pudo generar';
      setTimeout(() => { boton.textContent = TEXTO_ORIGINAL; }, 2500);
      return;
    } finally {
      boton.disabled = false;
      boton.removeAttribute('aria-busy');
    }
    boton.textContent = TEXTO_ORIGINAL;
  });

  /* Se prepara en segundo plano para que el toque abra el menu al
     instante (ver encabezado). */
  const enReposo = window.requestIdleCallback || ((fn) => setTimeout(fn, 800));
  enReposo(() => preparar().catch(() => { /* se reintenta al tocar */ }));
})();
