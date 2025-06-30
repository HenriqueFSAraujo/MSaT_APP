import { useMutation } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';
import { toast } from '@/utils/toast';

type ParentalDataPayload = {
    userId: number
    parent1Cpf: string,
    parent1FullName: string,
    parent1Phone: string,
    parent1MaritalStatus: string,
    parent2Cpf: string,
    parent2FullName: string,
    parent2Phone: string,
    parent2MaritalStatus: string,
    residesWithBothParents: string
};

export function postParentalData() {
    return useMutation({

        mutationFn: (payload: ParentalDataPayload) =>
            api.post(Endpoints.Forms.Parental_Data, payload),

        onSuccess: () => {
            toast.success('Dados dos Pais confirmado!');
        },

        onError: (error) => {
            toast.error('Verifique se todos os campos foram preenchidos corretamente.');
            console.error(error)
        },
    });
}

