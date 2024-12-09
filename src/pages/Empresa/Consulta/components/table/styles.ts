import { IconButton, Pagination, Typography, Button } from '@mui/material';
import styled from 'styled-components';

export const ContainerComponet = styled.div`
  margin: 30px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
`;

export const TableWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const Table = styled.table`
  width: 100%;
  min-width: 800px; // Garante uma largura mínima para tabelas em telas pequenas
  border-collapse: collapse;

  td,
  th {
    text-align: left;
    padding: 12px 16px;
    white-space: nowrap; // Previne quebra de texto
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px; // Limita o tamanho máximo das células
  }

  // Define larguras específicas para cada coluna
  th:nth-child(1),
  td:nth-child(1) {
    width: 10%;
  } // Nome
  th:nth-child(2),
  td:nth-child(2) {
    width: 5%;
  } // Email
  th:nth-child(3),
  td:nth-child(3) {
    width: 5%;
  } // Login
  th:nth-child(4),
  td:nth-child(4) {
    width: 5%;
  } // Perfil
  th:nth-child(5),
  td:nth-child(5) {
    width: 5%;
  } // Situação
  th:nth-child(6),
  td:nth-child(6) {
    width: 15%;
  } // Ações
  th:nth-child(7),
  td:nth-child(7) {
    width: 15%;
  } // Ações
  th:nth-child(8),
  td:nth-child(8) {
    width: 5%;
  } // Ações
  th:nth-child(9),
  td:nth-child(0) {
    width: 5%;
  } // Ações

  tr {
    background-color: #ffffff;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f8f9fa;
    }
  }

  tr:nth-child(odd) {
    background-color: #f2f2f2;

    &:hover {
      background-color: #e9ecef;
    }
  }
`;

export const Tbody = styled.tbody`
  width: 100%;

  td {
    vertical-align: middle;
  }
`;

export const Thead = styled.thead`
  width: 100%;
  height: 54px;
  background-color: ${({ theme }) => theme.palette.bgColor.header};

  tr {
    background-color: transparent !important;
  }

  th {
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: ${({ theme }) => theme.palette.bgColor.header};
  }
`;

export const StyledPagination = styled(Pagination)`
  && {
    .MuiPaginationItem-root {
      background-color: white;
      color: #38458f;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin: 0 2px; // Adicionando espaço entre os botões
      min-width: 32px;
      height: 32px;

      &:hover {
        background-color: #f5f5f5;
      }

      &.Mui-selected {
        background-color: #38458f;
        color: white;

        &:hover {
          background-color: #38458f;
        }
      }
    }
  }
`;

export const ContainerModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.bgColor.white};
  border-radius: 6px;
  min-width: 80%;
`;

export const HeaderModal = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #b7b7b7;
  padding: 11px 8px 9px 16px;
`;

export const StyledTypography = styled(Typography)`
  font-weight: bold;
  color: #333;
`;

export const CloseButton = styled(IconButton)`
  color: #666;
  color: transparent;
  padding: 8px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

export const BodyModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 24px 14px;
  max-height: 70vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
`;

export const FooterModal = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: 24px 14px;
`;

export const StyledButton = styled(Button)`
  width: 74px;
  height: 37px;
`;

export const NoResultsMessage = styled.td`
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #666;
`;
