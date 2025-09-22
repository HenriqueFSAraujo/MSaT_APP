import { useForm, FormProvider, FieldValues } from 'react-hook-form';
import { InputFile } from '../common/InputFile/InputFile';
import { AlertCircle, CheckCircle2, Download, FileCheck, XCircle, Eye, Upload } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DOCUMENT_GROUPS, FormValues } from './form.ds';
import { toast } from '@/utils/toast';
import { useTabStore } from '@/store/tabStore';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

const REQUIRED_DOCUMENTS = [
  'singleRegistryRegistration',
  'maritalStatus',
  'identityDocuments',
];

interface DocumentValidation {
  [key: string]: {
    status: 'pending' | 'approved' | 'rejected';
    validator?: string;
    comment?: string;
    validatedAt?: Date;
  };
}

export const DocumentData = ({ label }: { label: string }) => {
  const [submitted, setSubmitted] = useState(false);
  const [documentValidations, setDocumentValidations] = useState<DocumentValidation>({});
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [validationComment, setValidationComment] = useState('');

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

  const validateDocument = (documentKey: string, status: 'approved' | 'rejected') => {
    setDocumentValidations(prev => ({
      ...prev,
      [documentKey]: {
        status,
        validator: 'Admin User',
        comment: validationComment,
        validatedAt: new Date()
      }
    }));
    setValidationComment('');
    setSelectedDocument(null);
    toast.success(`Documento ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso!`);
  };

  const downloadDocument = (documentKey: string) => {
    // Aqui você implementaria a lógica de download
    toast.success(`Download do documento ${documentKey} iniciado`);
  };

  const previewDocument = (documentKey: string) => {
    // Aqui você implementaria a lógica de preview
    toast.success(`Preview do documento ${documentKey}`);
  };

  const getDocumentStatus = (documentKey: string) => {
    const validation = documentValidations[documentKey];
    if (!validation) return 'pending';
    return validation.status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">Pendente</Badge>;
    }
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

      // Marcar tab como completa apenas se o envio foi bem-sucedido
      const { markTabAsCompleted } = useTabStore.getState();
      markTabAsCompleted('required_documents');

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
            <a href="/TUTORIAIS.pdf" download>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                Em caso de dúvidas, sobre como emitir os documento basta clicar aqui!

                <Download className="mr-1 h-5 w-5 cursor-pointer" />
              </div>
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload de Documentos
              </TabsTrigger>
              <TabsTrigger value="validation" className="flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                Validação de Documentos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-8">
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
            </TabsContent>

            <TabsContent value="validation" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Validação de Documentos</h3>
                <p className="text-sm text-gray-600">
                  Aqui você pode visualizar, baixar e validar os documentos enviados pelos alunos.
                </p>

                {DOCUMENT_GROUPS.map((group, groupIndex) => (
                  <div key={`validation-group-${groupIndex}`} className="space-y-4">
                    {group.map(({ name, label, desc }) => {
                      const status = getDocumentStatus(name);
                      const hasFile = hasValidFile(name as keyof FormValues);

                      return (
                        <Card key={name} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium text-gray-800">{label}</h4>
                                {getStatusIcon(status)}
                                {getStatusBadge(status)}
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{desc}</p>

                              {documentValidations[name] && (
                                <div className="text-xs text-gray-500 space-y-1">
                                  <p>Validado por: {documentValidations[name].validator}</p>
                                  <p>Data: {documentValidations[name].validatedAt?.toLocaleDateString('pt-BR')}</p>
                                  {documentValidations[name].comment && (
                                    <p>Comentário: {documentValidations[name].comment}</p>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {hasFile && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => previewDocument(name)}
                                    className="flex items-center gap-1"
                                  >
                                    <Eye className="w-4 h-4" />
                                    Preview
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => downloadDocument(name)}
                                    className="flex items-center gap-1"
                                  >
                                    <Download className="w-4 h-4" />
                                    Download
                                  </Button>
                                </>
                              )}

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-1"
                                  >
                                    <FileCheck className="w-4 h-4" />
                                    Validar
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Validar Documento: {label}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <label className="text-sm font-medium">Comentário (opcional)</label>
                                      <textarea
                                        value={validationComment}
                                        onChange={(e) => setValidationComment(e.target.value)}
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                        rows={3}
                                        placeholder="Adicione um comentário sobre a validação..."
                                      />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setSelectedDocument(null);
                                          setValidationComment('');
                                        }}
                                      >
                                        Cancelar
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => validateDocument(name, 'rejected')}
                                      >
                                        <XCircle className="w-4 h-4 mr-1" />
                                        Rejeitar
                                      </Button>
                                      <Button
                                        onClick={() => validateDocument(name, 'approved')}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <CheckCircle2 className="w-4 h-4 mr-1" />
                                        Aprovar
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </FormProvider >
  );
};
