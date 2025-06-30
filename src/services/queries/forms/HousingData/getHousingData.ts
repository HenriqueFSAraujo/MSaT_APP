import { useMutation } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';
import { toast } from '@/utils/toast';

type HousingDataPayload = {
    userId: number
};

export function getHousingData() {
    return useMutation({
        mutationFn: (payload: HousingDataPayload) =>
            api.get(`${Endpoints.Forms.Housing_Data}/${payload.userId}`),

        onSuccess: () => { },

        onError: (error) => {
            toast.error('Erro ao carregar informações do formulário.');
            console.error(error)
        },
    });
}

