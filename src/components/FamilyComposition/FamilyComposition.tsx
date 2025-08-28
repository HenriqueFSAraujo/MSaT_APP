import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Endpoints } from '@/services/endpoints';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { toast } from '@/utils/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import type { z } from 'zod';
import { DynamicInputSection } from '../common/DynamicInputSection/DynamicInputSection';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { dynamicSections, fieldMasksMap } from './form.ds';
import { type FamilyCompositionInfo, FamilyCompositionSchema } from './type/formData';

export const FamilyComposition = ({ label }: { label: string }) => {
  const { id: studentId } = useParams<{ id: string }>();
  const { setFormData, formData } = useScholarshipFormStore();

  // Mutation para submeter os dados da composição familiar
  const familyDataMutation = useMutation({
    mutationKey: ['send-family-data'],
    mutationFn: (payload: unknown) => api.post(Endpoints.Forms.Family_Composition, payload),
  });

  // Criar 10 linhas vazias para a composição familiar
  const createEmptyRows = (count: number) => {
    return Array.from({ length: count }, () => ({
      nomeCompleto: '',
      escolaridade: '',
      grauParentesco: '',
      dataNascimento: '',
      profissaoAtiva: '',
      estadoCivil: '',
      salarioBruto: '',
    }));
  };

  // Determinar os valores iniciais para composição familiar
  const initialValues = () => {
    // Se já existe dados salvos, use-os
    if (formData.family_composition?.composicaoFamiliar?.length) {
      return formData.family_composition;
    }
    // Caso contrário, crie 5 linhas vazias
    return {
      composicaoFamiliar: createEmptyRows(5),
      familiaresEscola: [],
      pessoasComDeficiencia: [],
      despesasMensais: [],
    };
  };

  const methods = useForm<z.infer<typeof FamilyCompositionSchema>>({
    resolver: zodResolver(FamilyCompositionSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: initialValues(),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const getMasksForSection = (fields: string[]) => {
    const masks: Record<string, 'date' | 'currency'> = {};
    fields.forEach((field) => {
      if (fieldMasksMap[field]) {
        masks[field] = fieldMasksMap[field];
      }
    });
    return masks;
  };

  const onSubmit = async (data: FamilyCompositionInfo) => {
    try {
      // Verificar se alguma linha está preenchida parcialmente
      const partiallyFilledRows = data.composicaoFamiliar.some((row) => {
        const filledFields = Object.values(row).filter(
          (value) => value && value.trim() !== ''
        ).length;
        return filledFields > 0 && filledFields < 7; // Se tem algum campo preenchido, mas não todos
      });

      if (partiallyFilledRows) {
        toast.error(
          'Erro de validação',
          'Todas as informações são obrigatórias em cada linha preenchida.'
        );
        return;
      }

      // Filtrar linhas vazias antes de salvar
      const filteredData = {
        ...data,
        composicaoFamiliar: data.composicaoFamiliar.filter(
          (item) =>
            (item?.nomeCompleto?.trim?.() ?? '') !== '' ||
            (item?.escolaridade?.trim?.() ?? '') !== '' ||
            (item?.grauParentesco?.trim?.() ?? '') !== '' ||
            (item?.dataNascimento?.trim?.() ?? '') !== '' ||
            (item?.profissaoAtiva?.trim?.() ?? '') !== '' ||
            (item?.estadoCivil?.trim?.() ?? '') !== '' ||
            (item?.salarioBruto?.trim?.() ?? '') !== ''
        ),
      };

      // Salvar no store local
      setFormData('family_composition', {
        composicaoFamiliar: filteredData.composicaoFamiliar,
        familiaresEscola: formData.family_composition?.familiaresEscola ?? [],
        pessoasComDeficiencia: formData.family_composition?.pessoasComDeficiencia ?? [],
        despesasMensais: formData.family_composition?.despesasMensais ?? [],
      });

      // Formatar e enviar dados para API
      const payload = {
        userInfoId: Number(studentId),
        composicaoFamiliar: filteredData.composicaoFamiliar.map((item) => ({
          ...item,
          salarioBruto: item?.salarioBruto
            ? item.salarioBruto.replace(/[^\d,]/g, '').replace(',', '.')
            : '',
        })),
      };

      // Executar a mutação
      await familyDataMutation.mutateAsync(payload);
      toast.success('Sucesso!', 'Composição familiar salva com sucesso!');
    } catch (error) {
      console.error('Erro no processamento:', error);
      toast.error('Erro', 'Ocorreu um erro ao salvar a composição familiar.');
    }
  };

  const footerMessage =
    '* Preencha os dados de todos os membros da família. As linhas em branco não serão salvas.';

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
            <div className="space-y-8">
              {dynamicSections.map((section) => (
                <div key={section.key} className="w-full">
                  <DynamicInputSection
                    title={section.title}
                    columns={section.columns}
                    fieldNames={section.fields}
                    namePrefix={section.key}
                    required={section.required}
                    fieldMasks={getMasksForSection(section.fields)}
                    footerMessage={footerMessage}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                className="mt-4 w-35 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors"
                disabled={isSubmitting || familyDataMutation.isPending}
              >
                {familyDataMutation.isPending ? 'Salvando...' : 'Salvar e continuar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
};
