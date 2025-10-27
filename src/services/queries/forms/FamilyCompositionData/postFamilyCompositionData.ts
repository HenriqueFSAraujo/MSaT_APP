import { api } from '@/services/api';
import { Endpoints } from '@/services/endpoints';
import { toast } from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';
import { useTabStore } from '@/store/tabStore';

type PostFamilyCompositionDataPayload = {
  userInfoId: number;
  composicaoFamiliar: Array<{
    nomeCompleto: string;
    escolaridade: string;
    escolaridade_other?: string;
    grauParentesco: string;
    dataNascimento: string;
    profissaoAtiva: string;
    estadoCivil: string;
    salarioBruto: string;
  }>;
};

type TransformedFamilyCompositionData = {
  userInfoId: number;
  composicaoFamiliar: Array<{
    nomeCompleto: string;
    escolaridade: string;
    escolaridade_other?: string;
    grauParentesco: string;
    dataNascimento: Date;
    profissaoAtiva: string;
    estadoCivil: string;
    salarioBruto: number;
  }>;
};

const convertStringToDate = (dateString: string): Date => {
  if (!dateString) return new Date();

  const [day, month, year] = dateString.split('/');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

const convertStringToDecimal = (valueString: string): number => {
  if (!valueString) return 0;

  const cleanValue = valueString.replace(/[^\d.,]/g, '');

  const normalizedValue = cleanValue.replace(',', '.');

  return parseFloat(normalizedValue) || 0;
};

const transformFamilyCompositionData = (data: PostFamilyCompositionDataPayload): TransformedFamilyCompositionData => {
  return {
    userInfoId: data.userInfoId,
    composicaoFamiliar: data.composicaoFamiliar.map(member => ({
      ...member,
      dataNascimento: convertStringToDate(member.dataNascimento),
      salarioBruto: convertStringToDecimal(member.salarioBruto),
    })),
  };
};

export function PostFamilyCompositionData() {
  return useMutation({
    mutationKey: ['post-family-composition-data'],
    mutationFn: (payload: PostFamilyCompositionDataPayload) => {
      const transformedData = transformFamilyCompositionData(payload);
      return api.post(Endpoints.Forms.Family_Composition, transformedData);
    },

    onSuccess: () => {
      toast.success('Dados de composição familiar salvos com sucesso!');
      const { markTabAsCompleted, setSelectedTab } = useTabStore.getState();
      markTabAsCompleted('family_composition');
      setSelectedTab('housing_conditions');
    },

    onError: (error) => {
      toast.error('Erro ao salvar dados de composição familiar. Verifique se todos os campos foram preenchidos corretamente.');
      console.error(error);
    },
  });
}
