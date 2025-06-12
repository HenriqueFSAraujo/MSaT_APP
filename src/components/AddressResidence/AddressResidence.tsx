import { useForm, FormProvider } from 'react-hook-form';
import FormInput from '../common/FormInput/FormInput';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues } from 'react-hook-form';
import FormSelect from '../common/FormSelect/FormSelect';
import { Button } from '../ui/button';
import { toast } from '@/utils/toast';
import { useTabStore } from '@/store/tabStore';
import { useViaCep } from '@/hooks/useViaCep';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';

const schema = z.object({
  address: z.string().min(1, 'Endereço é obrigatório'),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  zipCode: z.string().min(1, 'CEP é obrigatório'),
  referencePoint: z.string().optional(),
  residenceType: z.string().min(1, 'Informe onde o candidato reside'),

  transportUsage: z
    .string()
    .min(1, 'Informe se utiliza transporte para chegar à Unidade Educacional'),
  travelTime: z.string().min(1, 'Informe o tempo de deslocamento'),
  extracurricularActivities: z
    .string()
    .min(1, 'Informe se participa de atividades extracurriculares'),

  homePhone: z.string().optional(),
  workPhone: z.string().optional(),
  mobilePhone: z.string().min(1, 'Telefone celular é obrigatório'),
  email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),

  legalGuardian: z.string().min(1, 'Responsável legal é obrigatório'),
  studySegment: z.string().min(1, 'Informe o segmento que estudará em 2025'),
});

export const AddressResidence = ({ label }: { label: string }) => {
  const methods = useForm({
    mode: 'onChange',
    resolver: zodResolver(schema),
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
    },
  });

  // Corrigido: Desestruture `setValue` diretamente de `methods`
  const {
    setValue,
    formState: { errors },
  } = methods;
  const { fetchAddress } = useViaCep();
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);

  const handleCepBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const cep = event.target.value;

    const result = await fetchAddress(cep);

    if (result) {
      setValue('address', result.logradouro || '', { shouldValidate: true });
      setValue('neighborhood', result.bairro || '', { shouldValidate: true });
      setValue('city', result.localidade || '', { shouldValidate: true });

      await methods.trigger(['address', 'neighborhood', 'city']);
    } else {
      toast.error('CEP não encontrado ou inválido.');
    }
  };

  const onSubmit = async (data: FieldValues) => {
    const isValid = await methods.trigger();
    if (!isValid) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    toast.success('Sucesso!', 'Dados enviados com sucesso!');
    setSelectedTab('required_documents');
    console.log('Dados do formulário:', data);
  };

  return (
    <FormProvider {...methods}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-700 text-center mx-6 mb-4">{label}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              <FormInput
                {...methods.register('zipCode')}
                name="zipCode"
                label="CEP"
                required
                error={errors.zipCode?.message}
                mask="cep"
                onBlur={handleCepBlur} // Adiciona o evento onBlur
              />
              <FormInput
                {...methods.register('address')}
                name="address"
                label="Endereço"
                required
                error={errors.address?.message}
              />
              <FormInput
                {...methods.register('neighborhood')}
                name="neighborhood"
                label="Bairro"
                required
                error={errors.neighborhood?.message}
              />
              <FormInput
                {...methods.register('city')}
                name="city"
                label="Cidade"
                required
                error={errors.city?.message}
              />
              <FormInput
                {...methods.register('referencePoint')}
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
              {/* Outros campos continuam aqui */}
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
    </FormProvider >
  );
};
