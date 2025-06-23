import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { Endpoints } from '../endpoints';
import { toast } from '@/utils/toast';

type useCreateUserProps = {
    name: string
    cpf: string
    userName: string
    roleName: "ROLE_ADMIN" | "ROLE_USER"
    email: string
    isFirstLogin: boolean
};


export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: useCreateUserProps) =>
            api.post(Endpoints.Users.List, payload),

        onSuccess: () => {
            toast.success('Usuário cadastrado com sucesso!');
            queryClient.invalidateQueries();
        },

        onError: () => {
            toast.error('Erro ao cadastrar usuário.');
        },
    });
}

