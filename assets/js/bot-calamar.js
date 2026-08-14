/**
 * Bot Calamar — motor de respuestas y render del panel de chat.
 *
 * Compartido por login.html y home.html: cada página aporta su markup
 * (#botPanel, #botMessages, #botInput) y su saludo inicial; la lógica vive acá.
 *
 * Los datos provienen de fuentes oficiales del club:
 *   - cap.org.ar/preguntas-frecuentes
 *   - delbarrioalcontinente.cap.org.ar (campaña de socios)
 *   - cap.org.ar (actividades deportivas y contacto)
 *
 * Sin dependencias. Se carga con <script src> antes de cerrar </body>.
 */

const BOT_CONTACTO = {
  whatsapp: '+54 9 11 3691-7156',
  telefono: '4791-4748',
  email: 'sociosweb@cap.org.ar',
  direccion: 'Juan Zufriategui 2021, Vicente López, Buenos Aires',
  horarioOficina: 'lunes a viernes de 10:00 a 20:00 hs y sábados de 10:00 a 13:00 hs'
};

/**
 * Cada regla se evalúa en orden: gana la primera cuyo texto contenga alguna de
 * sus palabras clave. Las claves se escriben sin acentos porque la consulta del
 * socio se normaliza antes de comparar.
 */
const BOT_RESPUESTAS = [
  {
    keywords: ['medios de pago', 'como pago', 'formas de pago', 'debito', 'tarjeta', 'transferencia', 'efectivo', 'mercado pago'],
    respuesta: 'Podés pagar tu cuota con débito automático (tarjeta de crédito o CBU), con tarjeta desde el portal, o en efectivo en la oficina de socios. Con débito automático la cuota tiene un valor menor que pagándola suelta.'
  },
  {
    keywords: ['cuanto sale', 'cuanto cuesta', 'valor de la cuota', 'precio', 'categorias', 'categoria de socio', 'cuota'],
    respuesta: 'Las categorías vigentes son: Pleno (18+, con actividades deportivas), Activo (18+, sin deportes), Cadete (14 a 17), Menor (6 a 13), Infantil con cargo (0 a 6) y Adherente Mayor/Menor para quienes viven a más de 100 km. Los valores actualizados están en https://delbarrioalcontinente.cap.org.ar/ — con débito automático la cuota es más barata.'
  },
  {
    keywords: ['pago pendiente', 'deuda', 'debo', 'atrasad', 'vencid'],
    respuesta: 'En "Mis pagos pendientes" ves el detalle de tu cuota y podés abonarla online. Si figura algo que ya pagaste, escribinos a ' + BOT_CONTACTO.email + ' con el comprobante y lo regularizamos.'
  },
  {
    keywords: ['comprobante', 'factura', 'recibo', 'pagos realizados', 'historial de pago'],
    respuesta: 'En "Mis pagos realizados" tenés el historial completo con el comprobante de cada cuota para descargar.'
  },
  {
    keywords: ['carnet', 'credencial', 'qr', 'socio digital'],
    respuesta: 'Tu carnet digital está en la sección Credencial: se muestra con tu foto, tu número de socio y un código QR que se valida en el molinete. Podés agregarlo a la pantalla de inicio del celular para tenerlo siempre a mano.'
  },
  {
    keywords: ['grupo familiar', 'familiar', 'mi hijo', 'mi hija', 'esposa', 'esposo'],
    respuesta: 'Desde la Credencial podés cambiar entre los integrantes de tu grupo familiar y mostrar el carnet de cada uno. Para agregar o dar de baja un integrante hay que pasar por la oficina de socios con su documentación.'
  },
  {
    keywords: ['quiero ser socio', 'asociar', 'hacerme socio', 'registrar', 'alta de socio', 'inscribirme'],
    respuesta: 'Tenés dos opciones: completar el formulario en https://delbarrioalcontinente.cap.org.ar/ o acercarte a la oficina de socios de la sede de Vicente López y hacer el trámite personalmente. Pagando online la afiliación queda activa apenas se acredita el pago.'
  },
  {
    keywords: ['documentacion', 'que papeles', 'requisitos', 'que necesito para asociarme', 'foto 4x4'],
    respuesta: 'Para asociarte necesitás una foto 4×4, tu DNI y completar las planillas con tus datos básicos. Nada más.'
  },
  {
    keywords: ['horario', 'a que hora', 'cuando atienden', 'oficina de socios', 'abren'],
    respuesta: 'La oficina de socios, en la sede social de Vicente López, atiende ' + BOT_CONTACTO.horarioOficina + '.'
  },
  {
    keywords: ['donde queda', 'ubicacion', 'direccion', 'estadio', 'sede', 'como llego', 'cancha de platense'],
    respuesta: 'El estadio Ciudad de Vicente López y la sede social están en ' + BOT_CONTACTO.direccion + '. Ubicación en el mapa: https://maps.app.goo.gl/Z7EGvJhKnhSGpB9BA'
  },
  {
    keywords: ['entrada', 'ticket', 'partido de local', 'ir a la cancha', 'popular', 'platea'],
    respuesta: 'Como socio entrás gratis a la tribuna popular "Roberto Goyeneche" en los partidos de local, y tenés precio preferencial en el resto de las tribunas. Entradas de Liga Profesional: https://www.tuentrada.com/platense-lpf — Copa Libertadores: https://www.tuentrada.com/platense-libertadores'
  },
  {
    keywords: ['libertadores', 'copa', 'internacional', 'acreditacion'],
    respuesta: 'Toda la información de Copa Libertadores (entradas, acreditaciones y operativo) se publica en https://cap.org.ar/acreditaciones-conmebol-libertadores/'
  },
  {
    keywords: ['beneficio', 'descuento', 'promocion', 'zona calamar', 'comercios'],
    respuesta: 'Ser socio te da entrada gratis a la popular, uso de las instalaciones del club, 20% de descuento en la tienda oficial y cupones en más de 50 comercios adheridos. Todo el detalle está en la sección Zona Calamar del portal y en https://zonacalamar.info/'
  },
  {
    keywords: ['tienda', 'camiseta', 'merchandising', 'platensemania', 'puma', 'comprar'],
    respuesta: 'La tienda oficial es https://platensemania.com.ar/ y como socio tenés 20% de descuento presentando tu credencial.'
  },
  {
    keywords: ['deporte', 'actividad', 'disciplina', 'escuela', 'basquet', 'hockey', 'handball', 'futsal', 'patin', 'boxeo', 'esports', 'entrenar'],
    respuesta: 'El club tiene Básquet, Boxeo, eSports, Futsal masculino y femenino, Handball, Hóckey sobre césped y Patín artístico. Horarios y categorías de cada disciplina en https://cap.org.ar/ (sección Actividades Deportivas).'
  },
  {
    keywords: ['instalacion', 'futbol 5', 'futbol 6', 'tenis', 'quincho', 'alquilar'],
    respuesta: 'Como socio podés usar las canchas de fútbol 5 y 6, tenis, básquet, handball y los quinchos. La reserva se hace desde la sección Turnos del portal o en la oficina de socios.'
  },
  {
    keywords: ['turno', 'reserva', 'sacar cancha'],
    respuesta: 'Los turnos se sacan desde la sección Turnos del portal: elegís actividad, día y horario, y queda confirmado al instante.'
  },
  {
    keywords: ['contrasena', 'clave', 'olvide', 'recuperar', 'no puedo entrar', 'activar mi cuenta', 'password'],
    respuesta: 'En la pantalla de ingreso tocá "Ya soy socio, activar mi cuenta" y te enviamos un link a tu email registrado para reestablecer la contraseña. Si el mail no te llega, revisá el correo no deseado o escribinos a ' + BOT_CONTACTO.email + '.'
  },
  {
    keywords: ['mis datos', 'actualizar', 'cambiar mi mail', 'cambiar mi email', 'domicilio', 'modificar datos'],
    respuesta: 'Podés actualizar tu email, teléfono y domicilio desde la sección Mis Datos. El número de socio, el DNI y la categoría solo se modifican en la oficina de socios.'
  },
  {
    keywords: ['vitalicio', 'antiguedad', 'anos de socio'],
    respuesta: 'Después de determinada cantidad de años de antigüedad ininterrumpida podés acceder a la categoría vitalicio. La antigüedad se consulta en la oficina de socios.'
  },
  {
    keywords: ['eleccion', 'votar', 'comicios', 'autoridades', 'estatuto', 'asamblea'],
    respuesta: 'Los socios en condiciones participan de la elección de autoridades cada tres años. El estatuto y el reglamento de comicios están publicados en https://cap.org.ar/estatuto-del-club-a-platense/'
  },
  {
    keywords: ['baja', 'dar de baja', 'renunciar', 'cancelar mi socio'],
    respuesta: 'La baja se gestiona de forma presencial en la oficina de socios o escribiendo a ' + BOT_CONTACTO.email + ' desde el mail registrado en tu cuenta. Tené en cuenta que perdés la antigüedad acumulada.'
  },
  {
    keywords: ['adherente', 'vivo lejos', 'exterior', 'otra provincia', 'del interior'],
    respuesta: 'Si vivís a más de 100 km de la sede podés asociarte como Adherente Mayor (18+) o Adherente Menor, con una cuota más baja. Se tramita en https://delbarrioalcontinente.cap.org.ar/'
  },
  {
    keywords: ['redes', 'instagram', 'twitter', 'facebook', 'youtube', 'tiktok', 'platense tv'],
    respuesta: 'Seguinos como @caplatense en Instagram, X, Facebook y TikTok. Los videos del club están en https://www.youtube.com/CAPlatenseTV'
  },
  {
    keywords: ['hablar con', 'atencion al socio', 'humano', 'persona', 'contacto', 'telefono', 'whatsapp', 'llamar', 'mail'],
    respuesta: 'Te paso el contacto directo: WhatsApp ' + BOT_CONTACTO.whatsapp + ', teléfono ' + BOT_CONTACTO.telefono + ' o ' + BOT_CONTACTO.email + '. La oficina atiende ' + BOT_CONTACTO.horarioOficina + '.'
  }
];

