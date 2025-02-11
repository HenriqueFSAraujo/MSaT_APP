import { api } from '../api';

// Interfaces
export interface Vehicle {
  id: string;
  licensePlate: string;
  model: string;
  registrationState: string;
  creditorName: string;
  contractNumber: string;
  stage: string;
  status: string;
  requestDate: string;
  vehicleSeizureDateTime: string;
  lastMovementDate: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string;
  address: string;
  nameResponsible: string;
  company_type:
    | 'DADOS_PATIO'
    | 'DADOS_ESCRITORIO_COBRANCA'
    | 'DADOS_GUINCHO'
    | 'DADOS_LOCALIZADOR'
    | 'DADOS_DETRAN';
}

export interface MandatoryAssociation {
  id: string;
  companyId: string;
  vehicleId: string;
  vehicle: Vehicle;
  company: Company;
  createdAt: string;
}

interface CreateMandatoryAssociationParams {
  companyId: string;
  vehicleId: string;
  typePatio?: string;
  companyType: Company['company_type'];
}

export interface CompanyResponse {
  content: Company[];
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

// Mandatory Association Service
const getMandatoryAssociations = (vehicleId: string): Promise<MandatoryAssociation[]> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/api/v1/vehicle-company/${vehicleId}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const createMandatoryAssociation = (params: CreateMandatoryAssociationParams): Promise<void> => {
  return new Promise((resolve, reject) => {
    api
      .post('/api/v1/vehicle-company', params)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const deleteMandatoryAssociation = (companyId: string, vehicleId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    api
      .delete(`/api/v1/vehicle-company/${companyId}/${vehicleId}`)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Company Service
const getCompanies = (): Promise<CompanyResponse> => {
  return new Promise((resolve, reject) => {
    api
      .get('/api/v1/company?page=0&size=999999999&sort=id&sort=asc')
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Export services
export const mandatoryAssociationService = {
  getMandatoryAssociations,
  createMandatoryAssociation,
  deleteMandatoryAssociation,
};

export const companyService = {
  getCompanies,
};
