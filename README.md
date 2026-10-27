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

## Estrutura

```
src/
  app/            layout (SEO, tema, JSON-LD), página, /api/chat, sitemap, robots
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
