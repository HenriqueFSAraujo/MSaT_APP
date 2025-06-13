import { useState } from 'react';
import axios from 'axios';

interface AddressData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean; // Optional property to handle error responses
}

export const useViaCep = () => {
  const [address, setAddress] = useState<AddressData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddress = async (cep: string): Promise<AddressData | null> => {
    setLoading(true);
    setError(null);

    try {
      const sanitizedCep = cep.trim().replace(/\D/g, '');
      if (sanitizedCep.length !== 8) {
        throw new Error('CEP inválido. Certifique-se de que possui 8 dígitos.');
      }

      const response = await axios.get<AddressData>(
        `https://viacep.com.br/ws/${sanitizedCep}/json/`
      );

      if (response.data.erro) {
        throw new Error('CEP não encontrado.');
      }

      setAddress(response.data);
      return response.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Erro ao buscar o endereço.');
      } else {
        setError('Erro ao buscar o endereço.');
      }
      setAddress(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { address, loading, error, fetchAddress };
};
