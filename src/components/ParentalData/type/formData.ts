import { z } from 'zod';

export const parentalDataSchema = z.object({
  parent1FullName: z.string().optional().default(''),
  parent1Cpf: z.string().optional().default(''),
  parent1Phone: z.string().optional().default(''),
  parent1MaritalStatus: z.string().optional().default(''),
  parent2FullName: z.string().optional().default(''),
  parent2Cpf: z.string().optional().default(''),
  parent2Phone: z.string().optional().default(''),
  parent2MaritalStatus: z.string().optional().default(''),
  residesWithBothParents: z
    .string()
    .min(1, 'É obrigatório informar se o(a) candidato(a) reside com os dois genitores'),
});

export type ParentalData = z.infer<typeof parentalDataSchema>;
