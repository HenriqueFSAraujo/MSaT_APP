import { z } from 'zod';
import { flexibleBirthDateStringValidation } from '@/utils/dateValidations';

export const FamilyMemberSchema = z.object({
  nomeCompleto: z.string().optional().default(''),
  escolaridade: z.string().optional().default(''),
  escolaridade_other: z.string().optional().default(''),
  grauParentesco: z.string().optional().default(''),
  grauParentesco_other: z.string().optional().default(''),
  dataNascimento: flexibleBirthDateStringValidation,
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
}).superRefine((data, ctx) => {
  // Função auxiliar para verificar se uma linha está completamente vazia
  const isRowEmpty = (member: z.infer<typeof FamilyMemberSchema>) => {
    const nome = member.nomeCompleto?.trim() || '';
    const escolaridade = member.escolaridade?.trim() || '';
    const grauParentesco = member.grauParentesco?.trim() || '';
    const dataNascimento = member.dataNascimento?.trim() || '';
    const profissaoAtiva = member.profissaoAtiva?.trim() || '';
    const estadoCivil = member.estadoCivil?.trim() || '';
    const salario = member.salarioBruto?.trim() || '';

    return !nome && !escolaridade && !grauParentesco && !dataNascimento &&
           !profissaoAtiva && !estadoCivil && (!salario || salario === 'R$ 0,00');
  };

  // Validar cada linha
  data.composicaoFamiliar.forEach((member, index) => {
    // Se a linha está vazia, não valida
    if (isRowEmpty(member)) {
      return;
    }

    // Se tem pelo menos um campo preenchido, validar todos os campos obrigatórios
    if (!member.nomeCompleto?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Campo obrigatório',
        path: ['composicaoFamiliar', index, 'nomeCompleto'],
      });
    }

    if (!member.escolaridade?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Campo obrigatório',
        path: ['composicaoFamiliar', index, 'escolaridade'],
      });
    } else if (member.escolaridade === 'outros' && !member.escolaridade_other?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Especifique a escolaridade',
        path: ['composicaoFamiliar', index, 'escolaridade_other'],
      });
    }

    if (!member.grauParentesco?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Campo obrigatório',
        path: ['composicaoFamiliar', index, 'grauParentesco'],
      });
    } else if (member.grauParentesco === 'Outros' && !member.grauParentesco_other?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Especifique o grau de parentesco',
        path: ['composicaoFamiliar', index, 'grauParentesco_other'],
      });
    }

    if (!member.dataNascimento?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Campo obrigatório',
        path: ['composicaoFamiliar', index, 'dataNascimento'],
      });
    }

    if (!member.profissaoAtiva?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Campo obrigatório',
        path: ['composicaoFamiliar', index, 'profissaoAtiva'],
      });
    }

    if (!member.estadoCivil?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Campo obrigatório',
        path: ['composicaoFamiliar', index, 'estadoCivil'],
      });
    }
  });

  // Validar se pelo menos uma linha foi preenchida
  const hasAtLeastOneFilledRow = data.composicaoFamiliar.some(member => !isRowEmpty(member));
  if (!hasAtLeastOneFilledRow) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'É necessário preencher pelo menos um membro da família',
      path: ['composicaoFamiliar'],
    });
  }
});

// Define the type for a family member with index signature to allow string indexing
export interface FamilyMember {
  nomeCompleto: string;
  escolaridade: string;
  escolaridade_other?: string;
  grauParentesco: string;
  grauParentesco_other?: string;
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
