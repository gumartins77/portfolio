import { socials } from "@/data/profile";
import { Reveal } from "./Reveal";
import styles from "./SocialLinks.module.css";

export function SocialLinks({ animated = false }: { animated?: boolean }) {
  return (
    <ul className={styles.list}>
      {socials.map((social, i) => {
        const link = (
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.link} ${styles[social.variant]}`}
            aria-label={social.label}
            title={social.label}
          >
            <i className={`bi ${social.icon}`} aria-hidden="true" />
          </a>
        );
        return (
          <li key={social.variant}>
            {animated ? (
              <Reveal origin="right" delay={700 + i * 100}>
                {link}
              </Reveal>
            ) : (
              link
            )}
          </li>
        );
      })}
    </ul>
  );
}
