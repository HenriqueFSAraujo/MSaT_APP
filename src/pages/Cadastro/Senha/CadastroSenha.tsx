/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCadastro } from '@/hooks/useCadastroFrom';
import { userService } from '@/services/userService';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import LockIcon from '@mui/icons-material/Lock';
import ModalBiometria from '@/components/layout/components/modalBiometria/modalBiometria';
import CameraCapture from '@/components/common/componentCam/CameraCapture';
import CloseIcon from '@mui/icons-material/Close';
import TokenRegistration from '@/components/common/TokenRegistration';
import { Role } from '@/services/userService';

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Skeleton,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BodyModalAlert,
  BodyModalCam,
  ButtonContainer,
  CloseButton,
  ContainerInput,
  ContainerModalAlert,
  ContainerModalCam,
  FormContainer,
  HeaderModal,
  ImageContainer,
  InputComponet,
  Label,
  LoginContainer,
  StyledButtonAlert,
  StyledCheckIcon,
  StyledErrorIcon,
  StyledForm,
  StyledPaper,
  StyledReportIcon,
  StyledTypography,
  SubtitleTypography,
  TextTypography,
  TitleTypography,
  TitleTypographyCenter,
} from './styles';
import imgcarsblue from '@/assets/carrosVersaoAzul.svg';
import CustomModal from '@/components/common/modal/CustomModal';

