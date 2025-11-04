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
    name: 'situacaoImovel',
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
    name: 'tipoImovel',
    label: 'Tipo do Imóvel',
    required: true,
    options: [
      { value: 'CASA', label: 'Casa' },
      { value: 'APARTAMENTO', label: 'Apartamento' },
      { value: 'OUTRO', label: 'Outro' },
    ],
  },
  {
    name: 'estruturaFisica',
    label: 'Estrutura Física',
    required: true,
    options: [
      { value: 'ALVENARIA', label: 'Alvenária' },
      { value: 'MADEIRA', label: 'Madeira' },
      { value: 'TAIPA', label: 'Taipa' },
    ],
  },
  {
    name: 'esgotoSanitario',
    label: 'Esgoto Sanitário',
    required: true,
    options: [
      { value: 'EXISTENTE', label: 'Existente' },
      { value: 'INEXISTENTE', label: 'Inexistente' },
    ],
  },
  {
    name: 'fornecimentoEnergia',
    label: 'Fornecimento de Energia Elétrica',
    required: true,
    options: [
      { value: 'COMPANHIA_EXISTENTE', label: 'Companhia Existente' },
      { value: 'INEXISTENTE', label: 'Inexistente' },
      { value: 'OUTRO', label: 'Outro' },
    ],
  },
  {
    name: 'abastecimentoAgua',
    label: 'Abastecimento de Água',
    required: true,
    options: [
      { value: 'EXISTENTE', label: 'Existente' },
      { value: 'INEXISTENTE', label: 'Inexistente' },
    ],
  },
  {
    name: 'doencaCronicaFamilia',
    label: 'Condições de saúde - Há casos de doenças crônicas na família?',
    required: true,
    options: [
      { value: 'SIM', label: 'Sim' },
      { value: 'NAO', label: 'Não' },
    ],
  },
  {
    name: 'deficienciaFamilia',
    label: 'Condições de saúde - Há casos deficiencia na família?',
    required: true,
    options: [
      { value: 'SIM', label: 'Sim' },
      { value: 'NAO', label: 'Não' },
    ],
  },
];
