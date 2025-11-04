import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LucideIcon, Info } from 'lucide-react';
import { TooltipAction } from '../TooltipAction/TooltipAction';

type DialogActionProps = {
  textButton: string;
  textTitle: string;
  textDescription: string;
  icon?: LucideIcon;
  size?: string;
  open: boolean;
  setOpenModal: () => void;
};

export const DialogAction = ({
  textButton,
  textTitle,
  textDescription,
  icon: Icon,
  size,
  open,
  setOpenModal,
}: DialogActionProps) => {
  return (
    <>
      {Icon ? (
        <TooltipAction text="Clique aqui, para mais informações">
          <Icon
            size={Number(size) || 16}
            className="text-blue-600 hover:text-blue-700 cursor-pointer transition-colors duration-200"
            onClick={setOpenModal}
          />
        </TooltipAction>
      ) : (
        <button
          onClick={setOpenModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
        >
          {textButton}
        </button>
      )}

      <Dialog open={open} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 relative">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                {textTitle}
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Instruções:
              </h3>
              <DialogDescription className="text-sm text-blue-800 leading-relaxed">
                {textDescription}
              </DialogDescription>
            </div>
          </div>

          <div className="flex justify-end p-6 pt-0">
            <button
              onClick={setOpenModal}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Entendi
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
