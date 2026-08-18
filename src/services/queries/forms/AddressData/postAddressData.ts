import { toast } from '@/utils/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../api';
import { Endpoints } from '../../../endpoints';

type AddressDataPayload = {
    userId: number
    zipCode: string;
    address: string;
    neighborhood: string;
    city: string;
    referencePoint?: string;
    residenceType: string;
    structureType: string;
    structureTypeOthers?: string;
    hasSewage: string;
    electricitySource: string;
    waterSupply: string;
    transportType: string;
    transportTypeOthers?: string;
    commutingTime: string;
    afterSchoolActivities: string;
    activityDescription?: string;
    weeklyFrequency?: string;
};

export function PostAddressData() {
    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (payload: AddressDataPayload) =>
            api.post(Endpoints.Forms.Address_Data, payload),

        onSuccess: (_response, payload) => {
            queryClient.invalidateQueries({ queryKey: ['get-address-data', payload.userId] });
            toast.success('Endereço confirmado!');
        },

        onError: (error) => {
            toast.error('Verifique se todos os campos foram preenchidos corretamente.');
            console.error(error)
        },
    });
}

