import { create } from 'zustand';

export type Role = 'Aluno' | 'Gestor' | 'Todos';

export type SortField = 'name' | 'email' | 'cpf';
export type SortOrder = 'asc' | 'desc';

interface UsersPaginationStore {
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;
  role: Role;
  status: string[];
  sortField: SortField;
  sortOrder: SortOrder;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  setSearchTerm: (term: string) => void;
  setRole: (role: Role) => void;
  setStatus: (status: string[]) => void;
  setSort: (field: SortField, order: SortOrder) => void;
  resetPagination: () => void;
}

export const useUsersPaginationStore = create<UsersPaginationStore>()((set) => ({
  currentPage: 1,
  itemsPerPage: 10,
  searchTerm: '',
  role: 'Aluno' as Role,
  status: ['ativo', 'inativo'],
  sortField: 'name',
  sortOrder: 'asc',
  setCurrentPage: (page: number) => set({ currentPage: page }),
  setItemsPerPage: (items: number) => set({ itemsPerPage: items }),
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setRole: (role: Role) => set({ role }),
  setStatus: (status: string[]) => set({ status }),
  setSort: (field: SortField, order: SortOrder) => set({ sortField: field, sortOrder: order }),
  resetPagination: () => set({ currentPage: 1 }),
}));

