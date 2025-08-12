import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';

export function GetPersonalData(userId: number) {
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