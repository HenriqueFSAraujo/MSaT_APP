import { useForm, FormProvider } from 'react-hook-form';
import FormInput from '../common/FormInput/FormInput';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues } from 'react-hook-form';
import FormSelect from '../common/FormSelect/FormSelect';
import { Button } from '../ui/Button';

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

const AddressResidence = () => {
  const methods = useForm({
    mode: 'onSubmit',
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

  const { errors } = methods.formState;

  const onSubmit = async (data: FieldValues) => {
    const isValid = await methods.trigger();
    if (!isValid) return;
    console.log('Dados do formulário:', data);
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-6xl mx-auto bg-white p-6">
        <h1 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Informações de Endereço e Residência
        </h1>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            <FormInput
              {...methods.register('zipCode')}
              name="zipCode"
              label="CEP"
              required
              error={errors.zipCode?.message}
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

            <FormInput
              {...methods.register('transportUsage')}
              name="transportUsage"
              label="Utiliza transporte para chegar à Unidade Educacional?"
              required
              error={errors.transportUsage?.message}
            />
            <FormInput
              {...methods.register('travelTime')}
              name="travelTime"
              label="Tempo habitual gasto no deslocamento"
              required
              error={errors.travelTime?.message}
              withMarginTop
            />
            <FormInput
              {...methods.register('extracurricularActivities')}
              name="extracurricularActivities"
              label="Participa de atividades no contraturno escolar?"
              required
              error={errors.extracurricularActivities?.message}
              withMarginTop
            />

            <FormInput
              {...methods.register('homePhone')}
              name="homePhone"
              label="Telefone residencial"
              error={errors.homePhone?.message}
            />
            <FormInput
              {...methods.register('workPhone')}
              name="workPhone"
              label="Telefone do trabalho"
              error={errors.workPhone?.message}
            />
            <FormInput
              {...methods.register('mobilePhone')}
              name="mobilePhone"
              label="Telefone celular"
              required
              error={errors.mobilePhone?.message}
            />
            <FormInput
              {...methods.register('email')}
              name="email"
              label="E-mail para confirmação"
              required
              error={errors.email?.message}
            />

            <FormInput
              {...methods.register('legalGuardian')}
              name="legalGuardian"
              label="Responsável legal do(a) candidato(a) bolsista"
              required
              error={errors.legalGuardian?.message}
            />
            <FormInput
              {...methods.register('studySegment')}
              name="studySegment"
              label="Segmento que estudará em 2025"
              required
              error={errors.studySegment?.message}
            />
          </div>
          <div className="flex justify-end w-full">
            <Button
              type="submit"
              className="mt-4 w-35 bg-blue-400 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all"
            >
              Salvar e continuar
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default AddressResidence;
