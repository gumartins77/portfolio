import type { NextRequest } from "next/server";

type Window = { ms: number; max: number };

/**
 * Limite simples por IP, em memória: vale por instância da função, o que
 * basta para um portfólio. Retorna `true` quando o IP passou de algum limite.
 */
export function createRateLimiter(windows: Window[]) {
  const hits = new Map<string, number[]>();
  const longest = Math.max(...windows.map((w) => w.ms));

  return function rateLimited(ip: string) {
    const now = Date.now();
    const kept = (hits.get(ip) ?? []).filter((t) => now - t < longest);
    if (windows.some((w) => kept.filter((t) => now - t < w.ms).length >= w.max)) {
      hits.set(ip, kept);
      return true;
    }
    hits.set(ip, [...kept, now]);
    if (hits.size > 5000) hits.delete(hits.keys().next().value!);
    return false;
  };
}

export function clientIp(request: NextRequest) {
  const h = request.headers;
  return h.get("x-nf-client-connection-ip") ?? h.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
}
