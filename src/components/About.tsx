import Image from "next/image";
import { profile } from "@/data/profile";
import styles from "./About.module.css";
import { Reveal } from "./Reveal";
import { SocialLinks } from "./SocialLinks";

export function About() {
  return (
    <section id="sobre" className="section">
      <div className={`interface ${styles.grid}`}>
        <Reveal origin="left" className={styles.media}>
          <Image
            src={profile.photo}
            alt={`${profile.name} sorrindo, de óculos e camiseta preta`}
            width={1071}
            height={1468}
            sizes="(max-width: 900px) 90vw, 400px"
          />
        </Reveal>

        <div className={styles.text}>
          <Reveal as="h2" origin="right" delay={300}>
            Muito prazer, <span>sou Gustavo Martins.</span>
          </Reveal>
          <Reveal as="p" origin="right" delay={500}>
            Sou desenvolvedor back-end com <strong>4 anos de experiência</strong> em automações inteligentes,
            integrações de sistemas e desenvolvimento de software ponta a ponta, baseado em {profile.location}.
            Especialista em orquestração de fluxos com <strong>N8N</strong> e em <strong>IA aplicada</strong>:
            assistentes de vendas e atendimento, chatbots via WhatsApp, robôs autônomos e sistemas multiagente.
          </Reveal>
          <Reveal as="p" origin="right" delay={600}>
            Atuo em todo o ciclo de desenvolvimento, do back-end ao front-end e à infraestrutura, com Java, Node.js,
            NestJS, Next.js, React, TypeScript, PostgreSQL, Supabase, AWS e Docker. Gosto de trabalhar perto de
            clientes e gestores, traduzindo necessidades de negócio em soluções escaláveis e prontas para produção.
          </Reveal>
          <Reveal as="p" origin="right" delay={700}>
            Vim do interior de Minas, descobri a programação pela internet e comecei como estoquista até ser promovido
            a programador. Fora do código: Flamengo, Fórmula 1 (Ferrari), filmes de super-herói e videogame.
          </Reveal>
          <SocialLinks animated />
        </div>
      </div>
    </section>
  );
}
