"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";
import { profile } from "@/data/profile";
import type { ChatMessage, ChatStreamEvent } from "@/lib/chat-types";
import styles from "./Chatbot.module.css";

type Message = ChatMessage & { id: string; notice?: string };

const STORAGE_KEY = "chat-history";
const PREVIEW_DELAY_MS = 10_000;

const GREETING: Message = {
  id: "greeting",
  role: "model",
  text: "Oi! 👋 Sou o assistente virtual do **Gustavo Martins**. Pode me perguntar sobre a experiência, as habilidades, os serviços ou como falar com ele.",
};

const SUGGESTIONS = [
  "Quem é o Gustavo?",
  "Com o que ele trabalha hoje?",
  "Ele faz chatbots com IA?",
  "Como posso contratá-lo?",
];

function loadHistory(): Message[] {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(saved) && saved.length ? saved : [GREETING];
  } catch {
    return [GREETING];
  }
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // A conversa sobrevive a recarregar a página, mas não a fechar a aba.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages(loadHistory());
    const timer = setTimeout(() => setPreview(true), PREVIEW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (streaming) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      // Storage bloqueado: a conversa só não persiste.
    }
  }, [messages, streaming]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  function toggle() {
    setOpen((o) => !o);
    setPreview(false);
  }

  async function send(raw: string) {
    const text = raw.trim();
    if (!text || streaming) return;
    setInput("");
    setError("");
    setStreaming(true);

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text };
    const replyId = `r-${Date.now()}`;
    const history = [...messages.filter((m) => m.id !== GREETING.id && m.text), userMsg];
    setMessages((m) => [...m, userMsg, { id: replyId, role: "model", text: "" }]);

    const controller = new AbortController();
    abortRef.current = controller;
    const update = (fn: (msg: Message) => Message) =>
      setMessages((m) => m.map((msg) => (msg.id === replyId ? fn(msg) : msg)));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, text }) => ({ role, text })) }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Não consegui responder agora.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      const handle = (line: string) => {
        if (!line.trim()) return;
        let event: ChatStreamEvent;
        try {
          event = JSON.parse(line);
        } catch {
          return;
        }
        if (event.type === "text") update((msg) => ({ ...msg, text: msg.text + event.text }));
        else update((msg) => ({ ...msg, notice: event.text }));
      };
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        lines.forEach(handle);
      }
      handle(buffer);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError((err as Error).message);
      setMessages((m) => m.filter((msg) => msg.id !== replyId));
    } finally {
      // Resposta vazia (ex.: erro antes do primeiro trecho) vira só o aviso
      setMessages((m) => m.filter((msg) => msg.id !== replyId || msg.text || msg.notice));
      setStreaming(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  function clear() {
    abortRef.current?.abort();
    setMessages([GREETING]);
    setError("");
  }

  const showSuggestions = messages.length === 1 && !streaming;

  return (
    <div className={styles.root}>
      {preview && !open && (
        <div className={styles.preview}>
          <button type="button" className={styles.previewText} onClick={toggle}>
            🤖 Precisa de ajuda? Estou aqui para isso! 🚀
          </button>
          <button type="button" className={styles.previewClose} onClick={() => setPreview(false)} aria-label="Dispensar">
            <i className="bi bi-x" aria-hidden="true" />
          </button>
        </div>
      )}

      <section
        id="chatbot"
        className={`${styles.panel} ${open ? styles.open : ""}`}
        role="dialog"
        aria-label="Assistente virtual do Gustavo"
        aria-hidden={!open}
        inert={!open}
      >
        <header className={styles.head}>
          <Image src={profile.photo} alt="" width={40} height={40} className={styles.avatar} />
          <div className={styles.title}>
            <strong>Assistente do Gustavo</strong>
            <span>
              <span className={styles.online} aria-hidden="true" /> IA · responde na hora
            </span>
          </div>
          <button type="button" className={styles.iconBtn} onClick={clear} aria-label="Nova conversa" title="Nova conversa">
            <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
          </button>
          <button type="button" className={styles.iconBtn} onClick={() => setOpen(false)} aria-label="Fechar chat">
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </header>

        <div ref={listRef} className={styles.list} aria-live="polite" aria-busy={streaming}>
          {messages.map((m) => (
            <div key={m.id} className={`${styles.msg} ${m.role === "user" ? styles.user : styles.bot}`}>
              {m.text ? (
                m.role === "model" ? (
                  <ReactMarkdown
                    components={{
                      a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {m.text}
                  </ReactMarkdown>
                ) : (
                  <p>{m.text}</p>
                )
              ) : (
                !m.notice && (
                  <span className={styles.typing} aria-label="Digitando">
                    <span />
                    <span />
                    <span />
                  </span>
                )
              )}
              {m.notice && <p className={styles.notice}>{m.notice}</p>}
            </div>
          ))}

          {showSuggestions && (
            <div className={styles.suggestions}>
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
          {error && <p className={styles.error}>{error}</p>}
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          <label htmlFor="chat-input" className="sr-only">
            Sua pergunta
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            rows={1}
            maxLength={1000}
            placeholder="Pergunte sobre o Gustavo..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button type="submit" className={styles.send} disabled={!input.trim() || streaming} aria-label="Enviar">
            <i className="bi bi-send-fill" aria-hidden="true" />
          </button>
        </form>
        <p className={styles.disclaimer}>Respostas geradas por IA. Para assuntos importantes, fale direto com o Gustavo.</p>
      </section>

      <button
        type="button"
        className={styles.fab}
        onClick={toggle}
        aria-label={open ? "Fechar chat" : "Abrir chat com o assistente"}
        aria-expanded={open}
        aria-controls="chatbot"
      >
        <i className={`bi ${open ? "bi-chevron-down" : "bi-chat-dots-fill"}`} aria-hidden="true" />
      </button>
    </div>
  );
}
