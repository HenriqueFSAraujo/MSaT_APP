import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import styled from 'styled-components';

// Estilos personalizados
export const StyledTabs = styled(Tabs)`
  background-color: #f0f0f0;
  border-radius: 8px 8px 0 0;
  overflow: hidden;

  .MuiTabs-indicator {
    display: none; // Isso remove completamente o indicador
  }

  .Muitabs-selected {
    border-radius: 6px 6px 0 0;
  }
`;

export const StyledTab = styled(Tab)`
  min-width: 120px;
  border-radius: 8px 8px 0 0;
  margin-right: 2px;
  background-color: #e9ecef;
  color: #4b4b4b;
  font-weight: bold;
  text-transform: capitalize !important;
  /* transition: all 0.3s ease; */

  &.Mui-selected {
    background-color: #ffffff;
    color: #1976d2;
    border-radius: 6px 6px 0 0;
    margin-top: 4px; // Isso faz a aba selecionada parecer mais alta
    height: calc(100% + 4px); // Compensa a margem superior
  }
`;

export const TabPanel = styled(Box)`
  padding: 24px;
  background-color: #ffffff;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
