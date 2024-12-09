// styles.ts
import { TextField, Typography } from '@mui/material';
import styled from 'styled-components';

export const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 18px;

  h2 {
    font-size: 22px;
    font-weight: 600;
    line-height: 27.65px;
    letter-spacing: 0.01em;
    text-align: left;

    @media (max-width: 768px) {
      font-size: 20px;
    }
  }
`;

export const ConatainerFilter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 30px 18px;

  @media (max-width: 768px) {
    padding: 20px 12px;
  }
`;

export const Card = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.palette.bgColor.card};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.palette.borderColor};
  display: flex;
  flex-direction: column;
  padding: 18px 18px;

  @media (max-width: 768px) {
    padding: 12px;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    line-height: 17.6px;
    letter-spacing: 0.01em;
    text-align: left;
    margin-top: 8px;
    margin-bottom: 8px;

    @media (max-width: 768px) {
      font-size: 16px;
    }
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

export const ContainerCards = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
`;

export const ContainerButons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    width: 100%;

    button {
      width: 100%;
    }
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

  @media (min-width: 769px) {
    width: calc(20% - 0.8rem); // Para 5 campos em linha com gap
  }
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
