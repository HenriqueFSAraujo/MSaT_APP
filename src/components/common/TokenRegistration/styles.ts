import { TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
`;

export const StyledForm = styled.form`
  width: 100%;
`;

export const StyledPaper = styled.div`
  display: flex;
  gap: 30px;
  flex-direction: column;
  padding: 40px 30px;
  width: 100%;
  max-width: 380px;
  border-radius: 6px !important;
  background-color: ${({ theme }) => theme.palette.bgColor.white};
  /* box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); */
  /* border: 1px solid #e5e5e5; */
  border: 1px solid #387c8e;

  /* @media (min-width: 900px) {
    padding: 56px;
  } */
  h2 {
    max-width: 300px;
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
  margin-top: 0px !important;

  & .MuiInputBase-root {
    height: 45px;
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

  svg {
    fill: #dbdbdb;
  }
`;
