import Image from "next/image";
import { profile } from "@/data/profile";
import styles from "./Footer.module.css";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="interface">
        <div className={styles.top}>
          <Image src="/images/logo02.png" alt="Gustavo Martins — Programador" width={202} height={40} />
          <SocialLinks />
        </div>
        <div className={styles.bottom}>
          <a href={`mailto:${profile.email}`}>
            <i className="bi bi-envelope-fill" aria-hidden="true" /> {profile.email}
          </a>
          <p>
            © {new Date().getFullYear()} {profile.name}. Feito com Next.js.
          </p>
        </div>
      </div>
    </footer>
  );
}
