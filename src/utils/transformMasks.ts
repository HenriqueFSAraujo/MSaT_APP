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

export function maskCurrency(value: string) {
  const onlyNumbers = value.replace(/\D/g, '');

  if (!onlyNumbers) return '';

  const number = parseInt(onlyNumbers, 10);

  const numberFloat = number / 100;

  return numberFloat.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function maskCpfCustom(cpf: string): string {
  const digits = cpf.replace(/\D/g, '');

  if (digits.length !== 11) return cpf;

  return `***.${digits.slice(3, 6)}.***-${digits.slice(9)}`;
}

export const moneyMask = (rawValue: string): (string | RegExp)[] => {
  // Remove tudo que não é dígito
  const numbers = rawValue.replace(/\D+/g, '');

  // Se não tem valor, retorna máscara inicial
  if (numbers.length === 0) {
    return ['R', '$', ' ', /\d/, ',', /\d/, /\d/];
  }

  // Converte para número e divide em reais e centavos
  const amount = parseInt(numbers, 10) / 100;

  // Formata o valor como string no formato monetário
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);

  // Converte a string formatada em uma máscara
  const mask: (string | RegExp)[] = [];
  for (let i = 0; i < formattedValue.length; i++) {
    const char = formattedValue[i];
    if (/\d/.test(char)) {
      mask.push(/\d/);
    } else {
      mask.push(char);
    }
  }

  return mask;
};
