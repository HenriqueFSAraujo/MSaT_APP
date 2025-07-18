import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useCreateUser } from '@/services/queries/useCreateUser';
import { Label } from '@/components/ui/label';

type DialogChangeStatusUserProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: boolean
  userId?: number
};

export const DialogChangeStatusUser = ({ open, onOpenChange, status, userId }: DialogChangeStatusUserProps) => {
  const { mutate: createUser } = useCreateUser();

  const statusMessage = {
    active: {
      title: 'Ativar usuário',
      desc: 'Tem certeza que deseja ativar este usuário? Ele terá acesso ao sistema novamente.',
    },
    deactive: {
      title: 'Desativar usuário',
      desc: 'Tem certeza que deseja desativar este usuário? Ele perderá o acesso ao sistema.',
    },
  }

  const handleSave = () => {
    console.log('bom demais')
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[500px] p-0 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <UserPlus className="h-6 w-6" />
              {status === true ? statusMessage.deactive.title : statusMessage.active.title}
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {status === true ? statusMessage.deactive.desc : statusMessage.active.desc}
              </Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 m-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="px-6 bg-blue-600 hover:bg-blue-700">
            Alterar status
          </Button>
        </div>
      </DialogContent>
    </Dialog >

  );
};
