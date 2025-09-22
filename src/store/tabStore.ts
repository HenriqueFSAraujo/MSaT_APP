import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TabStore {
  selectedTab: string;
  completedTabs: string[];
  showTabValidation: boolean;
  setSelectedTab: (tab: string) => void;
  markTabAsCompleted: (tab: string) => void;
  canNavigateToTab: (targetTab: string) => boolean;
  toggleTabValidation: () => void;
  resetTabProgress: () => void;
  resetSpecificTab: (tab: string) => void;
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
      showTabValidation: false, // Toggle para ativar/desativar validação (desativado por padrão)

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

      markTabAsCompleted: (tab: string) => {
        set((state) => ({
          completedTabs: [...new Set([...state.completedTabs, tab])]
        }));
      },

      canNavigateToTab: (targetTab: string) => {
        const { completedTabs, selectedTab, showTabValidation } = get();

        // Se validação estiver desativada, permitir navegação livre
        if (!showTabValidation) {
          return true;
        }

        const currentIndex = TABS.findIndex(t => t.value === selectedTab);
        const targetIndex = TABS.findIndex(t => t.value === targetTab);

        // Debug: mostrar informações de navegação
        console.log('Debug canNavigateToTab:', {
          selectedTab,
          targetTab,
          currentIndex,
          targetIndex,
          completedTabs,
          isCurrentTabCompleted: completedTabs.includes(selectedTab),
          isMovingForward: targetIndex > currentIndex
        });

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

      resetTabProgress: () => {
        set({
          selectedTab: 'scholarship_info',
          completedTabs: []
        });
      },

      resetSpecificTab: (tab: string) => {
        set((state) => ({
          completedTabs: state.completedTabs.filter(t => t !== tab)
        }));
      }
    }),
    {
      name: 'tab-store',
    }
  )
);
