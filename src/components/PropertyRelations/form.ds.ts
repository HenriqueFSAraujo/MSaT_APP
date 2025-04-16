export const dynamicSections = [
  {
    key: 'vehicles',
    title: 'Relação de Veículos:',
    columns: ['Marca/Modelo', 'Ano de Fabricação', 'Utilização'],
    fields: ['model', 'year', 'usage'],
    required: true,
  },
  {
    key: 'peopleSchool',
    title: 'Familiares em outras escolas particulares:',
    columns: ['Nome', 'Escola', 'Valor da Mensal'],
    fields: ['name', 'school', 'monthlyValue'],
    required: true,
  },
  {
    key: 'peopleDeficiency',
    title: 'Pessoas com deficiência:',
    columns: ['Nome', 'Tipo de Deficiência', 'Despesa Mensal'],
    fields: ['name', 'tDeficiency', 'monthlyValue'],
    required: true,
  },
  {
    key: 'expenseBreakdown',
    info: 'Instrução para o preenchimento do quadro: Tipo de despesa a ser informada no campo Discriminação da despesa (ex: Aluguel, Energia elétrica, Telefone fixo e celular, Alimentação, Aquisição, Combustível, Plano de saúde, IPTU, IPVA, imposto de renda, INSS, Transporte escolar, Internet, Educação, Outro tipo de financiamento - favor especificar. Outras despesas).',
    title: 'Despesas mensais básicas:',
    columns: ['Discriminação da Despesa', 'Valores em Reais'],
    fields: ['expense', 'realValue'],
    required: true,
  },
];
