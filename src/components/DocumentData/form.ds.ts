interface FormFieldValue {
  files?: Array<{
    value: File;
    mimeType: string;
  }>;
  option?: {
    type: 'option' | 'none';
    value: string;
  };
  // Mantém compatibilidade com versão anterior (single file)
  file?: {
    value: File;
    mimeType: string;
  };
}

export interface FormValues {
  singleRegistryRegistration: FormFieldValue | string;
  maritalStatus: FormFieldValue | string;
  identityDocuments: FormFieldValue | string;
  guardianshipDocuments: FormFieldValue | string;
  vaccinationCard: FormFieldValue | string;
  proofOfResidence: FormFieldValue | string;
  workContract: FormFieldValue | string;
  bankingRelationsReport: FormFieldValue | string;
  proofOfIncome: FormFieldValue | string;
  supportingDocumentation: FormFieldValue | string;
  bankStatements: FormFieldValue | string;
  businessDocuments: FormFieldValue | string;
  taxDocuments: FormFieldValue | string;
  meiDocuments: FormFieldValue | string;
  healthDisability: FormFieldValue | string;
  familyComposition: FormFieldValue | string;
  governmentProgram: FormFieldValue | string;
}

type DocumentOption = {
  name: string;
  label: string;
  desc?: string;
  linkLabel?: string;
  openLink?: string;
  downloadLabel?: string;
  downloadLink?: string;
  required?: boolean;
  options?: {
    value: string;
    label: string;
    description?: string;
  }[];
};

export const DOCUMENT_GROUPS: DocumentOption[][] = [
  [
    {
      name: 'singleRegistryRegistration',
      label: 'Cadastro do CAD. único',
      linkLabel: 'Disponível no link',
      openLink: 'https://meucadunico.cidadania.gov.br/meu_cadunico',
      required: true,
    },
    {
      name: 'maritalStatus',
      label: 'Estado Civil',
      desc: 'Apresentar documento que comprove o estado civil de todos os membros do grupo familiar maiores de 18 (dezoito) anos de idade',
      required: true,
    },
    {
      name: 'identityDocuments',
      label: 'Documentos de Identificação',
      desc: 'Apresentar um documento de identificação do(a) candidato(a) e de todos os membros do grupo familiar',
      required: true,
    },
  ],
  [
    {
      name: 'guardianshipDocuments',
      label: 'Apresentar (Se for o caso)',
      desc: 'Documentos legais para casos de tutela, guarda ou adoção',
    },
    {
      name: 'vaccinationCard',
      label: 'Carteira de Vacinação',
      desc: 'Carteira de vacinação atualizada do(a) candidato(a) conforme o calendário nacional',
    },
    {
      name: 'proofOfResidence',
      label: 'Comprovante de Residência',
      desc: 'Documentos que comprovam o endereço residencial atual (últimos 3 meses)',
    },
  ],
  [
    {
      name: 'workContract',
      label: 'Carteira de trabalho digital',
      desc: 'CTPS digital ou documento equivalente comprovando vínculo empregatício de todos os membros do grupo familiar maiores de 16 (dezesseis) anos de idade',
      required: true,
    },
    {
      name: 'bankingRelationsReport',
      label: 'Relatório Completo do Cadastro de Clientes (SFN)',
      desc: 'Documentos do sistema financeiro nacional sobre contas bancárias (Registrato ou Certidão Negativa)',
    },
    {
      name: 'proofOfIncome',
      label: 'Comprovante de Renda',
      desc: 'Documentos que comprovam as fontes e valores de renda (holerites, declarações, extratos, etc)',
    },
  ],
  [
    {
      name: 'supportingDocumentation',
      label: 'Documentação Comprobatória',
      desc: 'Documentos adicionais que possam ser necessários para comprovar informações',
    },
    {
      name: 'bankStatements',
      label: 'Extratos Bancários Pessoais',
      desc: 'Últimos 3 meses de contas corrente, poupança e investimentos para maiores de 18 anos',
    },
    {
      name: 'businessDocuments',
      label: 'Documentos Empresariais',
      desc: 'Documentação contábil e jurídica para comprovação de renda empresarial (ECD, PGDAS, Contrato Social, etc)',
    },
  ],
  [
    {
      name: 'taxDocuments',
      label: 'Documentos Fiscais',
      desc: 'Declarações de Imposto de Renda e comprovantes (IRPF 2024 completo ou Comprovante de Isenção)',
    },
    {
      name: 'meiDocuments',
      label: 'Microempreendedor Individual',
      desc: 'Documentação específica para Microempreendedores Individuais (MEI)',
    },
    {
      name: 'healthDisability',
      label: 'Possui doença ou deficiência?',
      desc: 'Declaração de condições de saúde que necessitem de comprovação (laudos, atestados médicos)',
    },
  ],
  [
    {
      name: 'governmentProgram',
      label: 'Acesso a programas governamentais de renda mínima',
      desc: 'Federal, Estadual ou Municipal (Bolsa Família, auxílio, etc)',
    },
  ],
];
