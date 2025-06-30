import { useMutation } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';
import { toast } from '@/utils/toast';

type postScholarshipProcessPayload = {
    userId: number
    currentvaiParticiparPassWord: boolean
    jaFoiContemplado: boolean
    percentual?: number
};

export function postScholarshipProcess() {
    return useMutation({

        mutationFn: (payload: postScholarshipProcessPayload) =>
            api.post(Endpoints.Forms.SchoolarShip_data, payload),

        onSuccess: () => {
            toast.success('Processo de Bolsa confirmado!');
        },

        onError: (error) => {
            toast.error('Verifique se todos os campos foram preenchidos corretamente.');
            console.error(error)
        },
    });
}

