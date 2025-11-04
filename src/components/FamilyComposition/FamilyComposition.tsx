import { useFamilyCompositionData, PostFamilyCompositionData } from '@/services/queries/forms/FamilyCompositionData';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { useTabStore } from '@/store/tabStore';
import { maskCurrency, maskDate } from '@/utils/transformMasks';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useCallback, useMemo, useEffect, useRef } from 'react';
import type { z } from 'zod';
import { DynamicInputSection } from '../common/DynamicInputSection/DynamicInputSection';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { dateFieldsMap, dynamicSections, fieldMasksMap, selectFieldsMap } from './form.ds';
import {
  type FamilyCompositionInfo,
  FamilyCompositionSchema,
  type FamilyMember,
} from './type/formData';

// Interface para os dados que vêm da API
interface ApiFamilyMember {
  id?: number;
  nomeCompleto?: string;
  escolaridade?: string;
  escolaridade_other?: string;
  grauParentesco?: string;
  grauParentesco_other?: string;
  dataNascimento?: string | Date;
  profissaoAtiva?: string;
  estadoCivil?: string;
  salarioBruto?: string | number;
}

export const FamilyComposition = ({ label }: { label: string }) => {
  console.log('🟢 FamilyComposition renderizado');

  const { id: studentId } = useParams<{ id: string }>();

  // Usar seletores específicos ao invés de pegar tudo
  const setFormData = useScholarshipFormStore((state) => state.setFormData);
  const familyCompositionData = useScholarshipFormStore((state) => state.formData.family_composition);
  const markTabAsCompleted = useTabStore((state) => state.markTabAsCompleted);
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);

  // Ref para controlar se já inicializamos o formulário
  const hasInitialized = useRef(false);

  // Query para buscar dados existentes
  const { data: existingData, isLoading } = useFamilyCompositionData(Number(studentId));

  // Mutation para salvar dados
  const familyDataMutation = PostFamilyCompositionData();

  const createEmptyRows = useCallback((count: number) => {
    return Array.from({ length: count }, () => ({
      nomeCompleto: '',
      escolaridade: '',
      escolaridade_other: '',
      grauParentesco: '',
      grauParentesco_other: '',
      dataNascimento: '',
      profissaoAtiva: '',
      estadoCivil: '',
      salarioBruto: 'R$ 0,00',
    }));
  }, []);

  // Função para aplicar máscaras nos dados da API
  const applyMasksToApiData = useCallback((data: ApiFamilyMember[]): FamilyMember[] => {
    return data.map((item) => ({
      nomeCompleto: item.nomeCompleto || '',
      escolaridade: item.escolaridade || '',
      escolaridade_other: item.escolaridade_other || '',
      grauParentesco: item.grauParentesco || '',
      grauParentesco_other: item.grauParentesco_other || '',
      dataNascimento: item.dataNascimento ? maskDate(item.dataNascimento.toString()) : '',
      profissaoAtiva: item.profissaoAtiva || '',
      estadoCivil: item.estadoCivil || '',
      salarioBruto: item.salarioBruto ? maskCurrency(item.salarioBruto.toString()) : 'R$ 0,00',
    }));
  }, []);

  const initialValues = useMemo((): FamilyCompositionInfo => {
    // Sempre começar com valores vazios para evitar problemas de estado
    return {
      composicaoFamiliar: createEmptyRows(5),
      familiaresEscola: [],
      pessoasComDeficiencia: [],
      despesasMensais: [],
    };
  }, [createEmptyRows]);

  const methods = useForm<z.infer<typeof FamilyCompositionSchema>>({
    resolver: zodResolver(FamilyCompositionSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues,
  });

  const {
    handleSubmit,
    reset,
    trigger,
    formState: { isSubmitting },
  } = methods;

  // Função para verificar se uma linha está completamente vazia
  const isRowEmpty = useCallback((row: FamilyMember, index?: number) => {
    const nome = row.nomeCompleto?.trim() || '';
    const escolaridade = row.escolaridade?.trim() || '';
    const grauParentesco = row.grauParentesco?.trim() || '';
    const dataNascimento = row.dataNascimento?.trim() || '';
    const profissaoAtiva = row.profissaoAtiva?.trim() || '';
    const estadoCivil = row.estadoCivil?.trim() || '';
    const salario = row.salarioBruto?.trim() || '';

    const isEmpty = !nome && !escolaridade && !grauParentesco && !dataNascimento &&
                    !profissaoAtiva && !estadoCivil && (!salario || salario === 'R$ 0,00');

    if (isEmpty && index !== undefined) {
      console.log(`  ⚪ Linha ${index + 1} está vazia`);
    }

    return isEmpty;
  }, []);

  // Memoizar as máscaras para cada seção
  const sectionMasks = useMemo(() => {
    const result: Record<string, Record<string, 'date' | 'currency' | 'year'>> = {};
    dynamicSections.forEach((section) => {
      const masks: Record<string, 'date' | 'currency' | 'year'> = {};
      section.fields.forEach((field) => {
        if (fieldMasksMap[field]) {
          masks[field] = fieldMasksMap[field];
        }
      });
      result[section.key] = masks;
    });
    return result;
  }, []);


  // Reset form when data from API arrives
  useEffect(() => {
    // Só inicializa uma vez quando terminar de carregar
    if (!isLoading && !hasInitialized.current) {
      hasInitialized.current = true;

      // A API está retornando um array direto, não um objeto com composicaoFamiliar
      const composicaoFamiliar = Array.isArray(existingData) ? existingData : existingData?.composicaoFamiliar || [];

      // Se não houver dados da API, usar 5 linhas default
      const finalComposicaoFamiliar = composicaoFamiliar.length > 0
        ? applyMasksToApiData(composicaoFamiliar)
        : createEmptyRows(5);

      const formDataToReset = {
        composicaoFamiliar: finalComposicaoFamiliar,
        familiaresEscola: [],
        pessoasComDeficiencia: [],
        despesasMensais: [],
      };
      reset(formDataToReset);

      // Marcar tab como concluída se há dados válidos
      if (composicaoFamiliar.length > 0) {
        markTabAsCompleted('family_composition', studentId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingData, isLoading, reset]);

  // Removed auto-save to prevent issues with multiple rows being created on reload

  const onSubmit = async (data: FamilyCompositionInfo) => {
    console.log('🔵 onSubmit chamado (função direta)');
    console.log('🔵 Total de linhas:', data.composicaoFamiliar.length);

    try {
      // Filtrar apenas linhas preenchidas (não vazias) PRIMEIRO
      console.log('🔵 Verificando quais linhas estão vazias...');
      data.composicaoFamiliar.forEach((row, idx) => {
        isRowEmpty(row, idx);
      });
      const filledRows = data.composicaoFamiliar.filter(row => !isRowEmpty(row));
      console.log('🔵 Linhas vazias removidas:', data.composicaoFamiliar.length - filledRows.length);
      console.log('🔵 Linhas preenchidas:', filledRows.length);

      // Atualizar o formulário removendo linhas vazias visualmente ANTES de validar
      console.log('🔵 Atualizando formulário visualmente com apenas linhas preenchidas...');
      reset({
        ...data,
        composicaoFamiliar: filledRows,
      });

      // Aguardar um pouco para o formulário se atualizar visualmente
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('✅ Formulário atualizado visualmente');

      // Validar todos os campos antes de prosseguir
      const isValid = await trigger();
      console.log('🔵 Validação passou?', isValid);

      if (!isValid) {
        console.log('❌ Validação falhou, retornando');
        return;
      }

      // Preparar dados filtrados sem linhas vazias (já filtrados acima)
      const filteredData = {
        ...data,
        composicaoFamiliar: filledRows,
      };

      setFormData('family_composition', {
        composicaoFamiliar: filteredData.composicaoFamiliar,
        familiaresEscola: familyCompositionData?.familiaresEscola ?? [],
        pessoasComDeficiencia: familyCompositionData?.pessoasComDeficiencia ?? [],
        despesasMensais: familyCompositionData?.despesasMensais ?? [],
      });

      const payload = {
        userInfoId: Number(studentId),
        composicaoFamiliar: filteredData.composicaoFamiliar.map((item) => {
          const processedItem: FamilyMember = { ...item };
          if (item.escolaridade === 'outros' && item.escolaridade_other) {
            processedItem.escolaridade = item.escolaridade_other;
          }

          if (item.salarioBruto) {
            processedItem.salarioBruto = item.salarioBruto.replace(/[^\d,]/g, '').replace(',', '.');
          }

          Object.keys(processedItem).forEach((key) => {
            if (key.endsWith('_other')) {
              delete processedItem[key];
            }
          });

          return processedItem;
        }),
      };

      console.log('🔵 Enviando dados para API...');
      await familyDataMutation.mutateAsync(payload);
      console.log('✅ Dados salvos com sucesso!');

      // Marcar a aba como concluída e navegar para a próxima tab (DocumentData)
      console.log('🔵 Marcando tab como concluída e navegando...');
      markTabAsCompleted('family_composition', studentId);
      setSelectedTab('required_documents');
      console.log('✅ Navegação concluída');

    } catch (error) {
      console.error('❌ Erro no processamento:', error);
      // O toast de erro já é tratado na mutation
    }
  };

  const footerMessage = useMemo(() =>
    '* Preencha os dados de todos os membros da família. As linhas em branco não serão salvas.'
  , []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados da composição familiar...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <FormProvider {...methods}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-700 text-center mx-6 mb-4">
            {label}
          </CardTitle>
          <CardDescription>
            Preencha o quadro de composição familiar com todos os dados solicitados de todos os
            membros do grupo familiar (todas as pessoas que residem no mesmo domicílio que o(a)
            candidato(a)). Inicie o preenchimento com o nome completo do(a) candidato(a).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-8">
              {dynamicSections.map((section) => {
                return (
                  <div key={section.key} className="w-full">
                    <DynamicInputSection
                      columns={section.columns}
                      fieldNames={section.fields}
                      namePrefix={section.key}
                      required={section.required}
                      fieldMasks={sectionMasks[section.key]}
                      footerMessage={footerMessage}
                      dateFields={dateFieldsMap[section.key] || []}
                      selectFields={selectFieldsMap[section.key] || []}
                      showTotalRow={section.showTotalRow}
                    />
                  </div>
                );
              })}
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
