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
  padding: 24px 14px 16px;

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
  margin-top: 30px;
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
  width: 53px;
  height: 37px;
  margin-left: 10px;
`;

export const StyledErrorIcon = styled(ErrorIcon)`
  /* font-size: 6.5rem; */
  color: #f8d186; // Amarelo
`;

export const StyledTypography = styled(Typography)`
  font-weight: bold;
  color: #333;
`;

export const SubtitleTypography = styled(Typography)`
  font-size: 15px;
  font-weight: 400;
  line-height: 18.86px;
  padding: 10px 0;
`;

export const TitleTypography = styled(Typography)`
  font-size: 30px;
  font-weight: 400;
  line-height: 37.71px;
`;
