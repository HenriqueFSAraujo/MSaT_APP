import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { User, LockKeyhole, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react';
import { toast } from '@/utils/toast';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { useChangePassword } from '@/services/queries/useChangePassword';
import { useAuthStore } from '@/store/useAuthStore';
import { maskCpfCustom } from '@/utils/transformMasks';

const passwordSchema = z
  .object({
    currentPassWord: z.string().min(1, 'A senha atual é obrigatória'),
    newPassword: z.string().min(1, 'A nova senha é obrigatória'),
    confirmPassword: z.string().min(1, 'A confirmação da senha é obrigatória'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
  .refine((data) => data.newPassword !== data.currentPassWord, {
    message: 'A nova senha não pode ser igual à senha atual',
    path: ['newPassword'],
  });

type DialogPerfilActionProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DialogPerfilAction = ({ open, onOpenChange }: DialogPerfilActionProps) => {
  const { id, name, email, cpf } = useAuthStore();
  const [currentPassWord, setcurrentPassWord] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutate: resetPassword } = useChangePassword();

  const handleInputChange = (
    value: string,
    setter: (value: string) => void,
    currentValue: string
  ) => {
    if (value !== currentValue) {
      setter(value);
      setIsDirty(true);
    }
  };

  const handleSave = () => {
    setIsDirty(true);
    if (!currentPassWord || !newPassword || !confirmPassword) {
      const newErrors: Record<string, string> = {};
      if (!currentPassWord) newErrors.currentPassWord = 'A senha atual é obrigatória';
      if (!newPassword) newErrors.newPassword = 'A nova senha é obrigatória';
      if (!confirmPassword) newErrors.confirmPassword = 'A confirmação da senha é obrigatória';
      setErrors(newErrors);
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      passwordSchema.parse({ currentPassWord, newPassword, confirmPassword });

      resetPassword(
        {
          id,
          currentPassWord,
          newPassword,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
            // Reset form
            setcurrentPassWord('');
            setNewPassword('');
            setConfirmPassword('');
            setErrors({});
            setIsFormValid(false);
            setIsDirty(false);
          },
          onError: (error: unknown) => {
            let message = 'Erro ao atualizar a senha. Verifique os dados.';
            type ErrorWithResponse = {
              response?: {
                data?: {
                  message?: string;
                };
              };
            };
            if (
              typeof error === 'object' &&
              error !== null &&
              'response' in error &&
              (error as ErrorWithResponse).response?.data?.message
            ) {
              message = (error as ErrorWithResponse).response?.data?.message as string;
            }
            toast.error(message);
          },
        }
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

  useEffect(() => {
    if (!isDirty) return;

    const timeout = setTimeout(() => {
      try {
        passwordSchema.parse({ currentPassWord, newPassword, confirmPassword });
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
    }, 300); // 300ms debounce

    return () => clearTimeout(timeout);
  }, [currentPassWord, newPassword, confirmPassword, isDirty]);

  useEffect(() => {
    if (!open) {
      setcurrentPassWord('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
      setIsFormValid(false);
      setIsDirty(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[500px] p-0 overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <User className="h-6 w-6" />
              Meu perfil
            </DialogTitle>
            <p className="text-blue-100 text-sm mt-2">
              Para sua segurança, escolha uma senha forte e única
            </p>
          </DialogHeader>
        </div>

        <div className="flex gap-6 flex-col sm:flex-row sm:items-start p-4 bg-blue-50 rounded-lg text-sm text-blue-900">
          <User className="text-blue-600 w-5 h-5 mt-1" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div>
              <Label className="text-xs text-blue-700">Nome completo</Label>
              <p>{name}</p>
            </div>
            <div>
              <Label className="text-xs text-blue-700">E-mail</Label>
              <p>{email}</p>
            </div>
            <div>
              <Label className="text-xs text-blue-700">CPF</Label>
              <p>{maskCpfCustom(cpf)}</p>
            </div>
          </div>
        </div>

        <div className="px-6 pt-4">
          <div className="text-sm font-semibold text-muted-foreground mb-2 flex gap-1 items-center">
            <Shield className="h-6 w-6" />
            <span>Alterar senha</span>
          </div>
          <hr />
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Senha Atual</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <Input
                  type={showCurrent ? 'text' : 'password'}
                  name="fake-password-field"
                  autoComplete="off"
                  value={currentPassWord}
                  onChange={(e) =>
                    handleInputChange(e.target.value, setcurrentPassWord, currentPassWord)
                  }
                  placeholder="Digite sua senha atual"
                  className={cn(
                    'pl-9 pr-9',
                    errors.currentPassWord ? 'border-red-500 focus-visible:ring-red-500' : ''
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.currentPassWord && (
                <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.currentPassWord}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Nova Senha</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <Input
                  autoComplete="off"
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => handleInputChange(e.target.value, setNewPassword, newPassword)}
                  placeholder="Digite a nova senha"
                  className={cn(
                    'pl-9 pr-9',
                    errors.newPassword ? 'border-red-500 focus-visible:ring-red-500' : ''
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.newPassword}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Confirmar Nova Senha</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <Input
                  autoComplete="off"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) =>
                    handleInputChange(e.target.value, setConfirmPassword, confirmPassword)
                  }
                  placeholder="Confirme a nova senha"
                  className={cn(
                    'pl-9 pr-9',
                    errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6">
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormValid || !isDirty}
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
