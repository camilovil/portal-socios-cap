export const config = {
  matcher: '/((?!favicon.ico).*)',
};

export default function middleware(request) {
  const auth = request.headers.get('authorization');
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;

  if (auth) {
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = atob(encoded);
      const [u, p] = decoded.split(':');
      if (u === user && p === pass) {
        return;
      }
    }
  }

  return new Response('Autenticación requerida', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Portal de Socios CAP — Propuesta"',
    },
  });
}
