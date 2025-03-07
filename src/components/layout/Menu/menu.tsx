import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { useState } from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ContainerButtonClose, DrawerContent, ListItemComponet, MenuButton } from './styles';

import { defineAbilitiesFor } from '@/hooks/permission';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';

import DomainIcon from '@mui/icons-material/Domain';
import PersonIcon from '@mui/icons-material/Person';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export default function Menu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const permission = defineAbilitiesFor(localStorage.getItem('@garantias:role')!);

  const DrawerList = (
    <DrawerContent role="presentation">
      <ContainerButtonClose>
        <Button onClick={toggleDrawer(false)}>
          <CloseIcon />
        </Button>
      </ContainerButtonClose>
      <List onClick={toggleDrawer(false)}>
        {permission.can('Get', 'Dashboard') ? (
          <ListItemComponet disablePadding onClick={() => navigate('/dashboard')}>
            <ListItemButton>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItemComponet>
        ) : null}

        {permission.can('Get', 'User') ? (
          <ListItemComponet disablePadding onClick={() => navigate('/dashboard/users')}>
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Usuários" />
            </ListItemButton>
          </ListItemComponet>
        ) : null}

        {permission.can('Get', 'Sair') ? (
          <ListItemComponet
            disablePadding
            onClick={() => {
              localStorage.removeItem('@garantias:session');
              navigate('/login');
            }}
          >
            <ListItemButton>
              <ListItemIcon>
                <DomainIcon />
              </ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItemButton>
          </ListItemComponet>
        ) : null}
      </List>
    </DrawerContent>
  );

  return (
    <div>
      <MenuButton onClick={toggleDrawer(true)}>
        {' '}
        <MenuIcon />{' '}
      </MenuButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
