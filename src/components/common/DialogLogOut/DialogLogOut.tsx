import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

type DialogLogOutProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DialogLogOut = ({ open, onOpenChange }: DialogLogOutProps) => {
  const navigate = useNavigate();

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

  const LogOut = () => {
    useAuthStore.getState().clearAuthData();
    useScholarshipFormStore.getState().clearFormData();
    navigate('/');
  };

  return (
    <AnimatePresence>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-[500px] p-0 overflow-hidden"
          onInteractOutside={(e) => e.preventDefault()}
        >
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
                    Confirmar Logout
                  </DialogTitle>
                </motion.div>
              </DialogHeader>
            </motion.div>

            <motion.div 
              className="p-6"
              variants={itemVariants}
            >
              <div className="space-y-4">
                <motion.div 
                  className="space-y-2"
                  variants={itemVariants}
                >
                  <Label className="text-sm font-medium">
                    Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente para
                    acessar os recursos.
                  </Label>
                </motion.div>

                <motion.div 
                  className="flex justify-end gap-3 mt-8"
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
                      onClick={LogOut} 
                      className="px-6 bg-blue-600 hover:bg-blue-700"
                    >
                      Sair
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
};
