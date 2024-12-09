import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Webcam from 'react-webcam';
import { styled } from 'styled-components';

export const ContainerCam = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
  }
`;

export const CameraContainer = styled.div`
  width: 100%;
  height: 80%;
  overflow: hidden;
`;

export const StyledWebcam = styled(Webcam)`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translatey(-50%) scaleX(-1) !important;
  width: 50%;
  height: 85%;
  object-fit: cover;
  border-radius: 50%;
  background: #1d1d1d;

  @media (max-width: 768px) {
    width: 75%;
    height: 85%;
  }
`;

export const ButtonContainer = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  justify-content: center;
  padding-bottom: 14px;
  padding-top: 14px;
  border-top: 1px solid #b7b7b7;

  border-bottom-left-radius: 6px !important;
  border-bottom-right-radius: 6px !important;
`;

export const StyledButtonAlert = styled(Button)`
  min-width: 100px;
  height: 37px;
  margin-left: 10px;

  font-size: 18px !important;
  font-weight: 400 !important;
  line-height: 22.63px !important;
`;

export const CapturedImage = styled.img`
  width: 45%;
  height: 70%;
  border-radius: 50%;
  object-fit: cover;
  position: relative;
  top: 45%;
  left: 50%;
  transform: translateX(-50%) translatey(-50%) scaleX(-1) !important;

  @media (max-width: 768px) {
    width: 65%;
    height: 70%;
  }
`;

export const FloatingTopContainer = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  z-index: 10;

  @media (max-width: 768px) {
    top: 20px;
    right: 20px;
  }
`;

export const SwitchCameraButton = styled(IconButton)`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.5) !important;
  padding: 15px !important;
  color: black !important;
  z-index: 10;

  @media (max-width: 768px) {
    top: 40px;
    right: 20px;
  }

  &:hover {
    background: white !important;
  }

  .MuiSvgIcon-root {
    font-size: 2rem;
  }
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
`;

export const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 18px;
  line-height: 1.6;
  max-width: 600px;
  margin: 20px auto;
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

export const StyledTypography = styled(Typography)`
  font-weight: bold;
  color: #333;
`;

export const ButtonsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  z-index: 10;
  padding: 0 20px;

  @media (max-width: 768px) {
    bottom: 5vh;
  }
`;

export const Text = styled.span`
  color: #0d181c;
  font-size: 14px;
  position: absolute;
  bottom: 75px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  width: 100%;
`;
