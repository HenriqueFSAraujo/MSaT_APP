import { api } from '../api';

interface State {
  id: string;
  sigla: string;
  nome: string;
}

interface City {
  id: string;
  nome: string;
}

const getStates = (): Promise<State[]> => {
  return new Promise((resolve, reject) => {
    api
      .get('/api/v1/state')
      .then((response) => {
        resolve(response.data as State[]);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getCitiesByState = (codeState: string): Promise<City[]> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/api/v1/state-city/${codeState}`)
      .then((response) => {
        resolve(response.data as City[]);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const locationService = {
  getStates,
  getCitiesByState,
};

export { locationService };
