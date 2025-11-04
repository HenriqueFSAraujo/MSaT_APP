import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuthStore } from '@/store/useAuthStore';
import { BookOpenText, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const closeMenu = () => setOpen(false);
  const { role, id } = useAuthStore();

  const menuAdminButtons = (
    <>
      <Button
        variant="ghost"
        className="w-full flex justify-start gap-2 text-white"
        onClick={() => {
          navigate('/dashboard-users');
          closeMenu();
        }}
      >
        <BookOpenText className="h-5 w-5" />
        Painel de usuários
      </Button>
    </>
  );

  const menuStudentButton = (
    <Button
      variant="ghost"
      className="w-full flex justify-start gap-2 text-white"
      onClick={() => {
        navigate(`/student-portal/${id}`);
        closeMenu();
      }}
    >
      <LayoutDashboard className="h-5 w-5" />
      Painel do aluno
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="group p-2 h-10 w-10">
          <Menu className="h-6 w-6 text-white group-hover:text-slate-800" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-64 p-4 [&>button:first-of-type]:hidden bg-blue-300"
        style={{ backgroundColor: '#93c5fd ' }}
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
              src="/imgs/logo-educa.png"
              alt="Logo"
              className="h-14 w-auto object-contain cursor-pointer"
            />
          </div>
          {role === 'ROLE_ADMIN' ? menuAdminButtons : menuStudentButton}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
