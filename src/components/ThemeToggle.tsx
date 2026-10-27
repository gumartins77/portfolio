"use client";

import { useSyncExternalStore } from "react";
import styles from "./ThemeToggle.module.css";

type Theme = "dark" | "light";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);
  const isLight = theme === "light";

  function toggle() {
    const next: Theme = isLight ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage pode estar bloqueado (aba anônima); o tema só não persiste.
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label="Ativar tema claro"
      className={styles.trilho}
      data-light={isLight}
      onClick={toggle}
    >
      <span className={styles.indicador}>
        <i className={`bi ${isLight ? "bi-sun-fill" : "bi-moon-stars-fill"}`} aria-hidden="true" />
      </span>
    </button>
  );
}
