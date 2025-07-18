export const fieldMasksMap: Record<string, 'currency' | 'date'> = {
  valorMensal: 'currency',
  despesaMensal: 'currency',
  valor: 'currency',
  anoFabricacao: 'date',
};

export const dynamicSections = [
  {
    key: 'veiculos',
    title: 'Relação de Veículos:',
    columns: ['Marca/Modelo', 'Ano de Fabricação', 'Utilização'],
    fields: ['marcaModelo', 'anoFabricacao', 'utilizacao'],
    required: true,
  },
  {
    key: 'familiaresEscola',
    title: 'Familiares em outras escolas particulares:',
    columns: ['Nome', 'Escola', 'Valor da Mensal'],
    fields: ['nome', 'escola', 'valorMensal'],
    required: true,
  },
  {
    key: 'pessoasComDeficiencia',
    title: 'Pessoas com deficiência:',
    columns: ['Nome', 'Tipo de Deficiência', 'Despesa Mensal'],
    fields: ['nome', 'tipoDeficiencia', 'despesaMensal'],
    required: true,
  },
  {
    key: 'despesasMensais',
    info: 'Instrução para o preenchimento do quadro: Tipo de despesa a ser informada no campo Discriminação da despesa (ex: Aluguel, Energia elétrica, Telefone fixo e celular, Alimentação, Aquisição, Combustível, Plano de saúde, IPTU, IPVA, imposto de renda, INSS, Transporte escolar, Internet, Educação, Outro tipo de financiamento - favor especificar. Outras despesas).',
    title: 'Despesas mensais básicas:',
    columns: ['Discriminação da Despesa', 'Valores em Reais'],
    fields: ['descricao', 'valor'],
    required: true,
  },
];
