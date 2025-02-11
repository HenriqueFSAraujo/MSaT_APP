import { IconButton, Pagination, Typography, Button } from '@mui/material';
import styled from 'styled-components';

import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportIcon from '@mui/icons-material/Report';

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

export const ContainerModalAlert = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 500px;
  background-color: ${({ theme }) => theme.palette.bgColor.white};
  border-radius: 6px;
`;

export const BodyModalAlert = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 24px 14px 16px;
  min-height: 250px;

  svg {
    font-size: 6.5rem;
  }
`;

export const BodyModalCam = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 6px;

  /* padding: 24px 14px 16px; */

  svg {
    font-size: 6.5rem;
  }
`;

export const StyledErrorIcon = styled(ErrorIcon)`
  font-size: 4.5rem !important;
  color: #f8d186;
`;

export const StyledCheckIcon = styled(CheckCircleIcon)`
  font-size: 4.5rem !important;
  color: #388f68;
`;

export const StyledReportIcon = styled(ReportIcon)`
  font-size: 4.5rem !important;
  color: #7c1414;
`;

export const TitleTypographyCenter = styled(Typography)`
  font-size: 20px !important;
  font-weight: 400 !important;
  line-height: 25.14px !important;
  margin-top: 20px !important;
  /* width: 100%;
  display: flex;
  align-items: center;
  justify-content: center; */
  text-align: center;
`;

export const TitleTypography = styled(Typography)`
  font-size: 20px !important;
  font-weight: 400 !important;
  line-height: 25.14px !important;
  margin-top: 20px !important;
`;

export const SubtitleTypography = styled(Typography)`
  display: flex;
  width: 100%;
  font-size: 14px !important;
  font-weight: 400 !important;
  line-height: 17.6px !important;
  margin-top: 32px !important;
  padding-left: 10px;
`;

export const TextTypography = styled(Typography)`
  display: flex;
  width: 100%;
  font-size: 14px !important;
  font-weight: 400 !important;
  line-height: 17.6px !important;
  color: #7c1414 !important;
  padding-left: 10px;
`;
export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  justify-content: flex-end;
  padding-bottom: 14px;
  padding-top: 14px;
  padding-right: 20px;
  border-top: 1px solid #b7b7b7;
  min-height: 50px;
`;

export const StyledButtonAlert = styled(Button)`
  min-width: 101px;
  height: 37px;
  margin-left: 10px;

  font-size: 18px !important;
  font-weight: 400 !important;
  line-height: 22.63px !important;
`;

export const ContainerModalCam = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 500px;
  height: 600px;
  background-color: ${({ theme }) => theme.palette.bgColor.white};
  border-radius: 6px;

  @media (max-width: 768px) {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
  }
`;
