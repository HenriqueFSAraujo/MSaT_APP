import { Button, Select, TextField, Typography } from '@mui/material';
import styled from 'styled-components';

// Componentes estilizados
export const InputComponent = styled(TextField)`
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

  & .MuiOutlinedInput-input.Mui-disabled {
    -webkit-text-fill-color: black !important;
  }
`;

export const SelectComponent = styled(Select)`
  & .MuiInputBase-root {
    height: 32px;
  }
`;

export const Label = styled(Typography)`
  height: 24px;
`;

export const ContainerInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

export const SaveButton = styled(Button)`
  width: 70px;
  height: 37px;
`;

export const CancelButton = styled(Button)`
  width: 89px;
  height: 37px;
`;

export const InputGroupContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 12px;
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

  & .MuiOutlinedInput-input.Mui-disabled {
    -webkit-text-fill-color: black !important;
  }
`;
