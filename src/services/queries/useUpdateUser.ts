import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { Endpoints } from '../endpoints';
import { toast } from '@/utils/toast';
import type { TipoAluno } from './useCreateUser';

export type UpdateUserPayload = {
  name: string;
  userName?: string;
  roleName: string;
  cpf: string;
  email: string;
  /**
   * Obrigatorio quando roleName = ROLE_USER. Deve ser null quando ROLE_ADMIN.
   * Validacao espelhada no backend em UserInfoService.validateTipoAluno().
   */
  tipoAluno?: TipoAluno | null;
};

export type UpdateUserArgs = {
  userId: number;
  payload: UpdateUserPayload;
};

/**
 * Atualiza um usuario existente (PUT /api/users/{id}).
 *
 * O backend retorna erros estruturados via GlobalExceptionHandler — em onError,
 * tente extrair `response.data.message` ou `response.data.fieldErrors` para
 * mensagens mais precisas.
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-user'],
    mutationFn: async ({ userId, payload }: UpdateUserArgs) => {
      const token = localStorage.getItem('token');
      return api.put(`${Endpoints.Users.List}/${userId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    onSuccess: () => {
      toast.success('Usuário atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },

    onError: () => {
      toast.error('Erro ao atualizar usuário.');
    },
  });
}
