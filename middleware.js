export const config = {
  matcher: '/((?!favicon.ico).*)',
};

const COOKIE_NAME = 'cap_auth';

function loginPage(error, redirectTo) {
  return `<!DOCTYPE html>
<html lang="es-AR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Acceso — Portal de Socios CAP</title>
<style>
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
    font-family: -apple-system, Segoe UI, Roboto, sans-serif; background:#2a1a0d;
    background-image: radial-gradient(rgba(190,161,94,0.35) 1px, transparent 1px);
    background-size: 16px 16px; }
  .card { background:#fff; border-radius:16px; padding:36px 32px; width:320px; max-width:90vw;
    box-shadow: 0 24px 50px rgba(0,0,0,0.35); text-align:center; }
  h1 { font-size:16px; color:#4a2e15; margin:0 0 6px; }
  p { font-size:12px; color:#8a8378; margin:0 0 22px; }
  input { width:100%; box-sizing:border-box; padding:12px 14px; border:1px solid #e6e0d4; border-radius:8px;
    font-size:14px; margin-bottom:14px; outline:none; }
  input:focus { border-color:#bea15e; }
  button { width:100%; padding:12px; border:none; border-radius:999px; background:#bea15e; color:#2a1a0d;
    font-weight:700; font-size:13px; letter-spacing:.3px; cursor:pointer; }
  .error { color:#b3261e; font-size:12px; margin-bottom:12px; }
</style>
</head>
<body>
  <form class="card" method="POST" action="/__login">
    <h1>Portal de Socios — Propuesta</h1>
    <p>Acceso restringido, ingresá la contraseña</p>
    ${error ? '<div class="error">Contraseña incorrecta</div>' : ''}
    <input type="password" name="password" placeholder="Contraseña" autofocus required>
    <input type="hidden" name="redirect" value="${redirectTo}">
    <button type="submit">Ingresar</button>
  </form>
</body>
</html>`;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const PASSWORD = process.env.BASIC_AUTH_PASS;

  const cookieHeader = request.headers.get('cookie') || '';
  const authed = cookieHeader
    .split(';')
    .some((c) => c.trim() === `${COOKIE_NAME}=${PASSWORD}`);

  if (url.pathname === '/__login' && request.method === 'POST') {
    const form = await request.formData();
    const pass = form.get('password');
    const redirectTo = form.get('redirect') || '/';
    if (pass === PASSWORD) {
      const res = new Response(null, { status: 303, headers: { Location: redirectTo } });
      res.headers.append(
        'Set-Cookie',
        `${COOKIE_NAME}=${PASSWORD}; Path=/; HttpOnly; Secure; Max-Age=${60 * 60 * 24 * 14}; SameSite=Lax`
      );
      return res;
    }
    return new Response(loginPage(true, redirectTo), {
      status: 401,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  if (authed) return;

  return new Response(loginPage(false, url.pathname), {
    status: 401,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
