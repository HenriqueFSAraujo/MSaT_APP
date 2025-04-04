import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Users, Clipboard, ClockAlert } from 'lucide-react';

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
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-64 p-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={closeMenu}
        />

        <nav className="mt-8 space-y-4">
          <Button
            variant="ghost"
            className="w-full flex justify-start gap-2"
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
            className="w-full flex justify-start gap-2"
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
            className="w-full flex justify-start gap-2"
            onClick={() => {
              navigate('/dashboard/users');
              closeMenu();
            }}
          >
            <Users className="h-5 w-5" /> Usuários
          </Button>

          <Button
            variant="ghost"
            className="w-full flex justify-start gap-2 text-red-500 h-5 p-5"
            onClick={logOut}
          >
            Sair
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
