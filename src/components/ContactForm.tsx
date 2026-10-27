"use client";

import { useState, useSyncExternalStore, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from "react";
import { contactForm } from "@/data/profile";
import styles from "./ContactForm.module.css";

type Field = "name" | "email" | "phone" | "message";
type Values = Record<Field, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validators: Record<Field, (v: string) => boolean> = {
  name: (v) => v.trim().length >= 3,
  email: (v) => EMAIL_RE.test(v.trim()),
  phone: (v) => /^\d{10,11}$/.test(v.replace(/\D/g, "")),
  message: (v) => v.trim().length >= 3,
};

const errors: Record<Field, string> = {
  name: "Nome deve ter no mínimo 3 caracteres",
  email: "Digite um e-mail válido",
  phone: "Digite um telefone válido com DDD",
  message: "Mensagem deve ter no mínimo 3 caracteres",
};

/** (00) 0 0000-0000 para celular, (00) 0000-0000 para fixo. */
function maskPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
}

const subscribe = () => () => {};
const isThankYou = () => new URLSearchParams(window.location.search).get("section") === "obrigado";

export function ContactForm() {
  const sent = useSyncExternalStore(subscribe, isThankYou, () => false);
  const [values, setValues] = useState<Values>({ name: "", email: "", phone: "", message: "" });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});

  const invalid = (field: Field) => Boolean(touched[field]) && !validators[field](values[field]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const field = e.target.name as Field;
    const value = field === "phone" ? maskPhone(e.target.value) : e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    setTouched((t) => ({ ...t, [field]: true }));

    if (e.target instanceof HTMLTextAreaElement) {
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const fields = Object.keys(validators) as Field[];
    setTouched({ name: true, email: true, phone: true, message: true });
    const firstInvalid = fields.find((f) => !validators[f](values[f]));
    if (firstInvalid) {
      e.preventDefault();
      (e.currentTarget.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
    }
  }

  if (sent) {
    return (
      <div className={styles.form}>
        <h2 className="section-title">
          Obrigado <span>pelo contato.</span>
        </h2>
        <p className={styles.thanks}>
          Em breve entrarei em contato com você <i className="bi bi-emoji-smile" aria-hidden="true" />
        </p>
      </div>
    );
  }

  const input = (field: Field, label: string, props: InputHTMLAttributes<HTMLInputElement>) => (
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
    <form action={contactForm.action} method="post" className={styles.form} onSubmit={handleSubmit} noValidate>
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

      <input type="hidden" name="accessKey" value={contactForm.accessKey} />
      <input type="hidden" name="redirectTo" value={contactForm.redirectTo} />

      <button type="submit" className={`btn-primary ${styles.submit}`}>
        Enviar <i className="bi bi-send-fill" aria-hidden="true" />
      </button>
    </form>
  );
}
