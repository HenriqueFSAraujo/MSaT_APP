import React, { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Menu, MenuItem } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  StyledAppBar,
  StyledToolbar,
  LeftSection,
  RightSection,
  AdminText,
  TransparentIconButton,
  PageTitle,
  LogoBoxLogin,
  LogoBox,
} from './styles';
import MenuComponent from '@/components/layout/Menu/menu';

interface HeaderProps {
  shouldRender: boolean;
}

export const Header: React.FC<HeaderProps> = ({ shouldRender }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleClick = () => {};

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!shouldRender) return null;

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/dashboard/consulta':
        return 'Consulta';
      case '/dashboard/users':
        return 'Usuários';
      default:
        return 'Página';
    }
  };

  const isLoginPage =
    location.pathname === '/login' || location.pathname.startsWith('/cadastrarSenha/');

  if (isLoginPage) {
    return (
      <StyledAppBar position="static">
        <StyledToolbar>
          <LeftSection>
            <LogoBoxLogin></LogoBoxLogin>
          </LeftSection>

          <Box />

          <RightSection></RightSection>
        </StyledToolbar>
      </StyledAppBar>
    );
  }

  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <LeftSection>
          <MenuComponent />
          <LogoBox onClick={() => navigate('/dashboard')}></LogoBox>
        </LeftSection>

        <PageTitle variant="h3">{getPageTitle()}</PageTitle>

        <RightSection>
          <AdminText>Olá Administrador Montreal!</AdminText>{' '}
          <TransparentIconButton
            color="inherit"
            onClick={handleClick}
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <PersonIcon />
          </TransparentIconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleClose}>Perfil Localizador</MenuItem>
            <MenuItem onClick={handleClose}>Perfil ADM</MenuItem>
            <MenuItem onClick={handleClose}>Perfil Pátio</MenuItem>
          </Menu>
          <TransparentIconButton color="inherit">
            <SettingsIcon />
          </TransparentIconButton>
        </RightSection>
      </StyledToolbar>
    </StyledAppBar>
  );
};
