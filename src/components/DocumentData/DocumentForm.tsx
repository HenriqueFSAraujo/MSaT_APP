import { useForm, FormProvider } from 'react-hook-form';
import { DocumentData } from './DocumentData';
import { DOCUMENT_GROUPS } from './form.ds';
import { Button } from '@/components/ui/button';
import { toast } from '@/utils/toast';
import { useTabStore } from '@/store/tabStore';
import { Card } from '@/components/ui/card';

export const DocumentForm = () => {
  const methods = useForm({
    mode: 'onChange',
  });

  const { handleSubmit } = methods;
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);

  const onSubmit = async (data: unknown) => {
    try {
      console.log('Form data:', data);
      toast.success('Etapa concluída', 'Você pode continuar sem enviar documentos.');
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
            <h2 className="text-2xl font-semibold text-gray-800">Documentos Complementares</h2>
            <p className="text-gray-600 mt-1">
              Você pode enviar os documentos disponíveis para complementar suas informações.
            </p>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800">Lista de documentos</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Selecione o tipo de documento e faça o upload dos arquivos correspondentes
                </p>
              </div>

              <div className="space-y-4">
                {DOCUMENT_GROUPS.map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-4">
                    {group.map((doc) => (
                      <DocumentData key={doc.name} label={doc.label} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Verifique se os documentos enviados estão legíveis e atualizados
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
