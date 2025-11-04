import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { Endpoints } from '../endpoints';
import { toast } from '@/utils/toast';

type useChangePasswordProps = {
  id: number;
  currentPassWord: string;
  newPassword: string;
};

export function useChangePassword() {
  return useMutation({
    mutationKey: ['change-password'],
    mutationFn: ({ id, ...payload }: useChangePasswordProps) =>
      api.put(`${Endpoints.Users.ResetPassword}/${id}`, payload),

    onSuccess: () => {
      toast.success('Senha redefinida com sucesso!');
      //TODO: VERIFICAR GET PARA TRAZER DADOS DO ALUNO E DAR O REFETCH NO FIRSTLOGIN DO USER
    },

    onError: () => {
      toast.error('Erro ao redefinir a senha.');
    },
  });
}
