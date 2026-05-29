import { create } from 'zustand';

export type Role = 'Aluno' | 'Gestor' | 'Todos';

export type SortField = 'name' | 'email' | 'cpf';
export type SortOrder = 'asc' | 'desc';

/**
 * Filtro por tipo de escola do aluno.
 * - 'TODOS': sem filtro (default)
 * - 'ESCOLA_PARTICULAR' / 'ESCOLA_GRATUITA': bate com TipoAluno do backend
 * - 'NAO_CLASSIFICADO': alunos legados com tipoAluno = null (194 cadastrados antes da V52)
 */
export type TipoAlunoFilter =
  | 'TODOS'
  | 'ESCOLA_PARTICULAR'
  | 'ESCOLA_GRATUITA'
  | 'NAO_CLASSIFICADO';

interface UsersPaginationStore {
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;
  role: Role;
  status: string[];
  tipoAluno: TipoAlunoFilter;
  sortField: SortField;
  sortOrder: SortOrder;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  setSearchTerm: (term: string) => void;
  setRole: (role: Role) => void;
  setStatus: (status: string[]) => void;
  setTipoAluno: (tipoAluno: TipoAlunoFilter) => void;
  setSort: (field: SortField, order: SortOrder) => void;
  resetPagination: () => void;
}

export const useUsersPaginationStore = create<UsersPaginationStore>()((set) => ({
  currentPage: 1,
  itemsPerPage: 10,
  searchTerm: '',
  role: 'Aluno' as Role,
  status: ['ativo', 'inativo'],
  tipoAluno: 'TODOS' as TipoAlunoFilter,
  sortField: 'name',
  sortOrder: 'asc',
  setCurrentPage: (page: number) => set({ currentPage: page }),
  setItemsPerPage: (items: number) => set({ itemsPerPage: items }),
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setRole: (role: Role) => set({ role }),
  setStatus: (status: string[]) => set({ status }),
  setTipoAluno: (tipoAluno: TipoAlunoFilter) => set({ tipoAluno }),
  setSort: (field: SortField, order: SortOrder) => set({ sortField: field, sortOrder: order }),
  resetPagination: () => set({ currentPage: 1 }),
}));

