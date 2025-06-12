import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { Endpoints } from '../endpoints';

type User = {
    id: number;
    name: string;
    email: string;
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