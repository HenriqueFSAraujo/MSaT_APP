import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { Endpoints } from '../endpoints';
import { toast } from '@/utils/toast';

type useChangePasswordProps = {
  id: number;
  currentPassWord: string;
  newPassword: string;
};

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['status-user'],
    mutationFn: ({ id, ...payload }: useChangePasswordProps) =>
      api.put(`${Endpoints.Users.ResetPassword}/${id}`, payload),

    onSuccess: () => {
      toast.success('Senha redefinida com sucesso!');
      queryClient.invalidateQueries();
    },

    onError: () => {
      toast.error('Erro ao redefinir a senha.');
    },
  });
}
