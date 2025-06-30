import { z } from 'zod';
import { radioGroups } from '../form.ds';
import { HousingDataPayload } from '@/services/queries/forms/HousingData/postHousingData';

export const housingConditionsSchema = z.object(
  Object.fromEntries(
    radioGroups.map((group) => [
      group.name,
      group.required ? z.string().min(1, 'Campo obrigatório') : z.string().optional(),
    ])
  )
);

export type housingConditionsInfo = Omit<HousingDataPayload, 'userId'>;


