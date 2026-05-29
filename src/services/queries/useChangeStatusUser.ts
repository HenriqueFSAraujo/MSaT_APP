import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { Endpoints } from '../endpoints';
import { toast } from '@/utils/toast';

export type ChangeStatusUserPayload = {
  id: number;
  isActive: boolean;
};

/**
 * Ativa/desativa um usuário via PUT /api/users/status/{id}.
 *
 * Backend espera body { isActive: boolean } e retorna texto plano com a confirmação.
 *
 * Antes desta correção este arquivo duplicava o hook useChangePassword (mesmo nome de função,
 * apontando para /users/reset-password). Agora é o hook real de alteração de status.
 */
export function useChangeStatusUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['change-status-user'],
    mutationFn: ({ id, isActive }: ChangeStatusUserPayload) => {
      const token = localStorage.getItem('token');
      return api.put(
        `${Endpoints.Users.ChangeStatus}/${id}`,
        { isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },

    onSuccess: (_data, variables) => {
      toast.success(
        variables.isActive ? 'Usuário ativado com sucesso!' : 'Usuário desativado com sucesso!',
      );
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },

    onError: () => {
      toast.error('Erro ao alterar status do usuário.');
    },
  });
}
