import { useTabStore } from '@/store/tabStore';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const useTabNavigation = (currentTab: string, form?: any) => {
    const {
        selectedTab,
        setSelectedTab,
        markTabAsCompleted,
        canNavigateToTab,
        showTabValidation
    } = useTabStore();

    const navigateToTab = async (targetTab: string) => {
        // Se validação estiver desativada, navegar livremente
        if (!showTabValidation) {
            setSelectedTab(targetTab);
            return true;
        }

        // Validar formulário atual antes de sair
        if (form) {
            const isValid = await form.trigger();
            if (!isValid) {
                toast.error('Por favor, complete os campos obrigatórios antes de continuar');
                return false;
            }
        }

        // Verificar se pode navegar para a tab de destino
        if (canNavigateToTab(targetTab)) {
            setSelectedTab(targetTab);
            return true;
        } else {
            // Se não pode navegar, verificar se é porque a tab atual não está completa
            const { completedTabs } = useTabStore.getState();
            if (!completedTabs.includes(currentTab)) {
                toast.error('Complete a tab atual antes de avançar');
            } else {
                toast.error('Não é possível navegar para esta tab no momento');
            }
            return false;
        }
    };

    const completeCurrentTab = () => {
        markTabAsCompleted(currentTab);
    };

    const navigateToNextTab = async () => {
        const TABS = [
            'scholarship_info',
            'personal_data',
            'parents_data',
            'address_info',
            'family_composition',
            'required_documents',
            'property_relations'
        ];

        const currentIndex = TABS.indexOf(currentTab);
        const nextTab = TABS[currentIndex + 1];

        // Debug: mostrar estado atual
        const { completedTabs } = useTabStore.getState();
        console.log('Debug navegação:', {
            currentTab,
            nextTab,
            completedTabs,
            canNavigate: canNavigateToTab(nextTab || ''),
            showTabValidation
        });

        if (nextTab) {
            return await navigateToTab(nextTab);
        }

        return false;
    };

    const navigateToPreviousTab = async () => {
        const TABS = [
            'scholarship_info',
            'personal_data',
            'parents_data',
            'address_info',
            'family_composition',
            'required_documents',
            'property_relations'
        ];

        const currentIndex = TABS.indexOf(currentTab);
        const previousTab = TABS[currentIndex - 1];

        if (previousTab) {
            return await navigateToTab(previousTab);
        }

        return false;
    };

    const canGoForward = () => {
        const TABS = [
            'scholarship_info',
            'personal_data',
            'parents_data',
            'address_info',
            'family_composition',
            'required_documents',
            'property_relations'
        ];

        const currentIndex = TABS.indexOf(currentTab);
        return currentIndex < TABS.length - 1;
    };

    const canGoBack = () => {
        const TABS = [
            'scholarship_info',
            'personal_data',
            'parents_data',
            'address_info',
            'family_composition',
            'required_documents',
            'property_relations'
        ];

        const currentIndex = TABS.indexOf(currentTab);
        return currentIndex > 0;
    };

    return {
        navigateToTab,
        navigateToNextTab,
        navigateToPreviousTab,
        completeCurrentTab,
        canNavigateToTab,
        canGoForward,
        canGoBack,
        showTabValidation
    };
};
