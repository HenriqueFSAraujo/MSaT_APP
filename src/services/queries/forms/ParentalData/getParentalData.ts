import { useMutation } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';
import { toast } from '@/utils/toast';

type ParentalDataPayload = {
    userId: number
};

export function getParentalData() {
    return useMutation({
        mutationFn: (payload: ParentalDataPayload) =>
            api.get(`${Endpoints.Forms.Parental_Data}/${payload.userId}`),

        onSuccess: () => { },

        onError: (error) => {
            toast.error('Erro ao carregar informações do formulário.');
            console.error(error)
        },
    });
}

