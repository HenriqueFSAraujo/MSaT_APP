export const fieldMasksMap: Record<string, 'currency' | 'date'> = {
  salarioBruto: 'currency',
  dataNascimento: 'date',
};

export const dynamicSections = [
  {
    key: 'composicaoFamiliar',
    title: 'Composição Familiar:',
    columns: ['Nome Completo', 'Escolaridade', 'Grau de Parentesco', 'Data de Nascimento', 'Profissão Ativa', 'Estado Civil', 'Salário Bruto'],
    fields: ['nomeCompleto', 'escolaridade', 'grauParentesco', 'dataNascimento', 'profissaoAtiva', 'estadoCivil', 'salarioBruto'],
    required: true,
  },
];
