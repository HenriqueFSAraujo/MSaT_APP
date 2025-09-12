import { RadioButtonGroup } from '@/components/common/RadioButtonGroup/RadioButtonGroup';
import { UseHousingData } from '@/services/queries/forms/HousingData/getHousingData';
import { HousingDataPayload, PostHousingData } from '@/services/queries/forms/index';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { toast } from '@/utils/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { radioGroups } from './form.ds';
import { housingConditionsInfo, housingConditionsSchema } from './type/formData';

type FormData = housingConditionsInfo;

export const HousingConditions = ({ label }: { label: string }) => {
  const { setFormData, formData } = useScholarshipFormStore();
  const { mutate: FormSubmit } = PostHousingData();
  const { id: StudentId } = useParams<{ id: string }>();
  const { data } = UseHousingData(Number(StudentId));
  const methods = useForm<FormData>({
    resolver: zodResolver(housingConditionsSchema),
    defaultValues: {
      ...Object.fromEntries(radioGroups.map((group) => [group.name, ''])),
    },
  });

  useEffect(() => {
    if (data) {
      methods.reset({
        ...methods.getValues(),
        ...(data as Partial<FormData>),
      });
    }
  }, [data, methods]);

  const { handleSubmit } = methods;

  const onSubmit = async (data: FormData) => {
    try {
      setFormData('housing_conditions', data);

      const payload: HousingDataPayload = {
        userId: Number(StudentId),
        ...data,
      };

      FormSubmit(payload);
    } catch (error) {
      console.error('Erro no processamento:', error);
      toast.error('Erro', 'Ocorreu um erro ao salvar as condições de moradia.');
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {radioGroups.map((group) => (
                <div key={group.name} className="border-b pb-6">
                  <RadioButtonGroup
                    name={group.name}
                    label={group.label}
                    required={group.required}
                    options={group.options}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-6">
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
