import { useMutation } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';
import { toast } from '@/utils/toast';

type AddressDataPayload = {
    userId: number
    currentvaiParticiparPassWord: boolean
    jaFoiContemplado: boolean
    percentual: number
};

export function postAddressData() {
    return useMutation({

        mutationFn: (payload: AddressDataPayload) =>
            api.post(Endpoints.Forms.Address_Data, payload),

        onSuccess: () => {
            toast.success('Endereço confirmado!');
        },

        onError: (error) => {
            toast.error('Verifique se todos os campos foram preenchidos corretamente.');
            console.error(error)
        },
    });
}

