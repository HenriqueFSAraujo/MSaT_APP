import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { User, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { toast } from '@/utils/toast';
import { z } from "zod";
import { useUpdatePassword } from '@/services/queries/useChangePassword';

type DialogPerfilActionProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
};

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "A senha atual é obrigatória"),
  newPassword: z.string().min(1, "A nova senha é obrigatória"),
  confirmPassword: z.string().min(1, "A confirmação da senha é obrigatória"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
}).refine((data) => data.newPassword !== data.currentPassword, {
  message: "A nova senha não pode ser igual à senha atual",
  path: ["newPassword"],
});

type FormErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};


export const DialogPerfilAction = ({
  open,
  onOpenChange,
  userName,
}: DialogPerfilActionProps) => {
  const { mutate: updatePassword } = useUpdatePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
        const newErrors: FormErrors = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0] as keyof FormErrors] = error.message;
          }
        });
        setErrors(newErrors);
        setIsFormValid(false);
      }
    }
  }, [currentPassword, newPassword, confirmPassword, isDirty]);

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
    try {
      passwordSchema.parse({ currentPassword, newPassword, confirmPassword });

      updatePassword(
        { currentPassword, newPassword },
        {
          onSuccess: () => {
            onOpenChange(false);
            toast.success('Senha atualizada com sucesso!');
          },
          onError: () => {
            toast.error('Erro ao atualizar a senha. Verifique os dados e tente novamente.');
          },
        }
      );
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0] as keyof FormErrors] = error.message;
          }
        });
        setErrors(newErrors);
        toast.error('Por favor, corrija os erros do formulário.');
      }
    }
  };


  useEffect(() => {
    if (!open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
      setIsFormValid(false);
      setIsDirty(false);
    }
  }, [open]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-blue-600 text-center">
            Meu Perfil
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Atualize sua senha abaixo
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Nome do usuário */}
          <div className="flex items-center space-x-2">
            <User className="text-muted-foreground w-5 h-5" />
            <Label className="text-sm text-muted-foreground">Usuário:</Label>
            <span className="text-sm font-medium">{userName}</span>
          </div>

          {/* Nova Senha */}
          <div className="space-y-1">
            <Label className="text-sm">Nova Senha</Label>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1.5 text-gray-400 w-5 h-5" />
              <Input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => handleInputChange(e.target.value, setNewPassword, newPassword)}
                placeholder="Digite a nova senha"
                className={`pl-10 pr-10 ${errors.newPassword ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1.5 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Senha Atual */}
          <div className="space-y-1">
            <Label className="text-sm">Senha Atual</Label>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1.5 text-gray-400 w-5 h-5" />
              <Input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => handleInputChange(e.target.value, setCurrentPassword, currentPassword)}
                placeholder="Digite sua senha atual"
                className={`pl-10 pr-10 ${errors.currentPassword ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1.5 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
            )}
          </div>

          {/* Confirmar Nova Senha */}
          <div className="space-y-1">
            <Label className="text-sm">Confirmar Nova Senha</Label>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1.5 text-gray-400 w-5 h-5" />
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => handleInputChange(e.target.value, setConfirmPassword, confirmPassword)}
                placeholder="Confirme a nova senha"
                className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1.5 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

