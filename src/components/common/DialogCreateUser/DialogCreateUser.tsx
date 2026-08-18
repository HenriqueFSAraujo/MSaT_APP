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

const userSchema = z
  .object({
    fullName: z.string().min(1, 'O nome completo é obrigatório'),
    cpf: z.string().min(1, 'O CPF é obrigatório'),
    email: z.union([z.string().email('E-mail inválido'), z.literal('')]),
    roleName: z.enum(['ROLE_ADMIN', 'ROLE_USER'], {
      required_error: 'O perfil é obrigatório',
    }),
    tipoAluno: z.enum(['ESCOLA_PARTICULAR', 'ESCOLA_GRATUITA']).optional(),
  })
  .refine(
    (data) => data.roleName !== 'ROLE_USER' || !!data.tipoAluno,
    {
      message: 'O tipo de aluno é obrigatório para o perfil Aluno',
      path: ['tipoAluno'],
    },
  );

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
    tipoAluno: '' as '' | 'ESCOLA_PARTICULAR' | 'ESCOLA_GRATUITA',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const handleInputChange = (field: string, value: string | { name: string }) => {
    let newValue: unknown = value;
    if (field === 'cpf' && typeof value === 'string') {
      newValue = formatCpf(value);
    }
    setFormData((prev) => {
      const next = { ...prev, [field]: newValue };
      // Se o admin trocou o perfil para ADMIN, limpamos o tipoAluno (admin nao tem tipo).
      // Espelha o comportamento do backend em UserInfoService.normalizeTipoAlunoForAdmin().
      if (field === 'roleName' && value === 'ROLE_ADMIN') {
        next.tipoAluno = '';
      }
      return next;
    });
    setIsDirty(true);
  };

  const handleInputBlur = (field: string) => {
    setTouchedFields(prev => new Set(prev).add(field));
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
        email: formData.email || null,
        isFirstLogin: formData.isFirstLogin,
        // Backend ignora tipoAluno quando ROLE_ADMIN (UserInfoService.normalizeTipoAlunoForAdmin),
        // mas mandamos null explicito para deixar a intencao clara.
        tipoAluno: formData.roleName === 'ROLE_USER' ? formData.tipoAluno || null : null,
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
            tipoAluno: '',
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
    if (!isDirty || touchedFields.size === 0) return;

    try {
      userSchema.parse(formData);
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
        setIsFormValid(false);
      }
    }
  }, [formData, isDirty, touchedFields]);

  useEffect(() => {
    if (!open) {
      setFormData({
        name: '',
        cpf: '',
        roleName: '',
        fullName: '',
        email: '',
        isFirstLogin: false,
        tipoAluno: '',
      });
      setErrors({});
      setIsFormValid(false);
      setIsDirty(false);
      setTouchedFields(new Set());
    }
  }, [open]);

  const getCpfLabel = () => {
    return formData.roleName === 'ROLE_ADMIN' ? 'CPF' : 'CPF do candidato';
  };

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
                    {field === 'cpf' && getCpfLabel()}
                    {field === 'email' && 'E-mail (opcional)'}
                  </Label>
                  <motion.div whileHover={{ scale: 1.01 }}>
                    <Input
                      value={
                        typeof formData[field as keyof typeof formData] === 'string'
                          ? (formData[field as keyof typeof formData] as string)
                          : ''
                      }
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      onBlur={() => handleInputBlur(field)}
                      placeholder='Digite o nome completo'
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
                    onValueChange={(value) => {
                      handleInputChange('roleName', value);
                      handleInputBlur('roleName');
                    }}
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
                        onValueChange={(value) => handleInputChange('tipoAluno', value)}
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
