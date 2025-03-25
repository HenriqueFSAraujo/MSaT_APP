import { useForm, FormProvider } from 'react-hook-form';
import FormInput from '../common/FormInput/FormInput';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues } from 'react-hook-form';
import FormSelect from '../common/FormSelect/FormSelect';
import { Button } from '../ui/Button';

const schema = z.object({
  parent1FullName: z.string().min(1, 'Nome completo do Genitor 1 é obrigatório'),
  parent1Cpf: z.string().min(1, 'CPF do Genitor 1 é obrigatório'),
  parent1Phone: z.string().min(1, 'Telefone de contato do Genitor 1 é obrigatório'),
  parent1MaritalStatus: z.string().min(1, 'Estado civil do Genitor 1 é obrigatório'),

  parent2FullName: z.string().min(1, 'Nome completo do Genitor 2 é obrigatório'),
  parent2Cpf: z.string().min(1, 'CPF do Genitor 2 é obrigatório'),
  parent2Phone: z.string().min(1, 'Telefone de contato do Genitor 2 é obrigatório'),
  parent2MaritalStatus: z.string().min(1, 'Estado civil do Genitor 2 é obrigatório'),

  residesWithBothParents: z
    .string()
    .min(1, 'É obrigatório informar se o(a) candidato(a) reside com os dois genitores'),
});

const ParentalDataForm = () => {
  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(schema),
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
          Dados dos Genitores
        </h1>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            <FormInput
              {...methods.register('parent1FullName')}
              name="parent1FullName"
              label="Nome completo do genitor 1"
              required
              error={errors.parent1FullName?.message}
            />
            <FormInput
              {...methods.register('parent1Cpf')}
              name="parent1Cpf"
              label="CPF do genitor 1"
              mask="cpf"
              required
              error={errors.parent1Cpf?.message}
            />
            <FormInput
              {...methods.register('parent1Phone')}
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
              options={[
                { value: 'S', label: 'Solteiro' },
                { value: 'C', label: 'Casado' },
                { value: 'D', label: 'Divorciado' },
                { value: 'V', label: 'Viúvo' },
                { value: 'O', label: 'Outro' },
              ]}
              error={errors.parent1MaritalStatus?.message}
            />
            <FormInput
              {...methods.register('parent2FullName')}
              name="parent2FullName"
              label="Nome completo do genitor 2"
              required
              error={errors.parent1FullName?.message}
            />
            <FormInput
              {...methods.register('parent2Cpf')}
              name="parent2Cpf"
              label="CPF do genitor 2"
              mask="cpf"
              required
              error={errors.parent2Cpf?.message}
            />
            <FormInput
              {...methods.register('parent2Phone')}
              name="parent2Phone"
              label="Telefone de contato do genitor 2"
              mask="phone"
              required
              type="parent2Phone"
              error={errors.parent2Phone?.message}
            />
            <FormSelect
              name="parent2MaritalStatus"
              label="Estado cívil do genitor 2"
              required
              description="Selecione uma das opções abaixo."
              options={[
                { value: 'S', label: 'Solteiro' },
                { value: 'C', label: 'Casado' },
                { value: 'D', label: 'Divorciado' },
                { value: 'V', label: 'Viúvo' },
                { value: 'O', label: 'Outro' },
              ]}
              error={errors.parent2MaritalStatus?.message}
            />
            <FormSelect
              name="residesWithBothParents"
              label="O candidato reside com os dois genitores?"
              required
              description="Selecione uma das opções abaixo."
              options={[
                { value: 'S', label: 'Sim' },
                { value: 'N', label: 'Não' },
              ]}
              error={errors.residesWithBothParents?.message}
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

export default ParentalDataForm;
