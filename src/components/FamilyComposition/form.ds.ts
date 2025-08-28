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

export const dynamicSections = [
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
  },
];
