import { Button, RadioGroup, Select, TextField, Typography } from '@mui/material';
import styled from 'styled-components';

// Media queries breakpoints
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
  padding: 10px;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 5px;
    gap: 10px;
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

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
  }
`;

export const InputComponet = styled(TextField)`
  & .MuiInputBase-root {
    height: 32px;
  }

  & .MuiOutlinedInput-input {
    padding: 4px 8px;
  }
`;

export const ContainerTable = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 15px 0;
  overflow-x: auto;
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
`;

export const TitleField = styled.span`
  display: flex;
  width: 100%;
  flex-direction: column;
  font-size: 14px;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 12px;
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
  min-height: 32px;
  word-break: break-word;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 12px;
    line-height: 16px;
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

export const StyledRadioGroup = styled(RadioGroup)`
  display: flex;
  margin-bottom: 16px;
  width: 100%;
  gap: 100px;

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const AcionarCompanyButton = styled(Button)`
  width: 180px;
  height: 35px;
  border-radius: 4px;
  background-color: #10823f !important;
  color: #ffffff;

  &:hover {
    background-color: #0a6e2e !important;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
  }
`;

export const AlterarMandatarioButton = styled(Button)`
  width: 185px !important;
  height: 30px;
  text-transform: none;
  font-size: 12px;
  margin-top: 24px !important;
  margin-left: auto !important;

  @media (max-width: ${breakpoints.tablet}) {
    width: 100% !important;
    margin-left: 0 !important;
    margin-top: 12px !important;
  }
`;

export const TableWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 6px;
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
`;
