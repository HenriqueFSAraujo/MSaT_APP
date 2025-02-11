import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import styled from 'styled-components';

export const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled(Box)`
  /* background-color: white;
  border-radius: 8px;
  padding: 24px;
  overflow-y: auto; */
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 80%;
  max-width: 80%;
  max-height: 80vh;

  @media (max-width: 768px) {
    max-width: 90%;
  }
`;
