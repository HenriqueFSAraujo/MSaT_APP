import { useMutation } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';
import { toast } from '@/utils/toast';

type PersonalDataPayload = {
    userId: number
};

export function getPersonalData() {
    return useMutation({
        mutationFn: (payload: PersonalDataPayload) =>
            api.get(`${Endpoints.Forms.Personal_Data}/${payload.userId}`),

        onSuccess: () => { },

        onError: (error) => {
            toast.error('Erro ao carregar informações do formulário.');
            console.error(error)
        },
    });
}

