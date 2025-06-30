import { useMutation } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';
import { toast } from '@/utils/toast';

type PropertyDataPayload = {
    userId: number
};

export function getPropertyData() {
    return useMutation({
        mutationFn: (payload: PropertyDataPayload) =>
            api.get(`${Endpoints.Forms.Property_Data}/${payload.userId}`),

        onSuccess: () => { },

        onError: (error) => {
            toast.error('Erro ao carregar informações do formulário.');
            console.error(error)
        },
    });
}

