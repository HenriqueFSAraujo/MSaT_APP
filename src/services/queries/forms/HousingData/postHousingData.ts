import { useMutation } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';
import { toast } from '@/utils/toast';

export type HousingDataPayload = {
    userId: number
    situacaoImovel: string
    tipoImovel: string
    estruturaFisica: string
    esgotoSanitario: string
    fornecimentoEnergia: string
    abastecimentoAgua: string
    doencaCronicaFamilia: string
    deficienciaFamilia: string
};

export function postHousingData() {
    return useMutation({

        mutationFn: (payload: HousingDataPayload) =>
            api.post(Endpoints.Forms.Housing_Data, payload),

        onSuccess: () => {
            toast.success('Condições de Moradia confirmada!');
        },

        onError: (error) => {
            toast.error('Verifique se todos os campos foram preenchidos corretamente.');
            console.error(error)
        },
    });
}

