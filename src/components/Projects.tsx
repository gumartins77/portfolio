import Image from "next/image";
import { aiProjects, projects } from "@/data/profile";
import styles from "./Projects.module.css";
import { Reveal } from "./Reveal";

export function Projects() {
  return (
    <section id="portfolio" className={`section ${styles.section}`}>
      <div className="interface">
        <Reveal as="h2" className="section-title">
          Meu <span>portfólio.</span>
        </Reveal>

        <Reveal as="h3" className={styles.subtitle} delay={100}>
          <i className="bi bi-cpu" aria-hidden="true" /> IA & Automação
        </Reveal>
        <Reveal as="p" className="section-lead" delay={150}>
          Soluções em produção para empresas e projetos próprios. Os sistemas internos não têm link público, mas posso
          apresentar em uma conversa.
        </Reveal>

        <ul className={styles.aiGrid}>
          {aiProjects.map((project, i) => (
            <li key={project.title}>
              <Reveal delay={(i % 4) * 120}>
                <article className={styles.aiCard}>
                  <i className={`bi ${project.icon} ${styles.aiIcon}`} aria-hidden="true" />
                  <p className={styles.context}>{project.context}</p>
                  <h4>{project.title}</h4>
                  <p className={styles.description}>{project.description}</p>
                  <ul className={styles.stack} aria-label="Tecnologias">
                    {project.stack.map((tech) => (
                      <li key={tech} className="chip">
                        {tech}
                      </li>
                    ))}
                  </ul>
                  {project.href && (
                    <a href={project.href} target="_blank" rel="noopener noreferrer" className={styles.aiLink}>
                      Ver projeto <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                      <span className="sr-only"> {project.title}</span>
                    </a>
                  )}
                </article>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal as="h3" className={styles.subtitle}>
          <i className="bi bi-window" aria-hidden="true" /> Sites & Landing pages
        </Reveal>
        <Reveal as="p" className="section-lead" delay={150}>
          Passe o mouse sobre os projetos para percorrer as páginas.
        </Reveal>

        <ul className={styles.grid}>
          {projects.map((project, i) => (
            <li key={project.href}>
              <Reveal delay={300 + i * 300}>
                <a href={project.href} target="_blank" rel="noopener noreferrer" className={styles.card}>
                  <Image
                    src={project.image}
                    alt={`Captura de tela: ${project.title} da ${project.client}`}
                    fill
                    sizes="(max-width: 700px) 90vw, 360px"
                  />
                  <span className={styles.overlay}>
                    <span>{project.title} da</span>
                    <span className={styles.client}>{project.client}</span>
                    <span className={styles.visit}>
                      Visitar site <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                    </span>
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
