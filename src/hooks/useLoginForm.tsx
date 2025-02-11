import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/store/store';
// import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const formSchema = z.object({
  username: z.string().min(1, 'Usuário inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type FormData = z.infer<typeof formSchema>;

interface JwtPayload {
  user: {
    createdByAdmin: boolean;
    email: string;
    fullName: string;
    id: number;
    isEnabled: boolean;
    isReset: boolean;
    link: string;
    passwordChangeByUser: boolean;
    resetAt: number;
    roles: [
      {
        id: number;
        name: string;
      },
    ];
    userImage: string;
    username: string;
  };
}

export function useLoginForm() {
  const [error, setError] = useState('');
  const { setToken } = useAuthStore();

  const { mutate: mutateLogin, isPending } = useMutation({
    mutationFn: authService.login,
    onSuccess(data) {
      localStorage.setItem('@garantias:session', JSON.stringify(data));
      setToken(data.token);

      const roleDecode: JwtPayload | null = jwtDecode(data.accessToken);
      localStorage.setItem('@garantias:role', JSON.stringify(roleDecode?.user.roles[0].name));
      localStorage.setItem('@garantias:id', JSON.stringify(roleDecode?.user.id));
    },
    onError() {
      setError('Não foi possível se autenticar com os dados informados.');
      localStorage.removeItem('@garantias:session');
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const {
    formState: { errors },
  } = form;

  function onSubmit(values: FormData) {
    localStorage.removeItem('@garantias:session');
    mutateLogin(values);
  }

  return {
    form,
    onSubmit,
    isPending,
    error,
    errors,
  };
}
