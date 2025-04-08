import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Settings, User } from 'lucide-react';
import MenuComponent from '@/components/layout/Menu/menu';
import { useTabStore } from '@/store/tabStore';

interface HeaderProps {
  shouldRender?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ shouldRender = true }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);

  const nameUser = localStorage.getItem('nameUser');

  const isLoginPage =
    location.pathname === '/login' || location.pathname.startsWith('/cadastrarSenha/');

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/formulario-aluno':
        return 'Formulário do candidato a bolsa de estudos';
      case '/dashboard/consulta':
        return 'Consulta';
      case '/dashboard/users':
        return 'Usuários';
      default:
        return 'Página';
    }
  };

  const backToFirstTab = () => {
    setSelectedTab('personal_data');
  };

  if (!shouldRender) return null;

  if (isLoginPage) {
    return (
      <header className="h-[76px] md:h-[64px] sm:h-[56px] bg-[#0b59ac] shadow-sm flex items-center justify-center px-6">
        <div className="ml-[20px] cursor-pointer md:ml-[12px]">
          <img
            src="https://agostinianas.com.br/wp-content/uploads/2020/12/logo-congregacao-branco.svg"
            alt="Logo"
            className="h-auto max-w-full max-h-[100px] md:max-h-[32px]"
          />
        </div>
      </header>
    );
  }

  return (
    <header className="h-[76px] md:h-[64px] sm:h-[56px] bg-[#0b59ac] shadow-sm flex items-center justify-between px-[22px] md:px-4 sm:px-3">
      <div className="flex items-center gap-[20px] md:gap-[12px] sm:gap-[8px]">
        <MenuComponent />
        <img
          src="https://agostinianas.com.br/wp-content/uploads/2020/12/logo-congregacao-branco.svg"
          alt="Logo"
          className="h-16 w-auto object-contain cursor-pointer"
          onClick={backToFirstTab}
        />
      </div>

      <h1 className="font-normal text-white mx-[20px] flex-1 text-center md:mx-[12px] sm:text-[1rem] md:text-[2rem] m:mx-[8px] truncate md:truncate-none block">
        {getPageTitle()}
      </h1>

      <div className="flex items-center gap-[16px] md:gap-[8px] sm:gap-[4px]">
        <span className="mr-2 text-white text-[16px] leading-normal whitespace-nowrap hidden md:inline">
          Bem-vindo <strong>{nameUser}</strong>!
        </span>

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="p-2 md:p-1.5 sm:p-1 text-white hover:bg-white/10"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <User className="w-[24px] h-[24px] md:w-[22px] md:h-[22px] sm:w-[20px] sm:h-[20px]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[200px] bg-white shadow-md rounded mt-2">
            <DropdownMenuItem onClick={() => setOpen(false)}>Perfil Localizador</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(false)}>Perfil ADM</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(false)}>Perfil Pátio</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <Button variant="ghost" className="p-2 md:p-1.5 sm:p-1 text-white hover:bg-white/10">
          <Settings className="w-[24px] h-[24px] md:w-[22px] md:h-[22px] sm:w-[20px] sm:h-[20px]" />
        </Button>
      </div>
    </header>
  );
};
