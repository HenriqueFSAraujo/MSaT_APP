import { api } from '../api';
import { Role, User } from '../userService';

// Interface estendida de Role para incluir os novos campos
export interface ExtendedRole extends Role {
  requiresTokenFirstLogin: boolean;
  biometricValidation: boolean;
}

// Interface estendida de User para incluir os novos campos
export interface ExtendedUser extends Omit<User, 'roles'> {
  roles: ExtendedRole[];
  tokenLogin: boolean;
}

// Enum para tipos de token
export enum TokenType {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
}

// Funções do serviço
const completeRegistration = (userId: number): Promise<ExtendedUser> => {
  return api
    .post(`/api/v1/auth/user/complete-registration/${userId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error(`Erro ao completar registro do usuário ${userId}:`, error);
      throw new Error('Falha ao completar registro do usuário');
    });
};

const validateToken = (userId: number, token: string): Promise<void> => {
  return api
    .post(`/api/v1/validate-token/${userId}/${token}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error(`Erro ao validar token para usuário ${userId}:`, error);
      throw new Error('Falha ao validar token');
    });
};

const sendToken = (userId: number, type: TokenType): Promise<void> => {
  return api
    .post(`/api/v1/send-token/${userId}/${type}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error(`Erro ao enviar token para usuário ${userId}:`, error);
      throw new Error('Falha ao enviar token');
    });
};

// Exportação do serviço
export const registrationService = {
  completeRegistration,
  validateToken,
  sendToken,
};
