// utils/masks.ts
export const formatCPF = (value: string): string => {
  // Remove todos os caracteres que não são dígitos
  const digits = value.replace(/\D/g, '');

  // Aplica a máscara CPF: 999.999.999-99
  const cpfMasked = digits
    .slice(0, 11) // CPF tem 11 dígitos
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  return cpfMasked;
};

export const formatPhone = (value: string): string => {
  // Remove todos os caracteres que não são dígitos
  const digits = value.replace(/\D/g, '');

  // Aplica a máscara Telefone: (99) 99999-9999
  const phoneMasked = digits
    .slice(0, 11) // Fixo + o DDD geralmente tem 11 dígitos
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');

  return phoneMasked;
};
