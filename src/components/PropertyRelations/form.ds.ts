export const fieldMasksMap: Record<string, 'currency' | 'date' | 'year'> = {
  valorMensal: 'currency',
  despesaMensal: 'currency',
  valor: 'currency',
  anoFabricacao: 'year',
};

export const dynamicSections = [
  {
    key: 'veiculos',
    title: 'Relação de Veículos:',
    columns: ['Marca/Modelo', 'Ano de Fabricação', 'Utilização'],
    fields: ['marcaModelo', 'anoFabricacao', 'utilizacao'],
    required: true,
    footerMessage:
      '* Informe todos os veículos da família. Caso não possua veículos, deixe uma linha em branco.',
  },
  {
    key: 'familiaresEscola',
    title: 'Familiares em outras escolas particulares:',
    columns: ['Nome', 'Escola', 'Valor da Mensal'],
    fields: ['nome', 'escola', 'valorMensal'],
    required: true,
    footerMessage:
      '* Informe apenas familiares que estudam em escolas particulares. Caso não se aplique, deixe em branco.',
  },
  {
    key: 'pessoasComDeficiencia',
    title: 'Pessoas com deficiência:',
    columns: ['Nome', 'Tipo de Deficiência', 'Despesa Mensal'],
    fields: ['nome', 'tipoDeficiencia', 'despesaMensal'],
    required: true,
    footerMessage:
      '* Informe todas as pessoas com deficiência da família e suas respectivas despesas médicas/terapêuticas.',
  },
  {
    key: 'despesasMensais',
    info: 'Instrução para o preenchimento do quadro: Tipo de despesa a ser informada no campo Discriminação da despesa (ex: Aluguel, Energia elétrica, Telefone fixo e celular, Alimentação, Aquisição, Combustível, Plano de saúde, IPTU, IPVA, imposto de renda, INSS, Transporte escolar, Internet, Educação, Outro tipo de financiamento - favor especificar. Outras despesas).',
    title: 'Despesas mensais básicas:',
    columns: ['Discriminação da Despesa', 'Valores em Reais'],
    fields: ['descricao', 'valor'],
    required: true,
    footerMessage:
      '* Preencha todas as despesas mensais básicas da família. Valores devem ser informados em reais (R$).',
  },
];
