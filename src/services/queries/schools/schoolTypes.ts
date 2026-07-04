export type SchoolType = 'PARTICULAR' | 'GRATUITA';

export type School = {
  id: number;
  nome: string;
  cnpj: string;
  nsu?: string;
  endereco?: string;
  tipo: SchoolType;
  status?: string;
};

export type SchoolPayload = {
  nome: string;
  cnpj: string;
  nsu?: string;
  endereco?: string;
  tipo: SchoolType;
};
