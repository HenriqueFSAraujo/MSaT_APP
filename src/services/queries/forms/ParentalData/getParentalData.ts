import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';

export function useParentalData(userId: number, options?: { enabled?: boolean }) {
    return useQuery({
    queryKey: ['get-parental-data', userId],
    queryFn: async () => {
        const { data } = await api.get(`${Endpoints.Forms.Parental_Data}/${userId}`);
        return data;
        },
        enabled: (options?.enabled !== undefined ? options.enabled : !!userId),
        staleTime: 1000 * 60 * 5,
        retry: false
    });
}


