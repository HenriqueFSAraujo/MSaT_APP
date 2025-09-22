import { z } from 'zod';

export const consentTermsSchema = z.object({
    declaranteNome: z.string().min(1, 'Nome do declarante é obrigatório'),
    declaranteRG: z.string().min(1, 'RG do declarante é obrigatório'),
    declaranteCPF: z.string().min(1, 'CPF do declarante é obrigatório'),
    alunoNome: z.string().min(1, 'Nome do(a) aluno(a) é obrigatório'),
    aceitaTermos: z.boolean().refine((val) => val === true, {
        message: 'Você deve aceitar os termos para continuar'
    })
});

export type ConsentTermsType = z.infer<typeof consentTermsSchema>;
