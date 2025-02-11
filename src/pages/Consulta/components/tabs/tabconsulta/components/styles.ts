import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';

export const InputComponent = styled(TextField)`
  & .MuiInputBase-root {
    height: 32px;
    min-height: 32px;
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

  @media (max-width: 600px) {
    & .MuiInputBase-root {
      height: 40px;
      min-height: 40px;
    }

    & .MuiOutlinedInput-input {
      padding: 8px 12px;
    }
  }
`;

export const Label = styled(Typography)`
  height: auto;
  min-height: 24px;
  font-size: 14px;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

export const ContainerInput = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
  margin-bottom: 16px;
`;

export const InputGroupContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 12px;
  padding: 0 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    padding: 0 8px;
  }
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;

  @media (max-width: 600px) {
    padding: 8px;
    gap: 16px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding: 0 16px;

  @media (max-width: 600px) {
    flex-direction: column-reverse;
    padding: 0 8px;
  }
`;

export const SaveButton = styled(Button)`
  min-width: 70px;
  height: 37px;

  @media (max-width: 600px) {
    width: 100%;
    height: 44px;
  }
`;

export const CancelButton = styled(Button)`
  min-width: 89px;
  height: 37px;

  @media (max-width: 600px) {
    width: 100%;
    height: 44px;
  }
`;
