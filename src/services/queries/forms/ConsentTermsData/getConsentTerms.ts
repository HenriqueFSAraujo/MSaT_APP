import { api } from '@/services/api';
import { Endpoints } from '@/services/endpoints';
import { useQuery } from '@tanstack/react-query';

export function useConsentTerms(userId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['get-consent-terms', userId],
    queryFn: async () => {
      const { data } = await api.get(`${Endpoints.Forms.Consent_Terms}/${userId}`);
      return data;
    },
    enabled: (options?.enabled !== undefined ? options.enabled : !!userId),
    staleTime: 1000 * 60 * 5,
    retry: false
  });
}

