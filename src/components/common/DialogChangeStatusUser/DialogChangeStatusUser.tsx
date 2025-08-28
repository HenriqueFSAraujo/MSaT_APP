import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useCreateUser } from '@/services/queries/useCreateUser';
import { AnimatePresence, motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

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

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[500px] p-0 overflow-hidden">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="bg-gradient-to-r from-blue-600 to-blue-700 p-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                    <UserPlus className="h-6 w-6" />
                    {status === true ? statusMessage.deactive.title : statusMessage.active.title}
                  </DialogTitle>
                </motion.div>
              </DialogHeader>
            </motion.div>

            <motion.div 
              className="p-6"
              variants={itemVariants}
            >
              <motion.div 
                className="space-y-4"
                variants={itemVariants}
              >
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label className="text-sm font-medium">
                    {status === true ? statusMessage.deactive.desc : statusMessage.active.desc}
                  </Label>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="flex justify-end gap-3 m-2"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)} 
                  className="px-6"
                >
                  Cancelar
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={handleSave} 
                  className="px-6 bg-blue-600 hover:bg-blue-700"
                >
                  Alterar status
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
};
