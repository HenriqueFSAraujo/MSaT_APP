import { z } from 'zod';

export const scholarshipProcessSchema = z.object({
  wantsToParticipate: z.enum(['sim', 'nao'], {
    required_error: 'Por favor, selecione uma opção'
  }),
  hadScholarshipLastYear: z.enum(['sim', 'nao'], {
    required_error: 'Por favor, selecione uma opção'
  }),
  previousScholarshipPercentage: z.enum(['50', '100']).optional()
    .refine((val) => {
      if (val === undefined) return true;
      return ['50', '100'].includes(val);
    }, 'Selecione um percentual válido')
});

export type ScholarshipProcessForm = z.infer<typeof scholarshipProcessSchema>;