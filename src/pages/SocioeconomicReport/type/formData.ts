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

  beneficiarioProgramaRenda: z.enum(['Sim', 'Não'], {
    required_error: 'Informe se é beneficiário de Programa de Transferência de Renda',
  }),

  resideProximoUnidadeEscolar: z.enum(['Sim', 'Não'], {
    required_error: 'Informe se reside próximo da Unidade Escolar',
  }),

  candidatoComDeficiencia: z.enum(['Sim', 'Não'], {
    required_error: 'Informe se o(a) candidato(a)/aluno(a) possui deficiência',
  }),

  doencaGraveOuDeficienciaFamiliar: z.enum(['Sim', 'Não'], {
    required_error: 'Informe se há ocorrência de doença grave/deficiência no grupo familiar',
  }),

  quantidadeMenoresDezoitoAnos: z
    .string()
    .min(1, 'Quantidade de membros no grupo familiar com idade inferior a 18 anos é obrigatória'),

  aspectosRelevantes: z.string().optional(),

  resultadoSocioeconomico: z.enum(['Deferido', 'Indeferido'], {
    required_error: 'Resultado da avaliação socioeconômica é obrigatório',
  }),

  dataFinalizacaoParecer: z
    .string()
    .min(1, 'Data da finalização do parecer é obrigatória'),
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

export type FormularioSocioeconomicoData = z.infer<typeof formularioSocioeconomicoSchema>;
