import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Endpoints } from '@/services/endpoints';
import { School } from './schoolTypes';

export function useGetSchoolById(id?: number) {
  return useQuery<School>({
    queryKey: ['school', id],
    queryFn: async () => {
      const { data } = await api.get(`${Endpoints.Schools.List}/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
