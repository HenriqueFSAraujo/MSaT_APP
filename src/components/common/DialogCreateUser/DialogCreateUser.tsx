import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useCreateUser } from '@/services/queries/useCreateUser';
import { toast } from '@/utils/toast';
import { formatCpf } from '@/utils/transformMasks';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { z } from 'zod';

const userSchema = z.object({
  fullName: z.string().min(1, 'O nome completo é obrigatório'),
  cpf: z.string().min(1, 'O CPF é obrigatório'),
  email: z.string().email('E-mail inválido'),
  roleName: z.enum(['ROLE_ADMIN', 'ROLE_USER'], {
    required_error: 'O perfil é obrigatório',
  }),
});

type DialogCreateUserProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DialogCreateUser = ({ open, onOpenChange }: DialogCreateUserProps) => {
  const { mutate: createUser } = useCreateUser();

  const [formData, setFormData] = useState({
    name: '',
    fullName: '',
    roleName: '',
    cpf: '',
    email: '',
    isFirstLogin: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleInputChange = (field: string, value: string | { name: string }) => {
    let newValue: unknown = value;
    if (field === 'cpf' && typeof value === 'string') {
      newValue = formatCpf(value);
    }
    setFormData((prev) => ({ ...prev, [field]: newValue }));
    setIsDirty(true);
  };

  const handleSave = () => {
    setIsDirty(true);

    try {
      userSchema.parse(formData);

      const payload = {
        id: '',
        name: formData.fullName,
        userName: formData.cpf,
        cpf: formData.cpf.replace(/\D/g, ''),
        roleName: formData.roleName,
        email: formData.email,
        isFirstLogin: formData.isFirstLogin,
      };

      createUser(payload, {
        onSuccess: () => {
          onOpenChange(false);
          setFormData({
            name: '',
            cpf: '',
            roleName: '',
            fullName: '',
            email: '',
            isFirstLogin: false,
          });
          setErrors({});
          setIsFormValid(false);
          setIsDirty(false);
        },
        onError: () => {
          toast.error('Erro ao criar usuário. Verifique os dados e tente novamente.');
        },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
        console.log(newErrors);
        toast.error('Por favor, corrija os erros do formulário.');
      }
    }
  };

  useEffect(() => {
    if (!isDirty) return;
    try {
      userSchema.parse(formData);
      setErrors({});
      setIsFormValid(true);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
        setIsFormValid(false);
      }
    }
  }, [formData, isDirty]);

  useEffect(() => {
    if (!open) {
      setFormData({
        name: '',
        cpf: '',
        roleName: '',
        fullName: '',
        email: '',
        isFirstLogin: false,
      });
      setErrors({});
      setIsFormValid(false);
      setIsDirty(false);
    }
  }, [open]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <AnimatePresence>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-[500px] p-0 overflow-hidden"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-blue-700 p-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                    <UserPlus className="h-6 w-6" />
                    Criar Novo Usuário
                  </DialogTitle>
                </motion.div>
                <motion.p
                  className="text-blue-100 text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Preencha os campos para adicionar um novo usuário.
                </motion.p>
              </DialogHeader>
            </motion.div>

            <motion.div className="p-6 space-y-4" variants={itemVariants}>
              {['fullName', 'cpf', 'email'].map((field, index) => (
                <motion.div
                  key={field}
                  className="space-y-2"
                  variants={itemVariants}
                  custom={index}
                >
                  <Label className="text-sm font-medium">
                    {field === 'fullName' && 'Nome Completo'}
                    {field === 'cpf' && 'CPF'}
                    {field === 'email' && 'E-mail'}
                  </Label>
                  <motion.div whileHover={{ scale: 1.01 }}>
                    <Input
                      value={
                        typeof formData[field as keyof typeof formData] === 'string'
                          ? (formData[field as keyof typeof formData] as string)
                          : ''
                      }
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      placeholder={`Digite o ${field === 'name' ? 'nome completo' : field}`}
                      className={cn(errors[field] && 'border-red-500 focus-visible:ring-red-500')}
                    />
                  </motion.div>
                  <AnimatePresence>
                    {errors[field] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-1 text-red-500 text-xs mt-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {errors[field]}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              <motion.div className="space-y-2" variants={itemVariants}>
                <Label className="text-sm font-medium">Perfil</Label>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <Select
                    value={formData.roleName}
                    onValueChange={(value) => handleInputChange('roleName', value)}
                  >
                    <SelectTrigger
                      className={cn(errors.roleName && 'border-red-500 focus-visible:ring-red-500')}
                    >
                      <SelectValue placeholder="Selecione o perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
                      <SelectItem value="ROLE_USER">Aluno</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
                <AnimatePresence>
                  {errors.roleName && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-1 text-red-500 text-xs mt-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.roleName}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div className="flex justify-end gap-3 mt-8" variants={itemVariants}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="px-6"
                  >
                    Cancelar
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleSave}
                    disabled={!isFormValid}
                    className="px-6 bg-blue-600 hover:bg-blue-700"
                  >
                    Criar Usuário
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
};
