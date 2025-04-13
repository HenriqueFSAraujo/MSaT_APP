type RadioOption = {
  value: string;
  label: string;
};

type RadioGroup = {
  name: string;
  label: string;
  required: boolean;
  options: RadioOption[];
};

export const radioGroups: RadioGroup[] = [
  {
    name: 'propertyStatus',
    label: 'Situação do Imóvel',
    required: true,
    options: [
      { value: 'PROPRIO', label: 'Próprio' },
      { value: 'FINANCIADO', label: 'Financiado' },
      { value: 'CEDIDO', label: 'Cedido' },
      { value: 'ALUGADO', label: 'Alugado' },
      { value: 'COMPARTILHADO_COM_OUTRA_FAMILIA', label: 'Compartilhado com outra família' },
    ],
  },
  {
    name: 'propertyType',
    label: 'Tipo do Imóvel',
    required: true,
    options: [
      { value: 'CASA', label: 'Casa' },
      { value: 'APARTAMENTO', label: 'Apartamento' },
      { value: 'OUTRO', label: 'Outro' },
    ],
  },
  {
    name: 'buildingStructure',
    label: 'Estrutura Física',
    required: true,
    options: [
      { value: 'ALVENARIA', label: 'Alvenária' },
      { value: 'MADEIRA', label: 'Madeira' },
      { value: 'TAIPA', label: 'Taipa' },
    ],
  },
  {
    name: 'sewageSystem',
    label: 'Esgoto Sanitário',
    required: true,
    options: [
      { value: 'EXISTENTE', label: 'Existente' },
      { value: 'INEXISTENTE', label: 'Inexistente' },
    ],
  },
  {
    name: 'electricitySupply',
    label: 'Fornecimento de Energia Elétrica',
    required: true,
    options: [
      { value: 'COMPANHIA_EXISTENTE', label: 'Companhia Existente' },
      { value: 'INEXISTENTE', label: 'Inexistente' },
      { value: 'OUTRO', label: 'Outro' },
    ],
  },
  {
    name: 'waterSupply',
    label: 'Abastecimento de Água',
    required: true,
    options: [
      { value: 'EXISTENTE', label: 'Existente' },
      { value: 'INEXISTENTE', label: 'Inexistente' },
    ],
  },
  {
    name: 'chronicDiseasesInFamily',
    label: 'Condições de saúde - Há casos de doenças crônicas na família?',
    required: true,
    options: [
      { value: 'SIM', label: 'Sim' },
      { value: 'NAO', label: 'Não' },
    ],
  },
  {
    name: 'disabilitiesInFamily',
    label: 'Condições de saúde - Há casos deficiencia na família?',
    required: true,
    options: [
      { value: 'SIM', label: 'Sim' },
      { value: 'NAO', label: 'Não' },
    ],
  },
];
