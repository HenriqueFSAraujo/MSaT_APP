import MenuComponent from '@/components/Menu/menu';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTabStore } from '@/store/tabStore';
import { useAuthStore } from '@/store/useAuthStore';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DialogLogOut } from '../common/DialogLogOut/DialogLogOut';
import { DialogPerfilAction } from '../common/DialogPerfilAction/DialogPerfilAction';

interface HeaderProps {
  shouldRender?: boolean;
}

export const Header = ({ shouldRender = true }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalLogOut, setOpenModalLogOut] = useState(false);
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);
  const closeMenu = () => setOpen(!open);

  const { id, name: nameUser, role } = useAuthStore();

  const isLoginPage =
    location.pathname === '/login' || location.pathname.startsWith('/cadastrarSenha/');

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/students':
        return '';
      case '/dashboard/consulta':
        return '';
      case '/dashboard-users':
        return '';
    }
  };

  const handleClickMenu = () => {
    setSelectedTab('scholarship_info');

    if (role === 'ROLE_ADMIN') return navigate('/dashboard-Users');
    navigate(`/student-portal/${id}`);
  };

  const handleLogOut = () => {
    setOpenModalLogOut(!openModalLogOut);
    closeMenu();
  };

  const handleEditModal = () => {
    setOpenModal(!openModal);
    closeMenu();
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  if (!shouldRender) return null;

  if (isLoginPage) {
    return (
      <motion.header
        className="h-[76px] md:h-[64px] sm:h-[56px] bg-[#0b59ac] shadow-sm flex items-center justify-center px-6"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <motion.div
          className="ml-[20px] cursor-pointer md:ml-[12px]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.img
            src="https://agostinianas.com.br/wp-content/uploads/2020/12/logo-congregacao-branco.svg"
            alt="Logo"
            className="h-auto max-w-full max-h-[100px] md:max-h-[32px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </motion.header>
    );
  }

  return (
    <motion.header
      className="h-auto md:h-[64px] sm:h-[56px] bg-[#0b59ac] shadow-sm flex items-center justify-between px-[22px] md:px-4 sm:px-3"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <motion.div
        className="flex items-center gap-[20px] md:gap-[12px] sm:gap-[8px]"
        variants={itemVariants}
      >
        <MenuComponent />
        <motion.img
          src="https://agostinianas.com.br/wp-content/uploads/2020/12/logo-congregacao-branco.svg"
          alt="Logo"
          className="h-16 w-auto object-contain cursor-pointer"
          onClick={handleClickMenu}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        />
      </motion.div>

      <motion.h1
        className="font-normal text-white mx-[20px] flex-1 text-center md:mx-[12px] sm:text-[1rem] md:text-[2rem] m:mx-[8px] truncate md:truncate-none block"
        variants={itemVariants}
      >
        {getPageTitle()}
      </motion.h1>

      <motion.div
        className="flex items-center gap-[16px] md:gap-[8px] sm:gap-[4px]"
        variants={itemVariants}
      >
        <AnimatePresence>
          <motion.span
            className="mr-2 text-white text-[16px] leading-normal whitespace-nowrap hidden md:inline"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            Bem-vindo <strong>{nameUser}</strong>!
          </motion.span>
        </AnimatePresence>

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                className="p-2 md:p-1.5 sm:p-1 text-white hover:bg-white"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <User className="w-[24px] h-[24px] md:w-[22px] md:h-[22px] sm:w-[20px] sm:h-[20px]" />
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="min-w-[200px] bg-white shadow-md rounded-md border cursor-pointer"
          >
            <motion.div whileHover={{ scale: 1.02 }}>
              <DropdownMenuItem
                onClick={handleEditModal}
                className="text-muted-foreground h-10 px-4 cursor-pointer hover:bg-blue-800"
              >
                <User className="w-[24px] h-[24px] md:w-[22px] md:h-[22px] sm:w-[20px] sm:h-[20px]" />
                Meu Perfil
              </DropdownMenuItem>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <DropdownMenuItem
                onClick={handleLogOut}
                className="text-red-700 h-10 px-4 cursor-pointer"
              >
                <LogOut className="w-[24px] h-[24px] md:w-[22px] md:h-[22px] sm:w-[20px] sm:h-[20px]" />
                Sair
              </DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
      <DialogPerfilAction open={openModal} onOpenChange={setOpenModal} />
      <DialogLogOut open={openModalLogOut} onOpenChange={setOpenModalLogOut} />
    </motion.header>
  );
};
