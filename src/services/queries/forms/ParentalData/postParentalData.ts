import { useMutation } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';
import { toast } from '@/utils/toast';

type ParentalDataPayload = {
    userId: number
    currentvaiParticiparPassWord: boolean
    jaFoiContemplado: boolean
    percentual: number
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

