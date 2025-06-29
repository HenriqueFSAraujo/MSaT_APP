import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { Endpoints } from '../endpoints';
import { toast } from '@/utils/toast';

export type CreateUserPayload = {
    id: string
    name: string
    userName: string
    roleName: string
    cpf: string
    email: string
    isFirstLogin: boolean
};


export function useCreateUser() {
    return useMutation({
        mutationFn: async (payload: CreateUserPayload) => {
            const token = localStorage.getItem('token');

            return api.post(Endpoints.Users.List, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        },

        onSuccess: () => {
            toast.success('Senha atualizada com sucesso!');
        },

        onError: () => {
            toast.error('Erro ao atualizar senha.');
        },
    });
}
