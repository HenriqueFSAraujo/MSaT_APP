import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';

export const SectionTitle = styled(Typography)`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 10px;
  }
`;




export const UploadButton = styled(Button)`
  max-width: 30%;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const UploadFieldContainer = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SectionContainer = styled.div`
  margin-top: 30px;
  padding: 0px 16px;

  @media (max-width: 768px) {
    margin-top: 20px;
    padding: 0px 12px;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

export const HalfWidthField = styled(TextField)`
  flex: 1; /* Faz com que os campos tenham a mesma largura */
  min-width: calc(50% - 10px); /* Cada campo ocupa 50% da linha menos o espaço entre eles */

  @media (max-width: 768px) {
    min-width: 100%; /* Para telas pequenas, ocupa a largura completa */
  }
`;

export const FullWidthField = styled(TextField)`
  width: 100%;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  gap: 15px;

  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;

export const StyledButton = styled(Button)`
  width: 100px;
  height: 40px;

  @media (max-width: 768px) {
    width: 90px;
    height: 38px;
  }
`;


export const Container = styled.div`
  display: flex;
  width: 100%;
  padding: 0px 16px 20px;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 768px) {
    padding: 30px 12px;
    gap: 25px;
  }
`;

export const CardContainerRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 15px;

  margin-top: 10px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const CardContainerGroup = styled.div`
  display: flex;
  width: 50%;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    gap: 0.8rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.8rem;
  }
`;

export const ContainerInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
`;

export const Label = styled(Typography)`
  height: 24px;
`;

export const InputComponet = styled(TextField)`
  & .MuiInputBase-root {
    height: 32px;
  }

  & .MuiOutlinedInput-input {
    padding: 4px 8px;
  }

  & .MuiOutlinedInput-notchedOutline {
    border-width: 1px;
  }

  & .MuiInputLabel-outlined {
    transform: translate(14px, 7px) scale(1);
  }

  & .MuiInputLabel-outlined.MuiInputLabel-shrink {
    transform: translate(14px, -6px) scale(0.75);
  }

  @media (max-width: 768px) {
    & .MuiInputBase-root {
      height: 40px; // Aumentando um pouco para melhor toque em mobile
    }
  }
`;


export const CancelButton = styled(Button)`
  width: 89px;
  height: 37px;
`;

export const SaveButton = styled(Button)`
  width: 70px;
  height: 37px;
`;
