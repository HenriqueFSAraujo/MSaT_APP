import { api } from '@/services/api';
import { Endpoints } from '@/services/endpoints';
import { useQuery } from '@tanstack/react-query';

export function usePersonalData(userId: number) {
  return useQuery({
    queryKey: ['get-personal-data', userId],
    queryFn: async () => {
      const { data } = await api.get(`${Endpoints.Forms.Personal_Data}/${userId}`);
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: false
  });
}