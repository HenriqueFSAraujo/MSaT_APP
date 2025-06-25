import { useForm, FormProvider } from 'react-hook-form';
import FormInput from '../common/FormInput/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import FormSelect from '../common/FormSelect/FormSelect';
import { Button } from '../ui/button';
import { toast } from '@/utils/toast';
import { useTabStore } from '@/store/tabStore';
import { maritalStatusOptions, residesWithBothParentsOptions } from '@/utils/optionsMock';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { ParentalData, parentalDataSchema } from './type/formData';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';

export const ParentalDataForm = ({ label }: { label: string }) => {
  const { setFormData, formData } = useScholarshipFormStore();
  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(parentalDataSchema),
    defaultValues: {
      parent1FullName: '',
      parent1Cpf: '',
      parent1Phone: '',
      parent1MaritalStatus: '',
      parent2FullName: '',
      parent2Cpf: '',
      parent2Phone: '',
      parent2MaritalStatus: '',
      residesWithBothParents: '',
      ...(formData.parents_data as Partial<ParentalData>),
    },
  });

  const { errors } = methods.formState;

  const setSelectedTab = useTabStore((state) => state.setSelectedTab);

  const onSubmit = async (data: ParentalData) => {
    const isValid = await methods.trigger();

    if (!isValid) return;

    setFormData('parents_data', data);
    toast.success('Sucesso!', 'Dados enviados com sucesso!');
    console.log('Dados do formulário:', data);
    setSelectedTab('address_info');
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
          <div className="max-w-6xl mx-auto bg-white p-6">
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                <FormInput
                  name="parent1FullName"
                  label="Nome completo do genitor 1"
                  required
                  error={errors.parent1FullName?.message}
                />
                <FormInput
                  name="parent1Cpf"
                  label="CPF do genitor 1"
                  mask="cpf"
                  required
                  error={errors.parent1Cpf?.message}
                />
                <FormInput
                  name="parent1Phone"
                  label="Telefone de contato do genitor 1"
                  mask="phone"
                  required
                  type="parent1Phone"
                  error={errors.parent1Phone?.message}
                />
                <FormSelect
                  name="parent1MaritalStatus"
                  label="Estado cívil do genitor 1"
                  required
                  description="Selecione uma das opções abaixo."
                  options={maritalStatusOptions}
                  error={errors.parent1MaritalStatus?.message}
                />
                <FormInput
                  name="parent2FullName"
                  label="Nome completo do genitor 2"
                  error={errors.parent1FullName?.message}
                />
                <FormInput
                  name="parent2Cpf"
                  label="CPF do genitor 2"
                  mask="cpf"
                  error={errors.parent2Cpf?.message}
                />
                <FormInput
                  name="parent2Phone"
                  label="Telefone de contato do genitor 2"
                  mask="phone"
                  type="parent2Phone"
                  error={errors.parent2Phone?.message}
                />
                <FormSelect
                  name="parent2MaritalStatus"
                  label="Estado cívil do genitor 2"
                  description="Selecione uma das opções abaixo."
                  options={maritalStatusOptions}
                  error={errors.parent2MaritalStatus?.message}
                />
                <FormSelect
                  name="residesWithBothParents"
                  label="O candidato reside com os dois genitores?"
                  required
                  description="Selecione uma das opções abaixo."
                  options={residesWithBothParentsOptions}
                  error={errors.residesWithBothParents?.message}
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
          </div>
        </CardContent>
      </Card>
    </FormProvider>
  );
};
