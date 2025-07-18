
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LucideIcon } from 'lucide-react';
import { TooltipAction } from '../TooltipAction/TooltipAction';

type DialogActionProps = {
  textButton: string;
  textTitle: string;
  textDescription: string;
  icon?: LucideIcon;
  size?: string;
  open: boolean
  setOpenModal: () => void;
};

export const DialogAction = ({
  textButton,
  textTitle,
  textDescription,
  icon: Icon,
  size,
  open,
  setOpenModal
}: DialogActionProps) => {
  return (
    <>
      {Icon ? (
        <TooltipAction text="Clique aqui, para mais informações">
          <Icon
            size={Number(size) || 16}
            className="text-orange-500 cursor-pointer"
            onClick={setOpenModal}
          />
        </TooltipAction>
      ) : (
        <button onClick={setOpenModal}>{textButton}</button>
      )}

      <Dialog open={open} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-[500px] p-1 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                {textTitle}
              </DialogTitle>
            </DialogHeader>
          </div>
          <DialogDescription className="font-semibold text-sm text-muted-foreground">
            {textDescription}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

