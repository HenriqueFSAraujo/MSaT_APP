import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Endpoints } from '@/services/endpoints';
import { toast } from '@/utils/toast';
import { SchoolPayload } from './schoolTypes';

export function useCreateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['create-school'],
    mutationFn: (payload: SchoolPayload) => {
      const token = localStorage.getItem('token');

      return api.post(Endpoints.Schools.List, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    onSuccess: () => {
      toast.success('Escola cadastrada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },

    onError: () => {
      toast.error('Verifique se todos os campos foram preenchidos corretamente.');
    },
  });
}
