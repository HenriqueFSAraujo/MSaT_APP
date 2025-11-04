import { PostPropertyData, usePropertyData } from '@/services/queries/forms/index';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { toast } from '@/utils/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
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
      familiaresEscola: [{ nome: '', escola: '', valorMensal: 'R$ 0,00' }],
      pessoasComDeficiencia: [{ nome: '', tipoDeficiencia: '', despesaMensal: 'R$ 0,00' }],
      despesasMensais: [{ descricao: '', valor: 'R$ 0,00' }],
      ...(formData.property_relations as Partial<PropertyRelationsInfo>),
    },
  });

  const { handleSubmit, watch } = methods;

  const watchedValues = watch();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (watchedValues && Object.keys(watchedValues).length > 0) {
        const hasAnyValue = Object.values(watchedValues).some(
          value => {
            if (Array.isArray(value)) {
              return value.some(item =>
                Object.values(item).some(v => v !== '' && v !== undefined && v !== null)
              );
            }
            return value !== '' && value !== undefined && value !== null;
          }
        );

        if (hasAnyValue) {
          setFormData('property_relations', watchedValues);
        }
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [watchedValues, setFormData]);

  const formatCurrencyFromServer = useCallback((value: string | number | null | undefined): string => {
    if (!value && value !== 0) return 'R$ 0,00';

    if (typeof value === 'string' && value.includes('R$')) {
      return value;
    }

    let numValue: number;
    if (typeof value === 'number') {
      numValue = value / 100;
    } else {
      const cleanValue = String(value).replace(/\D/g, '');

      if (!cleanValue) return 'R$ 0,00';

      numValue = parseInt(cleanValue, 10) / 100;
    }

    if (isNaN(numValue)) return 'R$ 0,00';

    return numValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, []);

  const applyMasksToData = useCallback((serverData: Partial<PropertyRelationsInfo>): Partial<PropertyRelationsInfo> => {
    const maskedData = { ...serverData };

    if (maskedData.familiaresEscola) {
      maskedData.familiaresEscola = maskedData.familiaresEscola.map((item) => ({
        ...item,
        valorMensal: formatCurrencyFromServer(item.valorMensal),
      }));
    }

    if (maskedData.pessoasComDeficiencia) {
      maskedData.pessoasComDeficiencia = maskedData.pessoasComDeficiencia.map((item) => ({
        ...item,
        despesaMensal: formatCurrencyFromServer(item.despesaMensal),
      }));
    }

    if (maskedData.despesasMensais) {
      maskedData.despesasMensais = maskedData.despesasMensais.map((item) => ({
        ...item,
        valor: formatCurrencyFromServer(item.valor),
      }));
    }

    if (maskedData.veiculos) {
      maskedData.veiculos = maskedData.veiculos.map((item) => ({
        ...item,
        anoFabricacao: item.anoFabricacao ? String(item.anoFabricacao) : '',
      }));
    }

    return maskedData;
  }, [formatCurrencyFromServer]);

  useEffect(() => {
    const hasClearedCache = sessionStorage.getItem('has-cleared-mask-cache');
    if (!hasClearedCache) {
      const storageData = sessionStorage.getItem('scholarship-form');
      if (storageData) {
        try {
          const parsed = JSON.parse(storageData);
          if (parsed.state?.formData?.property_relations) {
            delete parsed.state.formData.property_relations;
            sessionStorage.setItem('scholarship-form', JSON.stringify(parsed));
            sessionStorage.setItem('has-cleared-mask-cache', 'true');
          }
        } catch (error) {
          console.error('Error clearing cache:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (data) {
      const maskedData = applyMasksToData(data);
      methods.reset({
        ...methods.getValues(),
        ...(maskedData as Partial<PropertyRelationsInfo>),
      });
    }
  }, [data, methods, applyMasksToData]);

  const unmaskDigits = (value: string) => value.replace(/\D/g, '');

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
        anoFabricacao: item.anoFabricacao ? item.anoFabricacao.replace(/\D/g, '').slice(0, 4) : '',
      })),
    };
  };

  const getMasksForSection = (fields: string[]) => {
    const masks: Record<string, 'date' | 'currency' | 'year'> = {};
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
                    footerMessage={section.footerMessage}
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
