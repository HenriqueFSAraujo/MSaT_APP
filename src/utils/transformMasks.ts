export const formatCpf = (value: string) => {
  const numericValue = value.replace(/\D/g, '').slice(0, 11);

  return numericValue
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const maskDate = (value: string) => {
  const v = value.replace(/\D/g, '').slice(0, 8);
  if (v.length >= 5) return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
  if (v.length >= 3) return `${v.slice(0, 2)}/${v.slice(2)}`;
  if (v.length >= 1) return v;
  return '';
};

export const maskCurrency = (value: string) => {
  const v = value.replace(/\D/g, '');
  if (!v) return '';
  const n = parseInt(v, 10);
  const reais = (n / 100).toFixed(2);
  return `R$ ${Number(reais).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
};
