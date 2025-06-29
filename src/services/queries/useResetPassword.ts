import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { Endpoints } from '../endpoints';
import { toast } from '@/utils/toast';

type useResetPasswordProps = {
    id: string
    currentPassWord: string
    newPassword: string
};


export function useResetPassword() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...payload }: useResetPasswordProps) =>
            api.put(`${Endpoints.Users.ResetPassword}/${id}`, payload),


        onSuccess: () => {
            toast.success('Senha redefinida com sucesso!');
            queryClient.invalidateQueries();
        },

        onError: () => {
            toast.error('Erro ao redefinir a senha.');
        },
    });
}


