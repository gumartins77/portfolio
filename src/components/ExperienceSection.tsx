import { experiences } from "@/data/profile";
import styles from "./ExperienceSection.module.css";
import { Reveal } from "./Reveal";

export function ExperienceSection() {
  return (
    <section id="experiencia" className={`section ${styles.section}`}>
      <div className="interface">
        <Reveal as="h2" className="section-title">
          Minha <span>experiência.</span>
        </Reveal>
        <Reveal as="p" className="section-lead" delay={150}>
          Da manutenção de hardware a sistemas multiagente com IA: uma trajetória construída resolvendo problemas
          reais de negócio.
        </Reveal>

        <ol className={styles.timeline}>
          {experiences.map((job) => (
            <li key={`${job.company}-${job.period}`} className={styles.item}>
              <Reveal origin="right">
                <article className={styles.card}>
                  <header>
                    <p className={styles.period}>
                      <i className="bi bi-calendar3" aria-hidden="true" /> {job.period}
                    </p>
                    <h3>{job.role}</h3>
                    <p className={styles.meta}>
                      <strong>{job.company}</strong> · {job.type} · {job.location}
                    </p>
                  </header>
                  <ul className={styles.highlights}>
                    {job.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <ul className={styles.stack} aria-label="Tecnologias">
                    {job.stack.map((tech) => (
                      <li key={tech} className="chip">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
