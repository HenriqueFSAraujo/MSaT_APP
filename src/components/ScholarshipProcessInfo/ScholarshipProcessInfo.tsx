import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { useTabStore } from '@/store/tabStore';

type ScholarshipProcessInfoProps = {
  onNext: () => void;
  onBack: () => void;
};

export function ScholarshipProcessInfo({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onNext,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onBack,
}: ScholarshipProcessInfoProps): JSX.Element {
  // estados no componente
  const [wantsToParticipate, setWantsToParticipate] = useState<'sim' | 'nao' | ''>('');
  const [hadScholarshipLastYear, setHadScholarshipLastYear] = useState<'sim' | 'nao' | ''>('');
  const [previousScholarshipPercentage, setPreviousScholarshipPercentage] = useState<
    '50' | '100' | ''
  >('');

  const { setFormData, formData } = useScholarshipFormStore();
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);

  const handleDownloadEdital = () => {
    // TODO: Implement the download functionality when the file is available
    console.log('Download Edital');
  };

  const scholarshipProcessData = formData.scholarship_info;

  useEffect(() => {
    if (scholarshipProcessData) {
      setWantsToParticipate(scholarshipProcessData.wantsToParticipate);
      setHadScholarshipLastYear(scholarshipProcessData.hadScholarshipLastYear);
      setPreviousScholarshipPercentage(scholarshipProcessData.previousScholarshipPercentage || '');
    }
  }, [scholarshipProcessData]);

  const handleContinue = () => {
    if (wantsToParticipate !== '' && hadScholarshipLastYear !== '') {
      setFormData('scholarship_info', {
        wantsToParticipate: wantsToParticipate as 'sim' | 'nao',
        hadScholarshipLastYear: hadScholarshipLastYear as 'sim' | 'nao',
        previousScholarshipPercentage: previousScholarshipPercentage || undefined,
      });
    }

    setSelectedTab('personal_data');
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
      <CardContent className="space-y-6">
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
              value={wantsToParticipate}
              onValueChange={(value) => setWantsToParticipate(value as 'sim' | 'nao')}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="participate-yes" />
                <Label htmlFor="participate-yes">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="participate-no" />
                <Label htmlFor="participate-no">Não</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="font-bold">
              O(A) candidato(a) foi contemplado com bolsa de estudo no ano letivo de 2025 nesta
              unidade escolar?*
            </Label>
            <RadioGroup
              value={hadScholarshipLastYear}
              onValueChange={(value) => setHadScholarshipLastYear(value as 'sim' | 'nao')}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="scholarship-yes" />
                <Label htmlFor="scholarship-yes">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="scholarship-no" />
                <Label htmlFor="scholarship-no">Não</Label>
              </div>
            </RadioGroup>
          </div>

          {hadScholarshipLastYear === 'sim' && (
            <div>
              <Label className="font-bold">Percentual de bolsa de estudo concedido em 2025:*</Label>
              <RadioGroup
                value={previousScholarshipPercentage}
                onValueChange={(value) => setPreviousScholarshipPercentage(value as '50' | '100')}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="50" id="percentage-50" />
                  <Label htmlFor="percentage-50">50%</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="100" id="percentage-100" />
                  <Label htmlFor="percentage-100">100%</Label>
                </div>
              </RadioGroup>
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
                onClick={handleContinue}
                disabled={
                  !wantsToParticipate ||
                  !hadScholarshipLastYear ||
                  (hadScholarshipLastYear === 'sim' && !previousScholarshipPercentage)
                }
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ScholarshipProcessInfo;
