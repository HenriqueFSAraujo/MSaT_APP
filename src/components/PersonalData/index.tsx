import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from '../common/FormInput/FormInput';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues } from 'react-hook-form';
import FormSelect from '../common/FormSelect/FormSelect';
import FormDate from '../common/FormDate/FormDate';
import { Button } from '../ui/Button';

const schema = z.object({
  username: z.string().min(1, 'Nome completo é obrigatório'),
  login: z.string().min(1, 'Login é obrigatório'),
  email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
  cpf: z.string().min(1, 'CPF é obrigatório'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  genero: z.string().min(1, 'Gênero é obrigatório'),
  cpfBolsista: z.string().optional(),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  deficiencia: z.string().min(1, 'Pessoa com deficiência é obrigatória'),
  educacenso: z.string().optional(),
});

const PersonalDataForm: React.FC = () => {
  const methods = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-6xl mx-auto bg-white ">
        <h1 className="text-2xl font-semibold p-6 text-gray-700 text-center mb-6">
          Dados Pessoais
        </h1>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormInput name="username" label="Nome completo" required />
            <FormInput name="login" label="Login" required />
            <FormInput name="email" label="E-mail" type="email" required />
            <FormInput name="cpf" label="CPF" mask="cpf" required />
            <FormInput name="telefone" label="Telefone" mask="telefone" required />
            <FormSelect
              name="genero"
              label="Escolha seu Gênero"
              required
              description="Selecione uma das opções abaixo."
              options={[
                { value: 'M', label: 'Masculino' },
                { value: 'F', label: 'Feminino' },
                { value: 'O', label: 'Outro' },
              ]}
            />
            <FormInput name="cpfBolsista" label="CPF do(a) candidato(a) bolsista" mask="cpf" />
            <FormDate name="dataNascimento" label="Data de Nascimento" required />
            <FormSelect
              name="deficiencia"
              label="Pessoa com deficiência"
              required
              description="Selecione uma das opções abaixo."
              options={[
                { value: 'S', label: 'Sim' },
                { value: 'N', label: 'Não' },
              ]}
            />
            <FormInput
              name="educacenso"
              label="Número Educacenso"
              description="Caso não possua, deixe em branco."
            />
          </div>
          <div className="flex justify-end w-full">
            <Button
              type="submit"
              className="mt-4 w-28 bg-blue-400 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all"
            >
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default PersonalDataForm;
