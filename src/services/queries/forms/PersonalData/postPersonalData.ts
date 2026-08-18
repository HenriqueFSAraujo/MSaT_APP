import { api } from '@/services/api';
import { Endpoints } from '@/services/endpoints';
import { toast } from '@/utils/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
    escolaId: number
};


export function PostPersonalData() {
    const queryClient = useQueryClient();

    return  useMutation({
        mutationKey: ['send-personal-data'],
        mutationFn: (payload: postPersonalDataPayload) =>
            api.post(Endpoints.Forms.Personal_Data, payload),

        onSuccess: (_response, payload) => {
            queryClient.invalidateQueries({ queryKey: ['get-personal-data', payload.userId] });
            toast.success('Processo de Bolsa confirmado!');
        },

        onError: (error) => {
            toast.error('Verifique se todos os campos foram preenchidos corretamente.');
            console.error(error)
        },
    });
}

