import { ContactForm } from "./ContactForm";
import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section id="contato" className="section">
      <div className="interface">
        <Reveal>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
