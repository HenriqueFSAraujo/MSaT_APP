import { z } from 'zod';

// Esquema para campos vazios ou completos
const memberSchema = z.object({
  nomeCompleto: z.string()
    .refine(val => !val || val.trim() !== '', 'Campo obrigatório'),
  escolaridade: z.string()
    .refine(val => !val || val.trim() !== '', 'Campo obrigatório'),
  grauParentesco: z.string()
    .refine(val => !val || val.trim() !== '', 'Campo obrigatório'),
  dataNascimento: z.string()
    .refine(val => !val || /^\d{2}\/\d{2}\/\d{4}$/.test(val), 'Formato de data deve ser DD/MM/AAAA'),
  profissaoAtiva: z.string()
    .refine(val => !val || val.trim() !== '', 'Campo obrigatório'),
  estadoCivil: z.string()
    .refine(val => !val || val.trim() !== '', 'Campo obrigatório'),
  salarioBruto: z.string()
    .refine(val => !val || val.trim() !== '', 'Campo obrigatório'),
}).superRefine((data, ctx) => {
  // Se qualquer campo tem valor, todos são obrigatórios
  const hasValue = Object.values(data).some(val => val && val.trim() !== '');
  
  // Se tem algum valor, verifica se todos estão preenchidos
  if (hasValue) {
    Object.entries(data).forEach(([key, val]) => {
      // Se não tem valor e algum campo foi preenchido
      if (!val || val.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Campo obrigatório',
          path: [key],
        });
      }
      
      // Validação específica para data
      if (key === 'dataNascimento' && val && !/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Formato de data deve ser DD/MM/AAAA',
          path: [key],
        });
      }
    });
  }
});

export const FamilyCompositionSchema = z.object({
  composicaoFamiliar: z
    .array(memberSchema)
    .refine(
      (arr) => arr.some(item => 
        Object.values(item).some(val => val && val.trim() !== '')
      ), 
      { message: 'Pelo menos um membro da família é obrigatório' }
    ),
  familiaresEscola: z
    .array(
      z.object({
        nome: z.string().min(1, 'Campo obrigatório'),
        escola: z.string().min(1, 'Campo obrigatório'),
        valorMensal: z.string().min(1, 'Campo obrigatório'),
      })
    )
    .optional(),
  pessoasComDeficiencia: z
    .array(
      z.object({
        nome: z.string().min(1, 'Campo obrigatório'),
        tipoDeficiencia: z.string().min(1, 'Campo obrigatório'),
        despesaMensal: z.string().min(1, 'Campo obrigatório'),
      })
    )
    .optional(),
  despesasMensais: z
    .array(
      z.object({
        descricao: z.string().min(1, 'Campo obrigatório'),
        valor: z.string().min(1, 'Campo obrigatório'),
      })
    )
    .optional(),
});

export type FamilyCompositionInfo = z.infer<typeof FamilyCompositionSchema>;
