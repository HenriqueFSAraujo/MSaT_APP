import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';

export function useFamilyCompositionData(userId: number) {
  return useQuery({
    queryKey: ['get-family-composition-data', userId],
    queryFn: async () => {
      const { data } = await api.get(`${Endpoints.Forms.Family_Composition}/${userId}`);
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: false
  });
}

