import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { toast } from '@/utils/toast';
import { RadioButtonGroup } from '@/components/common/RadioButtonGroup/RadioButtonGroup';
import { radioGroups } from './form.ds';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { housingConditionsSchema, housingConditionsInfo } from './type/formData';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';

type FormData = z.infer<typeof housingConditionsSchema>;

export const HousingConditions = ({ label }: { label: string }) => {
  const { setFormData, formData } = useScholarshipFormStore();
  const methods = useForm<FormData>({
    resolver: zodResolver(housingConditionsSchema),
    defaultValues: {
      ...Object.fromEntries(radioGroups.map((group) => [group.name, ''])),
      ...(formData.housing_conditions as Partial<FormData>),
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: housingConditionsInfo) => {
    try {
      console.log('Dados enviados:', data);
      setFormData('housing_conditions', data);
      toast.success('Sucesso!', 'Condições de moradia salvas com sucesso!');
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
