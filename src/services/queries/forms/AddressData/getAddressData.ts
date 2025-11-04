import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';

export function useAddressData(userId: number, options?: { enabled?: boolean }) {
    return useQuery({
    queryKey: ['get-address-data', userId],
    queryFn: async () => {
        const { data } = await api.get(`${Endpoints.Forms.Address_Data}/${userId}`);
        return data;
        },
        enabled: (options?.enabled !== undefined ? options.enabled : !!userId),
        staleTime: 1000 * 60 * 5,
        retry: false
    });
}


