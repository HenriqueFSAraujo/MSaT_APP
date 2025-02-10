import styled from 'styled-components';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';

export const ContainerButtonClose = styled.div`
  width: 250px;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: end;
`;

export const DrawerContent = styled(Box)`
  width: 250px;
  height: 100vh;
  background-color:rgb(15, 48, 121);

  svg {
    fill: ${({ theme }) => theme.palette.bgColor.white};
  }

  span {
    color: #fff;
  }
`;

export const MenuButton = styled(Button)`
  svg {
    fill: ${({ theme }) => theme.palette.bgColor.white};
  }
`;

export const ListItemComponet = styled(ListItem)`
  &:hover {
    background-color: #15232a;
  }
`;
