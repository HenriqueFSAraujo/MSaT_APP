import { useForm, FormProvider } from 'react-hook-form';
import { InputFile } from '../common/InputFile/InputFile';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

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

const REQUIRED_DOCUMENTS: (keyof FormValues)[] = [
  'cadUnicoRegistration',
  'maritalStatusProof',
  'identityDocuments',
  'residenceProof',
  'incomeProof',
  'birthCertificate',
];

const DOCUMENT_GROUPS = [
  [
    { name: 'cadUnicoRegistration', label: 'Cadastro do CAD. único' },
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
  const [submitted, setSubmitted] = useState(false);
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

  const formValues = methods.watch();

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

  const isRequiredAndEmpty = (fieldName: keyof FormValues) => {
    return REQUIRED_DOCUMENTS.includes(fieldName) && !hasValidFile(fieldName);
  };

  const onSubmit = (data: FormValues) => {
    setSubmitted(true);
    const hasError = REQUIRED_DOCUMENTS.some((field) => !hasValidFile(field));
    if (hasError) {
      return;
    }

    console.log('Submetendo documentos:', data);
    Object.entries(data).forEach(([fieldName, file]) => {
      if (file) {
        console.log(`Enviando ${fieldName}:`, file.name);
      }
    });
    alert('Documentos enviados com sucesso!');
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-6xl mx-auto bg-white p-6">
        <h1 className="text-2xl font-semibold text-gray-700 text-center  m-6">Documentos Gerais</h1>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            {DOCUMENT_GROUPS.map((group, groupIndex) => (
              <div key={`group-${groupIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {group.map(({ name, label }) => (
                  <div
                    key={name}
                    className={`border-2 rounded-lg p-2 cursor-pointer transition-colors ${
                      hasValidFile(name as keyof FormValues)
                        ? 'border-green-300 bg-green-50'
                        : submitted && isRequiredAndEmpty(name as keyof FormValues)
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                    onClick={() => handleDocumentClick(name as keyof FormValues)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-800">
                        {label}
                        {REQUIRED_DOCUMENTS.includes(name as keyof FormValues) && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </h3>
                      {hasValidFile(name as keyof FormValues) ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : submitted && isRequiredAndEmpty(name as keyof FormValues) ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : null}
                    </div>
                    <InputFile
                      name={name as keyof FormValues}
                      id={`file-input-${name as keyof FormValues}`}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    {submitted && isRequiredAndEmpty(name as keyof FormValues) && (
                      <p className="text-xs text-red-500 mt-1">Documento obrigatório</p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-end w-full">
            <Button
              type="submit"
              className="mt-4 w-35 bg-blue-400 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all"
            >
              Salvar e continuar
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};
