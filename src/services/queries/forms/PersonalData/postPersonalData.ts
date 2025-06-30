import { useMutation } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';
import { toast } from '@/utils/toast';

type postPersonalDataPayload = {
    userId: number
    fullName: string
    email: string
    cpf: string
    cpfScholarship: string
    phone: string
    gender: string
    dateBirth: string
    deficiency: string
    educasenso: string
};

export function postPersonalData() {
    return useMutation({

        mutationFn: (payload: postPersonalDataPayload) =>
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

