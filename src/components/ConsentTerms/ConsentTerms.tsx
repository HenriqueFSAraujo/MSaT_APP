import { useTabStore } from '@/store/tabStore';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { TabNavigation } from '@/components/TabNavigation/TabNavigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { formatCpf } from '@/utils/transformMasks';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { consentTermsSchema, ConsentTermsType } from './type/formData';
import { useConsentTerms, PostConsentTerms } from '@/services/queries/forms';

export const ConsentTerms = ({ label }: { label: string }) => {
    const { setFormData, formData } = useScholarshipFormStore();
    const { resetSpecificTab } = useTabStore();
    const { id: StudentId } = useParams<{ id: string }>();
    const userId = StudentId ? parseInt(StudentId, 10) : 0;
    const [hasLoadedFromAPI, setHasLoadedFromAPI] = useState(false);

    const { data: consentTermsData } = useConsentTerms(userId, { enabled: !!userId });
    const { mutate: FormSubmit } = PostConsentTerms();

    const methods = useForm<ConsentTermsType>({
        resolver: zodResolver(consentTermsSchema),
        defaultValues: {
            declaranteNome: '',
            declaranteRG: '',
            declaranteCPF: '',
            alunoNome: '',
            aceitaTermos: false,
            ...(formData.consent_terms as Partial<ConsentTermsType>),
        },
    });

    const { errors } = methods.formState;
    const { watch } = methods;
    const aceitaTermos = watch('aceitaTermos');

    const watchedValues = watch();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (watchedValues && Object.keys(watchedValues).length > 0) {
                const hasAnyValue = Object.values(watchedValues).some(
                    value => value !== '' && value !== undefined && value !== null && value !== false
                );

                if (hasAnyValue) {
                    setFormData('consent_terms', watchedValues);
                }
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [watchedValues, setFormData]);

    const maskRG = (value: string) => {
        const numericValue = value.replace(/\D/g, '').slice(0, 9);
        return numericValue.replace(/(\d{6})(\d)/, '$1-$2');
    };

    useEffect(() => {
        if (consentTermsData && !hasLoadedFromAPI) {
            const formDataFromAPI = {
                declaranteNome: consentTermsData.nomeDeclarante || '',
                declaranteRG: consentTermsData.rgDeclarante || '',
                declaranteCPF: consentTermsData.cpfDeclarante || '',
                alunoNome: consentTermsData.nomeAluno || '',
                aceitaTermos: consentTermsData.aceiteTermos || false,
            };

            const hasAllRequiredFields =
                formDataFromAPI.declaranteNome &&
                formDataFromAPI.declaranteRG &&
                formDataFromAPI.declaranteCPF &&
                formDataFromAPI.alunoNome &&
                formDataFromAPI.aceitaTermos;

            if (!hasAllRequiredFields) {
                resetSpecificTab('consent_terms');
            }

            methods.reset({
                ...methods.getValues(),
                ...formDataFromAPI,
            });
            setHasLoadedFromAPI(true);
        }
    }, [consentTermsData, methods, hasLoadedFromAPI, resetSpecificTab]);

    useEffect(() => {
        if (formData.consent_terms && !hasLoadedFromAPI) {
            const storeData = formData.consent_terms;
            const currentValues = methods.getValues();

            methods.reset({
                ...currentValues,
                ...storeData,
            });
        }
    }, [formData.consent_terms, methods, hasLoadedFromAPI]);

    useEffect(() => {
        if (formData.personal_data) {
            const personalData = formData.personal_data;
            const currentValues = methods.getValues();

            if (personalData.fullName && !currentValues.declaranteNome) {
                methods.setValue('declaranteNome', personalData.fullName);
            }
            if (personalData.fullName && !currentValues.alunoNome) {
                methods.setValue('alunoNome', personalData.fullName);
            }
            if (personalData.rg && !currentValues.declaranteRG) {
                methods.setValue('declaranteRG', personalData.rg);
            }
            if (personalData.cpf && !currentValues.declaranteCPF) {
                methods.setValue('declaranteCPF', personalData.cpf);
            }
        }
    }, [formData.personal_data, methods]);

    useEffect(() => {
        const { completedTabs } = useTabStore.getState();

        const hasAllRequiredFields =
            watchedValues.declaranteNome &&
            watchedValues.declaranteRG &&
            watchedValues.declaranteCPF &&
            watchedValues.alunoNome &&
            watchedValues.aceitaTermos;

        if (completedTabs.includes('consent_terms') && !hasAllRequiredFields) {
            resetSpecificTab('consent_terms');
        }
    }, [watchedValues, resetSpecificTab]);

    const onSubmit = async (formValues: ConsentTermsType) => {
        const isValid = await methods.trigger();
        if (!isValid) return;

        const hasAllRequiredFields =
            formValues.declaranteNome &&
            formValues.declaranteRG &&
            formValues.declaranteCPF &&
            formValues.alunoNome &&
            formValues.aceitaTermos;

        if (!hasAllRequiredFields) {
            return;
        }

        if (!userId) {
            console.error('UserId não encontrado');
            return;
        }

        try {
            setFormData('consent_terms', formValues);

            const { markTabAsCompleted } = useTabStore.getState();
            markTabAsCompleted('consent_terms', StudentId || null);

            const payload = {
                nomeDeclarante: formValues.declaranteNome,
                rgDeclarante: formValues.declaranteRG,
                cpfDeclarante: formValues.declaranteCPF,
                nomeAluno: formValues.alunoNome,
                aceiteTermos: formValues.aceitaTermos,
                userId: userId,
            };

            FormSubmit(payload);

            console.log('Processo finalizado com sucesso!');

        } catch (error) {
            console.error(error);
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
                    <div className="max-w-4xl mx-auto bg-white p-6">
                        <form onSubmit={methods.handleSubmit(onSubmit)}>
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        Declaração 1
                                    </h3>

                                    <div className="bg-gray-50 p-6 rounded-lg border">
                                        <div className="text-sm text-gray-700 leading-relaxed">
                                            <span>Eu, </span>
                                            <input
                                                {...methods.register('declaranteNome')}
                                                placeholder="Nome do declarante"
                                                className="inline-block w-48 px-2 py-1 border-b border-gray-400 bg-transparent focus:outline-none focus:border-blue-500 text-center"
                                                required
                                            />
                                            <span>, portador do RG </span>
                                            <input
                                                {...methods.register('declaranteRG')}
                                                placeholder="RG"
                                                className="inline-block w-32 px-2 py-1 border-b border-gray-400 bg-transparent focus:outline-none focus:border-blue-500 text-center"
                                                onChange={(e) => {
                                                    const maskedValue = maskRG(e.target.value);
                                                    methods.setValue('declaranteRG', maskedValue);
                                                }}
                                                required
                                            />
                                            <span>, CPF </span>
                                            <input
                                                {...methods.register('declaranteCPF')}
                                                placeholder="CPF"
                                                className="inline-block w-32 px-2 py-1 border-b border-gray-400 bg-transparent focus:outline-none focus:border-blue-500 text-center"
                                                onChange={(e) => {
                                                    const maskedValue = formatCpf(e.target.value);
                                                    methods.setValue('declaranteCPF', maskedValue);
                                                }}
                                                required
                                            />
                                            <span>, responsável legal do(a) aluno(a) candidato(a) </span>
                                            <input
                                                {...methods.register('alunoNome')}
                                                placeholder="Nome do aluno"
                                                className="inline-block w-48 px-2 py-1 border-b border-gray-400 bg-transparent focus:outline-none focus:border-blue-500 text-center"
                                                required
                                            />
                                            <span>, declaro para os devidos fins e sob as penas da Lei que as informações aqui prestadas são verdadeiras e por elas me responsabilizo.
                                                Estou ciente que efetuando a inscrição para Processo Seletivo de Bolsa de Estudo ano 2026, por meio deste sistema,
                                                não tenho quaisquer garantia de concessão de percentual de bolsa de estudo, não gerando assim direito adquirido ou
                                                expectativa de direito ao/a candidato(a) que porventura não seja beneficiado(a) com a bolsa de estudo.</span>
                                        </div>

                                        {formData.personal_data && (
                                            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                                                ℹ️ Os campos foram preenchidos automaticamente com os dados da aba "Dados Pessoais".
                                                Você pode editá-los se necessário.
                                            </div>
                                        )}

                                        <div className="mt-4 space-y-1">
                                            {errors.declaranteNome && (
                                                <p className="text-sm text-red-500">Nome do declarante é obrigatório</p>
                                            )}
                                            {errors.declaranteRG && (
                                                <p className="text-sm text-red-500">RG do declarante é obrigatório</p>
                                            )}
                                            {errors.declaranteCPF && (
                                                <p className="text-sm text-red-500">CPF do declarante é obrigatório</p>
                                            )}
                                            {errors.alunoNome && (
                                                <p className="text-sm text-red-500">Nome do(a) aluno(a) é obrigatório</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        Declaração 2
                                    </h3>

                                    <div className="bg-gray-50 p-6 rounded-lg border">
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            O(a) responsável legal e/ou financeiro(a) pelo aluno(a) e o representante da Unidade Educacional estão
                                            cientificados que os dados pessoais e os dados sensíveis, fornecidos durante o Processo Seletivo de Bolsa de Estudo,
                                            são requisitos essenciais e de uso exclusivo para a participação no Programa de Bolsa de Estudo para o ano letivo de 2026.
                                            Destarte, é expressamente autorizado pelo responsável legal e/ou financeiro pelo aluno (titular dos dados) que o
                                            representante da Unidade Educacional possa coletar, armazenar, processar e tratar os dados do aluno e do grupo familiar.
                                            A Unidade Educacional compromete-se a coletar, armazenar, processar e tratar os dados pessoais, sensíveis, nos termos da
                                            Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais) e com confidencialidade, limitando o compartilhamento de dados
                                            exclusivamente nos casos em que houver objetivos educacionais, implicando na manutenção da segurança do aluno e do seu
                                            grupo familiar, mediante assinatura de termos de autorizações prévias e específicas.
                                        </p>
                                    </div>

                                    <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <Checkbox
                                            id="aceitaTermos"
                                            checked={aceitaTermos}
                                            onCheckedChange={(checked) => methods.setValue('aceitaTermos', checked as boolean)}
                                            className="mt-1"
                                        />
                                        <div className="space-y-1">
                                            <label
                                                htmlFor="aceitaTermos"
                                                className="text-sm font-medium text-gray-900 cursor-pointer"
                                            >
                                                Declaro que li e aceito os termos de consentimento acima *
                                            </label>
                                            {errors.aceitaTermos && (
                                                <p className="text-sm text-red-500">{errors.aceitaTermos.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center w-full mt-8 gap-4">
                                <div className="flex-shrink-0">
                                    <TabNavigation
                                        currentTab="consent_terms"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={!aceitaTermos}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors"
                                >
                                    Finalizar Processo
                                </Button>
                            </div>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </FormProvider>
    );
};
