export const SITE_URL = "https://gustavo-martins.netlify.app";

export const profile = {
  name: "Gustavo Martins",
  role: "Desenvolvedor Back-End & Especialista em Automações e IA",
  location: "Sumaré, SP",
  email: "gmartins.dev42@gmail.com",
  availability: "Aberto a oportunidades CLT e PJ",
  photo: "/images/gustavo-martins.webp",
} as const;

export type Social = {
  label: string;
  href: string;
  icon: string;
  variant: "linkedin" | "github" | "instagram" | "whatsapp";
};

export const socials: Social[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/gustavo-martins-dev/", icon: "bi-linkedin", variant: "linkedin" },
  { label: "GitHub", href: "https://github.com/gumartins77", icon: "bi-github", variant: "github" },
  { label: "Instagram", href: "https://www.instagram.com/gumartins77/", icon: "bi-instagram", variant: "instagram" },
  { label: "WhatsApp", href: "https://wa.me/5519992599246", icon: "bi-whatsapp", variant: "whatsapp" },
];

export const navLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#especialidades", label: "Especialidades" },
  { href: "#sobre", label: "Sobre" },
  { href: "#experiencia", label: "Experiência" },
  { href: "#habilidades", label: "Habilidades" },
  { href: "#portfolio", label: "Projetos" },
] as const;

export const stats = [
  { value: "4+", label: "anos de experiência" },
  { value: "5", label: "empresas atendidas" },
  { value: "IA", label: "aplicada a negócios" },
] as const;

export const specialties = [
  {
    icon: "bi-robot",
    title: "Automação & IA",
    description:
      "Assistentes de vendas e atendimento, chatbots no WhatsApp, robôs autônomos e sistemas multiagente. Orquestro fluxos com N8N para que sua operação rode sozinha, com mais velocidade e menos erro.",
  },
  {
    icon: "bi-diagram-3",
    title: "Back-end & Integrações",
    description:
      "APIs REST, webhooks e integrações com plataformas como Wrike, Senior, VTEX, RD Station, Kommo e Meta API Oficial. Sistemas escaláveis, seguros e prontos para produção em Java, Node.js e NestJS.",
  },
  {
    icon: "bi-code-square",
    title: "Websites & Sistemas",
    description:
      "Sites, landing pages e sistemas administrativos com Next.js, React e TypeScript. Design envolvente, performance e foco em conversão para sua marca se destacar.",
  },
] as const;

export type Experience = {
  role: string;
  company: string;
  type: string;
  period: string;
  location: string;
  highlights: string[];
  stack: string[];
};

