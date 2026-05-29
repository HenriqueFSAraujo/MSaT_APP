import { api } from '@/services/api';
import { Endpoints } from '@/services/endpoints';
import { toast } from '@/utils/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Status de validação do admin para uma seção do formulário do aluno.
 * Os valores são UPPERCASE para bater com o enum do backend ({@code ValidationStatusEnum}).
 */
export type ValidationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

/**
 * Seção do formulário. Bate com o enum {@code FormSectionEnum} do backend.
 */
export type FormSection =
  | 'SCHOLARSHIP_INFO'
  | 'PERSONAL_DATA'
  | 'PARENTS_DATA'
  | 'ADDRESS_INFO'
  | 'FAMILY_COMPOSITION'
  | 'REQUIRED_DOCUMENTS'
  | 'PROPERTY_RELATIONS'
  | 'CONSENT_TERMS';

export type FormValidationSection = {
  id?: number;
  userInfoId: number;
  section: FormSection;
  status: ValidationStatus;
  reviewerId?: number | null;
  reviewedAt?: string | null;
  comment?: string | null;
};

export type FormValidationSummary = {
  userInfoId: number;
  sections: FormValidationSection[];
  allApproved: boolean;
};

export type UpdateFormValidationPayload = {
  status: ValidationStatus;
  reviewerId?: number | null;
  comment?: string | null;
};

/**
 * Mapeia o valor de tab do front (lowercase com underscore) para a seção do backend.
 * Útil porque a tela usa 'scholarship_info' e o backend espera 'SCHOLARSHIP_INFO'.
 */
export const tabToSection = (tab: string): FormSection => tab.toUpperCase() as FormSection;

/**
 * Mapeia o status do backend (UPPERCASE) para o formato legado do front ('pending'/'approved'/'rejected').
 * Útil enquanto não migramos completamente todos os pontos do front.
 */
export const statusToLegacy = (status: ValidationStatus): 'pending' | 'approved' | 'rejected' => {
  switch (status) {
    case 'APPROVED':
      return 'approved';
    case 'REJECTED':
      return 'rejected';
    default:
      return 'pending';
  }
};

/**
 * Mapeia o status legado do front para o enum do backend.
 */
export const legacyToStatus = (legacy: 'approved' | 'rejected'): ValidationStatus =>
  legacy === 'approved' ? 'APPROVED' : 'REJECTED';

// ====================== Hooks ======================

/**
 * Busca o resumo de validação (8 seções + flag allApproved) de um aluno.
 *
 * Sempre retorna as 8 seções, mesmo as ainda não avaliadas (com status PENDING) — o backend
 * inicializa virtualmente no service. Useful para renderizar a sidebar de validação.
 */
export function useFormValidationStatus(userInfoId: number | null | undefined) {
  return useQuery<FormValidationSummary>({
    queryKey: ['form-validation', userInfoId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const { data } = await api.get<FormValidationSummary>(
        `${Endpoints.FormValidation.Base}/${userInfoId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return data;
    },
    enabled: !!userInfoId && userInfoId > 0,
    staleTime: 1000 * 30,
  });
}

/**
 * Atualiza o status de uma seção. O backend faz upsert (cria registro se não existir)
 * e valida que o reviewerId é admin.
 */
export function useUpdateFormValidationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-form-validation'],
    mutationFn: async (params: {
      userInfoId: number;
      section: FormSection;
      payload: UpdateFormValidationPayload;
    }) => {
      const { userInfoId, section, payload } = params;
      const token = localStorage.getItem('token');
      const { data } = await api.put<FormValidationSection>(
        `${Endpoints.FormValidation.Base}/${userInfoId}/${section}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return data;
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['form-validation', variables.userInfoId] });
    },

    onError: () => {
      toast.error('Erro ao atualizar status da seção.');
    },
  });
}
