import { z } from 'zod';

export const formularioSocioeconomicoSchema = z.object({
  nomeAluno: z.string().min(1, 'Nome do(a) aluno(a) é obrigatório'),
  dataNascimentoAluno: z.string().min(1, 'Data de nascimento é obrigatória'),
  segmentoCursar2025: z.string().min(1, 'Segmento a cursar é obrigatório'),

  nomeResponsavel: z.string().min(1, 'Nome do(a) responsável é obrigatório'),
  cpfResponsavel: z.string().min(1, 'CPF do(a) responsável é obrigatório'),
  telefoneResponsavel: z.string().optional(),

  rendaBrutaFamiliar: z.string().min(1, 'Renda bruta mensal familiar é obrigatória'),
  quantidadePessoasFamilia: z
    .string()
    .min(1, 'Número de componentes do grupo familiar é obrigatório'),
  rendaPerCapita: z.string().optional(),
  rendaPerCapitaSalarioMinimo: z.string().optional(),

  percentualLc187: z.enum(['100%', 'Indeferido'], {
    required_error: 'Percentual conforme a Lei Complementar é obrigatório',
  }),
});

export const segmentoCursar2025Options = [
  { value: 'Educação infantil', label: 'Educação infantil' },
  { value: 'Ensino Fundamental Anos Iniciais', label: 'Ensino Fundamental Anos Iniciais' },
];

export const percentualOptions = [
  { value: '100%', label: '100%' },
  { value: 'Indeferido', label: 'Indeferido' },
];

export type FormularioSocioeconomicoData = z.infer<typeof formularioSocioeconomicoSchema>;
