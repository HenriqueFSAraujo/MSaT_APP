import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input.js';
import { Button } from '@/components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useTabStore } from '@/store/tabStore';
import { useLogin } from '@/Auth/Login/useLogin';
import { LoginPayload } from '@/Auth/Login/useLogin';
import { formatCpf } from '@/utils/transformMasks';

const loginSchema = z.object({
  userName: z.string().min(11, 'O CPF é obrigatório'),
  password: z.string().min(5, 'A senha deve ter pelo menos 5 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const [cpf, setCpf] = useState('');

  const [error, setError] = useState<string | null>(null);
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);
  const loginMutation = useLogin();

  const onSubmit = async (formData: LoginForm) => {
    setError(null);
    try {
      const payload: LoginPayload = {
        userName: formData.userName.replace(/\D/g, ''),
        password: formData.password,
      };
      await loginMutation.mutateAsync(payload);
    } catch (error) {
      setError('Usuário ou senha inválidos.');
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCpf(e.target.value);
    setCpf(formattedCPF);
    setValue('userName', formattedCPF, { shouldValidate: true });
  };

  useEffect(() => {
    localStorage.removeItem('token');
    setSelectedTab('scholarship_info');
  }, []);

  return (
    <div className="flex items-center bg-blue-300 justify-center min-h-screen px-4">
      <div className="w-full max-w-4xl bg-blue-600 shadow-2xl rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center justify-center p-12 bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="text-center text-white">
            <img
              src="/imgs/logo.jpeg"
              alt="Logo"
              className="max-h-60 w-auto object-contain mx-auto mb-6 p-3 bg-white"
            />
            <h1 className="text-3xl font-bold mb-4">Bem-vindo de Volta</h1>
            <p className="text-lg">Por favor, insira suas credenciais para acessar sua conta.</p>
          </div>
        </div>

        <div className="p-12 flex flex-col justify-center bg-white">
          <Card className="shadow-none border-0">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold text-gray-800">Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usuário (CPF)
                  </label>
                  <input
                    type="text"
                    placeholder="Digite seu CPF"
                    value={cpf}
                    {...register('userName')}
                    onChange={handleCPFChange}
                    maxLength={14}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  />
                  {errors.userName && (
                    <p className="text-red-500 text-sm mt-1">{errors.userName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                  <Input
                    type="password"
                    placeholder="••••••"
                    {...register('password')}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>
                {error && <p className="text-red-500 text-sm mt-1 text-center">{error}</p>}
                <div className="flex justify-end items-center">
                  <Button
                    type="submit"
                    className="w-1/2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                    disabled={isSubmitting || loginMutation.isPending}
                  >
                    {loginMutation.isPending ? 'Carregando...' : 'Entrar'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
