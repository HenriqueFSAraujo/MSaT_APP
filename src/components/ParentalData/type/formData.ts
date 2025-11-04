import { z } from 'zod';

export const parentalDataSchema = z.object({
  parent1FullName: z.string().min(1, 'Nome completo do Genitor 1 é obrigatório'),
  parent1Cpf: z.string().min(1, 'CPF do Genitor 1 é obrigatório'),
  parent1Phone: z.string().min(1, 'Telefone de contato do Genitor 1 é obrigatório'),
  parent1MaritalStatus: z.string().min(1, 'Estado civil do Genitor 1 é obrigatório'),

  parent2FullName: z.string().min(1, 'Nome completo do Genitor 2 é obrigatório'),
  parent2Cpf: z.string().min(1, 'CPF do Genitor 2 é obrigatório'),
  parent2Phone: z.string().min(1, 'Telefone de contato do Genitor 2 é obrigatório'),
  parent2MaritalStatus: z.string().min(1, 'Estado civil do Genitor 2 é obrigatório'),

  residesWithBothParents: z
    .string()
    .min(1, 'É obrigatório informar se o(a) candidato(a) reside com os dois genitores'),
});

export type ParentalData = z.infer<typeof parentalDataSchema>;
