import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { UserPlus, AlertCircle } from 'lucide-react';
import { toast } from '@/utils/toast';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { useCreateUser } from '@/services/queries/useCreateUser';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCpf } from '@/utils/transformMasks';

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[500px] p-0 overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <UserPlus className="h-6 w-6" />
              Criar Novo Usuário
            </DialogTitle>
            <p className="text-blue-100 text-sm mt-2">
              Preencha os campos para adicionar um novo usuário.
            </p>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-4">
          {['fullName', 'cpf', 'email'].map((field) => (
            <div key={field} className="space-y-2">
              <Label className="text-sm font-medium">
                {field === 'fullName' && 'Nome Completo'}
                {field === 'cpf' && 'CPF'}
                {field === 'email' && 'E-mail'}
              </Label>
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
              {errors[field] && (
                <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors[field]}
                </div>
              )}
            </div>
          ))}

          {/* Role */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Perfil</Label>
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
            {errors.roleName && (
              <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.roleName}
              </div>
            )}
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
              Criar Usuário
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
