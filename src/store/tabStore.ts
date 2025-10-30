import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TabStore {
  selectedTab: string;
  completedTabs: string[];
  completedTabsByUserId: Record<string, string[]>; // Armazenar por userId
  currentUserId: string | null; // ID do usuário atual
  showTabValidation: boolean;
  setSelectedTab: (tab: string) => void;
  setCurrentUserId: (userId: string | null) => void;
  markTabAsCompleted: (tab: string, userId?: string | null) => void;
  canNavigateToTab: (targetTab: string) => boolean;
  toggleTabValidation: () => void;
  resetTabProgress: (userId?: string | null) => void;
  resetSpecificTab: (tab: string) => void;
  loadCompletedTabsForUser: (userId: string | null) => void;
}

// Importar TABS para validação
const TABS = [
  { value: 'scholarship_info', label: 'Processo de Bolsa' },
  { value: 'personal_data', label: 'Dados Pessoais do(a) Candidato(a)' },
  { value: 'parents_data', label: 'Dados dos Pais/Responsável Legal' },
  { value: 'address_info', label: 'Informações Habitacionais' },
  { value: 'family_composition', label: 'Composição Familiar' },
  { value: 'required_documents', label: 'Docs Necessários' },
  { value: 'property_relations', label: 'Bens e Posses' },
  { value: 'consent_terms', label: 'Termos de Consentimento' },
];

export const useTabStore = create<TabStore>()(
  persist(
    (set, get) => ({
      selectedTab: 'scholarship_info',
      completedTabs: [],
      completedTabsByUserId: {}, // Armazenar abas completas por userId
      currentUserId: null, // ID do usuário atual
      showTabValidation: false, // Toggle para ativar/desativar validação (desativado por padrão)

      setCurrentUserId: (userId: string | null) => {
        set({ currentUserId: userId });
        // Carregar abas completas para este usuário
        get().loadCompletedTabsForUser(userId);
      },

      loadCompletedTabsForUser: (userId: string | null) => {
        if (!userId) {
          set({ completedTabs: [] });
          return;
        }

        const { completedTabsByUserId } = get();
        const userCompletedTabs = completedTabsByUserId[userId] || [];
        set({ completedTabs: userCompletedTabs });
      },

      setSelectedTab: (tab: string) => {
        const { canNavigateToTab, showTabValidation } = get();

        // Se validação estiver desativada, navegar livremente
        if (!showTabValidation) {
          set({ selectedTab: tab });
          return;
        }

        // Se validação estiver ativada, verificar permissões
        if (canNavigateToTab(tab)) {
          set({ selectedTab: tab });
        }
      },

      markTabAsCompleted: (tab: string, userId?: string | null) => {
        const { currentUserId, completedTabsByUserId } = get();
        const targetUserId = userId || currentUserId;

        if (!targetUserId) {
          console.warn('markTabAsCompleted: userId não fornecido');
          return;
        }

        set((state) => {
          const userCompletedTabs = state.completedTabsByUserId[targetUserId] || [];
          const updatedUserTabs = [...new Set([...userCompletedTabs, tab])];
          
          const newCompletedTabsByUserId = {
            ...state.completedTabsByUserId,
            [targetUserId]: updatedUserTabs
          };

          // Atualizar completedTabs apenas se for o usuário atual
          const newCompletedTabs = targetUserId === state.currentUserId 
            ? updatedUserTabs 
            : state.completedTabs;

          return {
            completedTabsByUserId: newCompletedTabsByUserId,
            completedTabs: newCompletedTabs
          };
        });
      },

      canNavigateToTab: (targetTab: string) => {
        const { completedTabs, selectedTab, showTabValidation } = get();

        // Se validação estiver desativada, permitir navegação livre
        if (!showTabValidation) {
          return true;
        }

        const currentIndex = TABS.findIndex(t => t.value === selectedTab);
        const targetIndex = TABS.findIndex(t => t.value === targetTab);

        // Pode navegar para frente apenas se a tab atual estiver completa
        if (targetIndex > currentIndex) {
          return completedTabs.includes(selectedTab);
        }

        // Pode sempre voltar para trás
        return true;
      },

      toggleTabValidation: () => {
        set((state) => ({
          showTabValidation: !state.showTabValidation
        }));
      },

      resetTabProgress: (userId?: string | null) => {
        const { currentUserId } = get();
        const targetUserId = userId || currentUserId;

        if (!targetUserId) {
          set({
            selectedTab: 'scholarship_info',
            completedTabs: []
          });
          return;
        }

        set((state) => {
          const newCompletedTabsByUserId = {
            ...state.completedTabsByUserId,
            [targetUserId]: []
          };

          // Atualizar completedTabs apenas se for o usuário atual
          const newCompletedTabs = targetUserId === state.currentUserId ? [] : state.completedTabs;

          return {
            selectedTab: 'scholarship_info',
            completedTabsByUserId: newCompletedTabsByUserId,
            completedTabs: newCompletedTabs
          };
        });
      },

      resetSpecificTab: (tab: string) => {
        const { currentUserId, completedTabsByUserId } = get();

        if (!currentUserId) {
          set((state) => ({
            completedTabs: state.completedTabs.filter(t => t !== tab)
          }));
          return;
        }

        set((state) => {
          const userCompletedTabs = state.completedTabsByUserId[currentUserId] || [];
          const updatedUserTabs = userCompletedTabs.filter(t => t !== tab);
          
          const newCompletedTabsByUserId = {
            ...state.completedTabsByUserId,
            [currentUserId]: updatedUserTabs
          };

          return {
            completedTabsByUserId: newCompletedTabsByUserId,
            completedTabs: updatedUserTabs
          };
        });
      }
    }),
    {
      name: 'tab-store',
    }
  )
);
