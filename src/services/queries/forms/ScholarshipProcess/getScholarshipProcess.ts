import { useMutation } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';
import { toast } from '@/utils/toast';

type getScholarshipProcessPayload = {
    userId: number
};

export function getScholarshipProcess() {
    return useMutation({
        mutationFn: (payload: getScholarshipProcessPayload) =>
            api.get(`${Endpoints.Forms.SchoolarShip_data}/${payload.userId}`),

        onSuccess: () => { },

        onError: (error) => {
            toast.error('Erro ao carregar informações do formulário.');
            console.error(error)
        },
    });
}

