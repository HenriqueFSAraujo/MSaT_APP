import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';

export function usePropertyData(userId: number, options?: { enabled?: boolean }) {
    return useQuery({
    queryKey: ['get-property-data', userId],
    queryFn: async () => {
        const { data } = await api.get(`${Endpoints.Forms.Property_Data}/${userId}`);
        return data;
        },
        enabled: (options?.enabled !== undefined ? options.enabled : !!userId),
        staleTime: 1000 * 60 * 5,
        retry: false
    });
}






