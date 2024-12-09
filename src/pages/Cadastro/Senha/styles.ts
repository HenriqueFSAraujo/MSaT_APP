import styled, { keyframes } from 'styled-components';
import { Button, IconButton, TextField, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportIcon from '@mui/icons-material/Report';

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: calc(100vh - 76px);
  width: 100%;
  padding: 10px;
  background-color: transparent;

  @media (min-width: 900px) {
    flex-direction: row;
  }

  @media (max-width: 2560px) {
    width: 80%;
  }

  @media (max-width: 2000px) {
    width: 85%;
  }

  @media (max-width: 1750px) {
    width: 100%;
  }

  @media (max-width: 1440px) {
    width: 100%;
  }

  @media (max-width: 900px) {
    width: 100%;
    padding-top: 80px;
  }
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px;

  @media (min-width: 900px) {
    width: 35%;
  }
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

export const StyledForm = styled.form`
  width: 100%;
`;

export const ForgotPassword = styled(Typography)`
  margin-top: 10px !important;
  margin-bottom: 32px !important;
  text-align: right;
  cursor: pointer;
`;

export const ImageContainer = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 800px;
  height: 100%;
  /* position: relative; */
  /* overflow: hidden; */
  /* background-image: url("public/car-hero-left-blue.png"),
    url("public/car-hero-right-blue.png"); */
  /* background-image: url("carrosVersaoAzul.svg"); */
  /* background-size: contain; */
  /* background-position: left, right; */
  /* background-repeat: no-repeat; */

  img {
    width: 100%;
  }

  @media (max-width: 1024px) {
    width: 50%;
  }

  @media (max-width: 1440px) {
    width: 50%;
  }

  @media (max-width: 900px) {
    width: 100%;
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

const moveTopImage = keyframes`
  from {
    top: 30%;
    right: -5%;
  }
  to {
    top: 25%;
    right: 5%;
  }
`;

const moveBottomImage = keyframes`
  from {
    bottom: 25%;
    left: -5%;
  }
  to {
    bottom: 20%;
    left: 5%;
  }
`;

export const TopImage = styled.img`
  position: absolute;
  width: 45%;
  max-width: 600px;
  transform: rotate(0deg);
  animation: ${moveTopImage} 1.5s ease-out forwards;
`;

export const BottomImage = styled.img`
  position: absolute;
  width: 45%;
  max-width: 600px;
  transform: rotate(0deg);
  animation: ${moveBottomImage} 1.5s ease-out forwards;
`;

// =========================== biometria  CSS ======================================

export const ContainerModalAlert = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 500px;
  background-color: ${({ theme }) => theme.palette.bgColor.white};
  border-radius: 6px;
`;

export const HeaderModal = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #b7b7b7;
  padding: 11px 8px 9px 16px;
`;

export const CloseButton = styled(IconButton)`
  color: #666;
  color: transparent;
  padding: 8px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

export const StyledTypography = styled(Typography)`
  font-weight: bold;
  color: #333;
`;

export const BodyModalAlert = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 24px 14px 16px;
  min-height: 250px;

  svg {
    font-size: 6.5rem;
  }
`;

export const BodyModalCam = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 6px;

  /* padding: 24px 14px 16px; */

  svg {
    font-size: 6.5rem;
  }
`;

export const StyledErrorIcon = styled(ErrorIcon)`
  font-size: 4.5rem !important;
  color: #f8d186;
`;

export const StyledCheckIcon = styled(CheckCircleIcon)`
  font-size: 4.5rem !important;
  color: #388f68;
`;

export const StyledReportIcon = styled(ReportIcon)`
  font-size: 4.5rem !important;
  color: #7c1414;
`;

export const TitleTypographyCenter = styled(Typography)`
  font-size: 20px !important;
  font-weight: 400 !important;
  line-height: 25.14px !important;
  margin-top: 20px !important;
  /* width: 100%;
  display: flex;
  align-items: center;
  justify-content: center; */
  text-align: center;
`;

export const TitleTypography = styled(Typography)`
  font-size: 20px !important;
  font-weight: 400 !important;
  line-height: 25.14px !important;
  margin-top: 20px !important;
`;

export const SubtitleTypography = styled(Typography)`
  display: flex;
  width: 100%;
  font-size: 14px !important;
  font-weight: 400 !important;
  line-height: 17.6px !important;
  margin-top: 32px !important;
  padding-left: 10px;
`;

export const TextTypography = styled(Typography)`
  display: flex;
  width: 100%;
  font-size: 14px !important;
  font-weight: 400 !important;
  line-height: 17.6px !important;
  color: #7c1414 !important;
  padding-left: 10px;
`;
export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  justify-content: flex-end;
  padding-bottom: 14px;
  padding-top: 14px;
  padding-right: 20px;
  border-top: 1px solid #b7b7b7;
  min-height: 50px;
`;

export const StyledButtonAlert = styled(Button)`
  min-width: 101px;
  height: 37px;
  margin-left: 10px;

  font-size: 18px !important;
  font-weight: 400 !important;
  line-height: 22.63px !important;
`;

export const ContainerModalCam = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 500px;
  height: 600px;
  background-color: ${({ theme }) => theme.palette.bgColor.white};
  border-radius: 6px;

  @media (max-width: 768px) {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
  }
`;