export const experiences: Experience[] = [
  {
    role: "Desenvolvedor Back-End / Especialista em Automações de IA",
    company: "GMS",
    type: "PJ",
    period: "2026 – Presente",
    location: "Remoto",
    highlights: [
      "Automações, integrações e soluções de IA para projetos corporativos",
      "Integração de sistemas via APIs REST e Webhooks",
      "Na CTE (Centro de Tecnologia de Edificações), consultoria de engenharia, construção e hotelaria: radar de mercado com IA no Salesforce, análise de contratos com Gemini, onboarding de clientes e recrutamento automatizado",
      "Workflows no N8N integrando Salesforce, SharePoint, Gupy, Wrike, Senior, Supabase e Google Drive",
    ],
    stack: ["N8N", "Salesforce", "SharePoint", "Gupy", "Supabase", "OpenAI", "Gemini", "Next.js"],
  },
  {
    role: "Desenvolvedor Back-End Pleno / Analista de Automações de IA",
    company: "Joov!",
    type: "PJ · Tempo integral",
    period: "Jun 2025 – Presente",
    location: "São Paulo, SP · Híbrido",
    highlights: [
      "Integrações do assistente de IA da empresa com foco em performance, escalabilidade e segurança",
      "Novas tecnologias de IA para o assistente de vendas: qualificação e atendimento automatizados",
      "SilvIA, assistente de vendas e SAC do e-commerce da Payot (VTEX + Typebot + N8N + GPT)",
      "Fluxos N8N com a API do Wrike para gestão de aprovações e dashboards financeiros",
      "Especificação técnica de sistema multiagente de atendimento (orquestrador + agentes especializados)",
      "Aplicações em Java, bancos SQL e serviços de proxy",
    ],
    stack: ["N8N", "Java", "SQL", "Wrike API", "Proxy", "IA Generativa"],
  },
  {
    role: "Programador Pleno / Analista de Automações de IA",
    company: "Grupo Escalada",
    type: "Tempo integral",
    period: "Mar 2025 – Jun 2025",
    location: "Campinas, SP · Presencial",
    highlights: [
      "Fluxos complexos de automação no N8N",
      "Chatbots inteligentes para atendimento via WhatsApp",
      "Robôs autônomos e otimização de integrações com sistemas externos",
    ],
    stack: ["N8N", "APIs REST", "WhatsApp", "JavaScript", "TypeScript"],
  },
  {
    role: "Programador / Analista de Automações de IA",
    company: "Adalink",
    type: "Tempo integral",
    period: "Mai 2024 – Mar 2025",
    location: "São Paulo, SP · Híbrido",
    highlights: [
      "Automações N8N e chatbots com IA para WhatsApp",
      "Automação de documentos no Google Drive: leitura, processamento e manipulação",
      "Aplicações back-end com Node.js e NestJS",
    ],
    stack: ["N8N", "Node.js", "NestJS", "Google Drive API", "TypeScript"],
  },
  {
    role: "Técnico de Informática / Programador Full-Stack",
    company: "Extra Máquinas SP",
    type: "Tempo integral",
    period: "Jul 2023 – Mai 2024",
    location: "Sumaré, SP · Presencial",
    highlights: [
      "Websites responsivos e landing pages com foco em conversão",
      "Ferramentas internas para gestão de leads e otimização do funil de vendas",
      "Promovido internamente após início como estoquista (Abr 2023)",
    ],
    stack: ["HTML", "CSS", "JavaScript", "PHP"],
  },
];

export const skillGroups = [
  {
    title: "Automação & IA",
    items: ["N8N", "OpenAI", "Google Gemini", "Agentes de IA", "Sistemas multiagente", "RAG", "Engenharia de prompt", "Typebot", "ManyChat", "Evolution API", "Meta API Oficial"],
  },
  { title: "Back-end", items: ["Node.js", "TypeScript", "Java", "NestJS", "PHP", "APIs REST", "GraphQL", "Webhooks"] },
  { title: "Banco de Dados", items: ["PostgreSQL", "Supabase", "SQL", "MySQL"] },
  { title: "Front-end", items: ["Next.js", "React", "TypeScript", "JavaScript", "PWA", "HTML", "CSS"] },
  { title: "Integrações", items: ["Salesforce", "SharePoint", "Gupy", "Wrike", "Senior", "VTEX", "RD Station", "Kommo", "Google Drive"] },
  { title: "Infra & DevOps", items: ["Docker", "Git", "GitHub", "Netlify", "Vercel", "AWS", "Proxy"] },
] as const;

/** Each card shows a tech on its face; flipped, it reveals one of six pairs. */
export const memoryCards = [
  { face: "javascript", pair: "postgress" },
  { face: "typescript", pair: "mysql" },
  { face: "next", pair: "mongo" },
  { face: "react", pair: "git" },
  { face: "html", pair: "aws" },
  { face: "css", pair: "docker" },
  { face: "php", pair: "postgress" },
  { face: "python", pair: "mysql" },
  { face: "node", pair: "mongo" },
  { face: "nest", pair: "git" },
  { face: "prisma", pair: "aws" },
  { face: "express", pair: "docker" },
] as const;

export const techLabels: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  next: "Next.js",
  react: "React",
  html: "HTML",
  css: "CSS",
  php: "PHP",
  python: "Python",
  node: "Node.js",
  nest: "NestJS",
  prisma: "Prisma",
  express: "Express",
  postgress: "PostgreSQL",
  mysql: "MySQL",
  mongo: "MongoDB",
  git: "Git",
  aws: "AWS",
  docker: "Docker",
};

