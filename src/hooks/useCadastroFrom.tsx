import { authService } from '@/services/auth';
import { userService } from '@/services/userService';
import { useAuthStore } from '@/store/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z
  .object({
    username: z.string().min(1, 'Usuário inválido'),
    password: z
      .string()
      .min(4, 'Pelo menos 4 caracteres, letras e números')
      .max(
        8,
        'Deve conter no máximo 8 caracteres, letras maiúsculas, minúsculas, números e caracteres (#_@)'
      )
      .regex(
        /[A-Z]/,
        'Deve conter no máximo 8 caracteres, letras maiúsculas, minúsculas, números e caracteres (#_@)'
      )
      .regex(
        /[a-z]/,
        'Deve conter no máximo 8 caracteres, letras maiúsculas, minúsculas, números e caracteres (#_@)'
      )
      .regex(
        /[^a-zA-Z0-9]/,
        'Deve conter no máximo 8 caracteres, letras maiúsculas, minúsculas, números e caracteres (#_@)'
      ),
    confirmPassword: z
      .string()
      .min(4, 'Pelo menos 4 caracteres, letras e números')
      .max(
        8,
        'Deve conter no máximo 8 caracteres, letras maiúsculas, minúsculas, números e caracteres (#_@)'
      ),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'As senhas não confere',
        path: ['confirmPassword'],
      });
    }
  });
type FormData = z.infer<typeof formSchema>;

export function useCadastro() {
  const [error, setError] = useState('');
  const id = useParams();
  const { setToken } = useAuthStore();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    formState: { errors },
  } = form;

  const { mutate, isPending } = useMutation({
    mutationFn: authService.login,
    onSuccess(data) {
      localStorage.setItem('@garantias:session', JSON.stringify(data));
      setToken(data.token);
    },
    onError() {
      setError('Não foi possível se autenticar com os dados informados.');
      localStorage.removeItem('@garantias:session');
    },
  });

  async function onSubmit(values: FormData): Promise<boolean> {
    if (id?.id) {
      try {
        // Atualiza a senha
        await userService.updatePasswordUser(id.id.toString(), values.password);

        // Prepara dados para login
        const loginData = {
          username: values.username,
          password: values.password,
        };

        // Faz o login
        return new Promise((resolve) => {
          mutate(loginData, {
            onSuccess: () => resolve(true),
            onError: () => resolve(false),
          });
        });
      } catch (error) {
        setError(error as string);
        return false;
      }
    }
    return false;
  }

  return {
    form,
    onSubmit,
    error,
    errors,
    isPending,
    setError,
  };
}
