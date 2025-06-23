import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { Endpoints } from '../endpoints';

export type User = {
    name: string,
    userName?: string,
    roleName: "ROLE_ADMIN" | "ROLE_USER",
    cpf: null,
    email: null,
    firstLogin: false
};

export function useGetUsers() {
    return useQuery<User[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const { data } = await api.get(Endpoints.Users.List);
            return data;
        },
    });
}