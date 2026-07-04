import { z } from 'zod';

export const schoolSchema = z.object({
  nome: z.string().nonempty('Nome é obrigatório'),
  cnpj: z.string().min(18, 'CNPJ inválido'),
  nsu: z.string().optional(),
  endereco: z.string().nonempty('Endereço é obrigatório'),
  tipo: z.enum(['PARTICULAR', 'GRATUITA'], {
    required_error: 'Selecione o tipo da escola',
  }),
});

export type SchoolFormType = z.infer<typeof schoolSchema>;
