import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { useForm, FormProvider } from 'react-hook-form';
import {
  FormularioSocioeconomicoData,
  formularioSocioeconomicoSchema,
  percentualOptions,
  segmentoCursar2025Options,
} from './type/formData';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '@/components/common/FormInput/FormInput';
import FormDate from '@/components/common/FormDate/FormDate';
import FormSelect from '@/components/common/FormSelect/FormSelect';
import { RadioButtonGroup } from '@/components/common/RadioButtonGroup/RadioButtonGroup';
import { Button } from '@/components/ui/button';

export default function SocioeconomicReport() {
  const methods = useForm<FormularioSocioeconomicoData>({
    mode: 'onSubmit',
    resolver: zodResolver(formularioSocioeconomicoSchema),
    defaultValues: {
      nomeAluno: '',
      dataNascimentoAluno: '',
      segmentoCursar2025: '',

      nomeResponsavel: '',
      cpfResponsavel: '',
      telefoneResponsavel: '',

      rendaBrutaFamiliar: '',
      quantidadePessoasFamilia: '',
      rendaPerCapita: '',
      rendaPerCapitaSalarioMinimo: '',

      percentualLc187: '100%',
    },
  });

  const {
    formState: { errors },
  } = methods;

  const onSubmit = (data: FormularioSocioeconomicoData) => {
    console.log('Form Data:', data);
  };

  return (
    <div className="min-h-auto bg-background">
      <div className="container mx-auto py-6 px-4">
        <div className="bg-card rounded-lg shadow-lg border">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-700 text-center mx-6 mb-4">
                PARECER TÉCNICO SOCIOECONÔMICO
              </CardTitle>
              <CardDescription className="text-md text-muted-foreground text-center">
                Processo Seletivo para Concessão de Bolsa de Estudo - Ano Letivo 2025
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                    <FormInput
                      name="nomeAluno"
                      label="Nome completo do(a) aluno(a)"
                      error={errors.nomeAluno?.message}
                      required
                    />
                    <FormDate
                      name="dataNascimentoAluno"
                      label="Data de nascimento do(a) aluno(a)"
                      error={errors.dataNascimentoAluno?.message}
                      required
                    />
                    <FormSelect
                      name="segmentoCursar2025"
                      label="Segmento a cursar em 2025"
                      description="Selecione uma das opções abaixo."
                      options={segmentoCursar2025Options}
                      error={errors.segmentoCursar2025?.message}
                      required
                    />
                    <FormInput
                      name="nomeResponsavel"
                      label="Nome completo do(a) responsável legal"
                      error={errors.nomeResponsavel?.message}
                      required
                    />
                    <FormInput
                      name="cpfResponsavel"
                      label="CPF do(a) responsável legal"
                      mask="cpf"
                      required
                    />
                    <FormInput
                      name="telefoneResponsavel"
                      label="Telefone de contato do(a) responsável legal"
                      mask="phone"
                      error={errors.telefoneResponsavel?.message}
                    />
                  </div>
                  <CardDescription className="text-md text-muted-foreground text-center my-5 bg-blue-300 text-white p-2 rounded">
                    INFORMAÇÕES SOCIOECONÔMICAS
                  </CardDescription>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                    <FormInput
                      name="rendaBrutaFamiliar"
                      label="Total da Renda Bruta Mensal Familiar"
                      mask="money"
                      required
                    />
                    <FormInput
                      name="quantidadePessoasFamilia"
                      label="Total de componentes no grupo familiar"
                      mask="money"
                      required
                    />
                    <FormInput
                      name="rendaPerCapita"
                      label="Renda per capita bruta"
                      mask="money"
                      required
                    />
                    <FormInput
                      name="rendaPerCapitaSalarioMinimo"
                      label="Renda per capita bruta em salários mínimos"
                      mask="money"
                      required
                    />
                    <RadioButtonGroup
                      name="percentualLc187"
                      label="Percentual conforme Lei Complementar 187/2021"
                      orientation="horizontal"
                      required
                      options={percentualOptions}
                    />
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
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
