import { useMutation } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';
import { toast } from '@/utils/toast';

type HousingDataPayload = {
    userId: string
    currentvaiParticiparPassWord: boolean
    jaFoiContemplado: boolean
    percentual: number
};

export function postHousingData() {
    return useMutation({

        mutationFn: (payload: HousingDataPayload) =>
            api.post(Endpoints.Forms.Housing_Data, payload),

        onSuccess: () => {
            toast.success('Condições de Moradia confirmada!');
        },

        onError: (error) => {
            toast.error('Verifique se todos os campos foram preenchidos corretamente.');
            console.error(error)
        },
    });
}

