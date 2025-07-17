import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Clipboard, X, BookOpenText, ClipboardList } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const closeMenu = () => setOpen(!open);

  const { role } = useAuthStore.getState();

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
          {role === 'ROLE_ADMIN' && (
            <>
              <Button
                variant="ghost"
                className="w-full flex justify-start gap-2 text-white"
                onClick={() => {
                  navigate('/dashboard-users');
                  closeMenu();
                }}
              >
                <BookOpenText className="h-5 w-5" /> Painel de usuários
              </Button>
              <Button
                variant="ghost"
                className="w-full flex justify-start gap-2 text-white"
                onClick={() => {
                  navigate('/socioeconomic-report');
                  closeMenu();
                }}
              >
                <ClipboardList className="h-5 w-5" /> Parecer Socioeconômico
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            className="w-full flex justify-start gap-2 text-white"
            onClick={() => {
              navigate('/students-form');
              closeMenu();
            }}
          >
            <Clipboard className="h-5 w-5" />
            Formulário do cadidato
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