export type AiProject = {
  icon: string;
  title: string;
  context: string;
  description: string;
  stack: string[];
};

/** Projetos de IA e automação. Os corporativos não têm link público. */
export const aiProjects: AiProject[] = [
  {
    icon: "bi-radar",
    title: "Radar de Inteligência de Mercado",
    context: "CTE · Turismo e hotelaria",
    description:
      "IA monitora fontes de notícias do setor de turismo, classifica e pontua oportunidades e converte as qualificadas em Leads no Salesforce, com revisão humana no meio do caminho.",
    stack: ["N8N", "OpenAI + Web Search", "Salesforce", "JSON Schema"],
  },
  {
    icon: "bi-file-earmark-text",
    title: "Análise de Contratos com IA",
    context: "CTE · Sustentabilidade",
    description:
      "Portal recebe o PDF do contrato e a IA compara com a proposta padrão e as regras internas, gerando um checklist de 20 itens com nível de risco antes da assinatura.",
    stack: ["N8N AI Agent", "Google Gemini", "Supabase", "Webhooks"],
  },
  {
    icon: "bi-chat-heart",
    title: "SilvIA — Assistente da Payot",
    context: "E-commerce de cosméticos",
    description:
      "Assistente de vendas e SAC integrado à loja VTEX: tira dúvidas, ajuda na jornada de compra e encaminha para vendedores, com arquitetura multiagente.",
    stack: ["VTEX", "Typebot", "N8N", "GPT-4.1"],
  },
  {
    icon: "bi-people",
    title: "Recrutamento automatizado",
    context: "CTE · RH",
    description:
      "Agente de IA transforma vagas aprovadas no SharePoint em publicações na Gupy, pontua candidatos de 0 a 100 e dispara e-mails em cada etapa até a admissão.",
    stack: ["N8N", "SharePoint", "Gupy", "Typebot"],
  },
  {
    icon: "bi-person-check",
    title: "Onboarding de clientes",
    context: "CTE · Comercial",
    description:
      "Negócio fechado no Salesforce dispara o onboarding: dados vão para o Supabase, projetos são sincronizados com o Wrike e o cliente recebe e-mails com a identidade da marca.",
    stack: ["Next.js", "Supabase", "Salesforce", "Wrike"],
  },
  {
    icon: "bi-graph-up-arrow",
    title: "Relatório financeiro automático",
    context: "CTE · Financeiro",
    description:
      "Todo mês um workflow consolida projetos e tarefas do Wrike com valores contratados e vencimentos e envia um relatório em HTML com os totais.",
    stack: ["N8N", "Wrike API", "JavaScript"],
  },
  {
    icon: "bi-tools",
    title: "Boletim de Manutenção (PWA)",
    context: "Operação de máquinas",
    description:
      "App instalável que substituiu o formulário em papel de manutenção de máquinas, com registro de peças e relatórios.",
    stack: ["PWA", "Supabase", "Netlify"],
  },
  {
    icon: "bi-heart-pulse",
    title: "TREIN — Treinos com Coach IA",
    context: "Projeto pessoal",
    description:
      "App de academia com histórico de cargas, calendário e um Coach IA (Gemini) que analisa a evolução e monta e edita treinos pelo chat.",
    stack: ["Next.js 16", "Supabase", "Gemini", "PWA"],
  },
];

export const projects = [
  {
    title: "Site Institucional",
    client: "Extra Máquinas S/A",
    href: "https://extramaquinas.com/",
    image: "/images/projeto-site-extra.png",
  },
  {
    title: "Landing Page",
    client: "Extra Máquinas S/A",
    href: "https://extramaquinas.com/whats/miniescavadeiras.html",
    image: "/images/projeto-lp-extra.png",
  },
  {
    title: "Site Institucional",
    client: "Gold Máquinas",
    href: "https://goldmaquinas.net/",
    image: "/images/projeto-site-gold-maquinas.png",
  },
] as const;

