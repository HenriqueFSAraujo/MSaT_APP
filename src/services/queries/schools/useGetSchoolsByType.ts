import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Endpoints } from '@/services/endpoints';
import { School, SchoolType } from './schoolTypes';

export function useGetSchoolsByType(tipo?: SchoolType) {
  return useQuery<School[]>({
    queryKey: ['schools-by-type', tipo],
    queryFn: async () => {
      const { data } = await api.get(`${Endpoints.Schools.ByType}/${tipo}`);
      return data;
    },
    enabled: !!tipo,
    staleTime: 1000 * 60 * 5,
  });
}
