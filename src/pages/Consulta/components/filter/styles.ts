import { TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import styled from 'styled-components';

const BREAKPOINTS = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
};

export const Container = styled.div`
  display: flex;
  width: 100%;
  padding-top: 50px;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    padding-top: 30px;
  }
`;

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

    @media (max-width: ${BREAKPOINTS.tablet}) {
      font-size: 20px;
      line-height: 25px;
    }

    @media (max-width: ${BREAKPOINTS.mobile}) {
      font-size: 18px;
      line-height: 22px;
    }
  }
`;

export const ConatainerFilter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 30px 18px;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    padding: 20px 12px;
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    padding: 15px 10px;
  }
`;

export const Card = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.palette.bgColor.card};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.palette.borderColor};
  display: flex;
  flex-direction: column;
  padding: 14px 18px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    line-height: 17.6px;
    letter-spacing: 0.01em;
    text-align: left;
    margin-top: 8px;
    margin-bottom: 8px;

    @media (max-width: ${BREAKPOINTS.tablet}) {
      font-size: 16px;
    }
  }

  @media (max-width: ${BREAKPOINTS.tablet}) {
    padding: 12px 14px;
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    padding: 10px 12px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.8rem;
  }
`;

export const ContainerDate = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  min-width: 330px;

  span {
    padding-top: 27px;
  }

  @media (max-width: ${BREAKPOINTS.tablet}) {
    min-width: unset;
    flex-direction: column;
    gap: 0.5rem;

    span {
      padding-top: 0;
      padding-bottom: 0.5rem;
    }
  }
`;

export const ContainerOtherVehicle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    flex-direction: column;
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

  @media (max-width: ${BREAKPOINTS.tablet}) {
    flex-direction: column-reverse;
    width: 100%;

    button {
      width: 100%;
      margin: 0;
    }
  }
`;

export const Label = styled(Typography)`
  height: 24px;
  font-size: 14px;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    height: 20px;
    font-size: 13px;
  }
`;

export const ContainerInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    margin-bottom: 8px;
  }
`;

export const InputComponet = styled(TextField)`
  & .MuiInputBase-root {
    height: 32px;
  }

  & .MuiOutlinedInput-input {
    padding: 4px 8px;
    font-size: 14px;

    @media (max-width: ${BREAKPOINTS.tablet}) {
      font-size: 13px;
    }
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

  @media (max-width: ${BREAKPOINTS.mobile}) {
    & .MuiInputBase-root {
      height: 40px;
    }
  }
`;

export const CustomDatePicker = styled(DatePicker)`
  & .MuiInputBase-root {
    height: 32px;
  }

  & .MuiOutlinedInput-input {
    padding: 4px 8px;
    font-size: 14px;

    @media (max-width: ${BREAKPOINTS.tablet}) {
      font-size: 13px;
    }
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

  & .MuiIconButton-root {
    padding: 2px;
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    & .MuiInputBase-root {
      height: 40px;
    }

    & .MuiIconButton-root {
      padding: 8px;
    }
  }
`;
