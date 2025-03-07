/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/CameraCapture/index.tsx
import { useState, useEffect, memo } from 'react';
import Webcam from 'react-webcam';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import { biometricService } from '@/services/biometricService';
import {
  ContainerCam,
  CameraContainer,
  StyledWebcam,
  ButtonContainer,
  StyledButtonAlert,
  CapturedImage,
  FloatingTopContainer,
  SwitchCameraButton,
  ErrorContainer,
  ErrorMessage,
  HeaderModal,
  StyledTypography,
  ButtonsContainer,
  Text,
} from './styles';

interface BrowserMessages {
  [key: string]: string;
}

interface CameraCaptureProps {
  mode: 'register' | 'validate';
  userId: number; // Changed from optional to required
  onclose: () => void;
  onSuccess: (success: boolean) => void;
  onError: (error: any) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  onclose,
  mode,
  userId,
  onSuccess,
  onError,
}) => {
  const webcamRef = ref<Webcam | null>(null);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const handleUserMedia = () => {
    setIsCameraReady(true);
  };

  useEffect(() => {
    if (!userId || isNaN(Number(userId))) {
      console.error('Invalid or missing user ID');
      onError(new Error('ID do usuário inválido ou não fornecido'));
      onclose();
    }
  }, [userId, onError, onclose]);

  const getVideoConstraints = () => {
    return {
      facingMode,
      width: { min: 1280, ideal: 1920, max: 2560 },
      height: { min: 720, ideal: 1080, max: 1440 },
      aspectRatio: 1,
      frameRate: { ideal: 30, max: 60 },
      resizeMode: 'crop-and-scale',
    };
  };

  const capture = (): void => {
    if (webcamRef.current) {
      try {
        const imageSrc = webcamRef.current.getScreenshot({
          width: dimensions.width,
          height: dimensions.height,
        });
        if (imageSrc) {
          setCapturedImage(imageSrc);
        } else {
          throw new Error('Falha ao capturar imagem');
        }
      } catch (err) {
        console.error('Erro na captura:', err);
        alert('Não foi possível capturar a imagem. Tente novamente.');
      }
    }
  };

  const base64ToFile = (base64String: string, filename: string): File => {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleRegisterPhoto = async (base64Image: string) => {
    try {
      setIsProcessing(true);
      const imageFile = base64ToFile(base64Image, 'user-photo.jpg');

      if (!userId || isNaN(Number(userId))) {
        throw new Error('ID do usuário inválido ou não fornecido');
      }

      const response = await biometricService.uploadUserImage(Number(userId), imageFile);

      if (response.success === 'true') {
        onSuccess?.(true);
        onclose();
      } else {
        throw new Error('Falha ao registrar imagem');
      }
    } catch (error) {
      console.error('Erro ao registrar foto:', error);
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleValidatePhoto = async (base64Image: string) => {
    try {
      setIsProcessing(true);

      if (!userId || isNaN(Number(userId))) {
        throw new Error('ID do usuário inválido ou não fornecido');
      }

      const response = await biometricService.validateFacialBiometrics(Number(userId), base64Image);

      if (response.success) {
        onSuccess?.(true);
        onclose();
      } else {
        throw new Error('Falha na validação biométrica');
      }
    } catch (error) {
      console.error('Erro na validação biométrica:', error);
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const detectBestResolution = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: getVideoConstraints(),
        });
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();

        if (capabilities.width && capabilities.height) {
          setDimensions({
            width: capabilities.width.max || 1920,
            height: capabilities.height.max || 1080,
          });
        }

        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.error('Erro ao detectar resolução:', error);
      }
    };

    detectBestResolution();
  }, []);

  useEffect(() => {
    const checkSupport = async (): Promise<void> => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Seu navegador não suporta acesso à câmera');
        }

        if (!window.isSecureContext) {
          throw new Error('É necessário usar HTTPS para acessar a câmera');
        }

        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
        }

        setHasPermission(true);
        setIsSupported(true);
        stream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.error('Erro na verificação:', err);
        setIsSupported(false);

        const browser = detectBrowser();
        let message = `Erro de compatibilidade: ${err instanceof Error ? err.message : 'Erro desconhecido'}\n\n`;
        message += getBrowserSpecificMessage(browser);

        alert(message);
      }
    };

    checkSupport();
  }, []);

  const detectBrowser = (): string => {
    const userAgent = navigator.userAgent;
    if (userAgent.match(/chrome|chromium|crios/i)) return 'chrome';
    if (userAgent.match(/firefox|fxios/i)) return 'firefox';
    if (userAgent.match(/safari/i)) return 'safari';
    if (userAgent.match(/opr\//i)) return 'opera';
    if (userAgent.match(/edg/i)) return 'edge';
    return 'other';
  };

  const getBrowserSpecificMessage = (browser: string): string => {
    const messages: BrowserMessages = {
      chrome: 'Recomendamos usar o Chrome atualizado.',
      firefox:
        'No Firefox, certifique-se de que as permissões de câmera estão habilitadas em about:permissions',
      safari:
        "No Safari, verifique se 'Câmera' está habilitada nas Preferências do Sistema > Segurança e Privacidade",
      opera: 'No Opera, verifique as configurações de câmera em opera://settings/content/camera',
      edge: 'No Edge, verifique as configurações de câmera em edge://settings/content/camera',
      other: 'Recomendamos usar o Google Chrome para melhor compatibilidade',
    };
    return messages[browser] || messages.other;
  };

  const retakePhoto = (): void => {
    setCapturedImage('');
  };

  const sendPhoto = async (): Promise<void> => {
    if (capturedImage && !isProcessing) {
      if (mode === 'register') {
        await handleRegisterPhoto(capturedImage);
      } else if (mode === 'validate') {
        await handleValidatePhoto(capturedImage);
      }
    }
  };

  const getInstructionText = () => {
    if (mode === 'register') {
      return 'Registre sua foto para validação biométrica';
    }
    return 'Posicione seu rosto para validação biométrica';
  };

  if (!isSupported) {
    return (
      <ErrorContainer>
        <h2>Erro de Compatibilidade</h2>
        <ErrorMessage>
          <p>Seu navegador não suporta acesso à câmera.</p>
          <p>Por favor, tente:</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>• Usar o Google Chrome mais recente</li>
            <li>• Verificar se está usando HTTPS</li>
            <li>• Permitir acesso à câmera nas configurações do navegador</li>
          </ul>
        </ErrorMessage>
      </ErrorContainer>
    );
  }

  if (hasPermission === false) {
    return (
      <ErrorContainer>
        <h2>Acesso Negado</h2>
        <ErrorMessage>Acesso à câmera negado. Verifique as permissões do navegador.</ErrorMessage>
      </ErrorContainer>
    );
  }

  return (
    <ContainerCam>
      <HeaderModal>
        <div></div>
        <StyledTypography variant="h6">{getInstructionText()}</StyledTypography>
        <div></div>
      </HeaderModal>
      <CameraContainer>
        {capturedImage ? (
          <>
            <CapturedImage src={capturedImage} alt="Captured" />
            <ButtonsContainer>
              <Text>
                Prontinho! Dê uma olhada na foto para ver se gostou!
                <br />
                Gostou da foto? Clique em Enviar ou Tirar outra!
              </Text>
            </ButtonsContainer>
          </>
        ) : (
          <>
            <StyledWebcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              screenshotQuality={1}
              imageSmoothing={true}
              minScreenshotWidth={1920}
              minScreenshotHeight={1080}
              videoConstraints={getVideoConstraints()}
              onUserMedia={handleUserMedia}
              onUserMediaError={(err: string | DOMException) => {
                console.error('Erro na câmera:', err);
                setIsSupported(false);
                const errorMessage = err instanceof DOMException ? err.message : err;
                alert(
                  `Erro ao acessar a câmera: ${errorMessage}\n${getBrowserSpecificMessage(detectBrowser())}`
                );
              }}
            />
            <FloatingTopContainer>
              <SwitchCameraButton
                disabled={!isCameraReady}
                onClick={() => {
                  setIsCameraReady(false);
                  setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
                }}
              >
                <FlipCameraAndroidIcon />
              </SwitchCameraButton>
            </FloatingTopContainer>
          </>
        )}
      </CameraContainer>
      <ButtonContainer>
        {capturedImage ? (
          <>
            <StyledButtonAlert
              onClick={retakePhoto}
              variant="outlined"
              color="primary"
              disabled={isProcessing || !isCameraReady}
            >
              {!isCameraReady ? 'Iniciando câmera...' : 'Tirar foto'}
            </StyledButtonAlert>
            <StyledButtonAlert
              onClick={sendPhoto}
              variant="outlined"
              color="success"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processando...' : 'Enviar'}
            </StyledButtonAlert>
          </>
        ) : (
          <StyledButtonAlert
            onClick={capture}
            variant="outlined"
            color="primary"
            disabled={isProcessing}
          >
            Tirar foto
          </StyledButtonAlert>
        )}
      </ButtonContainer>
    </ContainerCam>
  );
};

export default memo(CameraCapture);
function ref<T>(arg0: null) {
  throw new Error('Function not implemented.');
}
