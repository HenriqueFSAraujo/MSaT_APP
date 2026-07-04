import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Endpoints } from '@/services/endpoints';
import { toast } from '@/utils/toast';

export function useDeleteSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-school'],
    mutationFn: (id: number) => {
      const token = localStorage.getItem('token');

      return api.delete(`${Endpoints.Schools.List}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    onSuccess: () => {
      toast.success('Escola removida com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },

    onError: () => {
      toast.error('Erro ao remover a escola.');
    },
  });
}
