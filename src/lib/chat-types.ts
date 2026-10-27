// Tipos compartilhados entre o servidor e o widget do assistente.

export type ChatRole = "user" | "model";

export type ChatMessage = { role: ChatRole; text: string };

/** Eventos do stream NDJSON de /api/chat (um JSON por linha). */
export type ChatStreamEvent = { type: "text"; text: string } | { type: "notice"; text: string };
