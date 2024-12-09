/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from 'react';
import {
  BodyModalAlert,
  ButtonContainer,
  CloseButton,
  ContainerModalAlert,
  HeaderModal,
  StyledButtonAlert,
  StyledErrorIcon,
  StyledTypography,
  SubtitleTypography,
  TitleTypography,
} from './styles';

import CustomModal from '@/components/common/modal/CustomModal';
import CloseIcon from '@mui/icons-material/Close';

interface AlertModalProps {
  onCloseAlert: () => void;
  open: boolean;
  title: string;
  text: string;
  onClick: (value?: any) => void;
  headerTitle: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  onCloseAlert,
  open,
  title,
  text,
  headerTitle,
  onClick,
}) => {
  return (
    <CustomModal open={open} onClose={onCloseAlert}>
      <ContainerModalAlert>
        <HeaderModal>
          <StyledTypography variant="h6">{headerTitle}</StyledTypography>
          <CloseButton onClick={onCloseAlert} aria-label="close">
            <CloseIcon />
          </CloseButton>
        </HeaderModal>
        <BodyModalAlert>
          <StyledErrorIcon />
          <TitleTypography variant="h5">{title}</TitleTypography>
          <SubtitleTypography>{text}</SubtitleTypography>
          <ButtonContainer>
            <StyledButtonAlert onClick={onCloseAlert} variant="contained" color="secondary">
              Não
            </StyledButtonAlert>
            <StyledButtonAlert
              onClick={() => {
                onClick();
                onCloseAlert();
              }}
              variant="contained"
              color="primary"
            >
              Sim
            </StyledButtonAlert>
          </ButtonContainer>
        </BodyModalAlert>
      </ContainerModalAlert>
    </CustomModal>
  );
};

export default memo(AlertModal);
