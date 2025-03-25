import { useForm, FormProvider } from 'react-hook-form';
import { InputFile } from '../../common/InputFile/InputFile';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

type FormValues = {
  cadUnicoRegistration: File | null;
  maritalStatusProof: File | null;
  identityDocuments: File | null;
  vaccinationCard: File | null;
  residenceProof: File | null;
  incomeProof: File | null;
  workContract: File | null;
  schoolEnrollment: File | null;
  disabilityProof: File | null;
  birthCertificate: File | null;
  deathCertificate: File | null;
  custodyDocument: File | null;
  rentalIncomeProof: File | null;
};

const DOCUMENT_GROUPS = [
  [
    { name: 'cadUnicoRegistration', label: 'CadÚnico' },
    { name: 'maritalStatusProof', label: 'Estado Civil' },
    { name: 'identityDocuments', label: 'Documentos de Identidade' },
  ],
  [
    { name: 'vaccinationCard', label: 'Carteira de Vacinação' },
    { name: 'residenceProof', label: 'Comprovante de Residência' },
    { name: 'incomeProof', label: 'Comprovante de Renda' },
  ],
  [
    { name: 'workContract', label: 'Contrato de Trabalho' },
    { name: 'schoolEnrollment', label: 'Matrícula Escolar' },
    { name: 'disabilityProof', label: 'Comprovante de Deficiência' },
  ],
  [
    { name: 'birthCertificate', label: 'Certidão de Nascimento' },
    { name: 'deathCertificate', label: 'Certidão de Óbito' },
    { name: 'custodyDocument', label: 'Guarda ou Tutela' },
  ],
  [{ name: 'rentalIncomeProof', label: 'Comprovante de Aluguel' }],
];

export const DocumentForm = () => {
  const methods = useForm<FormValues>({
    defaultValues: {
      cadUnicoRegistration: null,
      maritalStatusProof: null,
      identityDocuments: null,
      vaccinationCard: null,
      residenceProof: null,
      incomeProof: null,
      workContract: null,
      schoolEnrollment: null,
      disabilityProof: null,
      birthCertificate: null,
      deathCertificate: null,
      custodyDocument: null,
      rentalIncomeProof: null,
    },
  });

  const [formValues] = useState<FormValues>(methods.watch());

  const handleDocumentClick = (fieldName: keyof FormValues) => {
    const file = formValues[fieldName];
    if (file) {
      console.log(`Documento: ${fieldName}`);
      console.log(`Nome do arquivo: ${file.name}`);
      console.log(`Tamanho: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Tipo: ${file.type}`);
      console.log('------------------------');
    }
  };

  const hasValidFile = (fieldName: keyof FormValues) => {
    const file = formValues[fieldName];
    return file instanceof File && file.size > 0;
  };

  const onSubmit = (data: FormValues) => {
    console.log('Submetendo documentos:', data);
    // Adicione aqui a lógica para enviar os arquivos para o servidor
    Object.entries(data).forEach(([fieldName, file]) => {
      if (file) {
        console.log(`Enviando ${fieldName}:`, file.name);
        // Aqui você faria o upload real do arquivo
      }
    });
    alert('Documentos enviados com sucesso!');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Upload de Documentos</h1>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            {DOCUMENT_GROUPS.map((group, groupIndex) => (
              <div key={`group-${groupIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {group.map(({ name, label }) => (
                  <div
                    key={name}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      hasValidFile(name as keyof FormValues)
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                    onClick={() => handleDocumentClick(name as keyof FormValues)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-800">{label}</h3>
                      {hasValidFile(name as keyof FormValues) && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <InputFile
                      name={name}
                      id={`file-input-${name}`}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => methods.reset()}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Limpar Todos
            </button>

            <button
              type="submit"
              disabled={!methods.formState.isValid}
              className={`px-6 py-3 rounded-md text-sm font-medium text-white ${
                methods.formState.isValid
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Enviar Documentos
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
