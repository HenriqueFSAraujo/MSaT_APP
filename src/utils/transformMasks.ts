export const formatCpf = (value: string) => {
  const numericValue = value.replace(/\D/g, '').slice(0, 11);

  return numericValue
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const maskDate = (value: string) => {
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return value;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }

  if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
    const datePart = value.split('T')[0];
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  }

  const v = value.replace(/\D/g, '').slice(0, 8);

  if (v.length === 8) {
    const year = v.slice(0, 4);
    const month = v.slice(4, 6);
    const day = v.slice(6, 8);
    return `${day}/${month}/${year}`;
  }

  if (v.length > 4) return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
  if (v.length > 2) return `${v.slice(0, 2)}/${v.slice(2)}`;
  return v;
};

export function maskCurrency(value: string | number) {
  if (typeof value === 'number') {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  if (!value || value.trim() === '') {
    return 'R$ 0,00';
  }

  if (/^R\$\s?\d/.test(value)) {
    return value;
  }

  if (value.includes(',') || value.includes('.')) {
    const cleanValue = value.replace(/\./g, '').replace(',', '.');
    const number = parseFloat(cleanValue);

    if (!isNaN(number)) {
      return number.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }

  const onlyNumbers = value.replace(/\D/g, '');

  if (!onlyNumbers) {
    return 'R$ 0,00';
  }

  const number = parseInt(onlyNumbers, 10);

  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function maskCurrencyInput(value: string) {
  const onlyNumbers = value.replace(/\D/g, '');

  if (!onlyNumbers || onlyNumbers === '0') {
    return 'R$ 0,00';
  }

  const number = parseInt(onlyNumbers, 10) / 100;

  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function maskCpfCustom(cpf: string): string {
  const digits = cpf.replace(/\D/g, '');

  if (digits.length !== 11) return cpf;

  return `***.${digits.slice(3, 6)}.***-${digits.slice(9)}`;
}

export const moneyMask = (rawValue: string): (string | RegExp)[] => {
  const numbers = rawValue.replace(/\D+/g, '');

  if (numbers.length === 0) {
    return ['R', '$', ' ', /\d/, ',', /\d/, /\d/];
  }

  const amount = parseInt(numbers, 10) / 100;

  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);

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

export function parseCurrency(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  if (typeof value !== 'string') {
    return String(value);
  }

  return value
    .replace(/\s/g, '')
    .replace('R$', '')
    .replace(/\./g, '')
    .replace(',', '.');
}

