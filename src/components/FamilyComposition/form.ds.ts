export const fieldMasksMap: Record<string, 'currency' | 'date' | 'year'> = {
  valorMensal: 'currency',
  despesaMensal: 'currency',
  valor: 'currency',
  anoFabricacao: 'year',
  salarioBruto: 'currency',
  dataNascimento: 'date',
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

export const maritalStatusOptions: SelectOption[] = [
  { value: 'Solteiro(a)', label: 'Solteiro(a)' },
  { value: 'Casado(a)', label: 'Casado(a)' },
  { value: 'Divorciado(a)', label: 'Divorciado(a)' },
  { value: 'Viúvo(a)', label: 'Viúvo(a)' },
  { value: 'União Estável', label: 'União Estável' },
  { value: 'Separado(a)', label: 'Separado(a)' },
];

export const kinshipOptions: SelectOption[] = [
  { value: 'Candidato(a)', label: 'Candidato(a)' },
  { value: 'Pai', label: 'Pai' },
  { value: 'Mãe', label: 'Mãe' },
  { value: 'Irmão(ã)', label: 'Irmão(ã)' },
  { value: 'Avô', label: 'Avô' },
  { value: 'Avó', label: 'Avó' },
  { value: 'Tio(a)', label: 'Tio(a)' },
  { value: 'Primo(a)', label: 'Primo(a)' },
  { value: 'Sobrinho(a)', label: 'Sobrinho(a)' },
  { value: 'Padrasto', label: 'Padrasto' },
  { value: 'Madrasta', label: 'Madrasta' },
  { value: 'Meio-irmão(ã)', label: 'Meio-irmão(ã)' },
  { value: 'Cunhado(a)', label: 'Cunhado(a)' },
  { value: 'Outros', label: 'Outros' },
];

// Add select fields mapping
export const selectFieldsMap: Record<string, string[]> = {
  composicaoFamiliar: ['escolaridade', 'estadoCivil', 'grauParentesco'],
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
    case 'estadoCivil':
      return maritalStatusOptions;
    case 'grauParentesco':
      return kinshipOptions;
    // Add more cases for other select fields as needed
    default:
      return [];
  }
};
