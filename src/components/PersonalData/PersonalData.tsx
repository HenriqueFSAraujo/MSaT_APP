import { PostPersonalData, usePersonalData } from '@/services/queries/forms/index';
import { useTabStore } from '@/store/tabStore';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { getBirthplaceOptions, genderOptions, Nationality, raceOptions, YesOrNo } from '@/utils/optionsMock';
import { TabNavigation } from '@/components/TabNavigation/TabNavigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
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
  const { resetSpecificTab } = useTabStore();
  const { mutate: FormSubmit } = PostPersonalData();
  const { id: StudentId } = useParams<{ id: string }>();
  const { data } = usePersonalData(Number(StudentId));
  const [hasLoadedFromAPI, setHasLoadedFromAPI] = useState(false);

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
  const { watch } = methods;
  const selectedNationality = watch('nationality');

  // Auto-save functionality
  const watchedValues = watch();

  useEffect(() => {
    // Debounce auto-save to avoid too many saves
    const timeoutId = setTimeout(() => {
      if (watchedValues && Object.keys(watchedValues).length > 0) {
        // Verificar se todos os campos obrigatórios estão preenchidos antes de salvar
        const hasAllRequired =
          watchedValues.fullName &&
          watchedValues.cpf &&
          watchedValues.rg &&
          watchedValues.nationality &&
          watchedValues.birthplace &&
          watchedValues.race &&
          watchedValues.phone &&
          watchedValues.gender &&
          watchedValues.dateBirth;

        // Só salvar se todos os campos obrigatórios estão preenchidos
        if (hasAllRequired) {
          setFormData('personal_data', watchedValues);
        }
      }
    }, 1000); // Save after 1 second of inactivity

    return () => clearTimeout(timeoutId);
  }, [watchedValues, setFormData]);

  const birthplaceOptions = selectedNationality
    ? getBirthplaceOptions(selectedNationality)
    : [];

  useEffect(() => {
    if (data && !hasLoadedFromAPI) {
      const formData = {
        ...methods.getValues(),
        ...(data as Partial<PersonalDataType>),
      };

      if (formData.dateBirth && typeof formData.dateBirth === 'string') {
        // Se já está em formato DD/MM/YYYY, não precisa converter
        if (formData.dateBirth.includes('/')) {
          // Já está no formato correto
        } else {
          // Assumir que está em formato ISO (YYYY-MM-DD)
          // Parse manualmente para evitar problemas de timezone
          const parts = formData.dateBirth.split('T')[0].split('-'); // Pega só a parte da data
          if (parts.length === 3) {
            const [year, month, day] = parts;
            formData.dateBirth = `${day}/${month}/${year}`;
          } else {
            // Se não conseguir fazer parse, remover o campo
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { dateBirth, ...formDataWithoutDate } = formData;
            methods.reset(formDataWithoutDate);
            setHasLoadedFromAPI(true);
            return;
          }
        }
      }

      // Verificar se campos obrigatórios estão vazios após carregar da API
      const hasAllRequiredFields =
        formData.rg &&
        formData.nationality &&
        formData.birthplace &&
        formData.race;

      // Se campos obrigatórios estão vazios, desmarcar a tab
      if (!hasAllRequiredFields) {
        resetSpecificTab('personal_data');
      }

      methods.reset(formData);
      setHasLoadedFromAPI(true);
    }
  }, [data, methods, hasLoadedFromAPI, resetSpecificTab]);

  useEffect(() => {
    if (formData.personal_data) {
      const storeData = formData.personal_data;
      const currentValues = methods.getValues();

      if (storeData.dateBirth && typeof storeData.dateBirth === 'string') {
        // Se já está em formato DD/MM/YYYY, manter
        if (!storeData.dateBirth.includes('/')) {
          // Se está em outro formato (ISO), converter para DD/MM/YYYY
          const parts = storeData.dateBirth.split('T')[0].split('-');
          if (parts.length === 3) {
            const [year, month, day] = parts;
            storeData.dateBirth = `${day}/${month}/${year}`;
          } else {
            // Se não conseguir fazer parse, remover o campo
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { dateBirth, ...storeDataWithoutDate } = storeData;
            methods.reset({
              ...currentValues,
              ...storeDataWithoutDate,
            });
            return;
          }
        }
      }

      methods.reset({
        ...currentValues,
        ...storeData,
      });
    }
  }, [formData.personal_data, methods]);

  useEffect(() => {
    if (selectedNationality) {
      const currentBirthplace = methods.getValues('birthplace');
      const newOptions = getBirthplaceOptions(selectedNationality);

      if (currentBirthplace && !newOptions.some(option => option.value === currentBirthplace)) {
        methods.setValue('birthplace', '');
      }
    }
  }, [selectedNationality, methods]);

  // Monitorar se a tab deve ser desmarcada quando campos obrigatórios estão vazios
  useEffect(() => {
    const { completedTabs } = useTabStore.getState();

    // Verificar se todos os campos obrigatórios estão preenchidos
    const hasAllRequiredFields =
      watchedValues.fullName &&
      watchedValues.cpf &&
      watchedValues.rg &&
      watchedValues.nationality &&
      watchedValues.birthplace &&
      watchedValues.race &&
      watchedValues.phone &&
      watchedValues.gender &&
      watchedValues.dateBirth;

    // Se a tab está marcada como completa mas não tem todos os campos, desmarcar
    if (completedTabs.includes('personal_data') && !hasAllRequiredFields) {
      resetSpecificTab('personal_data');
    }
  }, [watchedValues, resetSpecificTab]);

  const onSubmit = async (formValues: PersonalDataType) => {
    const isValid = await methods.trigger();
    if (!isValid) return;

    // Verificar se todos os campos obrigatórios estão preenchidos
    const hasAllRequiredFields =
      formValues.fullName &&
      formValues.cpf &&
      formValues.rg &&
      formValues.nationality &&
      formValues.birthplace &&
      formValues.race &&
      formValues.phone &&
      formValues.gender &&
      formValues.dateBirth;

    if (!hasAllRequiredFields) {
      return;
    }

    try {
      setFormData('personal_data', formValues);

      const { markTabAsCompleted } = useTabStore.getState();
      markTabAsCompleted('personal_data');

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
          ? (typeof formValues.dateBirth === 'string'
              ? formValues.dateBirth
              : (formValues.dateBirth as Date).toISOString())
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
                  description={selectedNationality
                    ? `Selecione uma das opções de ${Nationality.find(n => n.value === selectedNationality)?.label || 'naturalidade'}.`
                    : "Primeiro selecione a nacionalidade."
                  }
                  options={birthplaceOptions}
                  error={errors.birthplace?.message}
                  disabled={!selectedNationality}
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
                  name="educacenso"
                  label="Número Educacenso"
                  description="Caso não possua, deixe em branco."
                />
              </div>
              <div className="flex justify-between items-center w-full mt-4 gap-4">
                <div className="flex-shrink-0">
                  <TabNavigation
                    currentTab="personal_data"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors"
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
