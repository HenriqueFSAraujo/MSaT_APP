import { useForm, FormProvider, FieldValues } from 'react-hook-form';
import { InputFile } from '../common/InputFile/InputFile';
import { AlertCircle, CheckCircle2, Download, Eye, FileText } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { DOCUMENT_GROUPS, FormValues } from './form.ds';
import { toast } from '@/utils/toast';
import { useTabStore } from '@/store/tabStore';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/card';
import { PostMultipleDocumentsData, DocumentUploadPayload, useAllDocumentsList, useViewDocument } from '@/services/queries/forms/DocumentData';

const REQUIRED_DOCUMENTS = [
  'singleRegistryRegistration',
  'maritalStatus',
  'identityDocuments',
];

// Todos os tipos de documentos disponíveis
const ALL_DOCUMENT_TYPES = DOCUMENT_GROUPS.flat().map(doc => doc.name);

export const DocumentData = ({ label }: { label: string }) => {
  const { id: StudentId } = useParams<{ id: string }>();
  const [submitted, setSubmitted] = useState(false);

  const { mutate: uploadDocuments, isPending: isUploading } = PostMultipleDocumentsData();
  const { data: documentsList, refetch: refetchDocuments } = useAllDocumentsList(
    Number(StudentId),
    ALL_DOCUMENT_TYPES
  );
  const { mutate: viewDocument } = useViewDocument();

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

  // Função para obter documentos de um tipo específico
  const getDocumentsByType = (documentType: string) => {
    if (!documentsList) return [];
    return documentsList.filter(doc => doc.documentType === documentType);
  };

  const hasValidFile = (fieldName: keyof FormValues) => {
    // Se já existem documentos salvos, considerar como válido
    const savedDocuments = getDocumentsByType(fieldName);
    if (savedDocuments.length > 0) return true;

    const value = formValues[fieldName];
    if (typeof value === 'string') return false;

    // Suporte para múltiplos arquivos
    const hasFiles = value?.files && value.files.length > 0;
    // Compatibilidade com versão anterior
    const hasFile = value?.file?.value instanceof File;

    return hasFiles || hasFile;
  };

  const isRequiredAndEmpty = (fieldName: keyof FormValues) => {
    // Se já existem documentos salvos para este campo, não é obrigatório
    const savedDocuments = getDocumentsByType(fieldName);
    if (savedDocuments.length > 0) return false;

    const value = formValues[fieldName];
    if (typeof value === 'string') return REQUIRED_DOCUMENTS.includes(fieldName);

    const hasFiles = value?.files && value.files.length > 0;
    const hasFile = value?.file?.value instanceof File;
    const hasValidOption = value?.option?.value && value.option.value !== 'none';

    return (
      REQUIRED_DOCUMENTS.includes(fieldName) &&
      !hasFiles &&
      !hasFile &&
      !hasValidOption
    );
  };


  const onSubmit = async (data: FieldValues) => {
    try {
      setSubmitted(true);

      const hasError = REQUIRED_DOCUMENTS.some((fieldName) => {
        // Se já existem documentos salvos para este campo, não há erro
        const savedDocuments = getDocumentsByType(fieldName);
        if (savedDocuments.length > 0) return false;

        const fieldData = data[fieldName];

        if (!fieldData) return true;

        const hasFiles = fieldData.files && fieldData.files.length > 0;
        const hasValidFile = fieldData.file?.value instanceof File;
        const hasValidOption = fieldData.option?.value && fieldData.option.value !== 'none';

        return !(hasFiles || hasValidFile || hasValidOption);
      });

      if (hasError) {
        toast.error('Documentos incompletos', 'Por favor, complete todos os campos obrigatórios.');
        return;
      }

      if (!StudentId) {
        toast.error('Erro', 'ID do aluno não encontrado. Atualize a página e tente novamente.');
        return;
      }

      const documentsToUpload: DocumentUploadPayload[] = [];

      for (const [fieldName, fieldData] of Object.entries(data)) {
        if (!fieldData) continue;

        // Suporte para múltiplos arquivos (nova versão)
        if (fieldData.files && fieldData.files.length > 0) {
          fieldData.files.forEach((fileItem: { value: File; mimeType: string }) => {
            if (fileItem.value instanceof File) {
              documentsToUpload.push({
                file: fileItem.value,
                userId: Number(StudentId),
                documentType: fieldName, // Sempre usa o fieldName como tipo de documento
              });
            }
          });
        }
        // Compatibilidade com versão anterior (arquivo único)
        else if (fieldData.file?.value instanceof File) {
          documentsToUpload.push({
            file: fieldData.file.value,
            userId: Number(StudentId),
            documentType: fieldName, // Sempre usa o fieldName como tipo de documento
          });
        }
      }

      if (documentsToUpload.length === 0) {
        toast.error('Erro', 'Nenhum documento válido para upload.');
        return;
      }

      uploadDocuments(documentsToUpload, {
        onSuccess: () => {
          toast.success('Sucesso!', 'Documentos enviados com sucesso!');

          const { markTabAsCompleted } = useTabStore.getState();
          markTabAsCompleted('required_documents');

          // Refetch documentos após upload bem-sucedido
          refetchDocuments();

          setSelectedTab('property_relations');
        },
        onError: () => {
          toast.error('Erro no envio', 'Ocorreu um erro ao processar os documentos. Tente novamente.');
        },
      });
    } catch (error) {
      console.error('Erro no processamento:', error);
      toast.error('Erro no envio', 'Ocorreu um erro ao processar os documentos. Tente novamente.');
    }
  };

  const isError = (name: string): boolean => {
    return submitted && isRequiredAndEmpty(name as keyof FormValues);
  };

  // Função para visualizar documento
  const handleViewDocument = (documentId: number, documentType: string) => {
    if (!StudentId) return;
    viewDocument({
      documentId,
      documentType,
      userId: Number(StudentId),
    });
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

                          {/* Exibir documentos já enviados */}
                          {getDocumentsByType(name).length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs font-medium text-gray-600 mb-2">
                                Documentos enviados ({getDocumentsByType(name).length}):
                              </p>
                              <div className="space-y-2">
                                {getDocumentsByType(name).map((doc, idx) => (
                                  <div
                                    key={doc.id}
                                    className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                                  >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                      <span className="text-xs text-gray-700 truncate">
                                        {doc.nomeArquivo || doc.fileName || `Documento ${idx + 1}`}
                                      </span>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleViewDocument(doc.id, name)}
                                      className="h-7 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                      title="Visualizar documento"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

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
                    disabled={isUploading}
                    className="mt-4 w-35 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? 'Enviando...' : 'Salvar e continuar'}
                  </Button>
                </div>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
};
