import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormValidationStore } from '@/store/formValidationStore';
import { DialogConfirmReset } from './DialogConfirmReset';
import { useState } from 'react';

interface ProtectValidationChangesProps {
    children: React.ReactNode;
    studentId: string | null;
}

export const ProtectValidationChanges = ({ children, studentId }: ProtectValidationChangesProps) => {
    const [showDialog, setShowDialog] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
    const { hasChanges, reset } = useFormValidationStore();
    const navigate = useNavigate();

    // Interceptar cliques em links que podem levar para o formulário do aluno
    useEffect(() => {
        const handleNavigationAttempt = (e: Event) => {
            // Verificar se há alterações
            if (hasChanges()) {
                e.preventDefault();

                // Obter o link clicado
                const target = e.target as HTMLElement;
                const link = target.closest('a');
                if (link) {
                    const href = link.getAttribute('href');
                    if (href) {
                        setShowDialog(true);
                        setPendingNavigation(() => () => {
                            navigate(href);
                            reset();
                        });
                    }
                }
            }
        };

        // Adicionar listener para todos os links
        document.addEventListener('click', handleNavigationAttempt, true);

        return () => {
            document.removeEventListener('click', handleNavigationAttempt, true);
        };
    }, [hasChanges, reset, navigate]);

    const handleConfirmReset = () => {
        if (pendingNavigation) {
            pendingNavigation();
            setPendingNavigation(null);
        }
    };

    const handleCancel = () => {
        setShowDialog(false);
        setPendingNavigation(null);
    };

    return (
        <>
            {children}
            <DialogConfirmReset
                open={showDialog}
                onOpenChange={setShowDialog}
                onConfirm={handleConfirmReset}
            />
        </>
    );
};

