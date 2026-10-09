import { z } from 'zod';

const optionalField = z.string().optional();
const requiredField = z.string().min(1, 'Campo obrigatório');

export const PropertyRelationsSchema = z.object({
  veiculos: z
    .array(
      z.object({
        marcaModelo: optionalField,
        anoFabricacao: optionalField,
        utilizacao: optionalField,
      })
    )
    .default([]),
  familiaresEscola: z
    .array(
      z.object({
        nome: optionalField,
        escola: optionalField,
        valorMensal: optionalField,
      })
    )
    .default([]),
  pessoasComDeficiencia: z
    .array(
      z.object({
        nome: optionalField,
        tipoDeficiencia: optionalField,
        despesaMensal: optionalField,
      })
    )
    .default([]),
  despesasMensais: z
    .array(
      z.object({
        descricao: requiredField,
        valor: requiredField,
      })
    )
    .min(1, 'Informe ao menos uma despesa mensal')
    .default([]),
});

export type PropertyRelationsInfo = z.infer<typeof PropertyRelationsSchema>;
