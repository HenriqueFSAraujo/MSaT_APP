import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';

export function useParentalData(userId: number) {
    return useQuery({
    queryKey: ['get-parental-data', userId],
    queryFn: async () => {
        const { data } = await api.get(`${Endpoints.Forms.Parental_Data}/${userId}`);
        return data;
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5,
        retry: false
    });
}


