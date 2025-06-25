import { z } from 'zod';

export const addressInfoSchema = z.object({
  address: z.string().min(1, 'Endereço é obrigatório'),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  zipCode: z.string().min(1, 'CEP é obrigatório'),
  referencePoint: z.string().optional(),
  residenceType: z.string().min(1, 'Informe onde o candidato reside'),
});

export type AddressInfo = z.infer<typeof addressInfoSchema>;
