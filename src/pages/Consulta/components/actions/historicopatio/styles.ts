import { Button, Select, TextField, Typography } from '@mui/material';
import styled from 'styled-components';

const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  laptop: '1024px',
};

export const InputComponent = styled(TextField)`
  & .MuiInputBase-root {
    height: 32px;
  }

  & .MuiOutlinedInput-input {
    padding: 4px 8px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
    & .MuiInputBase-root {
      font-size: 14px;
    }
  }
`;

export const SelectComponent = styled(Select)`
  & .MuiInputBase-root {
    height: 32px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
  }
`;

export const Label = styled(Typography)`
  height: 24px;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 14px;
  }
`;

export const ContainerInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;

  @media (max-width: ${breakpoints.mobile}) {
    gap: 2px;
  }
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 10px;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 5px;
    gap: 15px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    width: 100%;
  }
`;

export const SaveButton = styled(Button)`
  width: 70px;
  height: 37px;

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
  }
`;

export const CancelButton = styled(Button)`
  width: 89px;
  height: 37px;

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
  }
`;

export const InputGroupContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 12px;
  width: 100%;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    gap: 15px;
  }
`;

export const InputComponet = styled(TextField)`
  & .MuiInputBase-root {
    height: 32px;
  }

  & .MuiOutlinedInput-input {
    padding: 4px 8px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
    & .MuiInputBase-root {
      font-size: 14px;
    }
  }
`;

export const ContainerTable = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 15px 0;
  overflow-x: auto;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 10px 0;
  }
`;

export const CardContainerRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 15px;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const ContainerField = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 12px;

  @media (max-width: ${breakpoints.mobile}) {
    margin-top: 8px;
  }
`;

export const TitleField = styled.span`
  display: flex;
  width: 100%;
  flex-direction: column;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 14px;
  }
`;

export const ContainerValueField = styled.div`
  border: 1px solid #e0e0e0;
  background-color: #e9ecef;
  border-radius: 4px;
  padding: 7px 8px 4px 8px;
  font-weight: 600;
  line-height: 17.6px;
  letter-spacing: 0.01em;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  word-break: break-word;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 12px;
    line-height: 16px;
    padding: 6px;
  }
`;

export const CardContainerGroup = styled.div`
  display: flex;
  width: 100%;
  gap: 15px;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const ButtonContainerLocalizador = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0;

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    width: 100%;
  }
`;

export const StyledButton = styled(Button)<{ $isActive: boolean }>`
  && {
    padding: 6px 10px;
    background-color: ${({ $isActive, theme }) =>
      $isActive ? theme.palette.primary.main : theme.palette.secondary.main};
    color: white;

    @media (max-width: ${breakpoints.mobile}) {
      width: 100%;
      font-size: 14px;
    }

    &:hover {
      background-color: ${({ $isActive, theme }) =>
        $isActive ? theme.palette.primary.dark : theme.palette.secondary.dark};
    }
  }
`;

export const NoHistoryText = styled.p`
  font-size: 16px;
  color: #666;
  padding: 20px;
  border-radius: 4px;
  margin: 10px 0;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 14px;
    padding: 15px;
    margin: 5px 0;
  }
`;

export const StyledTextArea = styled(TextField)`
  width: 100%;

  & .MuiInputBase-root {
    min-height: 100px;
  }

  & .MuiOutlinedInput-input {
    padding: 8px 14px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    & .MuiInputBase-root {
      min-height: 80px;
      font-size: 14px;
    }

    & .MuiOutlinedInput-input {
      padding: 6px 10px;
    }
  }
`;

export const TableWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  /* @media (max-width: ${breakpoints.tablet}) {
    margin: 0 -10px;
    padding: 0 10px;
    width: calc(100% + 20px);
  } */

  &::-webkit-scrollbar {
    height: 6px;

    @media (max-width: ${breakpoints.mobile}) {
      height: 4px;
    }
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  table {
    min-width: 600px;

    @media (max-width: ${breakpoints.mobile}) {
      font-size: 14px;

      th,
      td {
        padding: 8px 6px;
      }
    }
  }
`;
