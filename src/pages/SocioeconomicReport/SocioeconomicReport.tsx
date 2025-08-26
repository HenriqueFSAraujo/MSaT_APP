import FormDate from '@/components/common/FormDate/FormDate';
import FormInput from '@/components/common/FormInput/FormInput';
import FormSelect from '@/components/common/FormSelect/FormSelect';
import FormTextarea from '@/components/common/FormTextarea/FormTextarea';
import { RadioButtonGroup } from '@/components/common/RadioButtonGroup/RadioButtonGroup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSocioeconomic } from '@/services/queries/useSocioeconomic';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Info } from 'lucide-react';
import {
  avaliacaoOptions,
  FormularioSocioeconomicoData,
  formularioSocioeconomicoSchema,
  percentualOptions,
  segmentoCursar2025Options,
  simNaoOptions,
} from './type/formData';
import { toast } from '@/utils/toast';

export default function SocioeconomicReport() {
  const { id: StudentId } = useParams<{ id: string }>();
  const { mutate } = useSocioeconomic();
  const methods = useForm<FormularioSocioeconomicoData>({
    mode: 'onSubmit',
    resolver: zodResolver(formularioSocioeconomicoSchema),
    defaultValues: {
      nomeAluno: '',
      dataNascimentoAluno: undefined,
      segmentoCursar2025: '',
      nomeResponsavel: '',
      cpfResponsavel: '',
      telefoneResponsavel: '',
      rendaBrutaFamiliar: undefined,
      totalComponentesFamilar: undefined,
      rendaPerCapita: undefined,
      rendaPerCapitaSalarioMinimo: undefined,
      percentualLc187: undefined,
      beneficiarioProgramaRenda: undefined,
      resideProximoUnidadeEscolar: undefined,
      candidatoComDeficiencia: undefined,
      doencaGraveOuDeficienciaFamiliar: undefined,
      quantidadeMenoresDezoitoAnos: undefined,
      aspectosRelevantes: '',
      resultadoSocioeconomico: undefined,
      dataFinalizacaoParecer: new Date(),
    },
  });
  
  const rendaPerCapita = methods.watch('rendaPerCapita');
  const rendaBrutaFamiliar = methods.watch('rendaBrutaFamiliar');
  const totalComponentesFamilar = methods.watch('totalComponentesFamilar');
  
  useEffect(() => {
    if (rendaBrutaFamiliar && totalComponentesFamilar) {
      try {
        let rendaTotal = 0;
        if (typeof rendaBrutaFamiliar === 'string') {
          const valorLimpo = rendaBrutaFamiliar.replace(/[^\d.,]/g, '');
          const valorAmericano = valorLimpo.replace(/\./g, '').replace(',', '.');
          rendaTotal = parseFloat(valorAmericano) || 0;
        } else if (typeof rendaBrutaFamiliar === 'number') {
          rendaTotal = rendaBrutaFamiliar;
        }
        
        let componentes = 0;
        if (typeof totalComponentesFamilar === 'string') {
          componentes = parseInt(totalComponentesFamilar, 10) || 0;
        } else if (typeof totalComponentesFamilar === 'number') {
          componentes = totalComponentesFamilar;
        }
        
        if (rendaTotal > 0 && componentes > 0) {
          const rendaPerCapitaCalculada = rendaTotal / componentes;
          
          const rendaPerCapitaFormatada = rendaPerCapitaCalculada.toLocaleString('pt-BR', {
            style: 'currency', 
            currency: 'BRL'
          });
          
          methods.setValue('rendaPerCapita', rendaPerCapitaFormatada);
          console.log(`Renda: ${rendaTotal}, Componentes: ${componentes}, Per Capita: ${rendaPerCapitaFormatada}`);
        }
      } catch (error) {
        console.error("Erro ao calcular renda per capita:", error);
      }
    }
  }, [rendaBrutaFamiliar, totalComponentesFamilar, methods]);
  
  useEffect(() => {
    const salarioMinimo = 1518;
    
    if (rendaPerCapita !== undefined && rendaPerCapita !== null) {
      try {
        let rendaPerCapitaNumero = 0;
        
        if (typeof rendaPerCapita === 'string') {
          const valorLimpo = rendaPerCapita.replace(/[^\d.,]/g, '');
          const valorAmericano = valorLimpo.replace(/\./g, '').replace(',', '.');
          
          rendaPerCapitaNumero = parseFloat(valorAmericano) || 0;
        } else if (typeof rendaPerCapita === 'number') {
          rendaPerCapitaNumero = rendaPerCapita;
        }
        
        const rendaEmSalariosMinimos = rendaPerCapitaNumero / salarioMinimo;
        const valorFormatado = rendaEmSalariosMinimos.toFixed(4);
        
        methods.setValue('rendaPerCapitaSalarioMinimo', valorFormatado);
      } catch (error) {
        console.error("Erro ao calcular renda em salários mínimos:", error);
        methods.setValue('rendaPerCapitaSalarioMinimo', "0");
      }
    } else {
      methods.setValue('rendaPerCapitaSalarioMinimo', "0");
    }
  }, [rendaPerCapita, methods]);

  const {
    formState: { errors },
  } = methods;

  const onSubmit = (data: FormularioSocioeconomicoData) => {
    try {
      if (!data.dataNascimentoAluno) {
        toast.error('A data de nascimento do aluno é obrigatória.');
        return;
      }
      
      const getBooleanValue = (value: string | undefined): boolean => {
        if (!value) return false;
        return value === 'Sim';
      };
      
      const payload = {
        userId: Number(StudentId),
        nomeAluno: data.nomeAluno,
        dataNascimentoAluno: data.dataNascimentoAluno,
        segmentoCursar2025: data.segmentoCursar2025,
        nomeResponsavel: data.nomeResponsavel,
        cpfResponsavel: data.cpfResponsavel,
        telefoneResponsavel: data.telefoneResponsavel,
        rendaBrutaFamiliar: typeof data.rendaBrutaFamiliar === 'string' 
          ? parseFloat(data.rendaBrutaFamiliar.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.')) 
          : Number(data.rendaBrutaFamiliar),
        totalComponentesFamilar: typeof data.totalComponentesFamilar === 'string'
          ? parseInt(data.totalComponentesFamilar, 10)
          : Number(data.totalComponentesFamilar),
        rendaPerCapita: typeof data.rendaPerCapita === 'string'
          ? parseFloat(data.rendaPerCapita.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.'))
          : Number(data.rendaPerCapita),
        rendaPerCapitaSalarioMinimo: typeof data.rendaPerCapitaSalarioMinimo === 'string'
          ? parseFloat(data.rendaPerCapitaSalarioMinimo.replace(/[^\d.,]/g, '').replace(',', '.'))
          : Number(data.rendaPerCapitaSalarioMinimo || 0),
        beneficiarioProgramaRenda: getBooleanValue(data.beneficiarioProgramaRenda),
        resideProximoUnidadeEscolar: getBooleanValue(data.resideProximoUnidadeEscolar),
        candidatoComDeficiencia: getBooleanValue(data.candidatoComDeficiencia),
        doencaGraveOuDeficienciaFamiliar: data.doencaGraveOuDeficienciaFamiliar ? 
          getBooleanValue(data.doencaGraveOuDeficienciaFamiliar) : undefined,
        percentualLc187: data.percentualLc187 || '',
        quantidadeMenoresDezoitoAnos: typeof data.quantidadeMenoresDezoitoAnos === 'string' 
          ? parseInt(data.quantidadeMenoresDezoitoAnos, 10) 
          : data.quantidadeMenoresDezoitoAnos,
        aspectosRelevantes: data.aspectosRelevantes,
        resultadoSocioeconomico: data.resultadoSocioeconomico,
        dataFinalizacaoParecer: data.dataFinalizacaoParecer || new Date(),
      };
      
      console.log('Enviando dados:', payload);
      mutate(payload);
    } catch (error) {
      console.error("Erro ao processar dados do formulário:", error);
      toast.error("Ocorreu um erro ao processar os dados. Por favor, verifique os campos e tente novamente.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="min-h-auto bg-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto py-6 px-4">
        <motion.div 
          className="bg-card rounded-lg shadow-lg border"
          variants={cardVariants}
        >
          <Card>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CardHeader>
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <CardTitle className="text-2xl font-semibold text-gray-700 text-center mx-6 mb-4">
                    PARECER TÉCNICO SOCIOECONÔMICO
                  </CardTitle>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <CardDescription className="text-md text-muted-foreground text-center font-bold">
                    Processo Seletivo para Concessão de Bolsa de Estudo - Ano Letivo 2025
                  </CardDescription>
                </motion.div>
              </CardHeader>
            </motion.div>

            <CardContent>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                  <motion.div variants={sectionVariants}>
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
                  </motion.div>

                  <motion.div
                    variants={sectionVariants}
                    className="mt-8"
                  >
                    <CardDescription className="text-md text-center my-5 text-muted-foreground font-bold p-2">
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
                        name="totalComponentesFamilar"
                        label="Total de componentes no grupo familiar"
                        type='number'
                        required
                      />
                      <FormInput
                        name="rendaPerCapita"
                        label={<>Renda per capita bruta <span className="text-blue-500 font-normal text-sm">(calculado)</span></>}
                        mask="money"
                        disabled={true}
                        required
                        description={<span className="flex items-center">
                          <Info className="h-4 w-4 mr-1 text-blue-600" />
                          Renda bruta familiar ÷ total de componentes
                        </span>}
                      />
                      <FormInput
                        name="rendaPerCapitaSalarioMinimo"
                        label={<>Renda per capita bruta em salários mínimos <span className="text-blue-500 font-normal text-sm">(calculado: renda per capita/1.518)</span></>}
                        disabled={true}
                        required
                        description={<span className="flex items-center">
                          <Info className="h-4 w-4 mr-1 text-blue-600" />
                          Campo calculado automaticamente
                        </span>}
                      />
                      <RadioButtonGroup
                        name="percentualLc187"
                        label="Percentual conforme Lei Complementar 187/2021"
                        orientation="horizontal"
                        options={percentualOptions}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={sectionVariants}
                    className="mt-8"
                  >
                    <CardDescription className="text-md text-center my-5 text-muted-foreground font-bold p-2">
                      INFORMAÇÕES ADICIONAIS
                    </CardDescription>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 items-start">
                      <RadioButtonGroup
                        name="beneficiarioProgramaRenda"
                        label="Beneficiário de Programa de Transferência de Renda"
                        orientation="horizontal"
                        options={simNaoOptions}
                        required
                      />
                      <RadioButtonGroup
                        name="resideProximoUnidadeEscolar"
                        label="Reside próximo da Unidade Escolar"
                        orientation="horizontal"
                        options={simNaoOptions}
                        required
                      />
                      <RadioButtonGroup
                        name="candidatoComDeficiencia"
                        label="Candidato/Aluno com deficiência"
                        orientation="horizontal"
                        options={simNaoOptions}
                        required
                      />
                      <RadioButtonGroup
                        name="doencaGraveOuDeficienciaFamiliar"
                        label="Ocorrência de doença grave/deficiência no grupo familiar"
                        orientation="horizontal"
                        options={simNaoOptions}
                        required
                      />
                      <FormInput
                        name="quantidadeMenoresDezoitoAnos"
                        label="Quantidade de membros no grupo familiar com idade inferior a 18 anos"
                        type="number"
                      />
                      <FormTextarea
                        name="aspectosRelevantes"
                        label="Aspectos relevantes"
                        description="Adicione uma descrição detalhada"
                        withMarginTop={false}
                      />
                      <RadioButtonGroup
                        name="resultadoSocioeconomico"
                        label="Ocorrência de doença grave/deficiência no grupo familiar"
                        orientation="horizontal"
                        options={avaliacaoOptions}
                      />
                      <FormDate
                        name="dataFinalizacaoParecer"
                        label="Data da finalização do parecer"
                        error={errors.dataFinalizacaoParecer?.message}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex justify-end pt-6"
                    variants={sectionVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="mt-4 w-35 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors"
                    >
                      Salvar e continuar
                    </Button>
                  </motion.div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
