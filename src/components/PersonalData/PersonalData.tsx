import { PostPersonalData, usePersonalData } from '@/services/queries/forms/index';
import { useTabStore } from '@/store/tabStore';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { Birthplace, genderOptions, Nationality, raceOptions, YesOrNo } from '@/utils/optionsMock';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import FormDate from '../common/FormDate/FormDate';
import FormInput from '../common/FormInput/FormInput';
import FormSelect from '../common/FormSelect/FormSelect';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { personalDataSchema, PersonalDataType } from './type/formData';

export const PersonalData = ({ label }: { label: string }) => {
  const { setFormData, formData } = useScholarshipFormStore();
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);
  const { mutate: FormSubmit } = PostPersonalData();
  const { id: StudentId } = useParams<{ id: string }>();
  const { data } = usePersonalData(Number(StudentId));

  const methods = useForm<PersonalDataType>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      fullName: '',
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

  useEffect(() => {
    if (data) {
      methods.reset({
        ...methods.getValues(),
        ...(data as Partial<PersonalDataType>),
      });
    }
  }, [data, methods]);

  const onSubmit = async (formValues: PersonalDataType) => {
    const isValid = await methods.trigger();
    if (!isValid) return;

    try {
      setFormData('personal_data', formValues);
      setSelectedTab('parents_data');

      const payload = {
        userId: Number(StudentId),
        fullName: formValues.fullName,
        email: formValues.email,
        cpf: formValues.cpf,
        rg: formValues.rg ?? '',
        nationality: formValues.nationality ?? '',
        birthplace: formValues.birthplace ?? '',
        race: formValues.race ?? '',
        cpfScholarship: formValues.cpfScholarship ?? '',
        phone: formValues.phone,
        gender: formValues.gender,
        dateBirth: formValues.dateBirth
          ? formValues.dateBirth.toISOString()
          : '',
        deficiency: formValues.deficiency,
        educasenso: formValues.educacenso ?? '',
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
          <div className="max-w-6xl mx-auto bg-white p-6">
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                <FormInput
                  name="fullName"
                  label="Nome completo do(a) candidato(a)"
                  required
                  error={errors.fullName?.message}
                />
                <FormDate
                  name="dateBirth"
                  label="Data de Nascimento do(a) candidato(a)"
                  required
                  error={errors.dateBirth?.message}
                />
                <FormInput name="cpf" label="CPF do(a) candidato(a)" mask="cpf" required error={errors.cpf?.message} />
                <FormInput
                  name="rg"
                  label="RG do candidato(a) do(a) candidato(a)"
                  mask="rg"
                  error={errors.rg?.message}
                />
                <FormSelect
                  name="nationality"
                  label="Nacionalidade do(a) candidato(a)"
                  required
                  description="Selecione uma das opções abaixo."
                  options={Nationality}
                  error={errors.nationality?.message}
                />
                <FormSelect
                  name="birthplace"
                  label="Naturalidade do(a) candidato(a)"
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
                  label="Escolha o Gênero do(a) candidato(a)"
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
