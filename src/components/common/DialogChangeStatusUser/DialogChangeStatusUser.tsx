import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { useNavigate } from 'react-router-dom';

type DialogChangeStatusUserProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DialogChangeStatusUser = ({ open, onOpenChange }: DialogChangeStatusUserProps) => {
  const navigate = useNavigate();

  const LogOut = () => {
    useAuthStore.getState().clearAuthData();
    useScholarshipFormStore.getState().clearFormData();
    navigate('/');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[500px] p-0 overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              Confirmar Logout
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente para
                acessar os recursos.
              </Label>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6">
                Cancelar
              </Button>
              <Button onClick={LogOut} className="px-6 bg-blue-600 hover:bg-blue-700">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
