import React from 'react';
import { useLocation } from 'react-router-dom';
import AppContainer from '@/components/common/container/Container';
import { Header } from '@/components/layout/Header/Header';
import {} from './styles';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const shouldRenderHeader =
    !['/404'].includes(location.pathname) && !location.pathname.startsWith('/404');

  return (
    <>
      <Header shouldRender={shouldRenderHeader} />
      <AppContainer>{children}</AppContainer>
    </>
  );
};
