import { Header } from '@/components/Header/Header';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { token: isAuthenticated } = useAuthStore();
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <motion.div 
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {!isLoginPage && isAuthenticated && <Header />}
      <main className="flex-1">
        {children}
      </main>
    </motion.div>
  );
};