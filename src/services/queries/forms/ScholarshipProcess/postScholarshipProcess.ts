import { toast } from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';

type postScholarshipProcessPayload = {
    userId: number
    vaiParticipar: boolean
    jaFoiContemplado: boolean
    percentual?: number
};

export function PostScholarshipProcess() {
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

