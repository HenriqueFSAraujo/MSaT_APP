/* eslint-disable @typescript-eslint/no-explicit-any */
// services/consulta.ts


import { api } from '../api';

export interface VehicleResponse {
  [x: string]: unknown;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  content: Vehicle[];
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  model: string;

  registrationState: string;
  creditorName: string;
  requestDate: string;
  contractNumber: string;
  stage: string;
  status: string;
  lastMovementDate: string;
}

export interface GetVehiclesParams {
  page?: number;
  size?: number;
  startDate?: string;
  endDate?: string;
  creditor?: string;
  contractNumber?: string;
  uf?: string;
  model?: string;
  plate?: string;
  stage?: string;
  status?: string;
}

export interface Credor {
  nome: string;
  cnpj: string;
  endereco: string;
  email: string;
  telefone: string;
}

interface endereco {
  endereco: string;
}

export interface Devedor {
  nome: string;
  cpf_cnpj: string;
  enderecos: endereco[];
  contatosEmail: any[];
  contatosTelefone: any[];
  tipo: string;
}

export interface Veiculo {
  uf_emplacamento: string;
  placa: string;
  chassi: string;
  renavam: string;
  gravame: string;
  marca_modelo: string;
  cor: string;
  registro_detran: string;
  possui_gps: string;
  ano_modelo:string;
  ano_fabricacao:string;
}

export interface Contrato {
  numero: string;
  protocolo: string;
  descricao: string;
  data_contrato: any;
  data_pedido: any;
  data_notificacao: any;
  data_decurso_prazo: any;
  municipio_contrato: string;
  certidao_busca_apreensao: string;
  valor_divida: string;
  valor_leilao: string;
  taxa_juros: string;
  valor_parcela: string;
  quantidade_parcelas_pagas: any;
  quantidade_parcelas_abertas: any;
  data_primeira_parcela: any;
}

export interface Serventia {
  cns: number;
  nome: string;
  endereco: string;
  titular: string;
  telefone: string;
  substituto: string;
}

interface Empresas {
  address: string;
  company_type: 'DADOS_PATIO' | 'DADOS_ESCRITORIO_COBRANCA' | 'DADOS_GUINCHO' | 'DADOS_LOCALIZADOR';
  document: string;
  email: string;
  id: string;
  name: string;
  nameResponsible: string;
  phone: string;
}

export interface EscritorioCobranca {
  nome: string;
  email: string;
  cpf_cnpj: string;
  endereco: string;
  telefone: string;
  nomeResponsavel: string;
}

export interface Localizador {
  nome: string;
  email: string;
  cpf_cnpj: string;
  endereco: string;
  nomeResponsavel: string;
  telefone: string;
}

export interface Guincho {
  nome: string;
  email: string;
  cpf_cnpj: string;
  endereco: string;
  nomeResponsavel: string;
  telefone: string;
}

export interface Patio {
  nome: string;
  email: string;
  cpf_cnpj: string;
  endereco: string;
  telefone: string;
  nomeResponsavel: string;
  type: string;
}

export interface Address {
  postal_code: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  state: string;
  city: string;
  note: string;
}

export interface Historico {
  adress: Address;
  type: string;
}

export interface VehicleDetails {
  vehiculeId: string;
  credor: Credor;
  devedores: Devedor[];
  garantidores: any[]; // You might want to define a specific interface for this if needed
  veiculos: Veiculo[];
  contrato: Contrato;
  serventia: Serventia;
  empresas: Empresas[];
  veiculo?: Vehicle;
  historicos?: Historico[] | undefined;
}

export interface VehicleDetailsResponse {
  success: boolean;
  data: VehicleDetails;
  message: string;
}

const getVehicles = (params: GetVehiclesParams): Promise<VehicleResponse> => {
  return new Promise((resolve, reject) => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    api
      .get(`/api/v1/vehicle?${queryParams.toString()}`)
      .then((response) => {
        resolve(response.data as VehicleResponse);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getVehicleDetails = (idContrato: string): Promise<VehicleDetailsResponse> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/api/v1/vehicle/${idContrato}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const vehicleService = {
  getVehicles,
  getVehicleDetails,
};
