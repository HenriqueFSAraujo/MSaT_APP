import { toast } from '@/utils/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';

type PropertyDataPayload = {
  userInfoId: number;
  veiculos?: Array<veiculoProps>;
  familiaresEscola?: Array<familiaresEscolaProps>;
  pessoasComDeficiencia?: Array<pessoasComDeficiencia>;
  despesasMensais?: Array<despesasMensais>;
};

type veiculoProps = {
  marcaModelo: string;
  anoFabricacao: string;
  utilizacao: string;
};

type familiaresEscolaProps = {
  nome: string;
  escola: string;
  valorMensal: string;
};

type pessoasComDeficiencia = {
  nome: string;
  tipoDeficiencia: string;
  despesaMensal: string;
};

type despesasMensais = {
  descricao: string;
  valor: string;
};

export function PostPropertyData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PropertyDataPayload) =>
      api.post(Endpoints.Forms.Property_Data, payload),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['get-property-data', variables.userInfoId] });
      toast.success('Relacao de Bens confirmada!');
    },

    onError: (error) => {
      toast.error('Verifique se todos os campos foram preenchidos corretamente.');
      console.error(error);
    },
  });
}
