import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';

export function useFamilyCompositionData(userId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['get-family-composition-data', userId],
    queryFn: async () => {
      const { data } = await api.get(`${Endpoints.Forms.Family_Composition}/${userId}`);
      return data;
    },
    enabled: (options?.enabled !== undefined ? options.enabled : !!userId),
    staleTime: 1000 * 60 * 5,
    retry: false
  });
}

