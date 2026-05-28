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
import type { User } from '@/services/queries/useGetUsers';
import { useUpdateUser } from '@/services/queries/useUpdateUser';
import { toast } from '@/utils/toast';
import { formatCpf } from '@/utils/transformMasks';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, UserCog } from 'lucide-react';
import { useEffect, useState } from 'react';
import { z } from 'zod';

const userEditSchema = z
  .object({
    fullName: z.string().min(1, 'O nome completo é obrigatório'),
    cpf: z.string().min(1, 'O CPF é obrigatório'),
    email: z.string().email('E-mail inválido'),
    roleName: z.enum(['ROLE_ADMIN', 'ROLE_USER'], {
      required_error: 'O perfil é obrigatório',
    }),
    tipoAluno: z.enum(['ESCOLA_PARTICULAR', 'ESCOLA_GRATUITA']).optional(),
  })
  .refine((data) => data.roleName !== 'ROLE_USER' || !!data.tipoAluno, {
    message: 'O tipo de aluno é obrigatório para o perfil Aluno',
    path: ['tipoAluno'],
  });

type DialogEditUserProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
};

type FormState = {
  fullName: string;
  cpf: string;
  email: string;
  roleName: string;
  tipoAluno: '' | 'ESCOLA_PARTICULAR' | 'ESCOLA_GRATUITA';
};

const EMPTY_FORM: FormState = {
  fullName: '',
  cpf: '',
  email: '',
  roleName: '',
  tipoAluno: '',
};

/**
 * Modal de edição de usuário. Pré-popula com os dados atuais e dispara PUT /api/users/{id}.
 *
 * Regras:
 * - Quando Perfil = Aluno → campo "Tipo de Aluno" aparece e é obrigatório.
 * - Quando Perfil = Admin → tipoAluno é forçado a null no payload (backend faz o mesmo).
 */
export const DialogEditUser = ({ open, onOpenChange, user }: DialogEditUserProps) => {
  const { mutate: updateUser, isPending } = useUpdateUser();

  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Quando o modal abre com um usuário, pré-popular o form com os dados atuais.
  useEffect(() => {
    if (open && user) {
      setFormData({
        fullName: user.name ?? '',
        cpf: user.cpf ? formatCpf(user.cpf) : '',
        email: user.email ?? '',
        roleName: user.roleName ?? '',
        tipoAluno: (user.tipoAluno as FormState['tipoAluno']) ?? '',
      });
      setErrors({});
      setIsFormValid(true);
      setIsDirty(false);
      setTouchedFields(new Set());
    }
  }, [open, user]);

  // Limpa estado ao fechar.
  useEffect(() => {
    if (!open) {
      setFormData(EMPTY_FORM);
      setErrors({});
      setIsFormValid(false);
      setIsDirty(false);
      setTouchedFields(new Set());
    }
  }, [open]);

  const handleInputChange = (field: keyof FormState, value: string) => {
    const newValue = field === 'cpf' ? formatCpf(value) : value;
    setFormData((prev) => {
      const next = { ...prev, [field]: newValue } as FormState;
      // Espelha o backend (UserInfoService.normalizeTipoAlunoForAdmin):
      // se virar admin, limpa tipoAluno.
      if (field === 'roleName' && value === 'ROLE_ADMIN') {
        next.tipoAluno = '';
      }
      return next;
    });
    setIsDirty(true);
  };

  const handleInputBlur = (field: string) => {
    setTouchedFields((prev) => new Set(prev).add(field));
  };

  const handleSave = () => {
    if (!user) return;
    setIsDirty(true);

    try {
      userEditSchema.parse(formData);

      const payload = {
        name: formData.fullName,
        userName: formData.cpf.replace(/\D/g, ''),
        cpf: formData.cpf.replace(/\D/g, ''),
        roleName: formData.roleName,
        email: formData.email,
        tipoAluno:
          formData.roleName === 'ROLE_USER' ? formData.tipoAluno || null : null,
      };

      updateUser(
        { userId: user.userId, payload },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
          onError: () => {
            toast.error('Erro ao atualizar usuário. Verifique os dados e tente novamente.');
          },
        },
      );
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
        toast.error('Por favor, corrija os erros do formulário.');
      }
    }
  };

  // Validação reativa só nos campos tocados.
  useEffect(() => {
    if (!isDirty || touchedFields.size === 0) return;

    try {
      userEditSchema.parse(formData);
      setErrors({});
      setIsFormValid(true);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0] && touchedFields.has(error.path[0] as string)) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0);
      }
    }
  }, [formData, isDirty, touchedFields]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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
                    <UserCog className="h-6 w-6" />
                    Editar Usuário
                  </DialogTitle>
                </motion.div>
                <motion.p
                  className="text-blue-100 text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Atualize os dados do usuário e salve para confirmar.
                </motion.p>
              </DialogHeader>
            </motion.div>

            <motion.div className="p-6 space-y-4" variants={itemVariants}>
              {(['fullName', 'cpf', 'email'] as const).map((field, index) => (
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
                      value={formData[field]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      onBlur={() => handleInputBlur(field)}
                      placeholder={`Digite o ${field === 'fullName' ? 'nome completo' : field}`}
                      className={cn(
                        errors[field] && 'border-red-500 focus-visible:ring-red-500',
                      )}
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
                      className={cn(
                        errors.roleName && 'border-red-500 focus-visible:ring-red-500',
                      )}
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

              {/* Tipo de Aluno: visivel apenas quando perfil = Aluno. Obrigatorio pelo backend. */}
              <AnimatePresence>
                {formData.roleName === 'ROLE_USER' && (
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Label className="text-sm font-medium">Tipo de Aluno</Label>
                    <motion.div whileHover={{ scale: 1.01 }}>
                      <Select
                        value={formData.tipoAluno}
                        onValueChange={(value) =>
                          handleInputChange('tipoAluno', value)
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            errors.tipoAluno && 'border-red-500 focus-visible:ring-red-500',
                          )}
                        >
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ESCOLA_PARTICULAR">Escola Particular</SelectItem>
                          <SelectItem value="ESCOLA_GRATUITA">Escola Gratuita</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                    <AnimatePresence>
                      {errors.tipoAluno && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-1 text-red-500 text-xs mt-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {errors.tipoAluno}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div className="flex justify-end gap-3 mt-8" variants={itemVariants}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="px-6"
                    disabled={isPending}
                  >
                    Cancelar
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleSave}
                    disabled={!isFormValid || isPending}
                    className="px-6 bg-blue-600 hover:bg-blue-700"
                  >
                    {isPending ? 'Salvando...' : 'Salvar alterações'}
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
