import { useForm, FormProvider } from 'react-hook-form';
import FormInput from '../common/FormInput/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import FormSelect from '../common/FormSelect/FormSelect';
import { Button } from '../ui/button';
import { toast } from '@/utils/toast';
import { useTabStore } from '@/store/tabStore';
import { useViaCep } from '@/hooks/useViaCep';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { addressInfoSchema, AddressInfo } from './type/formData';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';

export const AddressResidence = ({ label }: { label: string }) => {
  const { setFormData, formData } = useScholarshipFormStore();
  const methods = useForm({
    mode: 'onSubmit',

    resolver: zodResolver(addressInfoSchema),
    defaultValues: {
      address: '',
      neighborhood: '',
      city: '',
      zipCode: '',
      referencePoint: '',
      residenceType: '',

      transportUsage: '',
      travelTime: '',
      extracurricularActivities: '',

      homePhone: '',
      workPhone: '',
      mobilePhone: '',
      email: '',

      legalGuardian: '',
      studySegment: '',
      ...(formData.address_info as Partial<AddressInfo>),
    },
  });

  const {
    setValue,
    formState: { errors },
  } = methods;
  const { fetchAddress } = useViaCep();
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);

  const handleCepBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const cep = event.target.value;

    try {
      const result = await fetchAddress(cep);

      if (result) {
        setValue('address', result.logradouro || '', { shouldValidate: true });
        setValue('neighborhood', result.bairro || '', { shouldValidate: true });
        setValue('city', result.localidade || '', { shouldValidate: true });

        await methods.trigger(['address', 'neighborhood', 'city']);
      } else {
        toast.error('CEP não encontrado ou inválido.');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast.error('Erro ao buscar CEP. Tente novamente mais tarde.');
    }
  };

  const onSubmit = async (data: AddressInfo) => {
    const isValid = await methods.trigger();
    console.log('cheguei');
    if (!isValid) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setFormData('address_info', data);
    toast.success('Sucesso!', 'Dados enviados com sucesso!');
    setSelectedTab('required_documents');
    console.log('Dados do formulário:', data);
  };

  return (
    <FormProvider {...methods}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-700 text-center mx-6 mb-4">
            {label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              <FormInput
                name="zipCode"
                label="CEP"
                required
                error={errors.zipCode?.message}
                mask="cep"
                onBlur={handleCepBlur}
              />
              <FormInput name="address" label="Endereço" required error={errors.address?.message} />
              <FormInput
                name="neighborhood"
                label="Bairro"
                required
                error={errors.neighborhood?.message}
              />
              <FormInput name="city" label="Cidade" required error={errors.city?.message} />
              <FormInput
                name="referencePoint"
                label="Ponto de referência do endereço"
                error={errors.referencePoint?.message}
              />
              <FormSelect
                name="residenceType"
                label="O(a) candidato(a) reside:"
                required
                options={[
                  { value: 'P', label: 'Própria' },
                  { value: 'A', label: 'Alugada' },
                  { value: 'O', label: 'Outros' },
                ]}
                error={errors.residenceType?.message}
              />
            </div>
            <div className="flex justify-end w-full">
              <Button
                type="submit"
                className="mt-4 w-35 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors"
              >
                Salvar e continuar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
};
