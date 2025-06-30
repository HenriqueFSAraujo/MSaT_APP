import { useMutation } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';
import { toast } from '@/utils/toast';

type PropertyDataPayload = {
    userId: number
    currentvaiParticiparPassWord: boolean;
    jaFoiContemplado: boolean;
    percentual: number
};

export function postPropertyData() {
    return useMutation({

        mutationFn: (payload: PropertyDataPayload) =>
            api.post(Endpoints.Forms.Property_Data, payload),

        onSuccess: () => {
            toast.success('Relação de Bens confirmado!');
        },

        onError: (error) => {
            toast.error('Verifique se todos os campos foram preenchidos corretamente.');
            console.error(error)
        },
    });
}

