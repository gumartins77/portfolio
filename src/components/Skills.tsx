import { skillGroups } from "@/data/profile";
import { MemoryGame } from "./MemoryGame";
import { Reveal } from "./Reveal";
import styles from "./Skills.module.css";

export function Skills() {
  return (
    <section id="habilidades" className="section">
      <div className="interface">
        <Reveal as="h2" className="section-title">
          Minhas <span>habilidades.</span>
        </Reveal>

        <div className={styles.groups}>
          {skillGroups.map((group, i) => (
            <Reveal key={group.title} delay={i * 80}>
              <div className={styles.group}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item} className="chip">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <MemoryGame />
      </div>
    </section>
  );
}
