import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { User, LockKeyhole, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react';
import { toast } from '@/utils/toast';
import { z } from 'zod';
import { useUpdatePassword } from '@/services/queries/useChangePassword';
import { cn } from '@/lib/utils';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'A senha atual é obrigatória'),
    newPassword: z.string().min(1, 'A nova senha é obrigatória'),
    confirmPassword: z.string().min(1, 'A confirmação da senha é obrigatória'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'A nova senha não pode ser igual à senha atual',
    path: ['newPassword'],
  });

type DialogPerfilActionProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
};

export const DialogPerfilAction = ({ open, onOpenChange, userName }: DialogPerfilActionProps) => {
  const { mutate: updatePassword } = useUpdatePassword();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    setIsDirty(true); // Force validation on save attempt

    if (!currentPassword || !newPassword || !confirmPassword) {
      const newErrors: Record<string, string> = {};
      if (!currentPassword) newErrors.currentPassword = 'A senha atual é obrigatória';
      if (!newPassword) newErrors.newPassword = 'A nova senha é obrigatória';
      if (!confirmPassword) newErrors.confirmPassword = 'A confirmação da senha é obrigatória';
      setErrors(newErrors);
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      passwordSchema.parse({ currentPassword, newPassword, confirmPassword });

      updatePassword(
        { currentPassword, newPassword },
        {
          onSuccess: () => {
            onOpenChange(false);
            toast.success('Senha atualizada com sucesso!');
            // Reset form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setErrors({});
            setIsFormValid(false);
            setIsDirty(false);
          },
          onError: () => {
            toast.error('Erro ao atualizar a senha. Verifique os dados e tente novamente.');
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

    try {
      passwordSchema.parse({
        currentPassword,
        newPassword,
        confirmPassword,
      });
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
  }, [currentPassword, newPassword, confirmPassword, isDirty]);

  useEffect(() => {
    if (!open) {
      setCurrentPassword('');
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
              <Shield className="h-6 w-6" />
              Atualização de Senha
            </DialogTitle>
            <p className="text-blue-100 text-sm mt-2">
              Para sua segurança, escolha uma senha forte e única
            </p>
          </DialogHeader>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-6 p-3 bg-blue-50 rounded-lg">
            <User className="text-blue-600 w-5 h-5" />
            <div>
              <Label className="text-sm text-blue-900">Usuário</Label>
              <p className="text-sm font-medium text-blue-700">{userName}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Senha Atual</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <Input
                  type={showCurrent ? 'text' : 'password'}
                  name="fake-password-field"
                  autoComplete="off"
                  value={currentPassword}
                  onChange={(e) =>
                    handleInputChange(e.target.value, setCurrentPassword, currentPassword)
                  }
                  placeholder="Digite sua senha atual"
                  className={cn(
                    'pl-9 pr-9',
                    errors.currentPassword ? 'border-red-500 focus-visible:ring-red-500' : ''
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
              {errors.currentPassword && (
                <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.currentPassword}
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
              disabled={!isFormValid}
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
