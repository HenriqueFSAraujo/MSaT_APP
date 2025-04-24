import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input.js';
import { Button } from '@/components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logins } from '@/utils/logins';
import { useTabStore } from '@/store/tabStore';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);

  const onSubmit = async (formData: LoginForm) => {
    setIsPending(true);
    setError(null);
    try {
      const user = Logins.find(
        (login) => login.user === formData.email && login.password === formData.password
      );
      if (user) {
        localStorage.setItem('nameUser', user.name);
        setSelectedTab('personal_data');
        navigate('/students-form');
      } else {
        setError('Usuário ou senha inválidos.');
      }
    } catch (error) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
      console.error('Erro ao processar submissão:', error);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    localStorage.removeItem('nameUser');
    setSelectedTab('personal_data');
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
            <h1 className="text-4xl font-bold mb-4">Bem-vindo de Volta</h1>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    {...register('email')}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground cursor-pointer hover:text-blue-500 hover:underline">
                    Esqueceu a senha?
                  </span>
                  <Button
                    type="submit"
                    className="w-1/2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                    disabled={isSubmitting || isPending}
                  >
                    {isPending ? 'Carregando...' : 'Entrar'}
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
