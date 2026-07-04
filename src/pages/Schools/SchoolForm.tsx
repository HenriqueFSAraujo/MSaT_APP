import FormInput from '@/components/common/FormInput/FormInput';
import { RadioButtonGroup } from '@/components/common/RadioButtonGroup/RadioButtonGroup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useCreateSchool,
  useGetSchoolById,
  useUpdateSchool,
} from '@/services/queries/schools';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { schoolSchema, SchoolFormType } from './type/schoolData';

export default function SchoolForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { data: school } = useGetSchoolById(isEditing ? Number(id) : undefined);
  const { mutate: createSchool } = useCreateSchool();
  const { mutate: updateSchool } = useUpdateSchool();

  const methods = useForm<SchoolFormType>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      nome: '',
      cnpj: '',
      nsu: '',
      endereco: '',
      tipo: undefined,
    },
  });

  const { errors } = methods.formState;

  useEffect(() => {
    if (school) {
      methods.reset({
        nome: school.nome,
        cnpj: school.cnpj,
        nsu: school.nsu ?? '',
        endereco: school.endereco ?? '',
        tipo: school.tipo,
      });
    }
  }, [school, methods]);

  const onSubmit = (values: SchoolFormType) => {
    const payload = {
      nome: values.nome,
      cnpj: values.cnpj,
      nsu: values.nsu,
      endereco: values.endereco,
      tipo: values.tipo,
    };

    const onSuccess = () => navigate('/schools');

    if (isEditing) {
      updateSchool({ id: Number(id), ...payload }, { onSuccess });
    } else {
      createSchool(payload, { onSuccess });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="p-4 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-700 text-center mx-6 mb-4">
              {isEditing ? 'Editar Escola' : 'Nova Escola'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                <FormInput name="nome" label="Nome da escola" required error={errors.nome?.message} />
                <FormInput name="cnpj" label="CNPJ" mask="cnpj" required error={errors.cnpj?.message} />
                <FormInput name="nsu" label="NSU" error={errors.nsu?.message} />
                <FormInput
                  name="endereco"
                  label="Endereço"
                  required
                  error={errors.endereco?.message}
                />
                <RadioButtonGroup
                  name="tipo"
                  label="Tipo da escola"
                  required
                  orientation="horizontal"
                  options={[
                    { value: 'PARTICULAR', label: 'Particular' },
                    { value: 'GRATUITA', label: 'Gratuita' },
                  ]}
                />
              </div>

              <div className="flex justify-between items-center w-full mt-6 gap-4">
                <Button type="button" variant="outline" onClick={() => navigate('/schools')}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors"
                >
                  Salvar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
}
