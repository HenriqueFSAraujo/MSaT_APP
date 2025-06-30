import { useMutation } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';
import { toast } from '@/utils/toast';

type getPersonalDataPayload = {
    userId: number
    currentvaiParticiparPassWord: boolean
    jaFoiContemplado: boolean
    percentual: number
};

export function getPersonalData() {
    return useMutation({

        mutationFn: (payload: getPersonalDataPayload) =>
            api.post(Endpoints.Forms.Personal_Data, payload),

        onSuccess: () => {
            toast.success('Processo de Bolsa confirmado!');
        },

        onError: (error) => {
            toast.error('Verifique se todos os campos foram preenchidos corretamente.');
            console.error(error)
        },
    });
}

