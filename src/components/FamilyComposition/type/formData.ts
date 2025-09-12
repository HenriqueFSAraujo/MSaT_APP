import { z } from 'zod';

export const FamilyMemberSchema = z.object({
  nomeCompleto: z.string().optional().default(''),
  escolaridade: z.string().optional().default(''),
  escolaridade_other: z.string().optional().default(''),
  grauParentesco: z.string().optional().default(''),
  dataNascimento: z.string().optional().default(''),
  profissaoAtiva: z.string().optional().default(''),
  estadoCivil: z.string().optional().default(''),
  salarioBruto: z.string().optional().default(''),
});

export const FamiliarEscolaSchema = z.object({
  nome: z.string().optional().default(''),
  escola: z.string().optional().default(''),
  valorMensal: z.string().optional().default(''),
});

export const PessoaComDeficienciaSchema = z.object({
  nome: z.string().optional().default(''),
  tipoDeficiencia: z.string().optional().default(''),
  despesaMensal: z.string().optional().default(''),
});

export const DespesaMensalSchema = z.object({
  descricao: z.string().optional().default(''),
  valor: z.string().optional().default(''),
});

export const FamilyCompositionSchema = z.object({
  composicaoFamiliar: z.array(FamilyMemberSchema),
  familiaresEscola: z.array(FamiliarEscolaSchema).optional().default([]),
  pessoasComDeficiencia: z.array(PessoaComDeficienciaSchema).optional().default([]),
  despesasMensais: z.array(DespesaMensalSchema).optional().default([]),
});

// Define the type for a family member with index signature to allow string indexing
export interface FamilyMember {
  nomeCompleto: string;
  escolaridade: string;
  escolaridade_other?: string;
  grauParentesco: string;
  dataNascimento: string;
  profissaoAtiva: string;
  estadoCivil: string;
  salarioBruto: string;
  [key: string]: string | undefined;
}

export interface FamiliarEscola {
  nome: string;
  escola: string;
  valorMensal: string;
}

export interface PessoaComDeficiencia {
  nome: string;
  tipoDeficiencia: string;
  despesaMensal: string;
}

export interface DespesaMensal {
  descricao: string;
  valor: string;
}

export interface FamilyCompositionInfo {
  composicaoFamiliar: FamilyMember[];
  familiaresEscola: FamiliarEscola[];
  pessoasComDeficiencia: PessoaComDeficiencia[];
  despesasMensais: DespesaMensal[];
}

export function isFamilyCompositionInfo(
  data: FamilyCompositionInfo
): data is FamilyCompositionInfo {
  return (
    data &&
    Array.isArray(data.composicaoFamiliar) &&
    (!data.familiaresEscola || Array.isArray(data.familiaresEscola)) &&
    (!data.pessoasComDeficiencia || Array.isArray(data.pessoasComDeficiencia)) &&
    (!data.despesasMensais || Array.isArray(data.despesasMensais))
  );
}
