import { z } from 'zod';

export const PropertyRelationsSchema = z.object({
  veiculos: z
    .array(
      z.object({
        marcaModelo: z.string().min(1, 'Campo obrigatório'),
        anoFabricacao: z
          .string()
          .min(4, 'Ano inválido')
          .regex(/^\d{4}$/, 'Ano deve conter 4 dígitos numéricos'),
        utilizacao: z.string().min(1, 'Campo obrigatório'),
      })
    )
    .min(1, 'Pelo menos uma linha é obrigatória'),
  familiaresEscola: z
    .array(
      z.object({
        nome: z.string().min(1, 'Campo obrigatório'),
        escola: z.string().min(1, 'Campo obrigatório'),
        valorMensal: z.string().min(1, 'Campo obrigatório'),
      })
    )
    .min(1, 'Pelo menos uma linha é obrigatória'),
  pessoasComDeficiencia: z
    .array(
      z.object({
        nome: z.string().min(1, 'Campo obrigatório'),
        tipoDeficiencia: z.string().min(1, 'Campo obrigatório'),
        despesaMensal: z.string().min(1, 'Campo obrigatório'),
      })
    )
    .min(1, 'Pelo menos uma linha é obrigatória'),
  despesasMensais: z
    .array(
      z.object({
        descricao: z.string().min(1, 'Campo obrigatório'),
        valor: z.string().min(1, 'Campo obrigatório'),
      })
    )
    .min(1, 'Pelo menos uma linha é obrigatória'),
});

export type PropertyRelationsInfo = z.infer<typeof PropertyRelationsSchema>;
