import { Button } from '@/components/ui/button';
import { useTabNavigation } from '@/hooks/useTabNavigation';
import { ChevronLeft } from 'lucide-react';

interface TabNavigationProps {
    currentTab: string;
    form?: any;
    className?: string;
}

export const TabNavigation = ({ currentTab, form, className = "" }: TabNavigationProps) => {
    const {
        navigateToPreviousTab,
        canGoBack,
        showTabValidation
    } = useTabNavigation(currentTab, form);

    if (!showTabValidation || !canGoBack()) {
        return null;
    }

    return (
        <Button
            variant="outline"
            onClick={navigateToPreviousTab}
            className={`flex items-center gap-2 ${className}`}
        >
            <ChevronLeft className="w-4 h-4" />
            Voltar
        </Button>
    );
};
