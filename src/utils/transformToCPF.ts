export const formatCpf = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 11)

    return numericValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};