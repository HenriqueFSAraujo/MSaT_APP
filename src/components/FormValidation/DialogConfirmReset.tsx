import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface DialogConfirmResetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export const DialogConfirmReset = ({ open, onOpenChange, onConfirm }: DialogConfirmResetProps) => {
    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="h-6 w-6 text-yellow-600" />
                        <DialogTitle>Perder progresso?</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2">
                        Você tem alterações não salvas na validação do formulário.
                        Ao acessar o formulário do aluno, essas alterações serão perdidas.
                        <br /><br />
                        Deseja continuar?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Continuar mesmo assim
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

