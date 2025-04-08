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
    label: '17.1 Situação do Imóvel',
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
    label: '17.2 Tipo do Imóvel',
    required: true,
    options: [
      { value: 'CASA', label: 'Casa' },
      { value: 'APARTAMENTO', label: 'Apartamento' },
      { value: 'OUTRO', label: 'Outro' },
    ],
  },
  {
    name: 'buildingStructure',
    label: '17.3 Estrutura Física',
    required: true,
    options: [
      { value: 'ALVENARIA', label: 'Alvenária' },
      { value: 'MADEIRA', label: 'Madeira' },
      { value: 'TAIPA', label: 'Taipa' },
    ],
  },
  {
    name: 'sewageSystem',
    label: '17.4 Esgoto Sanitário',
    required: true,
    options: [
      { value: 'EXISTENTE', label: 'Existente' },
      { value: 'INEXISTENTE', label: 'Inexistente' },
    ],
  },
  {
    name: 'electricitySupply',
    label: '17.5 Fornecimento de Energia Elétrica',
    required: true,
    options: [
      { value: 'COMPANHIA_EXISTENTE', label: 'Companhia Existente' },
      { value: 'INEXISTENTE', label: 'Inexistente' },
      { value: 'OUTRO', label: 'Outro' },
    ],
  },
  {
    name: 'waterSupply',
    label: '17.6 Abastecimento de Água',
    required: true,
    options: [
      { value: 'EXISTENTE', label: 'Existente' },
      { value: 'INEXISTENTE', label: 'Inexistente' },
    ],
  },
];
