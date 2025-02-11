import styled from 'styled-components';
import { AppBar, Toolbar, IconButton, Typography, Box, Menu } from '@mui/material';

const BREAKPOINTS = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
};

export const StyledAppBar = styled(AppBar)`
  height: 76px;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    height: 64px;
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    height: 56px;
  }
`;

export const LoginAppBar = styled(StyledAppBar)`
  justify-content: center;
`;

export const StyledToolbar = styled(Toolbar)`
  height: 100%;
  justify-content: space-between;
  background-color: rgb(11, 89, 172);
  padding-right: 22px !important;

  div {
    color: ${({ theme }) => theme.palette.bodyColorWhite} !important;
    font-size: 31px;
    font-weight: 400;
    line-height: 38.97px;
    text-align: left;

    @media (max-width: ${BREAKPOINTS.tablet}) {
      font-size: 24px;
      line-height: normal;
    }

    @media (max-width: ${BREAKPOINTS.mobile}) {
      font-size: 20px;
    }
  }

  @media (max-width: ${BREAKPOINTS.tablet}) {
    padding: 0 16px !important;
    min-height: 64px !important;
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    padding: 0 12px !important;
    min-height: 56px !important;
  }
`;

export const LeftSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    gap: 12px;
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    gap: 8px;
  }
`;

export const LogoBox = styled(Box)`
  margin-left: 20px;
  cursor: pointer;

  img {
    height: auto;
    max-width: 100%;
    max-height: 100px;

    @media (max-width: ${BREAKPOINTS.tablet}) {
      max-height: 32px;
    }
  }

  @media (max-width: ${BREAKPOINTS.tablet}) {
    margin-left: 12px;
    display: none;
  }
`;

export const LogoBoxLogin = styled(Box)`
  margin-left: 20px;
  cursor: pointer;

  img {
    height: auto;
    max-width: 100%;
    max-height: 100px;

    @media (max-width: ${BREAKPOINTS.tablet}) {
      max-height: 32px;
    }
  }

  @media (max-width: ${BREAKPOINTS.tablet}) {
    margin-left: 12px;
    /* display: none; */
  }
`;

export const RightSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    gap: 8px;
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    gap: 4px;
  }
`;

export const AdminText = styled(Typography)`
  margin-right: 8px !important;
  color: ${({ theme }) => theme.palette.bodyColorWhite} !important;
  font-size: 16px !important;
  line-height: normal !important;
  white-space: nowrap;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    display: none;
  }
`;

export const TransparentIconButton = styled(IconButton)`
  background-color: transparent;
  padding: 8px;
  color: ${({ theme }) => theme.palette.bodyColorWhite} !important;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .MuiSvgIcon-root {
    font-size: 24px;

    @media (max-width: ${BREAKPOINTS.tablet}) {
      font-size: 22px;
    }

    @media (max-width: ${BREAKPOINTS.mobile}) {
      font-size: 20px;
    }
  }

  @media (max-width: ${BREAKPOINTS.tablet}) {
    padding: 6px;
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    padding: 4px;
  }
`;

export const PageTitle = styled(Typography)`
  font-size: 31px !important;
  font-weight: 400 !important;
  color: ${({ theme }) => theme.palette.bodyColorWhite} !important;
  margin: 0 20px !important;
  flex: 1;
  text-align: center !important;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    font-size: 24px !important;
    margin: 0 12px !important;
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    font-size: 18px !important;
    margin: 0 8px !important;
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

// Estilizações adicionais para o Menu
export const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    background-color: #ffffff;
    min-width: 200px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    margin-top: 8px;
  }

  .MuiMenuItem-root {
    font-size: 14px;
    padding: 12px 16px;

    &:hover {
      background-color: rgba(59, 92, 105, 0.05);
    }

    @media (max-width: ${BREAKPOINTS.mobile}) {
      font-size: 13px;
      padding: 10px 14px;
    }
  }
`;

// Container para o logo e título no modo responsivo
export const TitleContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    justify-content: flex-start;
  }
`;

// Estilos para o Menu Mobile
export const MobileMenuIcon = styled(IconButton)`
  display: none;
  color: ${({ theme }) => theme.palette.bodyColorWhite} !important;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    display: flex;
    padding: 8px;
    margin-right: 8px;
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    padding: 6px;
    margin-right: 4px;
  }
`;

// Drawer styles para menu mobile se necessário
export const StyledDrawer = styled(Box)`
  width: 250px;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    width: 200px;
  }
`;
