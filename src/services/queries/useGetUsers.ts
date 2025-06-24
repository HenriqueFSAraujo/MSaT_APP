import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { Endpoints } from '../endpoints';

export type User = {
    userId: number
    name: string
    userName?: string
    roleName: "ROLE_ADMIN" | "ROLE_USER"
    cpf: null
    email: null
    active: boolean
    firstLogin: boolean
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