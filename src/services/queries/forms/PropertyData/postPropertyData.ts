import { useMutation } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';
import { toast } from '@/utils/toast';

type PropertyDataPayload = {
    userInfoId: number,
    veiculos?: Array<veiculoProps>,
    familiaresEscola?: Array<familiaresEscolaProps>,
    pessoasComDeficiencia?: Array<pessoasComDeficiencia>,
    despesasMensais?: Array<despesasMensais>
};


// TODO: Tipar corretamente o payload
type veiculoProps = {
    marcaModelo: string
    anoFabricacao: string
    utilizacao: string
}

type familiaresEscolaProps = {
    nome: string
    escola: string
    valorMensal: string
}

type pessoasComDeficiencia = {
    nome: string
    tipoDeficiencia: string
    despesaMensal: string
}

type despesasMensais = {
    descricao: string
    valor: string
}


export function postPropertyData() {
    return useMutation({

        mutationFn: (payload: PropertyDataPayload) =>
            api.post(Endpoints.Forms.Property_Data, payload),

        onSuccess: () => {
            toast.success('Relação de Bens confirmado!');
        },

        onError: (error) => {
            toast.error('Verifique se todos os campos foram preenchidos corretamente.');
            console.error(error)
        },
    });
}

