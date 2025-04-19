import { useForm, FormProvider } from 'react-hook-form';
import FormInput from '../common/FormInput/FormInput';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues } from 'react-hook-form';
import FormSelect from '../common/FormSelect/FormSelect';
import FormDate from '../common/FormDate/FormDate';
import { Button } from '../ui/button';
import { toast } from '@/utils/toast';
import { useTabStore } from '@/store/tabStore';

const schema = z.object({
  username: z.string().min(1, 'Nome completo é obrigatório'),
  login: z.string().min(1, 'Login é obrigatório'),
  email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
  cpf: z.string().min(1, 'CPF é obrigatório'),
  phone: z.string().min(1, 'phone é obrigatório'),
  gender: z.string().min(1, 'Gênero é obrigatório'),
  cpfScholarship: z.string().optional(),
  dateBirth: z
    .date({
      required_error: 'Data de nascimento é obrigatória',
      invalid_type_error: 'Formato inválido de data',
    })
    .refine((date) => date !== null, { message: 'Data de nascimento é obrigatória' }),
  deficiency: z.string().min(1, 'Pessoa com deficiência é obrigatória'),
  educacenso: z.string().optional(),
});

export const PersonalData = ({ label }: { label: string }) => {
  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      login: '',
      email: '',
      cpf: '',
      cpfScholarship: '',
      phone: '',
      dateBirth: '',
      gender: '',
      deficiency: '',
      educacenso: '',
    },
  });
  const { errors } = methods.formState;

  const setSelectedTab = useTabStore((state) => state.setSelectedTab);

  const onSubmit = async (data: FieldValues) => {
    const isValid = await methods.trigger();
    if (!isValid) return;
    toast.success('Sucesso!', 'Dados enviados com sucesso!');
    setSelectedTab('parents_data');

    console.log('Dados do formulário:', data);
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-6xl mx-auto bg-white p-6">
        <h1 className="text-2xl font-semibold text-gray-700 text-center m-6">{label}</h1>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            <FormInput
              {...methods.register('username')}
              name="username"
              label="Nome completo"
              required
              error={errors.username?.message}
            />
            <FormInput
              {...methods.register('login')}
              name="login"
              label="Login"
              required
              error={errors.login?.message}
            />
            <FormInput
              {...methods.register('email')}
              name="email"
              label="E-mail"
              type="email"
              required
              error={errors.email?.message}
            />
            <FormInput
              {...methods.register('cpf')}
              name="cpf"
              label="CPF"
              mask="cpf"
              required
              error={errors.cpf?.message}
            />
            <FormInput
              {...methods.register('phone')}
              name="phone"
              label="Telefone"
              mask="phone"
              required
              error={errors.phone?.message}
            />
            <FormSelect
              name="gender"
              label="Escolha seu Gênero"
              required
              description="Selecione uma das opções abaixo."
              options={[
                { value: 'M', label: 'Masculino' },
                { value: 'F', label: 'Feminino' },
                { value: 'O', label: 'Outro' },
              ]}
              error={errors.gender?.message}
            />
            <FormInput
              {...methods.register('cpfScholarship')}
              name="cpfScholarship"
              label="CPF do(a) candidato(a) bolsista"
              mask="cpf"
            />
            <FormDate
              name="dateBirth"
              label="Data de Nascimento"
              required
              error={errors.dateBirth?.message}
            />
            <FormSelect
              name="deficiency"
              label="Pessoa com deficiência"
              required
              description="Selecione uma das opções abaixo."
              options={[
                { value: 'S', label: 'Sim' },
                { value: 'N', label: 'Não' },
              ]}
              error={errors.deficiency?.message}
            />
            <FormInput
              {...methods.register('educacenso')}
              name="educacenso"
              label="Número Educacenso"
              description="Caso não possua, deixe em branco."
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
    </FormProvider>
  );
};
