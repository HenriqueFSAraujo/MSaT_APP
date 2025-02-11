import { api } from '../api';

// Interface para o item de apreensão
export interface SeizureDate {
  id: string;
  veiculeId: string;
  seizureDate: string;
}

interface CreateSeizureDateParams {
  vehicleId: string;
  seizureDate: string;
}

// Função para obter as datas de apreensão de um veículo
const getSeizureDates = (vehicleId: string): Promise<SeizureDate[]> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/api/v1/seizure-dates/${vehicleId}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Função para criar uma nova data de apreensão
const createSeizureDate = (params: CreateSeizureDateParams): Promise<void> => {
  return new Promise((resolve, reject) => {
    api
      .post(`/api/v1/seizure-dates`, params)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Função para atualizar uma data de apreensão
const updateSeizureDate = (params: CreateSeizureDateParams): Promise<void> => {
  return new Promise((resolve, reject) => {
    api
      .put(`/api/v1/seizure-dates`, params)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Exportação do serviço de datas de apreensão
export const seizureDateService = {
  getSeizureDates,
  createSeizureDate,
  updateSeizureDate,
};
