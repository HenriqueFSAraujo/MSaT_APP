import { toast } from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';

type AddressDataPayload = {
    userId: number
    zipCode: string;
    address: string;
    neighborhood: string;
    city: string;
    referencePoint?: string;
    residenceType: string;
};

export function PostAddressData() {
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

