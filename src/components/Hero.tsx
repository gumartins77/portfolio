import Image from "next/image";
import { profile, stats } from "@/data/profile";
import styles from "./Hero.module.css";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section id="inicio" className={styles.hero}>
      <div className={`interface ${styles.grid}`}>
        <Reveal className={styles.text}>
          <p className={styles.badge}>
            <span className={styles.dot} aria-hidden="true" />
            {profile.availability}
          </p>
          <h1>
            Transformando ideias em realidade digital <span>com você.</span>
          </h1>
          <p className={styles.lead}>
            Sou <strong>{profile.name}</strong>, desenvolvedor back-end e especialista em automações e IA. Crio assistentes de IA, chatbots,
            integrações e sistemas que automatizam processos e fazem seu negócio crescer, unindo design envolvente,
            funcionalidade intuitiva e foco em resultado.
          </p>
          <div className={styles.ctas}>
            <a href="#contato" className="btn-primary">
              Entre em contato
            </a>
            <a href="#experiencia" className="btn-ghost">
              Ver experiência
            </a>
          </div>
          <dl className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.value}</dt>
                <dd>{stat.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={500} className={styles.media}>
          <div className={styles.frame}>
            <Image
              src={profile.photo}
              alt={`Foto de ${profile.name}`}
              width={1071}
              height={1468}
              priority
              sizes="(max-width: 900px) 80vw, 420px"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
