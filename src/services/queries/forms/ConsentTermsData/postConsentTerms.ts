import { api } from '@/services/api';
import { Endpoints } from '@/services/endpoints';
import { toast } from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';

type PostConsentTermsPayload = {
  nomeDeclarante: string;
  rgDeclarante: string;
  cpfDeclarante: string;
  nomeAluno: string;
  aceiteTermos: boolean;
  userId: number;
};

export function PostConsentTerms() {
  return useMutation({
    mutationKey: ['send-consent-terms'],
    mutationFn: (payload: PostConsentTermsPayload) => {
      return api.post(Endpoints.Forms.Consent_Terms, payload);
    },

    onSuccess: () => {
      toast.success('Declaração salva com sucesso!');
    },

    onError: (error) => {
      toast.error('Erro ao salvar declaração. Tente novamente.');
      console.error(error);
    },
  });
}

