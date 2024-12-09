import styled, { keyframes } from 'styled-components';
import { TextField, Typography } from '@mui/material';

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
    width: 80%;
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
