/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Typography, Button, CircularProgress } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useLoginForm } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import {
  ContainerInput,
  ForgotPassword,
  FormContainer,
  ImageContainer,
  InputComponet,
  Label,
  LoginContainer,
  StyledForm,
  StyledPaper,
} from './styles';

import imgcarsblue from '@/assets/carrosVersaoAzul.svg';
import TokenRegistration from '@/components/common/TokenRegistration';
import { userService } from '@/services/userService';

const Login: React.FC = () => {
  const { form, onSubmit: originalOnSubmit, isPending, error, errors } = useLoginForm();
  const [showtoken, setShowtoken] = useState(false);
  // const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleTokenValidated = () => {
    setShowtoken(false);
    navigate('/dashboard');
  };

  const onSubmit = async (data: any) => {
    // setLoading(true);
    try {
      await new Promise((resolve) => {
        originalOnSubmit(data);
        const checkInterval = setInterval(() => {
          const session = localStorage.getItem('@garantias:session');
          if (session) {
            clearInterval(checkInterval);
            resolve(true);
          }
        }, 100);
      });

      const userId = localStorage.getItem('@garantias:id');
      if (userId) {
        const userData = await userService.getUserById(Number(userId));
        if (userData.tokenLogin) {
          setShowtoken(true);
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Erro ao processar submissão:', error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const data = localStorage.getItem('@garantias:session');

      if (!data) {
        // setLoading(false);
        return;
      }

      try {
        const session = JSON.parse(data) as {
          accessToken: string;
          token: string;
        };

        const decodedToken = jwtDecode(session.accessToken);

        if (!decodedToken?.exp) {
          // setLoading(false);
          return;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        const isExpired = decodedToken.exp < currentTime;

        if (isExpired) {
          // setLoading(false);
          return;
        }

        // Verificar se o usuário precisa autenticar token
        const userId = localStorage.getItem('@garantias:id');
        if (userId) {
          const userData = await userService.getUserById(Number(userId));
          if (userData.tokenLogin) {
            setShowtoken(true);
            // setLoading(false);
            return;
          }
        }

        // Só navega para o dashboard se não precisar de token
        navigate('/dashboard');
      } catch (error) {
        console.log('error', error);
        // setLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  // if (loading) {
  //   return (
  //     <LoginContainer>
  //       <FormContainer>
  //         <StyledPaper>
  //           <Skeleton variant="rectangular" width="100%" height={40} sx={{ mb: 4 }} />

  //           <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 3 }} />

  //           <Skeleton variant="rectangular" width="100%" height={20} sx={{ mb: 2 }} />

  //           <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 3 }} />

  //           <Skeleton
  //             variant="rectangular"
  //             width="100%"
  //             height={50}
  //             sx={{ borderRadius: '26px' }}
  //           />
  //         </StyledPaper>
  //       </FormContainer>
  //       <ImageContainer>
  //         <Skeleton variant="rectangular" width="90%" height={600} />
  //       </ImageContainer>
  //     </LoginContainer>
  //   );
  // }

  return (
    <LoginContainer>
      <FormContainer>
        {showtoken ? (
          <TokenRegistration
            onTokenValidated={handleTokenValidated}
            userId={Number(localStorage.getItem('@garantias:id'))}
          />
        ) : (
          <StyledPaper>
            <Typography
              variant="h4"
              component="h2"
              color="#444F60"
              gutterBottom
              sx={{ fontWeight: 'bold', textAlign: 'left', mb: 4 }}
            >
              <span style={{ color: '#444F60' }}>Acesse utilizando seu </span>
              <span style={{ color: '#265769' }}>Cadastro</span>
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
                      type="password"
                      variant="outlined"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      InputProps={{ startAdornment: <LockIcon sx={{ mr: 1 }} /> }}
                      sx={{ mb: 3 }}
                    />
                  )}
                />
              </ContainerInput>

              <ForgotPassword variant="body2" color="primary">
                Esqueci minha senha
              </ForgotPassword>

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
                {isPending ? <CircularProgress /> : 'Acessar'}
              </Button>
            </StyledForm>
          </StyledPaper>
        )}
      </FormContainer>

      <ImageContainer>

      </ImageContainer>
    </LoginContainer>
  );
};

export default Login;
