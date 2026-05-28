import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { Endpoints } from '../endpoints';

export type TipoAluno = 'ESCOLA_PARTICULAR' | 'ESCOLA_GRATUITA';

export type User = {
  userId: number;
  name: string;
  roleName: string;
  cpf: string | null;
  email: string | null;
  active: boolean;
  firstLogin: boolean;
  /**
   * Null para admins ou alunos cadastrados antes da feature (migration V52).
   * Vai vir preenchido para alunos novos com classificacao.
   */
  tipoAluno: TipoAluno | null;
};

export function useGetUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get(Endpoints.Users.List);
      return data;
    },
  });
}
