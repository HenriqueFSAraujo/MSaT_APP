import { useMutation } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';
import { toast } from '@/utils/toast';

type AddressDataPayload = {
    userId: number
};

export function getAddressData() {
    return useMutation({
        mutationFn: (payload: AddressDataPayload) =>
            api.get(`${Endpoints.Forms.Address_Data}/${payload.userId}`),

        onSuccess: () => { },

        onError: (error) => {
            toast.error('Erro ao carregar informações do formulário.');
            console.error(error)
        },
    });
}

