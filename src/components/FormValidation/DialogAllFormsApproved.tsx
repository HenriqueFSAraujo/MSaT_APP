import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ClipboardList } from 'lucide-react';

type DialogAllFormsApprovedProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Disparado ao clicar em "Gerar Parecer" — navega para /socioeconomic-report/{studentId}. */
  onGenerateOpinion: () => void;
};

/**
 * Modal exibido quando o admin aprova a última seção pendente do formulário do aluno.
 * Avisa que todas as 8 seções estão APPROVED e oferece atalho para gerar o parecer
 * socioeconômico. O usuário pode dispensar e continuar revisando.
 *
 * O controle de "já dispensado nesta sessão" fica na página pai (FormValidation.tsx) via
 * sessionStorage — não no modal — para que o modal continue simples e reutilizável.
 */
export const DialogAllFormsApproved = ({
  open,
  onOpenChange,
  onGenerateOpinion,
}: DialogAllFormsApprovedProps) => {
  return (
    <AnimatePresence>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-[520px] p-0 overflow-hidden"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="bg-gradient-to-r from-emerald-500 to-green-600 p-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="p-2 bg-white/20 rounded-full">
                    <CheckCircle2 className="h-7 w-7 text-white" />
                  </div>
                  <DialogTitle className="text-2xl font-bold text-white">
                    Todos os formulários aprovados!
                  </DialogTitle>
                </motion.div>
                <motion.p
                  className="text-emerald-50 text-sm mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Você concluiu a validação de todas as 8 seções deste aluno.
                </motion.p>
              </DialogHeader>
            </motion.div>

            <motion.div
              className="p-6 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm text-emerald-900 leading-relaxed">
                  Com todos os dados aprovados, o <strong>Parecer Socioeconômico</strong> já pode
                  ser gerado. Você pode prosseguir agora ou continuar revisando.
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="px-6"
                  >
                    Continuar revisando
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={onGenerateOpinion}
                    className="px-6 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                  >
                    <ClipboardList className="h-4 w-4" />
                    Gerar Parecer
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
};
