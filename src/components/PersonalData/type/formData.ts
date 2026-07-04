import { z } from 'zod';
import { birthDateStringValidation } from '@/utils/dateValidations';

export const personalDataSchema = z.object({
  fullName: z.string().nonempty('Nome completo é obrigatório'),
  email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
  cpf: z.string().min(1, 'CPF é obrigatório'),
  rg: z.string().min(1, 'RG é obrigatório'),
  nationality: z.string().min(1, 'Nacionalidade é obrigatória'),
  birthplace: z.string().min(1, 'Naturalidade é obrigatória'),
  race: z.string().min(1, 'Raça/Cor é obrigatória'),
  phone: z.string().min(1, 'Celular é obrigatório'),
  gender: z.string().min(1, 'Gênero é obrigatório'),
  cpfScholarship: z.string().optional(),
  dateBirth: birthDateStringValidation,
  deficiency: z.string().min(1, 'Pessoa com deficiência é obrigatória'),
  educacenso: z.string().optional(),
  tipoEscola: z.enum(['PARTICULAR', 'GRATUITA'], {
    required_error: 'Selecione o tipo de escola',
  }),
  escolaId: z.string().nonempty('Selecione a escola'),
});

export type PersonalDataType = z.infer<typeof personalDataSchema>;
