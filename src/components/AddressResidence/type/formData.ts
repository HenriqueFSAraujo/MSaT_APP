import { z } from 'zod';

export const addressInfoSchema = z.object({
  address: z.string().min(1, 'Endereço é obrigatório'),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  zipCode: z.string().min(1, 'CEP é obrigatório'),
  referencePoint: z.string().optional(),
  residenceType: z.string().min(1, 'Informe onde o candidato reside'),
  structureType: z.string().min(1, 'Campo obrigatório'),
  structureTypeOthers: z.string().optional(),
  hasSewage: z.string().min(1, 'Campo obrigatório'),
  electricitySource: z.string().min(1, 'Campo obrigatório'),
  waterSupply: z.string().min(1, 'Campo obrigatório'),
  transportType: z.string().min(1, 'Campo obrigatório'),
  transportTypeOthers: z.string().optional(),
  commutingTime: z.string().min(1, 'Campo obrigatório'),
  afterSchoolActivities: z.string().min(1, 'Campo obrigatório'),
  activityDescription: z.string().optional(),
  weeklyFrequency: z.string().optional(),
}).refine((data) => {
  if (data.afterSchoolActivities === 'Sim') {
    return !!data.activityDescription && data.activityDescription.trim() !== '';
  }
  return true;
}, {
  message: 'Campo obrigatório quando participa de atividades',
  path: ['activityDescription']
}).refine((data) => {
  if (data.afterSchoolActivities === 'Sim') {
    return !!data.weeklyFrequency && data.weeklyFrequency.trim() !== '';
  }
  return true;
}, {
  message: 'Campo obrigatório quando participa de atividades',
  path: ['weeklyFrequency']
}).refine((data) => {
  if (data.transportType === 'outros') {
    return !!data.transportTypeOthers && data.transportTypeOthers.trim() !== '';
  }
  return true;
}, {
  message: 'Por favor, especifique qual transporte utiliza',
  path: ['transportTypeOthers']
});

export type AddressInfo = z.infer<typeof addressInfoSchema>;
