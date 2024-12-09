import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import styled from 'styled-components';

export const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 0;
    margin: 0;
  }
`;

export const ModalContent = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 300px;
  max-width: 80%;
  max-height: 80vh;

  @media (max-width: 768px) {
    min-width: 100%;
    max-width: 100%;
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    margin: 0;
    padding: 0;
    border-radius: 0;
  }
`;
