import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { ExperienceSection } from "@/components/ExperienceSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Specialties } from "@/components/Specialties";

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <Specialties />
        <About />
        <ExperienceSection />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
