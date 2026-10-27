import { specialties } from "@/data/profile";
import { Reveal } from "./Reveal";
import styles from "./Specialties.module.css";

export function Specialties() {
  return (
    <section id="especialidades" className="section">
      <div className="interface">
        <Reveal as="h2" className="section-title">
          Minhas <span>especialidades.</span>
        </Reveal>
        <div className={styles.grid}>
          {specialties.map((item, i) => (
            <Reveal key={item.title} delay={300 + i * 200}>
              <article className={styles.box}>
                <i className={`bi ${item.icon}`} aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
