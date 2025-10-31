import { useTabStore } from '@/store/tabStore';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const useTabNavigation = (currentTab: string, form?: any) => {
    const {
        selectedTab,
        setSelectedTab,
        markTabAsCompleted
    } = useTabStore();

    const navigateToTab = async (targetTab: string) => {
        // Navegar livremente entre tabs sem validação obrigatória
        setSelectedTab(targetTab);
        return true;
    };

    const completeCurrentTab = () => {
        const { currentUserId } = useTabStore.getState();
        markTabAsCompleted(currentTab, currentUserId);
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
        canGoForward,
        canGoBack
    };
};
