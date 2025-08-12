import { usePropertyData } from '@/services/queries/forms/PropertyData/getPropertyData';
import { PostPropertyData } from '@/services/queries/forms/PropertyData/postPropertyData';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { toast } from '@/utils/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import type { z } from 'zod';
import { DynamicInputSection } from '../common/DynamicInputSection/DynamicInputSection';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { dynamicSections, fieldMasksMap } from './form.ds';
import { type PropertyRelationsInfo, PropertyRelationsSchema } from './type/formData';

export const PropertyRelations = ({ label }: { label: string }) => {
  const { mutate: FormSubmit } = PostPropertyData();
  const { id: StudentId } = useParams<{ id: string }>();
    const { data } = usePropertyData(Number(StudentId));
  const { setFormData, formData } = useScholarshipFormStore();
  const methods = useForm<z.infer<typeof PropertyRelationsSchema>>({
    resolver: zodResolver(PropertyRelationsSchema),
    mode: 'onSubmit',
    defaultValues: {
      veiculos: [{ marcaModelo: '', anoFabricacao: '', utilizacao: '' }],
      familiaresEscola: [{ nome: '', escola: '', valorMensal: '' }],
      pessoasComDeficiencia: [{ nome: '', tipoDeficiencia: '', despesaMensal: '' }],
      despesasMensais: [{ descricao: '', valor: '' }],
      ...(formData.property_relations as Partial<PropertyRelationsInfo>),
    },
  });

  const { handleSubmit } = methods;

  useEffect(() => {
    if (data) {
      methods.reset({
        ...methods.getValues(),
        ...(data as Partial<PropertyRelationsInfo>),
      });
    }
  }, [data, methods]);


  const unmaskDigits = (value: string) =>
    value.replace(/\D/g, '');


  const formatPayload = (data: PropertyRelationsInfo, userId: number) => {
    return {
      userInfoId: userId,
      familiaresEscola: data.familiaresEscola.map((item) => ({
        ...item,
        valorMensal: unmaskDigits(item.valorMensal),
      })),
      pessoasComDeficiencia: data.pessoasComDeficiencia.map((item) => ({
        ...item,
        despesaMensal: unmaskDigits(item.despesaMensal),
      })),
      despesasMensais: data.despesasMensais.map((item) => ({
        ...item,
        valor: unmaskDigits(item.valor),
      })),
      veiculos: data.veiculos.map((item) => ({
        ...item,
        anoFabricacao: unmaskDigits(item.anoFabricacao).slice(0, 4),
      })),
    };
  };

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
      setFormData('property_relations', data);
      
      
      const payload = formatPayload(data, Number(StudentId));
      FormSubmit(payload);
      
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
