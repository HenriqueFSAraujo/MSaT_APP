// src/services/biometricService.ts
import { api } from '../api';

// Interface para resposta da validação biométrica
export interface BiometricValidationResponse {
  userId: number;
  score: number;
  success: boolean;
}

// Interface para resposta do upload de imagem
export interface ImageUploadResponse {
  message: string;
  success: string;
}

// Função para validar biometria facial
const validateFacialBiometrics = (
  userId: number,
  imageBase64: string
): Promise<BiometricValidationResponse> => {
  return api
    .post('/api/v1/user-images/validate-facial-biometrics', {
      userId,
      imageBase64,
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Erro ao validar biometria facial:', error);
      throw new Error('Falha ao validar biometria facial');
    });
};

// Função para fazer upload de imagem do usuário
const uploadUserImage = (userId: number, file: File): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return api
    .post(`/api/v1/user-images/upload/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Erro ao fazer upload da imagem:', error);
      throw new Error('Falha ao enviar imagem do usuário');
    });
};

// Exportação das funções do serviço
export const biometricService = {
  validateFacialBiometrics,
  uploadUserImage,
};
