import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Endpoints } from '@/services/endpoints';
import { toast } from '@/utils/toast';
import { SchoolPayload } from './schoolTypes';

type UpdateSchoolProps = SchoolPayload & { id: number };

export function useUpdateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-school'],
    mutationFn: ({ id, ...payload }: UpdateSchoolProps) => {
      const token = localStorage.getItem('token');

      return api.put(`${Endpoints.Schools.List}/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    onSuccess: () => {
      toast.success('Escola atualizada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },

    onError: () => {
      toast.error('Verifique se todos os campos foram preenchidos corretamente.');
    },
  });
}
