import { z } from "zod";

// Mesmas regras no formulário (feedback imediato) e na rota /api/contact (segurança).

export const contactSchema = z.object({
  name: z.string().trim().min(3, "Nome deve ter no mínimo 3 caracteres").max(120, "Nome muito longo"),
  email: z.email("Digite um e-mail válido").trim().max(200, "E-mail muito longo"),
  phone: z
    .string()
    .trim()
    .refine((v) => /^\d{10,11}$/.test(v.replace(/\D/g, "")), "Digite um telefone válido com DDD"),
  message: z.string().trim().min(3, "Mensagem deve ter no mínimo 3 caracteres").max(5000, "Mensagem muito longa"),
  // Campo invisível: pessoas deixam vazio, robôs de spam costumam preencher.
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = Exclude<keyof ContactInput, "website">;
