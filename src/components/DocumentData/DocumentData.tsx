import { useForm, FormProvider, FieldValues } from 'react-hook-form';
import { InputFile } from '../common/InputFile/InputFile';
import { AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { DOCUMENT_GROUPS, FormValues } from './form.ds';
import { toast } from '@/utils/toast';
import { useTabStore } from '@/store/tabStore';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/card';

const REQUIRED_DOCUMENTS = [
  'singleRegistryRegistration',
  'maritalStatus',
  'identityDocuments',
  // 'guardianshipDocuments',
  // 'vaccinationCard',
  // 'proofOfResidence',
  // 'workContract',
  // 'bankingRelationsReport',
  // 'proofOfIncome',
  // 'supportingDocumentation',
  // 'bankStatements',
  // 'businessDocuments',
  // 'taxDocuments',
  // 'meiDocuments',
  // 'healthDisability',
  // 'familyComposition',
  // 'governmentProgram',
];

export const DocumentData = ({ label }: { label: string }) => {
  const [submitted, setSubmitted] = useState(false);
  const methods = useForm<FormValues>({
    defaultValues: {
      singleRegistryRegistration: '',
      maritalStatus: '',
      identityDocuments: '',
      guardianshipDocuments: '',
      vaccinationCard: '',
      proofOfResidence: '',
      workContract: '',
      bankingRelationsReport: '',
      proofOfIncome: '',
      supportingDocumentation: '',
      bankStatements: '',
      businessDocuments: '',
      taxDocuments: '',
      meiDocuments: '',
      healthDisability: '',
      familyComposition: '',
      governmentProgram: '',
    },
  });
  const formValues = methods.watch();

  const setSelectedTab = useTabStore((state) => state.setSelectedTab);

  const hasValidFile = (fieldName: keyof FormValues) => {
    const value = formValues[fieldName];
    return typeof value !== 'string' && value?.file?.value instanceof File;
  };

  const isRequiredAndEmpty = (fieldName: keyof FormValues) => {
    const value = formValues[fieldName];
    return (
      REQUIRED_DOCUMENTS.includes(fieldName) &&
      !(typeof value !== 'string' && value?.file?.value) &&
      !(typeof value !== 'string' && value?.option?.value && value.option.value !== 'none')
    );
  };

  const onSubmit = async (data: FieldValues) => {
    try {
      setSubmitted(true);

      const hasError = REQUIRED_DOCUMENTS.some((fieldName) => {
        const fieldData = data[fieldName];

        if (!fieldData) return true;

        const hasValidFile = fieldData.file?.value instanceof File;

        const hasValidOption = fieldData.option?.value && fieldData.option.value !== 'none';

        return !(hasValidFile || hasValidOption);
      });

      if (hasError) {
        toast.error('Documentos incompletos', 'Por favor, complete todos os campos obrigatórios.');

        return;
      }

      const payload: Record<string, unknown> = {};

      for (const [fieldName, fieldData] of Object.entries(data)) {
        if (!fieldData) continue;

        payload[fieldName] = {};

        if (fieldData.file?.value) {
          payload[fieldName] = {
            mimeType: fieldData.file.mimeType,
            type: 'file',
            value: await convertFileToBase64(fieldData.file.value),
            ...(fieldData.option && { selectedOption: fieldData.option.value }),
          };
        } else if (fieldData.option) {
          payload[fieldName] = {
            type: fieldData.option.type,
            value: fieldData.option.value,
            ...(fieldData.option.value !== 'none' && { selectedOption: fieldData.option.value }),
          };
        }
      }

      // Exemplo de envio:
      // const response = await fetch('/api/submit', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(payload)
      // });


      toast.success('Sucesso!', 'Documentos enviados com sucesso!');
      setSelectedTab('housing_conditions');
    } catch (error) {
      console.error('Erro no processamento:', error);
      toast.error('Erro no envio', 'Ocorreu um erro ao processar os documentos. Tente novamente.');
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = () => reject(new Error('Falha na conversão do arquivo'));
      reader.readAsDataURL(file);
    });
  };

  const isError = (name: string): boolean => {
    return submitted && isRequiredAndEmpty(name as keyof FormValues);
  };

  return (
    <FormProvider {...methods}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-700 text-center mx-6 mb-4">{label}</CardTitle>
          <CardDescription className='text-md text-muted-foreground text-center'>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              Em caso de dúvidas, sobre como emitir os documento basta baixar clicando aqui
              <a href="/TUTORIAIS.pdf" download>
                <Download className="mr-1 h-5 w-5 cursor-pointer" />
              </a>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
            {DOCUMENT_GROUPS.map((group, groupIndex) => (
              <div key={`group-${groupIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {group.map(
                  ({
                    name,
                    label,
                    options,
                    desc,
                    linkLabel,
                    openLink,
                    downloadLabel,
                    downloadLink,
                  }) => (
                    <div
                      key={name}
                      className={`border-2 rounded-lg p-4 transition-colors ${hasValidFile(name as keyof FormValues)
                        ? 'border-green-300 bg-green-50'
                        : submitted && isRequiredAndEmpty(name as keyof FormValues)
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                    >
                      {/* Cabeçalho mantido igual */}
                      <div className="flex justify-between items-center mb-3">
                        <h3
                          className={`font-medium text-gray-800 ${isError(name as string) ? 'text-red-500' : ''}`}
                        >
                          {label}
                          {REQUIRED_DOCUMENTS.includes(name) && (
                            <span className={`ml-1 ${isError(name as string) ? 'text-red-500' : ''}`}>
                              *
                            </span>
                          )}
                        </h3>
                        {hasValidFile(name as keyof FormValues) ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : submitted && isRequiredAndEmpty(name as keyof FormValues) ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : null}
                      </div>

                      <InputFile
                        name={name}
                        id={`file-input-${name}`}
                        accept=".pdf"
                        disabled={formValues[name as keyof FormValues] === 'Não possui'}
                        selectOptions={options}
                        description={desc}
                        linkLabel={linkLabel}
                        openLink={openLink}
                        downloadLabel={downloadLabel}
                        downloadLink={downloadLink}
                      />

                      {submitted && isRequiredAndEmpty(name as keyof FormValues) && (
                        <p className="text-xs text-red-500 mt-2">Documento obrigatório</p>
                      )}
                    </div>
                  )
                )}
              </div>
            ))}
            <div className="flex justify-end w-full">
              <Button
                type="submit"
                className="mt-4 w-35 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors"
              >
                Salvar e continuar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
};
