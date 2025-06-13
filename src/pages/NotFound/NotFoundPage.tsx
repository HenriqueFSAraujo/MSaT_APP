import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    // Se isso estiver redirecionando para si mesmo, pode ser removido
    // navigate('/404', { replace: true });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-white dark:bg-gray-950">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        404 - Página Não Encontrada
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        Desculpe, a página que você está procurando não existe.
      </p>
      <Button asChild>
        <Link to="/">Voltar para a Página Inicial</Link>
      </Button>
    </div>
  );
};
