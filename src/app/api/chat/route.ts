import { NextResponse, type NextRequest } from "next/server";
import { ApiError, GoogleGenAI, type Content } from "@google/genai";
import { z } from "zod";
import { ASSISTANT_SYSTEM_PROMPT } from "@/lib/assistant-prompt";
import type { ChatStreamEvent } from "@/lib/chat-types";
import { isSameOrigin } from "@/lib/request-origin";

// Limites por visitante (IP) para proteger a cota gratuita do Gemini.
// Ficam em memória: valem por instância da função, o que basta para um portfólio.
const LIMIT_PER_10_MIN = 15;
const LIMIT_PER_DAY = 60;
const HISTORY_MESSAGES = 20;

const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || "gemini-flash-lite-latest";

// Orçamento de tempo (ms): a Netlify encerra funções síncronas em ~30s
const TOTAL_BUDGET_MS = 25_000;
const PRIMARY_FIRST_CHUNK_MS = 12_000;

const bodySchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "model"]), text: z.string().trim().min(1).max(4000) }))
    .min(1)
    .max(40)
    .refine((m) => m[m.length - 1].role === "user", "A última mensagem deve ser do visitante.")
    .refine((m) => m[m.length - 1].text.length <= 1000, "Mensagem muito longa (máx. 1000 caracteres)."),
});

const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const day = (hits.get(ip) ?? []).filter((t) => now - t < 24 * 60 * 60 * 1000);
  const recent = day.filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= LIMIT_PER_10_MIN || day.length >= LIMIT_PER_DAY) {
    hits.set(ip, day);
    return true;
  }
  hits.set(ip, [...day, now]);
  if (hits.size > 5000) hits.delete(hits.keys().next().value!);
  return false;
}

function clientIp(request: NextRequest) {
  const h = request.headers;
  return h.get("x-nf-client-connection-ip") ?? h.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
}

class TimeoutError extends Error {
  constructor(model: string) {
    super(`timeout no modelo ${model}`);
    this.name = "TimeoutError";
  }
}

function canFallback(error: unknown) {
  return error instanceof TimeoutError || (error instanceof ApiError && [404, 408, 429, 500, 502, 503, 504].includes(error.status));
}

function describeError(error: unknown) {
  if (error instanceof ApiError) return `${error.status} ${error.message.slice(0, 300)}`;
  return error instanceof Error ? `${error.name}: ${error.message.slice(0, 300)}` : String(error);
}

function friendlyError(error: unknown) {
  if (error instanceof TimeoutError) return "Demorei demais para responder. Tente novamente em instantes.";
  if (error instanceof ApiError && error.status === 429) {
    return "Estou com muitas conversas agora. Tente de novo mais tarde ou fale direto com o Gustavo pelo WhatsApp.";
  }
  return "Não consegui responder agora. Tente novamente em instantes ou fale direto com o Gustavo pelo WhatsApp.";
}

export async function POST(request: NextRequest) {
  const requestStarted = Date.now();
  // Mesma origem apenas: impede que outros sites usem a cota da chave
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origem não permitida" }, { status: 403 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[chat] GEMINI_API_KEY ausente");
    return NextResponse.json({ error: "O assistente ainda não está configurado." }, { status: 503 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Mensagem inválida." }, { status: 400 });
  }

  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { error: "Você atingiu o limite de mensagens por agora. Tente mais tarde ou fale direto com o Gustavo." },
      { status: 429 },
    );
  }

  // Gemini exige que a conversa comece com "user" e alterne os papéis
  const history: Content[] = [];
  for (const m of parsed.data.messages.slice(-HISTORY_MESSAGES)) {
    const last = history[history.length - 1];
    if (!last && m.role === "model") continue;
    if (last?.role === m.role) last.parts!.push({ text: m.text });
    else history.push({ role: m.role, parts: [{ text: m.text }] });
  }

  const ai = new GoogleGenAI({ apiKey });
  const config = {
    systemInstruction: ASSISTANT_SYSTEM_PROMPT,
    temperature: 0.4,
    maxOutputTokens: 1024,
  };
  const deadline = requestStarted + TOTAL_BUDGET_MS;

  /** Gera a resposta com um modelo, abortando se não começar a tempo ou passar do prazo final. */
  async function* generate(model: string, firstChunkMs: number): AsyncGenerator<string> {
    const controller = new AbortController();
    let gotFirst = false;
    const firstTimer = setTimeout(() => !gotFirst && controller.abort(new TimeoutError(model)), firstChunkMs);
    const totalTimer = setTimeout(() => controller.abort(new TimeoutError(model)), Math.max(0, deadline - Date.now()));
    try {
      const response = await ai.models.generateContentStream({
        model,
        contents: history,
        config: { ...config, abortSignal: controller.signal },
      });
      for await (const chunk of response) {
        for (const part of chunk.candidates?.[0]?.content?.parts ?? []) {
          if (part.thought || !part.text) continue;
          gotFirst = true;
          yield part.text;
        }
      }
    } catch (error) {
      throw controller.signal.aborted && controller.signal.reason instanceof TimeoutError ? controller.signal.reason : error;
    } finally {
      clearTimeout(firstTimer);
      clearTimeout(totalTimer);
    }
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: ChatStreamEvent) => controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      let sentText = false;
      const models = FALLBACK_MODEL === PRIMARY_MODEL ? [PRIMARY_MODEL] : [PRIMARY_MODEL, FALLBACK_MODEL];
      let lastError: unknown;

      for (const [index, model] of models.entries()) {
        const remaining = deadline - Date.now();
        if (remaining < 3000) break;
        // O principal tem um tempo limite para começar a responder; o reserva usa o que sobrar
        const firstChunkMs = index === 0 && models.length > 1 ? Math.min(PRIMARY_FIRST_CHUNK_MS, remaining) : remaining;
        const t0 = Date.now();
        try {
          for await (const text of generate(model, firstChunkMs)) {
            sentText = true;
            send({ type: "text", text });
          }
          console.info(`[chat] ${model} ok em ${Date.now() - t0}ms`);
          lastError = undefined;
          break;
        } catch (error) {
          lastError = error;
          console.error(`[chat] ${model} falhou em ${Date.now() - t0}ms:`, describeError(error));
          // Já enviou parte da resposta, ou o erro não se resolve trocando de modelo
          if (sentText || !canFallback(error)) break;
        }
      }

      if (lastError) send({ type: "notice", text: friendlyError(lastError) });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
