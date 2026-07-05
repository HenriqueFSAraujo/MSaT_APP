import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Endpoints } from '@/services/endpoints';
import { School } from './schoolTypes';

export function useGetSchools() {
  return useQuery<School[]>({
    queryKey: ['schools'],
    queryFn: async () => {
      const { data } = await api.get(Endpoints.Schools.List);
      return data;
    },
  });
}
