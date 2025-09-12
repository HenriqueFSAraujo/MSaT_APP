export const fieldMasksMap: Record<string, 'currency' | 'date' | 'year'> = {
  valorMensal: 'currency',
  despesaMensal: 'currency',
  valor: 'currency',
  anoFabricacao: 'year',
  salarioBruto: 'currency',
};

export const dateFieldsMap: Record<string, string[]> = {
  composicaoFamiliar: ['dataNascimento'],
  familiaresEscola: [],
  pessoasComDeficiencia: [],
  despesasMensais: [],
  veiculos: [],
};

export type SelectOption = {
  value: string;
  label: string;
};

export const educationalOptions: SelectOption[] = [
  { value: 'Sem instrução/analfabeto', label: 'Sem instrução/analfabeto' },
  { value: 'Fundamental Incompleto', label: 'Fundamental Incompleto' },
  { value: 'Fundamental Completo', label: 'Fundamental Completo' },
  { value: 'Médio Incompleto', label: 'Médio Incompleto' },
  { value: 'Médio Completo', label: 'Médio Completo' },
  { value: 'Superior Incompleto', label: 'Superior Incompleto' },
  { value: 'Superior Completo', label: 'Superior Completo' },
  { value: 'Pós-graduação Incompleta', label: 'Pós-graduação Incompleta' },
  { value: 'Pós-graduação completa', label: 'Pós-graduação completa' },
  { value: 'outros', label: 'Outros' },
];

// Add select fields mapping
export const selectFieldsMap: Record<string, string[]> = {
  composicaoFamiliar: ['escolaridade'],
  familiaresEscola: [],
  pessoasComDeficiencia: [],
  despesasMensais: [],
};

export type DynamicSection = {
  key: string;
  title: string;
  columns: string[];
  fields: string[];
  required: boolean;
  footerMessage?: string;
  showTotalRow?: {
    fieldToSum: string;
    label: string;
  };
};

export const dynamicSections: DynamicSection[] = [
  {
    key: 'composicaoFamiliar',
    title: 'Composição Familiar:',
    columns: [
      'Nome Completo',
      'Escolaridade',
      'Grau de Parentesco',
      'Data de Nascimento',
      'Profissão Ativa',
      'Estado Civil',
      'Salário Bruto',
    ],
    fields: [
      'nomeCompleto',
      'escolaridade',
      'grauParentesco',
      'dataNascimento',
      'profissaoAtiva',
      'estadoCivil',
      'salarioBruto',
    ],
    required: true,
    footerMessage:
      '* Preencha os dados de todos os membros da família. As linhas em branco não serão salvas.',
    showTotalRow: {
      fieldToSum: 'salarioBruto',
      label: 'Renda Familiar Total',
    },
  },
];

// Define a mapping function to get options based on field name
export const getOptionsForField = (fieldName: string): SelectOption[] => {
  switch (fieldName) {
    case 'escolaridade':
      return educationalOptions;
    // Add more cases for other select fields as needed
    default:
      return [];
  }
};
