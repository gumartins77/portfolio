# Gustavo Martins — Portfólio

Portfólio pessoal feito com **Next.js 16 (App Router)**, React 19 e TypeScript, com um **assistente de IA próprio (Google Gemini)** que responde dúvidas sobre mim.

## Rodando localmente

```bash
npm install
cp .env.example .env
npm run dev
```

Acesse http://localhost:3000.

## Assistente de IA (Gemini)

Gere uma chave gratuita em [aistudio.google.com/apikey](https://aistudio.google.com/apikey) e coloque no `.env`:

```env
GEMINI_API_KEY=sua-chave
GEMINI_MODEL=gemini-flash-latest
GEMINI_FALLBACK_MODEL=gemini-flash-lite-latest
```

- **Modelo principal**: `gemini-flash-latest`. **Reserva**: `gemini-flash-lite-latest`, usado automaticamente se o principal estourar a cota ou demorar.
- A chave fica só no servidor (`/api/chat`); o navegador nunca a vê.
- Proteções: só aceita requisições do próprio site, limite por IP (15 msgs / 10 min, 60 / dia) e tempo máximo de 25s (limite da Netlify).
- **O que o assistente sabe** está em [`src/lib/assistant-prompt.ts`](src/lib/assistant-prompt.ts) (system prompt) e [`src/data/profile.ts`](src/data/profile.ts). Para ensinar algo novo, edite esses arquivos.

Na Netlify, cadastre as mesmas variáveis em *Site configuration → Environment variables*.

## Formulário de contato (Resend)

O formulário envia para `/api/contact`, que manda o e-mail pela [Resend](https://resend.com) (plano grátis: 3.000 e-mails/mês, 100/dia).

1. Crie a conta na Resend **com o e-mail que vai receber os contatos** (sem domínio próprio, a Resend só entrega para o e-mail da conta).
2. Em *API Keys*, crie uma chave com permissão **Sending access** e coloque no `.env`:

```env
RESEND_API_KEY=re_sua-chave
# Opcional: padrão é o e-mail de src/data/profile.ts
CONTACT_TO_EMAIL=seu-email@exemplo.com
```

- O e-mail chega com **Responder** apontando para o visitante, e o celular vira link de WhatsApp.
- Proteções: só aceita o próprio site, validação com o mesmo schema do formulário (zod), limite por IP (5/hora, 15/dia) e campo invisível anti-spam.
- Com domínio próprio verificado na Resend, defina `CONTACT_FROM_EMAIL` (ex.: `Portfólio <contato@seudominio.com>`).

## Estrutura

```
src/
  app/            layout (SEO, tema, JSON-LD), página, /api/chat, /api/contact, sitemap, robots
  components/     seções do site + Chatbot (cada um com seu CSS Module)
  data/profile.ts todo o conteúdo do site (experiência, skills, projetos, contatos)
  lib/            system prompt do assistente, tipos e checagem de origem
public/images/    fotos, logos e capturas dos projetos
```

## Scripts

| Comando             | O que faz                  |
| ------------------- | -------------------------- |
| `npm run dev`       | servidor de desenvolvimento |
| `npm run build`     | build de produção          |
| `npm run lint`      | ESLint                     |
| `npm run typecheck` | checagem de tipos          |
