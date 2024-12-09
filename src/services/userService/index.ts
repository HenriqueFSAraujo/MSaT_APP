// src/services/userService.ts
import { api } from '../api';

// Interface para a estrutura de uma Company (empresa)
export interface Company {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string;
  address: string;
  name_responsible: string;
  company_type: string;
}

// Interface que define a estrutura de uma Role (papel/função do usuário)
export interface Role {
  id: number;
  name: string;
  requiresTokenFirstLogin?: boolean;
  biometricValidation?: boolean;
}

// Interface que define a estrutura completa de um Usuário
export interface User {
  id: number;
  username: string;
  fullName: string;
  cpf: string;
  phone: string;
  email: string;
  link: string;
  resetAt: string;
  roles: Role[];
  companyId: string;
  enabled: boolean;
  reset: boolean;
  passwordChangedByUser: boolean;
  createdByAdmin: boolean;
  tokenLogin: boolean;
  password?: string;
}

// Interface para filtros de busca de usuários
export interface UserFilters {
  username?: string;
  fullName?: string;
  email?: string;
  enabled?: boolean | null;
  cpf?: string;
}

// Interface para criação de novo usuário
export interface CreateUserParams {
  username: string;
  fullName: string;
  email: string;
  password: string;
  enabled: boolean;
  roles: Role[];
  cpf: string;
  companyId: string;
  phone: string;
}

// Interface para atualização de usuário (senha opcional)
export interface UpdateUserParams extends Omit<CreateUserParams, 'password'> {
  password?: string;
}

// Interface para resposta paginada da API
export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

// Função para buscar usuários com paginação e filtros
const getUsers = (
  page: number,
  size: number,
  sorts: string[],
  filters?: UserFilters
): Promise<PaginatedResponse<User>> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  sorts.forEach((sort) => {
    queryParams.append('sort', sort);
  });

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
  }

  return api
    .get(`/api/v1/auth/users?${queryParams.toString()}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Erro ao buscar usuários:', error);
      throw new Error(error.response?.data?.detail || 'Falha ao buscar lista de usuários');
    });
};

// Função para buscar um usuário específico por ID
const getUserById = (id: number): Promise<User> => {
  return api
    .get(`/api/v1/auth/user/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error(`Erro ao buscar usuário ${id}:`, error);
      throw new Error(error.response?.data?.detail || 'Falha ao buscar dados do usuário');
    });
};

// Função para criar novo usuário
const createUser = (params: CreateUserParams): Promise<void> => {
  return api
    .post('/api/v1/auth/user', params)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Erro ao criar usuário:', error);

      // Verifica se existe uma resposta de erro da API
      if (error.response?.data) {
        const errorData = error.response.data;
        throw {
          status: errorData.status,
          type: errorData.type,
          title: errorData.title,
          detail: errorData.detail,
          timestamp: errorData.timestamp,
        };
      }

      // Caso não tenha resposta estruturada, lança erro genérico
      throw new Error('Falha ao criar novo usuário');
    });
};

// Função para atualizar dados de um usuário existente
const updateUser = (id: number, params: UpdateUserParams): Promise<void> => {
  return api
    .put(`/api/v1/auth/user/${id}`, params)
    .then((response) => response.data)
    .catch((error) => {
      console.error(`Erro ao atualizar usuário ${id}:`, error);
      throw new Error(error.response?.data?.detail || 'Falha ao atualizar dados do usuário');
    });
};

// Função para atualizar senha do usuário
const updatePasswordUser = (id: string, newPassword: string): Promise<User> => {
  return api
    .patch(`/api/v1/auth/user/${id}/password`, { newPassword })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Erro ao atualizar senha:', error);
      throw new Error(error.response?.data?.detail || 'Falha ao atualizar senha do usuário');
    });
};

// Função para buscar todas as roles
const getRoles = (): Promise<Role[]> => {
  return api
    .get('/api/v1/roles')
    .then((response) => response.data)
    .catch((error) => {
      console.error('Erro ao buscar roles:', error);
      throw new Error(error.response?.data?.detail || 'Falha ao buscar lista de roles');
    });
};

// Função para buscar empresas com paginação
const getCompanies = (
  page: number,
  size: number,
  sorts: string[]
): Promise<PaginatedResponse<Company>> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  sorts.forEach((sort) => {
    queryParams.append('sort', sort);
  });

  return api
    .get(`/api/v1/company?${queryParams.toString()}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Erro ao buscar empresas:', error);
      throw new Error(error.response?.data?.detail || 'Falha ao buscar lista de empresas');
    });
};

// Função para buscar uma empresa específica por ID
const getCompanyById = (companyId: string): Promise<Company> => {
  return api
    .get(`/api/v1/company/${companyId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error(`Erro ao buscar empresa ${companyId}:`, error);
      throw new Error(error.response?.data?.detail || 'Falha ao buscar dados da empresa');
    });
};

// Exportação das funções do serviço
export const userService = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updatePasswordUser,
};

export const companyService = {
  getCompanies,
  getCompanyById,
};

export const roleService = {
  getRoles,
};
