import { api } from '@/services/api';
import { Endpoints } from '@/services/endpoints';
import { toast } from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';

type postPersonalDataPayload = {
    userId: number
    fullName: string
    email: string
    cpf: string
    rg: string
    nationality: string
    birthplace: string
    cpfScholarship: string
    race: string
    phone: string
    gender: string
    dateBirth: string
    deficiency: string
    educasenso: string
};


export function PostPersonalData() {
    return  useMutation({
        mutationKey: ['send-personal-data'],
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

