import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { profile } from "@/data/profile";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import { isSameOrigin } from "@/lib/request-origin";

// Sem domínio verificado na Resend, só dá para enviar do remetente de testes
// para o próprio e-mail da conta, que é exatamente o caso de um formulário de contato.
const FROM = process.env.CONTACT_FROM_EMAIL || "Portfólio Gustavo Martins <onboarding@resend.dev>";
const TO = process.env.CONTACT_TO_EMAIL || profile.email;

const rateLimited = createRateLimiter([
  { ms: 60 * 60 * 1000, max: 5 },
  { ms: 24 * 60 * 60 * 1000, max: 15 },
]);

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function renderEmail({ name, email, phone, message }: ContactInput) {
  const whatsapp = `https://wa.me/55${phone.replace(/\D/g, "")}`;
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#666;font-weight:600;vertical-align:top">${label}</td><td style="padding:6px 0">${value}</td></tr>`;

  const html = `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111">
  <div style="background:#000;padding:20px 24px;border-bottom:4px solid #00ff08">
    <h1 style="margin:0;font-size:20px;color:#fff">Novo contato pelo <span style="color:#00ff08">portfólio</span></h1>
  </div>
  <div style="padding:24px;border:1px solid #eee;border-top:0">
    <table style="border-collapse:collapse;font-size:15px">
      ${row("Nome", escapeHtml(name))}
      ${row("E-mail", `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`)}
      ${row("Celular", `<a href="${whatsapp}">${escapeHtml(phone)}</a> (WhatsApp)`)}
    </table>
    <p style="margin:20px 0 8px;color:#666;font-weight:600">Mensagem</p>
    <div style="white-space:pre-wrap;background:#f6f6f6;border-radius:8px;padding:14px;font-size:15px">${escapeHtml(message)}</div>
    <p style="margin-top:20px;font-size:13px;color:#888">Responda este e-mail para falar direto com ${escapeHtml(name)}.</p>
  </div>
</div>`;

  const text = `Novo contato pelo portfólio\n\nNome: ${name}\nE-mail: ${email}\nCelular: ${phone} (${whatsapp})\n\nMensagem:\n${message}`;
  return { html, text };
}

export async function POST(request: NextRequest) {
  // Mesma origem apenas: impede que outros sites usem a cota de envio
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origem não permitida" }, { status: 403 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY ausente");
    return NextResponse.json({ error: "O envio de mensagens ainda não está configurado." }, { status: 503 });
  }

  const parsed = contactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
  }

  // Robô preencheu o campo invisível: finge sucesso e não envia nada
  if (parsed.data.website) return NextResponse.json({ ok: true });

  if (rateLimited(clientIp(request))) {
    return NextResponse.json({ error: "Muitas mensagens em pouco tempo. Tente mais tarde." }, { status: 429 });
  }

  const { html, text } = renderEmail(parsed.data);
  const { error } = await new Resend(apiKey).emails.send({
    from: FROM,
    to: TO,
    replyTo: parsed.data.email,
    subject: `Novo contato do portfólio: ${parsed.data.name}`,
    html,
    text,
  });

  if (error) {
    console.error("[contact] Resend falhou:", error.name, error.message);
    return NextResponse.json({ error: "Não consegui enviar sua mensagem agora." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
