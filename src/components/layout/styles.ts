import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import styled from 'styled-components';
import ErrorIcon from '@mui/icons-material/Error';
import Typography from '@mui/material/Typography';

export const BodyModalAlert = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 24px 14px 16px;

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
`;

export const CloseButton = styled(IconButton)`
  color: #666;
  color: transparent;
  padding: 8px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
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

export const StyledButtonAlert = styled(Button)`
  width: 101px;
  height: 37px;
  margin-left: 10px;

  font-size: 18px !important;
  font-weight: 400 !important;
  line-height: 22.63px !important;
`;

export const StyledErrorIcon = styled(ErrorIcon)`
  font-size: 4.5rem !important;
  color: #f8d186; // Amarelo
`;

export const StyledTypography = styled(Typography)`
  font-weight: bold;
  color: #333;
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

export const TitleTypography = styled(Typography)`
  font-size: 20px !important;
  font-weight: 400 !important;
  line-height: 25.14px !important;
  margin-top: 20px !important;
`;
