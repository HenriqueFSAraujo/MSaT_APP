import { useViaCep } from '@/hooks/useViaCep';
import { useAddressData } from '@/services/queries/forms/AddressData/getAddressData';
import { PostAddressData } from '@/services/queries/forms/AddressData/postAddressData';
import { useTabStore } from '@/store/tabStore';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { toast } from '@/utils/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import FormInput from '../common/FormInput/FormInput';
import FormSelect from '../common/FormSelect/FormSelect';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AddressInfo, addressInfoSchema } from './type/formData';

export const AddressResidence = ({ label }: { label: string }) => {
  const { setFormData, formData } = useScholarshipFormStore();
  const { mutate: FormSubmit } = PostAddressData();
  const { id: StudentId } = useParams<{ id: string }>();
  const { data } = useAddressData(Number(StudentId));
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
      structureType: '',
      structureTypeOthers: '',
      hasSewage: '',
      electricitySource: '',
      waterSupply: '',
      transportType: '',
      transportTypeOthers: '',
      commutingTime: '',
      afterSchoolActivities: '',
      activityDescription: '',
      weeklyFrequency: '',
      ...(formData.address_info as Partial<AddressInfo>),
    },
  });

  const {
    setValue,
    watch,
    formState: { errors },
  } = methods;
  const { fetchAddress } = useViaCep();
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);

  // Auto-save functionality
  const watchedValues = watch();

  useEffect(() => {
    // Debounce auto-save to avoid too many saves
    const timeoutId = setTimeout(() => {
      if (watchedValues && Object.keys(watchedValues).length > 0) {
        // Verificar se pelo menos um campo foi preenchido
        const hasAnyValue = Object.values(watchedValues).some(
          value => value !== '' && value !== undefined && value !== null
        );

        // Salvar se houver qualquer dado preenchido
        if (hasAnyValue) {
          setFormData('address_info', watchedValues);
        }
      }
    }, 1000); // Save after 1 second of inactivity

    return () => clearTimeout(timeoutId);
  }, [watchedValues, setFormData]);

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

  useEffect(() => {
    if (data) {
      methods.reset({
        ...methods.getValues(),
        ...(data as Partial<AddressInfo>),
      });
    }
  }, [data, methods]);

  const onSubmit = async (data: AddressInfo) => {
    const isValid = await methods.trigger();
    if (!isValid) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setFormData('address_info', data);
      const { markTabAsCompleted } = useTabStore.getState();
      markTabAsCompleted('address_info', StudentId);

      setSelectedTab('family_composition');

      const payload = {
        userId: Number(StudentId),
        zipCode: data.zipCode,
        address: data.address,
        neighborhood: data.neighborhood,
        city: data.city,
        referencePoint: data.referencePoint,
        residenceType: data.residenceType,
        structureType: data.structureType,
        structureTypeOthers: data.structureTypeOthers,
        hasSewage: data.hasSewage,
        electricitySource: data.electricitySource,
        waterSupply: data.waterSupply,
        transportType: data.transportType,
        transportTypeOthers: data.transportTypeOthers,
        commutingTime: data.commutingTime,
        afterSchoolActivities: data.afterSchoolActivities,
        activityDescription:
          data.afterSchoolActivities === 'Sim' ? data.activityDescription : undefined,
        weeklyFrequency: data.afterSchoolActivities === 'Sim' ? data.weeklyFrequency : undefined,
      };

      FormSubmit(payload);
    } catch (error) {
      console.error(error);
    }
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
                label="Situação do Imóvel:"
                required
                options={[
                  { value: 'Casa', label: 'Casa' },
                  { value: 'Apartamento', label: 'Apartamento' },
                  { value: 'Comôdo', label: 'Comôdo' },
                  { value: 'Outros', label: 'Outros' },
                ]}
                error={errors.residenceType?.message}
              />
              <FormSelect
                name="structureType"
                label="Estrutura fisica da moradia:"
                required
                options={[
                  { value: 'Alvenaria', label: 'Alvenaria' },
                  { value: 'Madeira', label: 'Madeira' },
                  { value: 'Taipa', label: 'Taipa' },
                  { value: 'Outros', label: 'Outros' },
                ]}
                withOtherOption={{
                  otherValue: 'Outros',
                  otherFieldName: 'structureTypeOthers',
                  otherPlaceholder: 'Especifique...',
                }}
                error={errors.structureType?.message}
              />

              <FormSelect
                name="hasSewage"
                label="Possui Esgoto sanitário:"
                required
                options={[
                  { value: 'Existente', label: 'Existente' },
                  { value: 'Inexistente', label: 'Inexistente' },
                ]}
                error={errors.hasSewage?.message}
              />

              <FormSelect
                name="electricitySource"
                label="Fornecimento de Energia Elétrica:"
                required
                options={[
                  { value: 'Companhia distribuidora', label: 'Companhia distribuidora' },
                  { value: 'Inexistente', label: 'Inexistente' },
                ]}
                error={errors.electricitySource?.message}
              />

              <FormSelect
                name="waterSupply"
                label="Abastecimento de Água:"
                required
                options={[
                  { value: 'Companhia distribuidora', label: 'Companhia distribuidora' },
                  { value: 'Inexistente', label: 'Inexistente' },
                ]}
                error={errors.waterSupply?.message}
              />

              <FormSelect
                name="transportType"
                label="Utiliza transporte para chegar à Unidade Educacional:"
                required
                options={[
                  { value: 'Transporte público', label: 'Transporte público' },
                  { value: 'Transporte escolar', label: 'Transporte escolar' },
                  {
                    value: 'Translado realizado pela família',
                    label: 'Translado realizado pela família',
                  },
                  { value: 'outros', label: 'Outros' },
                ]}
                withOtherOption={{
                  otherValue: 'outros',
                  otherFieldName: 'transportTypeOthers',
                  otherPlaceholder: 'Especifique o tipo de transporte',
                }}
                error={errors.transportType?.message || errors.transportTypeOthers?.message}
              />

              <FormSelect
                name="commutingTime"
                label="Tempo habitual gasto no deslocamento:"
                required
                options={[
                  { value: 'Até 10 minutos', label: 'Até 10 minutos' },
                  { value: 'Até 30 minutos', label: 'Até 30 minutos' },
                  { value: 'Até 1 hora', label: 'Até 1 hora' },
                  { value: 'Mais de 1 hora', label: 'Mais de 1 hora' },
                ]}
                error={errors.commutingTime?.message}
              />

              <FormSelect
                name="afterSchoolActivities"
                label="O(a) candidato(a) participa de atividades no contraturno escolar?"
                required
                options={[
                  { value: 'Não', label: 'Não' },
                  { value: 'Sim', label: 'Sim' },
                ]}
                error={errors.afterSchoolActivities?.message}
              />

              {methods.watch('afterSchoolActivities') === 'Sim' && (
                <>
                  <div className="col-span-1 sm:col-span-2 animate-in fade-in slide-in-from-left-5 duration-300">
                    <FormInput
                      name="activityDescription"
                      label={
                        <>
                          Quais são as atividades que o(a) candidato(a) participa?{' '}
                          <span className="text-red-500 ml-1">*</span>
                        </>
                      }
                      required
                      error={errors.activityDescription?.message}
                      withMarginTop
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-2 animate-in fade-in slide-in-from-left-5 duration-300">
                    <FormInput
                      name="weeklyFrequency"
                      label={
                        <>
                          Número de vezes por semana em que participa?{' '}
                          <span className="text-red-500 ml-1">*</span>
                        </>
                      }
                      required
                      error={errors.weeklyFrequency?.message}
                      withMarginTop
                    />
                  </div>
                </>
              )}
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
