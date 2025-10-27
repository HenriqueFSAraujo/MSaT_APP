import { z } from 'zod';
import { birthDateStringValidation } from '@/utils/dateValidations';

export const formularioSocioeconomicoSchema = z.object({
  nomeAluno: z.string().min(1, 'Nome do(a) aluno(a) é obrigatório'),
  dataNascimentoAluno: birthDateStringValidation,

  segmentoCursar2025: z.string().min(1, 'Segmento a cursar é obrigatório'),

  nomeResponsavel: z.string().min(1, 'Nome do(a) responsável é obrigatório'),
  cpfResponsavel: z.string().min(1, 'CPF do(a) responsável é obrigatório'),
  telefoneResponsavel: z.string().optional(),

  rendaBrutaFamiliar:z
  .string()
  .min(1, 'Renda bruta mensal familiar é obrigatória')
  .transform((val) => Number(val.replace(/\D/g, '')))
  .pipe(z.number().min(1, 'Deve ser no mínimo 1')),

  totalComponentesFamilar: z
  .string()
  .min(1, 'Total de componentes é obrigatório')
  .transform((val) => Number(val.replace(/\D/g, '')))
  .pipe(z.number().min(1, 'Deve ser no mínimo 1')),

  rendaPerCapita: z
  .string()
  .transform((val) => Number(val.replace(/\D/g, '')))
  .pipe(z.number().min(0, 'Valor inválido')),

  rendaPerCapitaSalarioMinimo: z
  .string()
  .transform((val) => {
    if (!val) return 0;
    const normalizedValue = val.replace(',', '.');
    return parseFloat(normalizedValue);
  })
  .pipe(z.number().min(0, 'Valor inválido')),


  percentualLc187: z.enum(['100%', 'Indeferido'], {
    required_error: 'Percentual conforme a Lei Complementar é obrigatório',
  }),

  beneficiarioProgramaRenda: z
  .enum(['Sim', 'Não'], {
    required_error: 'Informe se é beneficiário de Programa de Transferência de Renda',
  })
  .transform((value) => value === 'Sim'),

  resideProximoUnidadeEscolar: z
  .enum(['Sim', 'Não'], {
    required_error: 'Informe se reside próximo da Unidade Escolar',
  })
  .transform((value) => value === 'Sim'),


  candidatoComDeficiencia: z
  .enum(['Sim', 'Não'], {
    required_error: 'Informe se o(a) candidato(a)/aluno(a) possui deficiência',
  })
  .transform((value) => value === 'Sim'),

  doencaGraveOuDeficienciaFamiliar: z
  .enum(['Sim', 'Não'], {
    required_error: 'Informe se há ocorrência de doença grave/deficiência no grupo familiar',
  })
  .transform((value) => value === 'Sim'),

  quantidadeMenoresDezoitoAnos: z
  .string()
  .min(1, 'Campo obrigatório')
  .transform((val) => Number(val.replace(/\D/g, '')))
  .pipe(z.number().min(0, 'Valor inválido')),


  aspectosRelevantes: z.string().optional(),

  resultadoSocioeconomico: z.enum(['Deferido', 'Indeferido'], {
    required_error: 'Resultado da avaliação socioeconômica é obrigatório',
  }).optional(),

  dataFinalizacaoParecer: z
    .date({
      required_error: 'Data de finalização é obrigatória',
      invalid_type_error: 'Formato inválido de data',
    })
     .refine((date) => date !== null, { message: 'Data da finalização do parecer é obrigatória' }),
});

export const simNaoOptions = [
  { value: 'Sim', label: 'Sim' },
  { value: 'Não', label: 'Não' },
];

export const avaliacaoOptions = [
  { value: 'Deferido', label: 'Deferido' },
  { value: 'Indeferido', label: 'Indeferido' },
];

export const segmentoCursar2025Options = [
  { value: 'Educação infantil', label: 'Educação infantil' },
  { value: 'Ensino Fundamental Anos Iniciais', label: 'Ensino Fundamental Anos Iniciais' },
];

export const percentualOptions = [
  { value: '100%', label: '100%' },
  { value: 'Indeferido', label: 'Indeferido' },
];

export interface FormularioSocioeconomicoData {
  nomeAluno: string;
  dataNascimentoAluno: string;
  segmentoCursar2025: string;
  nomeResponsavel: string;
  cpfResponsavel: string;
  telefoneResponsavel?: string;
  rendaBrutaFamiliar: string | number;
  totalComponentesFamilar: string | number;
  rendaPerCapita: string | number;
  rendaPerCapitaSalarioMinimo: string | number;
  percentualLc187?: string;
  beneficiarioProgramaRenda?: string;
  resideProximoUnidadeEscolar?: string;
  candidatoComDeficiencia?: string;
  doencaGraveOuDeficienciaFamiliar?: string;
  quantidadeMenoresDezoitoAnos?: string | number;
  aspectosRelevantes: string;
  resultadoSocioeconomico?: string;
  dataFinalizacaoParecer: Date;
}

export type FormularioSocioeconomicoDataFromZod = z.infer<typeof formularioSocioeconomicoSchema>;
