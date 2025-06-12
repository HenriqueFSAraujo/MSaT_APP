import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LucideIcon } from 'lucide-react';

type DialogActionProps = {
  textButton: string;
  textTitle: string;
  textDescription: string;
  icon?: LucideIcon;
  size?: string;
};

export const DialogAction = ({
  textButton,
  textTitle,
  textDescription,
  icon: Icon,
  size,
}: DialogActionProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {Icon ? (
          <Icon size={Number(size) || 16} className="text-orange-500 cursor-pointer" />
        ) : (
          textButton
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-blue-600 text-center m-3">
            {textTitle}
          </DialogTitle>
          <DialogDescription className="font-semibold text-sm text-muted-foreground">
            {textDescription}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
