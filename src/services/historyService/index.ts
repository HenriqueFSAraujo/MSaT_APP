import { api } from '../api';

// Definição dos tipos de histórico
type HistoryType = 'LOCATION' | 'COLLECTED' | 'IMPOUND_LOT';

// Interface para o item de histórico
export interface HistoryItem {
  id: string;
  id_vehicle: string;
  type_history: HistoryType;
  license_plate: string;
  location?: {
    vehicle_found: boolean;
    note: string;
    address?: {
      postal_code: string;
      street: string;
      number: string;
      neighborhood: string;
      complement: string;
      state: string;
      city: string;
      note: string;
    };
  };
  collected?: {
    vehicle_found: boolean;
    note: string;
    collection_date_time?: string;
  };
  impound_lot?: {
    impound_arrival_date_time?: string;
    impound_departure_date_time?: string;
  };
}

interface HistoryResponse {
  content: HistoryItem[];
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

interface CreateHistoryParams {
  id_vehicle: string;
  license_plate: string;
  type_history: 'LOCATION' | 'COLLECTED' | 'IMPOUND_LOT';
  location?: {
    vehicle_found: boolean;
    note: string;
    address?: {
      postal_code: string;
      street: string;
      number: string;
      neighborhood: string;
      complement: string;
      state: string;
      city: string;
      note: string;
    };
  };
  collected?: {
    vehicle_found: boolean;
    note: string;
    collection_date_time?: string;
  };
  impound_lot?: {
    impound_arrival_date_time?: string;
    impound_departure_date_time?: string;
  };
}

// Função para obter o histórico de um veículo
const getHistory = (vehicleId: string): Promise<HistoryResponse> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/api/v1/history/by-vehicle?vehicleId=${vehicleId}&page=0&size=999999999&sort=asc`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Função para criar um novo registro de histórico
const createHistory = (params: CreateHistoryParams): Promise<void> => {
  return new Promise((resolve, reject) => {
    api
      .post('/api/v1/history', params)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Função para atualizar um registro de histórico existente
const updateHistory = (idHistory: string, params: CreateHistoryParams): Promise<void> => {
  return new Promise((resolve, reject) => {
    api
      .put(`/api/v1/history/${idHistory}`, params)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Função para excluir um registro de histórico
const deleteHistory = (idHistory: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    api
      .delete(`/api/v1/history/${idHistory}`)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Exportação do serviço de histórico
export const historyService = {
  getHistory,
  createHistory,
  updateHistory,
  deleteHistory,
};
