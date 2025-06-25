import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { toast } from '@/utils/toast';
import { dynamicSections, fieldMasksMap } from './form.ds';
import { DynamicInputSection } from '../common/DynamicInputSection/DynamicInputSection';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { PropertyRelationsSchema, PropertyRelationsInfo } from './type/formData';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';

export const PropertyRelations = ({ label }: { label: string }) => {
  const { setFormData, formData } = useScholarshipFormStore();
  const methods = useForm<z.infer<typeof PropertyRelationsSchema>>({
    resolver: zodResolver(PropertyRelationsSchema),
    mode: 'onSubmit',
    defaultValues: {
      vehicles: [{ model: '', year: '', usage: '' }],
      peopleSchool: [{ name: '', school: '', monthlyValue: '' }],
      peopleDeficiency: [{ name: '', tDeficiency: '', monthlyValue: '' }],
      expenseBreakdown: [{ expense: '', realValue: '' }],
      ...(formData.property_relations as Partial<PropertyRelationsInfo>),
    },
  });

  const { handleSubmit } = methods;

  const getMasksForSection = (fields: string[]) => {
    const masks: Record<string, 'date' | 'currency'> = {};
    fields.forEach((field) => {
      if (fieldMasksMap[field]) {
        masks[field] = fieldMasksMap[field];
      }
    });
    return masks;
  };

  const onSubmit = async (data: PropertyRelationsInfo) => {
    try {
      console.log('Dados enviados:', data);
      setFormData('property_relations', data);
      toast.success('Sucesso!', 'salva com sucesso!');
    } catch (error) {
      console.error('Erro no processamento:', error);
      toast.error('Erro', 'Ocorreu um erro ao salvar.');
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-wrap gap-6 justify-center">
              {dynamicSections.map((section) => (
                <div key={section.key} className="w-full md:w-[550px]">
                  <DynamicInputSection
                    title={section.title}
                    info={section?.info}
                    columns={section.columns}
                    fieldNames={section.fields}
                    namePrefix={section.key}
                    required={section.required}
                    fieldMasks={getMasksForSection(section.fields)}
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
