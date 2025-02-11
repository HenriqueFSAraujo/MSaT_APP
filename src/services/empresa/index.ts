import { api } from '../api';

export interface CompanyResponse {
  content: [
    id: string,
    name: string,
    email: string,
    document: string,
    phone: string,
    name_responsible: string,
    company_type: string,
  ];
}

export interface CompanyParams {
  page?: number;
  size?: number;
}

const getAllCompany = (): Promise<CompanyResponse> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/api/v1/company?page=0&size=999999999&sort=id&sort=asc`)
      .then((response) => {
        resolve(response.data as CompanyResponse);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const companyService = {
  getAllCompany,
};
