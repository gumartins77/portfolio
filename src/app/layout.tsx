import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "./globals.css";
import { Chatbot } from "@/components/Chatbot";
import { SITE_URL, profile, socials } from "@/data/profile";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
});

const description =
  "Gustavo Martins — Desenvolvedor Back-End e Especialista em Automações e IA. N8N, chatbots no WhatsApp, sistemas multiagente, integrações via API, Java, Node.js, NestJS e Next.js.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s | ${profile.name}`,
  },
  description,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  keywords: [
    "Gustavo Martins",
    "desenvolvedor back-end",
    "automação",
    "inteligência artificial",
    "N8N",
    "chatbot WhatsApp",
    "sistemas multiagente",
    "Node.js",
    "NestJS",
    "Java",
    "Next.js",
    "React",
    "TypeScript",
    "portfólio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: `${profile.name} — Portfólio`,
    title: `${profile.name} — ${profile.role}`,
    description,
    images: [{ url: profile.photo, width: 1071, height: 1468, alt: profile.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description,
    images: [profile.photo],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
};

// Runs before paint so the saved theme never flashes.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  url: SITE_URL,
  image: `${SITE_URL}${profile.photo}`,
  address: { "@type": "PostalAddress", addressLocality: "Sumaré", addressRegion: "SP", addressCountry: "BR" },
  sameAs: socials.filter((s) => s.variant !== "whatsapp").map((s) => s.href),
  knowsAbout: ["N8N", "Inteligência Artificial", "Automação", "Java", "Node.js", "NestJS", "Next.js", "PostgreSQL"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" data-theme="dark" className={poppins.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
