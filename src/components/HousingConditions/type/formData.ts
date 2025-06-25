import { z } from 'zod';
import { radioGroups } from '../form.ds';

export const housingConditionsSchema = z.object(
  Object.fromEntries(
    radioGroups.map((group) => [
      group.name,
      group.required ? z.string().min(1, 'Campo obrigatório') : z.string().optional(),
    ])
  )
);

export type housingConditionsInfo = z.infer<typeof housingConditionsSchema>;
