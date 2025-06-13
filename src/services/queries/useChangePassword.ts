import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { Endpoints } from '../endpoints';
import { toast } from '@/utils/toast';

type ChangePasswordPayload = {
    currentPassword: string;
    newPassword: string;
};

export function useUpdatePassword() {
    return useMutation({
        mutationFn: (payload: ChangePasswordPayload) =>
            api.post(Endpoints.Profile.ChangePassword, payload),

        onSuccess: () => {
            toast.success('Senha atualizada com sucesso!');
        },

        onError: () => {
            toast.error('Erro ao atualizar senha.');
        },
    });
}

