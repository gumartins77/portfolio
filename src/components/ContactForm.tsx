"use client";

import { useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from "react";
import { socials } from "@/data/profile";
import { contactSchema, type ContactField } from "@/lib/contact-schema";
import styles from "./ContactForm.module.css";

type Values = Record<ContactField, string>;
type Status = "idle" | "sending" | "sent" | "error";

const FIELDS: ContactField[] = ["name", "email", "phone", "message"];
const whatsapp = socials.find((s) => s.variant === "whatsapp")!.href;

/** Erro de cada campo segundo o mesmo schema que a API usa. */
function fieldErrors(values: Values) {
  const result = contactSchema.safeParse(values);
  const errors: Partial<Record<ContactField, string>> = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as ContactField;
      errors[field] ??= issue.message;
    }
  }
  return errors;
}

/** (00) 0 0000-0000 para celular, (00) 0000-0000 para fixo. */
function maskPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
}

export function ContactForm() {
  const [values, setValues] = useState<Values>({ name: "", email: "", phone: "", message: "" });
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  const errors = fieldErrors(values);
  const invalid = (field: ContactField) => Boolean(touched[field] && errors[field]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const field = e.target.name as ContactField;
    const value = field === "phone" ? maskPhone(e.target.value) : e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    setTouched((t) => ({ ...t, [field]: true }));

    if (e.target instanceof HTMLTextAreaElement) {
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    setTouched({ name: true, email: true, phone: true, message: true });
    const firstInvalid = FIELDS.find((f) => errors[f]);
    if (firstInvalid) {
      (e.currentTarget.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }

    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Não consegui enviar sua mensagem agora.");
      setStatus("sent");
    } catch (err) {
      setServerError((err as Error).message);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className={styles.form} role="status">
        <h2 className="section-title">
          Obrigado <span>pelo contato.</span>
        </h2>
        <p className={styles.thanks}>
          Em breve entrarei em contato com você <i className="bi bi-emoji-smile" aria-hidden="true" />
        </p>
      </div>
    );
  }

  const input = (field: ContactField, label: string, props: InputHTMLAttributes<HTMLInputElement>) => (
    <div className={styles.field}>
      <input
        id={field}
        name={field}
        className={`${styles.input} ${invalid(field) ? styles.error : ""}`}
        placeholder=" "
        value={values[field]}
        onChange={handleChange}
        aria-invalid={invalid(field) || undefined}
        aria-describedby={`${field}-error`}
        required
        {...props}
      />
      <label htmlFor={field}>{label}</label>
      <span id={`${field}-error`} className={styles.message} role="alert">
        {invalid(field) ? errors[field] : ""}
      </span>
    </div>
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className="section-title">
        Fala <span>comigo.</span>
      </h2>
      <p className={styles.sub}>Projeto, vaga ou ideia? Me conte e eu respondo rapidinho.</p>

      {input("name", "Seu nome completo", { type: "text", autoComplete: "name" })}
      {input("email", "Seu e-mail", { type: "email", inputMode: "email", autoComplete: "email" })}
      {input("phone", "Seu celular", { type: "tel", inputMode: "numeric", autoComplete: "tel-national" })}

      <div className={styles.field}>
        <textarea
          id="message"
          name="message"
          rows={1}
          className={`${styles.input} ${styles.textarea} ${invalid("message") ? styles.error : ""}`}
          placeholder=" "
          value={values.message}
          onChange={handleChange}
          aria-invalid={invalid("message") || undefined}
          aria-describedby="message-error"
          required
        />
        <label htmlFor="message">Sua mensagem</label>
        <span id="message-error" className={styles.message} role="alert">
          {invalid("message") ? errors.message : ""}
        </span>
      </div>

      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="website">Não preencha este campo</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {status === "error" && (
        <p className={styles.serverError} role="alert">
          {serverError}{" "}
          <a href={whatsapp} target="_blank" rel="noopener noreferrer">
            Fale comigo pelo WhatsApp
          </a>
          .
        </p>
      )}

      <button type="submit" className={`btn-primary ${styles.submit}`} disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            Enviando... <i className={`bi bi-arrow-repeat ${styles.spin}`} aria-hidden="true" />
          </>
        ) : (
          <>
            Enviar <i className="bi bi-send-fill" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
