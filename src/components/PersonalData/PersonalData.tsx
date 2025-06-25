import { useForm, FormProvider } from 'react-hook-form';
import FormInput from '../common/FormInput/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import FormSelect from '../common/FormSelect/FormSelect';
import FormDate from '../common/FormDate/FormDate';
import { Button } from '../ui/button';
import { toast } from '@/utils/toast';
import { useTabStore } from '@/store/tabStore';
import { Nationality, Birthplace, raceOptions, genderOptions, YesOrNo } from '@/utils/optionsMock';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { personalDataSchema, PersonalDataType } from './type/formData';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';

export const PersonalData = ({ label }: { label: string }) => {
  const { setFormData, formData } = useScholarshipFormStore();
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);

  const methods = useForm<PersonalDataType>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      username: '',
      email: '',
      cpf: '',
      rg: '',
      nationality: '',
      birthplace: '',
      race: '',
      phone: '',
      gender: '',
      dateBirth: undefined,
      deficiency: '',
      cpfScholarship: '',
      educacenso: '',
      ...(formData.personal_data as Partial<PersonalDataType>),
    },
  });

  const { errors } = methods.formState;

  const onSubmit = async (data: PersonalDataType) => {
    const isValid = await methods.trigger();
    if (!isValid) return;

    setFormData('personal_data', data);
    toast.success('Sucesso!', 'Dados enviados com sucesso!');
    setSelectedTab('parents_data');

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
          <div className="max-w-6xl mx-auto bg-white p-6">
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                <FormInput
                  name="username"
                  label="Nome completo"
                  required
                  error={errors.username?.message}
                />
                <FormDate
                  name="dateBirth"
                  label="Data de Nascimento"
                  required
                  error={errors.dateBirth?.message}
                />
                <FormInput name="cpf" label="CPF" mask="cpf" required error={errors.cpf?.message} />
                <FormInput
                  name="rg"
                  label="RG do candidato(a)"
                  mask="rg"
                  error={errors.rg?.message}
                />
                <FormSelect
                  name="nationality"
                  label="Nacionalidade"
                  required
                  description="Selecione uma das opções abaixo."
                  options={Nationality}
                  error={errors.nationality?.message}
                />
                <FormSelect
                  name="birthplace"
                  label="Naturalidade"
                  required
                  description="Selecione uma das opções abaixo."
                  options={Birthplace}
                  error={errors.birthplace?.message}
                />
                <FormSelect
                  name="race"
                  label="Raça/Cor do(a) candidato(a)"
                  required
                  description="Selecione uma das opções abaixo."
                  options={raceOptions}
                  error={errors.race?.message}
                />
                <FormSelect
                  name="gender"
                  label="Escolha seu Gênero"
                  required
                  description="Selecione uma das opções abaixo."
                  options={genderOptions}
                  error={errors.gender?.message}
                />
                <FormSelect
                  name="deficiency"
                  label="Pessoa com deficiência"
                  required
                  description="Selecione uma das opções abaixo."
                  options={YesOrNo}
                  error={errors.deficiency?.message}
                />
                <FormInput
                  name="email"
                  label="E-mail"
                  type="email"
                  required
                  error={errors.email?.message}
                />
                <FormInput
                  name="phone"
                  label="Celular"
                  mask="phone"
                  required
                  error={errors.phone?.message}
                />
                <FormInput
                  name="cpfScholarship"
                  label="CPF do(a) candidato(a) bolsista"
                  mask="cpf"
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
