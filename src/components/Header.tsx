"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { navLinks } from "@/data/profile";
import styles from "./Header.module.css";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header className={`${styles.header} ${scrolled ? styles.rolagem : ""}`}>
      <div className={`interface ${styles.bar}`}>
        <a href="#inicio" className={styles.logo} aria-label="Gustavo Martins — início">
          <Image src="/images/logo02.png" alt="" width={202} height={40} priority />
        </a>

        <nav className={styles.desktop} aria-label="Principal">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          <a href="#contato" className={`btn-primary ${styles.cta}`}>
            Contato
          </a>
          <button
            type="button"
            className={styles.burger}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            onClick={() => setMenuOpen(true)}
          >
            <i className="bi bi-list" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        className={`${styles.mobile} ${menuOpen ? styles.open : ""}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <button type="button" className={styles.close} aria-label="Fechar menu" onClick={close}>
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>
        <nav aria-label="Menu mobile">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={close}>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#contato" onClick={close}>
                Contato
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className={`${styles.overlay} ${menuOpen ? styles.overlayOn : ""}`} onClick={close} aria-hidden="true" />
    </header>
  );
}
