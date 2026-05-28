import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { Endpoints } from '../endpoints';
import { toast } from '@/utils/toast';

export type TipoAluno = 'ESCOLA_PARTICULAR' | 'ESCOLA_GRATUITA';

export type CreateUserPayload = {
  id: string;
  name: string;
  userName: string;
  roleName: string;
  cpf: string;
  email: string;
  isFirstLogin: boolean;
  /**
   * Obrigatorio quando roleName = ROLE_USER. Deve ser omitido/null quando ROLE_ADMIN.
   * Validacao espelhada no backend em UserInfoService.validateTipoAluno().
   */
  tipoAluno?: TipoAluno | null;
};

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['create-user'],
    mutationFn: async (payload: CreateUserPayload) => {
      const token = localStorage.getItem('token');

      return api.post(Endpoints.Users.List, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    onSuccess: () => {
      toast.success('Senha atualizada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },

    onError: () => {
      toast.error('Erro ao atualizar senha.');
    },
  });
}
