import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PostScholarshipProcess, useScholarShipData } from '@/services/queries/forms/index';
import { useTabStore } from '@/store/tabStore';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { useTabNavigation } from '@/hooks/useTabNavigation';
import { TabNavigation } from '@/components/TabNavigation/TabNavigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { scholarshipProcessSchema, type ScholarshipProcessForm } from './fomrData';
import FormSelect from '../common/FormSelect/FormSelect';

export function ScholarshipProcessInfo() {
  const { id: StudentId } = useParams<{ id: string }>();
  const { data } = useScholarShipData(Number(StudentId));
  const { mutateAsync: FormSubmit } = PostScholarshipProcess();
  const { setFormData, formData } = useScholarshipFormStore();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const form = useForm<ScholarshipProcessForm>({
    resolver: zodResolver(scholarshipProcessSchema),
    defaultValues: {
      segmentYearToStudy: '',
      specificGrade: '',
      wantsToParticipate: undefined,
      hadScholarshipLastYear: undefined,
      previousScholarshipPercentage: undefined
    }
  });

  const { navigateToNextTab } = useTabNavigation('scholarship_info', form);

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const hadScholarshipLastYear = watch('hadScholarshipLastYear');
  const segmentYearToStudy = watch('segmentYearToStudy');

  // Auto-save functionality
  const watchedValues = watch();

  useEffect(() => {
    // Debounce auto-save to avoid too many saves
    const timeoutId = setTimeout(() => {
      if (watchedValues && Object.keys(watchedValues).length > 0) {
        setFormData('scholarship_info', watchedValues);
      }
    }, 1000); // Save after 1 second of inactivity

    return () => clearTimeout(timeoutId);
  }, [watchedValues, setFormData]);

  const getGradeOptions = (segment: string) => {
    switch (segment) {
      case 'Educação Infantil':
        return [
          { value: 'Maternal I', label: 'Maternal I' },
          { value: 'Maternal II', label: 'Maternal II' },
          { value: 'Pré I', label: 'Pré I' },
          { value: 'Pré II', label: 'Pré II' },
        ];
      case 'Ensino Fundamental Anos Iniciais':
        return [
          { value: '1° ano', label: '1° ano' },
          { value: '2° ano', label: '2° ano' },
          { value: '3° ano', label: '3° ano' },
          { value: '4° ano', label: '4° ano' },
          { value: '5° ano', label: '5° ano' },
        ];
      case 'Ensino Fundamental Anos Finais':
        return [
          { value: '6° ano', label: '6° ano' },
          { value: '7° ano', label: '7° ano' },
          { value: '8° ano', label: '8° ano' },
          { value: '9° ano', label: '9° ano' },
        ];
      case 'Ensino Médio':
        return [
          { value: '1ª série', label: '1ª série' },
          { value: '2ª série', label: '2ª série' },
          { value: '3ª série', label: '3ª série' },
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    if (hadScholarshipLastYear === 'nao') {
      setValue('previousScholarshipPercentage', undefined);
    }
  }, [hadScholarshipLastYear, setValue]);

  // Limpar specificGrade quando segmentYearToStudy muda (exceto no carregamento inicial)
  useEffect(() => {
    // Só limpar se não estamos carregando dados iniciais E o usuário mudou manualmente
    if (!isInitialLoad && segmentYearToStudy) {
      const currentSpecificGrade = watch('specificGrade');
      // Só limpar se o grade atual não for compatível com o novo segmento
      const compatibleGrades = getGradeOptions(segmentYearToStudy);
      const isCompatible = compatibleGrades.some(option => option.value === currentSpecificGrade);

      if (!isCompatible && currentSpecificGrade) {
        setValue('specificGrade', '');
      }
    }
  }, [segmentYearToStudy, setValue, isInitialLoad, watch]);

  const scholarshipProcessData = formData.scholarship_info;

  // Carregar dados - PRIORIDADE: API > Zustand Store
  useEffect(() => {
    const currentSegment = watch('segmentYearToStudy');
    const currentGrade = watch('specificGrade');

    // Se houver dados da API e os campos estão vazios, carregar dados
    if (data && (!currentSegment || !currentGrade)) {
      // Usar setTimeout para garantir que os valores sejam definidos após todos os useEffects
      const timer = setTimeout(() => {
        // Definir AMBOS os campos ao mesmo tempo em uma única operação
        const updates: Partial<ScholarshipProcessForm> = {};

        const segmentoAno = data.segmentoAno;
        const serieAno = data.serieAno;

        if (segmentoAno) {
          updates.segmentYearToStudy = segmentoAno;
        }
        if (serieAno) {
          updates.specificGrade = serieAno;
        }

        const vaiParticipar = data.vaiParticipar;
        const jaFoiContemplado = data.jaFoiContemplado;

        updates.wantsToParticipate = vaiParticipar ? 'sim' : 'nao';
        updates.hadScholarshipLastYear = jaFoiContemplado ? 'sim' : 'nao';

        const percentual = data.percentual;
        if (percentual && percentual !== '0') {
          updates.previousScholarshipPercentage = percentual.toString() as '50' | '100';
        }

        // Definir todos os valores de uma vez
        (Object.keys(updates) as Array<keyof ScholarshipProcessForm>).forEach(key => {
          const value = updates[key];
          if (value !== undefined && value !== null && value !== '') {
            setValue(key, value as ScholarshipProcessForm[typeof key], { shouldValidate: true, shouldDirty: true, shouldTouch: true });
          }
        });

        // Só marcar como não inicial DEPOIS de definir todos os valores
        setTimeout(() => {
          setIsInitialLoad(false);
        }, 50);
      }, 150); // Aumentei o delay para 150ms

      return () => clearTimeout(timer);
    }
    // Se não houver dados da API, mas houver no store e campos vazios, usar o store
    else if (scholarshipProcessData && !data && (!currentSegment || !currentGrade)) {
      const timer = setTimeout(() => {
        if (scholarshipProcessData.segmentYearToStudy) {
          setValue('segmentYearToStudy', scholarshipProcessData.segmentYearToStudy, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        }
        if (scholarshipProcessData.specificGrade) {
          setValue('specificGrade', scholarshipProcessData.specificGrade, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        }
        if (scholarshipProcessData.wantsToParticipate) {
          setValue('wantsToParticipate', scholarshipProcessData.wantsToParticipate, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        }
        if (scholarshipProcessData.hadScholarshipLastYear) {
          setValue('hadScholarshipLastYear', scholarshipProcessData.hadScholarshipLastYear, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        }
        if (scholarshipProcessData.previousScholarshipPercentage) {
          setValue('previousScholarshipPercentage', scholarshipProcessData.previousScholarshipPercentage, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        }

        setTimeout(() => {
          setIsInitialLoad(false);
        }, 50);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [data, scholarshipProcessData, setValue, isInitialLoad, watch]);

  const onSubmit = async (formData: ScholarshipProcessForm) => {
    try {
      // Validar se todos os campos obrigatórios estão preenchidos
      const isFormValid = formData.segmentYearToStudy &&
        formData.specificGrade &&
        formData.wantsToParticipate &&
        formData.hadScholarshipLastYear &&
        (formData.hadScholarshipLastYear !== 'sim' || formData.previousScholarshipPercentage);

      if (!isFormValid) {
        return;
      }

      const payload = {
        userId: Number(StudentId),
        segmentoAno: formData.segmentYearToStudy,
        serieAno: formData.specificGrade,
        vaiParticipar: formData.wantsToParticipate === 'sim',
        jaFoiContemplado: formData.hadScholarshipLastYear === 'sim',
        percentual: formData.previousScholarshipPercentage ? Number(formData.previousScholarshipPercentage) : 0,
      };

      setFormData('scholarship_info', formData);
      await FormSubmit(payload);

      // Marcar tab como completa apenas se todos os campos estiverem preenchidos
      const { markTabAsCompleted } = useTabStore.getState();
      markTabAsCompleted('scholarship_info', StudentId);

      // Navegar para próxima tab
      await navigateToNextTab();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadEdital = () => {
    window.open('https://www.google.com', '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-700 text-center mx-6 mb-4">
          Processo Seletivo de Bolsa de Estudo - 2026
        </CardTitle>
        <CardDescription className="text-md text-muted-foreground text-center">
          Prezados pais/responsáveis legais,
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="prose">
              <p>
                Solicitamos atenção para o preenchimento do Formulário Socioeconômico do Candidato à
                Bolsa de Estudo e comprovação dos dados fornecidos por meio da documentação necessária.
                Alguns campos do Formulário são de preenchimento obrigatório, bem como o envio de alguns
                documentos. Sendo assim, sem tais preenchimentos o sistema não permite avançar para a
                próxima informação. Os campos com * são obrigatórios.
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Nos campos de documentação obrigatória (marcados com *) no Formulário Socioeconômico
                  do Candidato à Bolsa de Estudo não serão aceitos documentos repetidos ou folhas em
                  branco. Caso isso aconteça, o processo não será analisado, acarretando o indeferimento
                  da renovação/ concessão da Bolsa de Estudo para o ano letivo de 2026.
                </li>
                <li>
                  Formulário Socioeconômico do Candidato à Bolsa de Estudo preenchido parcialmente,
                  documentação incompleta e documentos ilegíveis resultarão no indeferimento da
                  renovação/ concessão da Bolsa de Estudo.
                </li>
                <li>
                  Nenhum documento será recebido após a data limite estabelecida, salvo se solicitado
                  pela Comissão de Bolsa de Estudo 2026 da Unidade Educacional.
                </li>
              </ul>
            </div>

            <div className='space-y-4'>
              <FormSelect
                name="segmentYearToStudy"
                label="Segmento a cursar em 2025:"
                required
                options={[
                  { value: 'Educação Infantil', label: 'Educação Infantil' },
                  { value: 'Ensino Fundamental Anos Iniciais', label: 'Ensino Fundamental Anos Iniciais' },
                  { value: 'Ensino Fundamental Anos Finais', label: 'Ensino Fundamental Anos Finais' },
                  { value: 'Ensino Médio', label: 'Ensino Médio' },
                ]}
                error={errors.segmentYearToStudy?.message}
              />
              {segmentYearToStudy && (
                <FormSelect
                  name="specificGrade"
                  label={`${segmentYearToStudy}:`}
                  required
                  options={getGradeOptions(segmentYearToStudy)}
                  error={errors.specificGrade?.message}
                />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label className="font-bold">
                  Deseja participar do Processo Seletivo de Bolsa de Estudo ano letivo 2026?*
                </Label>
                <RadioGroup
                  value={watch('wantsToParticipate') || ''}
                  onValueChange={(value) => setValue('wantsToParticipate', value as 'sim' | 'nao')}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sim" id="participate-yes" />
                    <Label htmlFor="participate-yes" className='cursor-pointer'>Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao" id="participate-no" />
                    <Label htmlFor="participate-no" className='cursor-pointer'>Não</Label>
                  </div>
                </RadioGroup>
                {errors.wantsToParticipate && (
                  <p className="text-sm text-red-500 mt-1">{errors.wantsToParticipate.message}</p>
                )}
              </div>

              <div>
                <Label className="font-bold">
                  O(A) candidato(a) foi contemplado com bolsa de estudo no ano letivo de 2025 nesta
                  unidade escolar?*
                </Label>
                <RadioGroup
                  value={watch('hadScholarshipLastYear') || ''}
                  onValueChange={(value) => setValue('hadScholarshipLastYear', value as 'sim' | 'nao')}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sim" id="scholarship-yes" />
                    <Label htmlFor="scholarship-yes" className='cursor-pointer'>Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao" id="scholarship-no" />
                    <Label htmlFor="scholarship-no" className='cursor-pointer'>Não</Label>
                  </div>
                </RadioGroup>
                {errors.hadScholarshipLastYear && (
                  <p className="text-sm text-red-500 mt-1">{errors.hadScholarshipLastYear.message}</p>
                )}
              </div>

              {hadScholarshipLastYear === 'sim' && (
                <div>
                  <Label className="font-bold">Percentual de bolsa de estudo concedido em 2025:*</Label>
                  <RadioGroup
                    value={watch('previousScholarshipPercentage') || ''}
                    onValueChange={(value) => setValue('previousScholarshipPercentage', value as '50' | '100')}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="50" id="percentage-50" />
                      <Label htmlFor="percentage-50" className='cursor-pointer'>50%</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="100" id="percentage-100" />
                      <Label htmlFor="percentage-100" className='cursor-pointer'>100%</Label>
                    </div>
                  </RadioGroup>
                  {errors.previousScholarshipPercentage && (
                    <p className="text-sm text-red-500 mt-1">{errors.previousScholarshipPercentage.message}</p>
                  )}
                </div>
              )}

              <div className="mt-6">
                <p className="mb-4">
                  No link abaixo consta o Edital de Divulgação do Processo Seletivo de
                  Renovação/Concessão da Bolsa de Estudo para o ano letivo de 2026, elaborado em
                  conformidade com a Lei Complementar nº187/2021 e o Decreto nº 11.791/2023. Solicitamos
                  uma leitura completa das informações.
                </p>
                <div className="flex flex-col space-y-4">
                  <Button onClick={handleDownloadEdital} variant="outline">
                    Baixar Edital de Divulgação do Processo
                  </Button>

                  <div className="w-full">
                    <div className="flex-shrink-0">
                      <TabNavigation
                        currentTab="scholarship_info"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={
                        !watch('segmentYearToStudy') ||
                        !watch('specificGrade') ||
                        !watch('wantsToParticipate') ||
                        !watch('hadScholarshipLastYear') ||
                        (watch('hadScholarshipLastYear') === 'sim' && !watch('previousScholarshipPercentage'))
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors w-full"
                    >
                      Salvar e continuar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}

export default ScholarshipProcessInfo;
