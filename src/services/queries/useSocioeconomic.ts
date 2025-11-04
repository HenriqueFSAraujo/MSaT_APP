import { toast } from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { Endpoints } from '../endpoints';

type useSocioeconomicProps = {
  userId: number;
  nomeAluno: string;
  dataNascimentoAluno: Date;
  segmentoCursar2025: string;
  nomeResponsavel: string
  cpfResponsavel: string
  telefoneResponsavel?: string
  rendaBrutaFamiliar: number
  totalComponentesFamilar: number
  rendaPerCapita: number
  rendaPerCapitaSalarioMinimo: number
  percentualLc187: string
  beneficiarioProgramaRenda: boolean
  resideProximoUnidadeEscolar: boolean
  candidatoComDeficiencia: boolean
  doencaGraveOuDeficienciaFamiliar?: boolean
  quantidadeMenoresDezoitoAnos?: number
  aspectosRelevantes?: string
  resultadoSocioeconomico?: string
  dataFinalizacaoParecer: Date
};

export function useSocioeconomic() {
  return useMutation({
    mutationKey: ['create-socioeconomic'],
    mutationFn: ( payload : useSocioeconomicProps) =>
      api.post(`${Endpoints.Users.Parecer}`, payload),

    onSuccess: () => {
      toast.success('Parecer Finalizado');
    },

    onError: () => {
      toast.error('Erro ao gerar parecer.');
    },
  });
}
