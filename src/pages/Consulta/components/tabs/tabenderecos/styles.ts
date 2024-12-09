import { Button, IconButton, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 15px;
`;

export const CardContainerRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 15px;
`;

export const CardContainerGroup = styled.div`
  display: flex;
  width: 100%;
  gap: 15px;
`;

export const ContainerField = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 12px;
`;
export const TitleField = styled.span`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

export const ContainerValueField = styled.div`
  border: 1px solid #e0e0e0;
  background-color: #e9ecef;
  border-radius: 4px;
  padding: 7px 8px 4px 8px;
  height: 30.6px;

  /* font-size: 14px; */
  font-weight: 600;
  line-height: 17.6px;
  letter-spacing: 0.01em;

  color: #000000;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const EditButton = styled(IconButton)`
  color: #666;
  padding: 2px !important;
  height: 17px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

export const ContainerValueFieldWhite = styled.div`
  /* border-bottom: 1px solid #E0E0E0; */
  background-color: transparent;
  border-radius: 4px;
  /* padding: 7px 8px 4px 8px; */

  span {
    border-bottom: 1px solid #e9ecef;
    padding: 7px 8px 4px 0px;
    width: 100%;
    margin-right: 10px;
  }

  /* font-size: 14px; */
  font-weight: 600;
  line-height: 17.6px;
  letter-spacing: 0.01em;

  color: #000000;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DownloadButton = styled(Button)`
  width: 62px;
  height: 29px;
  min-width: 62px; // Isso garante que o botão não encolha
  padding: 0;
  box-shadow: none !important;

  .MuiSvgIcon-root {
    font-size: 20px; // Ajuste o tamanho do ícone conforme necessário
  }
`;

export const ContainerTable = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 15px 0;
`;

export const StyledButton = styled(Button)`
  width: 227px;
  height: 35px;
  text-transform: none;
  font-size: 14px;
`;

export const ContainerModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%;
  background-color: ${({ theme }) => theme.palette.bgColor.white};
  border-radius: 6px;
  min-width: 80%;
`;

export const ContainerModalAlert = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 550px;
  background-color: ${({ theme }) => theme.palette.bgColor.white};
  border-radius: 6px;
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
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 24px 14px;
`;

export const BodyModalAlert = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 24px 14px;

  svg {
    font-size: 6.5rem;
  }
`;

export const FooterModal = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: 24px 14px;
`;

export const StyledErrorIcon = styled(ErrorIcon)`
  /* font-size: 6.5rem; */
  color: #f8d186; // Amarelo
`;

export const TitleTypography = styled(Typography)`
  font-size: 30px;
  font-weight: 400;
  line-height: 37.71px;
`;

export const SubtitleTypography = styled(Typography)`
  font-size: 15px;
  font-weight: 400;
  line-height: 18.86px;
  padding: 10px 0;
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  justify-content: flex-end;
  margin-top: 30px;
`;

export const StyledButtonAlert = styled(Button)`
  width: 53px;
  height: 37px;
  margin-left: 10px;
`;
