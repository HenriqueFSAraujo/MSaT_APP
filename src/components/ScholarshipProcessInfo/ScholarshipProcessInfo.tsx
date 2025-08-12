import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PostScholarshipProcess, useScholarShipData } from '@/services/queries/forms/index';
import { useTabStore } from '@/store/tabStore';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { scholarshipProcessSchema, type ScholarshipProcessForm } from './fomrData';

export function ScholarshipProcessInfo() {
  const { id: StudentId } = useParams<{ id: string }>();
  const { data } = useScholarShipData(Number(StudentId));
  const { mutate: FormSubmit } = PostScholarshipProcess();
  const { setFormData, formData } = useScholarshipFormStore();
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ScholarshipProcessForm>({
    resolver: zodResolver(scholarshipProcessSchema),
    defaultValues: {
      wantsToParticipate: undefined,
      hadScholarshipLastYear: undefined,
      previousScholarshipPercentage: undefined
    }
  });

  const hadScholarshipLastYear = watch('hadScholarshipLastYear');

  useEffect(() => {
    if (hadScholarshipLastYear === 'nao') {
      setValue('previousScholarshipPercentage', undefined);
    }
  }, [hadScholarshipLastYear, setValue]);

  useEffect(() => {
    if (data) {
      setValue('wantsToParticipate', data.vaiParticipar ? 'sim' : 'nao');
      setValue('hadScholarshipLastYear', data.jaFoiContemplado ? 'sim' : 'nao');
      if (data.percentual) {
        setValue('previousScholarshipPercentage', data.percentual.toString() as '50' | '100');
      }
    }
  }, [data, setValue]);

  const onSubmit = (formData: ScholarshipProcessForm) => {
    try {
      const payload = {
        userId: Number(StudentId),
        vaiParticipar: formData.wantsToParticipate === 'sim',
        jaFoiContemplado: formData.hadScholarshipLastYear === 'sim',
        percentual: formData.previousScholarshipPercentage ? Number(formData.previousScholarshipPercentage) : 0,
      };

      setFormData('scholarship_info', formData);
      FormSubmit(payload);
      setSelectedTab('personal_data');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadEdital = () => {
    console.log('Download Edital');
  };

  const scholarshipProcessData = formData.scholarship_info;

  useEffect(() => {
    if (scholarshipProcessData) {
      setValue('wantsToParticipate', scholarshipProcessData.wantsToParticipate);
      setValue('hadScholarshipLastYear', scholarshipProcessData.hadScholarshipLastYear);
      setValue('previousScholarshipPercentage', scholarshipProcessData.previousScholarshipPercentage);
    }
  }, [scholarshipProcessData, setValue]);

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

          <div className="space-y-4">
            <div>
              <Label className="font-bold">
                Deseja participar do Processo Seletivo de Bolsa de Estudo ano letivo 2026?*
              </Label>
              <RadioGroup
                value={watch('wantsToParticipate')}
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
                value={watch('hadScholarshipLastYear')}
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
                  value={watch('previousScholarshipPercentage')}
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
                <Button
                  type="submit"
                  disabled={
                    !watch('wantsToParticipate') ||
                    !watch('hadScholarshipLastYear') ||
                    (watch('hadScholarshipLastYear') === 'sim' && !watch('previousScholarshipPercentage'))
                  }
                >
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ScholarshipProcessInfo;
