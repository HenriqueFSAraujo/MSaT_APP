interface FormFieldValue {
  file?: {
    value: File;
    mimeType: string;
  };
  option?: {
    type: 'option' | 'none';
    value: string;
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
      required: true
    },
    {
      name: 'maritalStatus',
      label: 'Estado Civil',
      desc: 'Documentos comprobatórios do estado civil atual',
      required: true,
      options: [
        {
          value: 'marriageCertificate',
          label: 'Certidão de Casamento',
          description: 'Documento emitido pelo cartório',
        },
        {
          value: 'stableUnionCertificate',
          label: 'Certidão de União Estável',
          description: 'Reconhecida em cartório',
        },
        {
          value: 'none',
          label: 'Solteiro',
          description: 'Caso não se aplique',
        },
      ],
    },
    {
      name: 'identityDocuments',
      label: 'Documentos de Identidade',
      desc: 'Documentos oficiais com foto para identificação pessoal',
      required: true,
      options: [
        {
          value: 'idCard',
          label: 'RG',
          description: 'Carteira de Identidade original com foto recente',
        },
        {
          value: 'birthCertificate',
          label: 'Certidão de Nascimento',
          description: 'Certidão de Nascimento original',
        },
        {
          value: 'cpf',
          label: 'CPF',
          description: 'Cartão ou documento que comprove o número',
        },
        {
          value: 'driversLicense',
          label: 'CNH',
          description: 'Carteira Nacional de Habilitação válida',
        },
        {
          value: 'passport',
          label: 'Passaporte',
          description: 'Válido e dentro do prazo de validade',
        },
        {
          value: 'none',
          label: 'Não possui',
          description: 'Caso não se aplique',
        },
      ],
    },
  ],
  [
    {
      name: 'guardianshipDocuments',
      label: 'Apresentar (Se for o caso)',
      desc: 'Documentos legais para casos de tutela, guarda ou adoção',
      options: [
        {
          value: 'guardianshipDocument',
          label: 'Tutela',
          description: 'Documento judicial de tutela expedido pela Vara da Infância e Juventude',
        },
        {
          value: 'adoptionDocument',
          label: 'Adoção',
          description: 'Certidão de adoção ou documento equivalente emitido pelo cartório',
        },
        {
          value: 'custodyDocument',
          label: 'Guarda',
          description: 'Termo de guarda judicial ou escritura pública de guarda',
        },
        {
          value: 'none',
          label: 'Não se aplica',
          description:
            'Selecione esta opção caso não possua documentos de tutela, adoção ou guarda',
        },
      ],
    },
    {
      name: 'vaccinationCard',
      label: 'Carteira de Vacinação',
      desc: 'Carteira de vacinação atualizada conforme o calendário nacional',
    },
    {
      name: 'proofOfResidence',
      label: 'Comprovante de Residência',
      desc: 'Documentos que comprovam o endereço residencial atual',
      options: [
        {
          value: 'electricityBill',
          label: 'Conta de Luz',
          description: 'Últimos 3 meses',
        },
        {
          value: 'waterBill',
          label: 'Conta de Água',
          description: 'Últimos 3 meses',
        },
        {
          value: 'rentalAgreement',
          label: 'Contrato de Aluguel',
          description: 'Válido e registrado',
        },
      ],
    },
  ],
  [
    {
      name: 'workContract',
      label: 'Carteira de trabalho digital',
      desc: 'CTPS digital ou documento equivalente comprovando vínculo empregatício',
    },
    {
      name: 'bankingRelationsReport',
      label: 'Relatório Completo do Cadastro de Clientes (SFN)',
      desc: 'Documentos do sistema financeiro nacional sobre contas bancárias',
      options: [
        {
          value: 'registratoReport',
          label: 'Registrato - Relatório Completo',
          description:
            'Relatório oficial do Banco Central com todas as contas bancárias, emitido gratuitamente pelo site do Registrato',
        },
        {
          value: 'negativeCertificate',
          label: 'Certidão Negativa de Relacionamento',
          description:
            'Documento que comprova a ausência de vínculos com instituições financeiras, emitido pelo site do Banco Central',
        },
      ],
    },
    {
      name: 'proofOfIncome',
      label: 'Comprovante de Renda',
      desc: 'Documentos que comprovam as fontes e valores de renda',
      options: [
        {
          value: 'employed',
          label: 'Assalariado',
          description:
            '3 últimos holerites (6 meses se houver comissões) ou declaração do empregador',
        },
        {
          value: 'selfEmployed',
          label: 'Autônomo/Profissional Liberal',
          description: 'Declaração de renda + 3 últimos extratos bancários + CNIS',
        },
        {
          value: 'retired',
          label: 'Aposentado/Pensionista',
          description: 'Extrato dos últimos 3 benefícios do INSS',
        },
        {
          value: 'intern',
          label: 'Estagiário/Bolsista',
          description: 'Cópia do contrato de estágio/bolsa com valores',
        },
        {
          value: 'unemployed',
          label: 'Desempregado',
          description: 'Termo de rescisão + comprovante de seguro-desemprego',
        },
        {
          value: 'student',
          label: 'Estudante sem renda',
          description: 'Declaração de não renda + Carteira de Trabalho Digital',
        },
        {
          value: 'alimony',
          label: 'Pensão Alimentícia',
          description: 'Documento judicial/escritura ou declaração informal',
        },
        {
          value: 'financialSupport',
          label: 'Ajuda Financeira',
          description: 'Declaração de recebimento/repasse de valores',
        },
        {
          value: 'rentalIncome',
          label: 'Renda de Aluguéis',
          description: 'Contrato registrado + 3 comprovantes ou declaração',
        },
      ],
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
      options: [
        {
          value: 'checkingAccount',
          label: 'Conta Corrente',
          description: 'Extrato dos últimos 3 meses',
        },
        {
          value: 'savingsAccount',
          label: 'Conta Poupança',
          description: 'Extrato dos últimos 3 meses',
        },
        {
          value: 'investments',
          label: 'Investimentos',
          description: 'Extrato dos últimos 3 meses',
        },
      ],
    },
    {
      name: 'businessDocuments',
      label: 'Documentos Empresariais',
      desc: 'Documentação contábil e jurídica para comprovação de renda empresarial',
      options: [
        {
          value: 'incomeStatement',
          label: 'Declaração de Renda',
          description: 'Declaração de próprio punho com extrato bancário da empresa',
        },
        {
          value: 'ecd2023',
          label: 'ECD 2023',
          description: 'Escrituração Contábil Digital (Lucro Presumido/Real)',
        },
        {
          value: 'pgdasReceipt',
          label: 'Recibo PGDAS',
          description: 'Para empresas optantes pelo Simples Nacional',
        },
        {
          value: 'articlesOfAssociation',
          label: 'Certidão do Contrato Social',
          description: 'Certidão simplificada atualizada',
        },
        {
          value: 'cnpjCard',
          label: 'Cartão CNPJ',
          description: 'Com emissão recente (atualizado)',
        },
        {
          value: 'dctfInactive',
          label: 'DCTF Empresa Inativa',
          description: 'Declaração de Débitos Tributários Federais (jan/2023 e jan/2024)',
        },
        {
          value: 'terminationCertificate',
          label: 'Certidão de Baixa',
          description: 'Emitida pela Receita Federal para empresas baixadas',
        },
      ],
    },
  ],
  [
    {
      name: 'taxDocuments',
      label: 'Documentos Fiscais',
      desc: 'Declarações de Imposto de Renda e comprovantes',
      options: [
        {
          value: 'fullIRPF',
          label: 'IRPF Completo',
          description: 'Declaração 2024 (ano-base 2023) com todas as páginas e recibo',
        },
        {
          value: 'complementaryECD',
          label: 'ECD Complementar',
          description:
            'Escrituração Contábil Digital 2023 (se houver atividade empresarial no IRPF)',
        },
        {
          value: 'exemptionProof',
          label: 'Comprovante de Isenção',
          description: 'Para membros isentos (com consulta ao sistema da Receita Federal)',
        },
      ],
    },
    {
      name: 'meiDocuments',
      label: 'Microempreendedor Individual',
      desc: 'Documentação específica para Microempreendedores Individuais (MEI)',
    },
    {
      name: 'healthDisability',
      label: 'Possui doença ou deficiência?',
      desc: 'Declaração de condições de saúde que necessitem de comprovação',
      options: [
        {
          value: 'yes',
          label: 'Sim',
          description: 'Será necessário anexar documentos comprobatórios',
        },
        {
          value: 'none',
          label: 'Não',
          description: 'Não possui condições de saúde declaradas',
        },
      ],
    },
  ],
  [
    {
      name: 'governmentProgram',
      label: 'Acesso a programas governamentais de renda mínima',
      desc: 'Federal, Estadual ou Municipal',
      options: [
        {
          value: 'yes',
          label: 'Sim',
          description: 'Será necessário comprovar a participação no programa',
        },
        {
          value: 'none',
          label: 'Não',
          description: 'Não participa de nenhum programa atualmente',
        },
      ],
    },
  ],
];
