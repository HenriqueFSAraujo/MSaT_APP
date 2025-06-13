import { useForm, FormProvider } from 'react-hook-form';
import { DocumentData } from './DocumentData';
import { DOCUMENT_GROUPS } from './form.ds';
import { Button } from '@/components/ui/button';
import { toast } from '@/utils/toast';
import { useTabStore } from '@/store/tabStore';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

export const DocumentForm = () => {
    const methods = useForm({
        mode: 'onChange'
    });

    const { handleSubmit, watch } = methods;
    const setSelectedTab = useTabStore((state) => state.setSelectedTab);
    const formValues = watch();

    // Calcula o progresso baseado nos documentos obrigatórios
    const calculateProgress = () => {
        const requiredDocs = DOCUMENT_GROUPS.flat().filter(doc => doc.required);
        if (requiredDocs.length === 0) return 0;

        const completedDocs = requiredDocs.filter(doc => {
            const value = formValues[doc.name];
            return value && Object.keys(value).length > 0;
        });

        return (completedDocs.length / requiredDocs.length) * 100;
    };

    const onSubmit = async (data: any) => {
        try {
            console.log('Form data:', data);
            toast.success('Sucesso!', 'Documentos enviados com sucesso!');
            setSelectedTab('housing_conditions');
        } catch (error) {
            console.error('Erro no processamento:', error);
            toast.error('Erro no envio', 'Ocorreu um erro ao processar os documentos. Tente novamente.');
        }
    };

    return (
        <FormProvider {...methods}>
            <div className="w-full max-w-[1200px] mx-auto p-6">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">Documentação Necessária</h2>
                        <p className="text-gray-600 mt-1">
                            Por favor, envie todos os documentos necessários. Documentos marcados com * são obrigatórios.
                        </p>
                    </div>

                    <Card className="p-6">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Documentos Requeridos</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Selecione o tipo de documento e faça o upload dos arquivos correspondentes
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Progresso</span>
                                    <span className="text-gray-900 font-medium">{Math.round(calculateProgress())}%</span>
                                </div>
                                <Progress value={calculateProgress()} className="h-2" />
                            </div>

                            <div className="space-y-4">
                                {DOCUMENT_GROUPS.map((group, groupIndex) => (
                                    <div key={groupIndex} className="space-y-4">
                                        {group.map((doc) => (
                                            <DocumentData
                                                key={doc.name}
                                                label={doc.label}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Certifique-se de que todos os documentos estão legíveis e atualizados
                        </p>
                        <Button
                            type="submit"
                            onClick={handleSubmit(onSubmit)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Enviar Documentos
                        </Button>
                    </div>
                </div>
            </div>
        </FormProvider>
    );
}; 