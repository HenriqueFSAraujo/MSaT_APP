import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Users, Clipboard, ClockAlert, X } from 'lucide-react';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const closeMenu = () => setOpen(!open);

  const logOut = () => {
    localStorage.removeItem('nameUser');
    navigate('/');
    closeMenu();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="group p-2 h-10 w-10">
          <Menu className="h-6 w-6 text-white group-hover:text-slate-800" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-64 p-4 [&>button:first-of-type]:hidden"
        style={{ backgroundColor: 'oklch(70.7% 0.022 261.325)' }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 text-white hover:text-black transition-colors p-1"
          onClick={closeMenu}
        >
          <X className="w-4 h-4" />
        </Button>
        <nav className="mt-8 space-y-4">
          <div className="flex items-center justify-center mb-4">
            <img
              src="https://agostinianas.com.br/wp-content/uploads/2020/12/logo-congregacao-branco.svg"
              alt="Logo"
              className="h-17 w-auto object-contain cursor-pointer"
            />
          </div>
          <Button
            variant="ghost"
            className="w-full flex justify-start gap-2 text-white"
            onClick={() => {
              navigate('/formulario-aluno');
              closeMenu();
            }}
          >
            <Clipboard className="h-5 w-5" />
            Formulário do cadidato
          </Button>
          <Button
            variant="ghost"
            className="w-full flex justify-start gap-2 text-white"
            onClick={() => {
              navigate('/dashboard');
              closeMenu();
            }}
          >
            <ClockAlert className="h-5 w-5" />
            Formulário antigo
          </Button>

          <Button
            variant="ghost"
            className="w-full flex justify-start gap-2 text-white"
            onClick={() => {
              navigate('/dashboard/users');
              closeMenu();
            }}
          >
            <Users className="h-5 w-5" /> Usuários
          </Button>

          <Button
            variant="ghost"
            className="w-full flex justify-start gap-2 text-red-700 h-5 p-5"
            onClick={logOut}
          >
            Sair
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
