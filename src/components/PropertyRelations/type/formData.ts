import { z } from 'zod';

export const PropertyRelationsSchema = z.object({
  vehicles: z
    .array(
      z.object({
        model: z.string().min(1, 'Campo obrigatório'),
        year: z.string().min(1, 'Campo obrigatório'),
        usage: z.string().min(1, 'Campo obrigatório'),
      })
    )
    .min(1, 'Pelo menos uma linha é obrigatória'),
  peopleSchool: z
    .array(
      z.object({
        name: z.string().min(1, 'Campo obrigatório'),
        school: z.string().min(1, 'Campo obrigatório'),
        monthlyValue: z.string().min(1, 'Campo obrigatório'),
      })
    )
    .min(1, 'Pelo menos uma linha é obrigatória'),
  peopleDeficiency: z
    .array(
      z.object({
        name: z.string().min(1, 'Campo obrigatório'),
        tDeficiency: z.string().min(1, 'Campo obrigatório'),
        monthlyValue: z.string().min(1, 'Campo obrigatório'),
      })
    )
    .min(1, 'Pelo menos uma linha é obrigatória'),
  expenseBreakdown: z
    .array(
      z.object({
        expense: z.string().min(1, 'Campo obrigatório'),
        realValue: z.string().min(1, 'Campo obrigatório'),
      })
    )
    .min(1, 'Pelo menos uma linha é obrigatória'),
});

export type PropertyRelationsInfo = z.infer<typeof PropertyRelationsSchema>;