const CadastroSenha: React.FC = () => {
  const { form, onSubmit: originalOnSubmit, error, errors, isPending } = useCadastro();
  const [openAlert, setOpenAlert] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [success, setSuccess] = useState(false);
  const [erro, setErro] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [showtoken, setShowtoken] = useState(true);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isAgenteOficial = (roles: Role[]): boolean => {
    return roles.some((role) => role.name === 'ROLE_AGENTE_OFICIAL');
  };

  const tips = [
    'Centralize seu rosto na tela.',
    'Olhe diretamente para a câmera.',
    'Escolha um local bem iluminado.',
    'Remova acessórios que possam cobrir o rosto, como óculos e chapéus',
    'E permita a plataforma o uso da câmera do seu dipositivo',
  ];

  const handleTakePhoto = () => {
    setOpenAlert(false);
    setOpenCamera(true);
  };

  const handleTokenValidated = () => {
    setShowtoken(false);
  };

  const onSubmit = async (data: any) => {
    try {
      const loginSuccess = await originalOnSubmit(data);

      if (loginSuccess && id) {
        const userData = await userService.getUserById(Number(id));

        if (isAgenteOficial(userData.roles)) {
          setOpenAlert(true);
        } else {
          const userInfo = await userService.getUserById(Number(id));
          if (userInfo.passwordChangedByUser) {
            navigate('/dashboard');
          }
        }
      }
    } catch (error) {
      console.error('Erro ao processar submissão:', error);
    }
  };

  useEffect(() => {
    const checkUserToken = async () => {
      try {
        if (id) {
          const userData = await userService.getUserById(Number(id));
          const needsToken = userData.roles.some((role) => role.requiresTokenFirstLogin);
          console.log('requiresTokenFirstLogin', needsToken);
          setShowtoken(needsToken);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error checking user token requirement:', error);
        setLoading(false);
      }
    };

    checkUserToken();
  }, [id]);

  if (loading) {
    return (
      <LoginContainer>
        <FormContainer>
          <StyledPaper>
            <Skeleton variant="rectangular" width="100%" height={40} sx={{ mb: 4 }} />

            <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 3 }} />

            <Skeleton variant="rectangular" width="100%" height={20} sx={{ mb: 2 }} />

            <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 3 }} />

            <Skeleton
              variant="rectangular"
              width="100%"
              height={50}
              sx={{ borderRadius: '26px' }}
            />
          </StyledPaper>
        </FormContainer>
        <ImageContainer>
          <Skeleton variant="rectangular" width="90%" height={600} />
        </ImageContainer>
      </LoginContainer>
    );
  }

  return (
    <>
      <LoginContainer>
        <FormContainer>
          {showtoken ? (
            <TokenRegistration onTokenValidated={handleTokenValidated} userId={Number(id)} />
          ) : (
            <StyledPaper>
              <Typography
                color="#444F60"
                gutterBottom
                sx={{
                  fontWeight: '400',
                  textAlign: 'left',
                  mb: 4,
                  fontSize: '23px',
                  lineHeight: '16px',
                }}
              >
                Cadastre sua senha
              </Typography>

              {error && (
                <Typography color="error" sx={{ mb: 3, textAlign: 'center' }}>
                  {error}
                </Typography>
              )}

              <StyledForm onSubmit={form.handleSubmit(onSubmit)}>
                <ContainerInput>
                  <Label>Login</Label>
                  <Controller
                    name="username"
                    control={form.control}
                    render={({ field }) => (
                      <InputComponet
                        {...field}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        error={!!errors.username}
                        helperText={errors.username?.message}
                        InputProps={{
                          startAdornment: <AccountCircleIcon sx={{ mr: 1 }} />,
                        }}
                        sx={{ mb: 3 }}
                      />
                    )}
                  />
                </ContainerInput>

                <ContainerInput>
                  <Label>Senha</Label>
                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <InputComponet
                        {...field}
                        fullWidth
                        margin="normal"
                        type={showSenha ? 'text' : 'password'}
                        variant="outlined"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        InputProps={{
                          startAdornment: <LockIcon sx={{ mr: 1 }} />,
                          inputProps: {
                            maxLength: 8,
                          },
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowSenha(!showSenha)} edge="end">
                                {showSenha ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 3 }}
                      />
                    )}
                  />
                </ContainerInput>

                <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
                  <InfoIcon sx={{ color: '#E75454', width: '20px', height: '20px' }} />
                  <Label sx={{ fontSize: '15px' }}>Pelo menos 4 caracteres, letras e números</Label>
                </Box>

                <ContainerInput>
                  <Label>Confirmar senha:</Label>
                  <Controller
                    name="confirmPassword"
                    control={form.control}
                    render={({ field }) => (
                      <InputComponet
                        {...field}
                        fullWidth
                        margin="normal"
                        type={showConfirmarSenha ? 'text' : 'password'}
                        variant="outlined"
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        InputProps={{
                          startAdornment: <LockIcon sx={{ mr: 1 }} />,
                          inputProps: {
                            maxLength: 8,
                          },
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                                edge="end"
                              >
                                {showConfirmarSenha ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 3 }}
                      />
                    )}
                  />
                </ContainerInput>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    mt: 2,
                    borderRadius: '26px',
                    padding: '14px 0',
                    backgroundColor: '#3B5C69',
                    '&:hover': {
                      backgroundColor: '#2d4752',
                    },
                    fontSize: '23px',
                    lineHeight: '16px',
                  }}
                  disabled={isPending}
                >
                  {isPending ? <CircularProgress /> : 'Continuar'}
                </Button>
              </StyledForm>
            </StyledPaper>
          )}
        </FormContainer>

        <ImageContainer>
          <img src={imgcarsblue} alt="carros" />
        </ImageContainer>
      </LoginContainer>

      <CustomModal open={openAlert} onClose={() => {}}>
        <ContainerModalAlert>
          <HeaderModal>
            <StyledTypography variant="h6">Biometria facial</StyledTypography>
            {success && (
              <CloseButton
                onClick={() => {
                  setOpenAlert(false);
                  navigate('/dashboard');
                }}
                aria-label="close"
              >
                <CloseIcon />
              </CloseButton>
            )}
          </HeaderModal>
          <BodyModalAlert>
            {erro ? (
              <>
                <StyledReportIcon />
                <TitleTypographyCenter variant="h5">Algo deu errado!</TitleTypographyCenter>
                <TextTypography>
                  <br />
                  Não foi possível processar sua foto. Por favor, tente novamente seguindo as dicas
                  abaixo:
                </TextTypography>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                  {tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </>
            ) : success ? (
              <>
                <StyledCheckIcon />
                <TitleTypographyCenter variant="h5">
                  Tudo certo! Sua foto foi cadastrada com sucesso! Obrigado por colaborar!
                </TitleTypographyCenter>
              </>
            ) : (
              <>
                <StyledErrorIcon />
                <TitleTypography variant="h5">
                  Ei! Para seguir, só falta cadastrar uma foto. Rapidinho!
                </TitleTypography>
                <SubtitleTypography>Dicas para uma boa foto:</SubtitleTypography>
                <TextTypography>
                  <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                    {tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </TextTypography>
              </>
            )}
          </BodyModalAlert>
          <ButtonContainer>
            {!success && !erro && (
              <StyledButtonAlert onClick={handleTakePhoto} variant="outlined" color="primary">
                Tirar foto
              </StyledButtonAlert>
            )}
            {erro && (
              <StyledButtonAlert onClick={handleTakePhoto} variant="outlined" color="primary">
                Tentar novamente
              </StyledButtonAlert>
            )}
          </ButtonContainer>
        </ContainerModalAlert>
      </CustomModal>

      <ModalBiometria
        open={openCamera}
        onClose={() => {
          // setOpenCamera(false);
        }}
      >
        <ContainerModalCam>
          <BodyModalCam>
            <CameraCapture
              mode="register"
              userId={Number(id)}
              onclose={() => {
                setOpenCamera(false);
                setOpenAlert(true);
                if (!erro) {
                  setSuccess(true);
                }
              }}
              onSuccess={(success) => {
                if (success) {
                  setSuccess(true);
                  setErro(false);
                }
              }}
              onError={() => {
                setErro(true);
                setSuccess(false);
                setOpenCamera(false);
                setOpenAlert(true);
              }}
            />
          </BodyModalCam>
        </ContainerModalCam>
      </ModalBiometria>
    </>
  );
};

export default CadastroSenha;