const BOT_RESPUESTA_DEFAULT = 'Buena pregunta — todavía estoy aprendiendo esa respuesta. Mientras tanto escribinos a ' + BOT_CONTACTO.email + ' o por WhatsApp al ' + BOT_CONTACTO.whatsapp + ' y te ayudamos directamente.';

/** Pasa a minúsculas y saca acentos, para que "cuánto" matchee con "cuanto". */
function normalizarConsulta(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function botAnswerFor(texto) {
  const consulta = normalizarConsulta(texto);
  const regla = BOT_RESPUESTAS.find(r => r.keywords.some(clave => consulta.includes(clave)));
  return regla ? regla.respuesta : BOT_RESPUESTA_DEFAULT;
}

function escaparHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

/** Convierte las URLs y mails sueltos del texto en enlaces reales. */
function enlazarUrls(htmlSeguro) {
  return htmlSeguro
    .replace(/(https?:\/\/[^\s<]+[^\s<.,)])/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/(^|[\s(])([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g, '$1<a href="mailto:$2">$2</a>');
}

function agregarMensaje(texto, tipo) {
  const box = document.getElementById('botMessages');
  const msg = document.createElement('div');
  msg.className = 'bot-msg ' + tipo;
  msg.innerHTML = enlazarUrls(escaparHtml(texto));
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}

function botReply(texto) {
  agregarMensaje(texto, 'bot');
}

function botUserMsg(texto) {
  agregarMensaje(texto, 'user');
}

function botAsk(texto) {
  botUserMsg(texto);
  setTimeout(() => botReply(botAnswerFor(texto)), 400);
}

function botSend() {
  const input = document.getElementById('botInput');
  const texto = input.value.trim();
  if (!texto) return;
  botAsk(texto);
  input.value = '';
}

function toggleBot() {
  document.getElementById('botPanel').classList.toggle('open');
}
