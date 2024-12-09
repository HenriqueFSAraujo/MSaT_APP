import { ReactNode } from 'react';
import { ModalContent, StyledModal } from './styles';

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const ModalBiometria: React.FC<CustomModalProps> = ({ open, onClose, children }) => {
  return (
    <StyledModal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <ModalContent>{children}</ModalContent>
    </StyledModal>
  );
};

export default ModalBiometria;
