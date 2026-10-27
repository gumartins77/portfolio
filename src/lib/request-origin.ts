// Origem pública da requisição (ex.: https://gustavo-martins.netlify.app).
// Atrás do proxy da Netlify, request.url / nextUrl.origin podem apontar para o
// endereço interno da função, então usamos os cabeçalhos repassados pelo CDN.
export function publicHost(request: Request) {
  const h = request.headers;
  const host = (h.get("x-forwarded-host") ?? h.get("host"))?.split(",")[0].trim();
  return host || new URL(request.url).host;
}

export function publicOrigin(request: Request) {
  const host = publicHost(request);
  const forwarded = request.headers.get("x-forwarded-proto")?.split(",")[0].trim();
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
  const proto = forwarded || (isLocal ? "http" : "https");
  return `${proto}://${host}`;
}

/** true se o cabeçalho Origin (quando presente) é do próprio site. */
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === publicHost(request);
  } catch {
    return false;
  }
}
