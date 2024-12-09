import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import LockIcon from '@mui/icons-material/Lock';
import { registrationService, TokenType } from '@/services/registrationService';
import { StyledForm, StyledPaper, ContainerInput, Label, InputComponet } from './styles';

// Schema de validação
const tokenValidationSchema = z.object({
  tokenOption: z.enum([TokenType.SMS, TokenType.EMAIL], {
    required_error: 'Selecione um método de envio',
  }),
  token: z.string().min(12, 'O token deve ter 12 dígitos').max(12, 'O token deve ter 12 dígitos'),
});

type TokenValidationForm = z.infer<typeof tokenValidationSchema>;

// Props do componente
interface TokenRegistrationProps {
  userId: number;
  onTokenValidated: () => void;
}

const TokenRegistration: React.FC<TokenRegistrationProps> = ({ userId, onTokenValidated }) => {
  const [isTokenSent, setIsTokenSent] = useState(false);
  const [sendingToken, setSendingToken] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const COUNTDOWN_TIME = 60; // Tempo de espera em segundos

  // Effect para gerenciar o contador regressivo
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [countdown]);

  // Função para formatar o tempo
  const formatCountdown = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Configuração do formulário
  const form = useForm<TokenValidationForm>({
    resolver: zodResolver(tokenValidationSchema),
    defaultValues: {
      tokenOption: undefined, // Removido valor default para forçar escolha
      token: '',
    },
  });

  // Pegar o valor atual da opção selecionada
  const selectedOption = form.watch('tokenOption');

  // Handlers
  const handleSendToken = async () => {
    const tokenType = form.getValues('tokenOption');
    setError(null);

    if (!tokenType) {
      setError('Por favor, selecione um método de envio do token.');
      return;
    }

    try {
      setSendingToken(true);
      await registrationService.sendToken(userId, tokenType);
      setIsTokenSent(true);
      setCountdown(COUNTDOWN_TIME); // Inicia o contador após envio bem-sucedido
    } catch (error) {
      setError('Erro ao enviar token. Tente novamente.');
      console.error('Erro ao enviar token:', error);
    } finally {
      // setCountdown(COUNTDOWN_TIME); // Inicia o contador após envio bem-sucedido
      setSendingToken(false);
    }
  };

  const handleValidateToken = async (data: TokenValidationForm) => {
    setError(null);

    try {
      await registrationService.validateToken(userId, data.token);
      onTokenValidated();
    } catch (error) {
      setError('Token inválido. Verifique o código e tente novamente.');
      console.error('Erro ao validar token:', error);
    }
  };

  return (
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
        Cadastro de Token
      </Typography>

      <Typography
        color="#444F60"
        sx={{
          fontWeight: '400',
          textAlign: 'left',
          mb: 2,
          fontSize: '16px',
          lineHeight: '16px',
        }}
      >
        Como você prefere receber o Token de validação?
      </Typography>

      <Typography
        color="#444F60"
        gutterBottom
        sx={{
          fontWeight: '400',
          textAlign: 'left',
          mb: 1,
          fontSize: '16px',
          lineHeight: '16px',
        }}
      >
        Escolha uma opção para continuar:
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '20px',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Controller
            name="tokenOption"
            control={form.control}
            render={({ field }) => (
              <input
                type="radio"
                {...field}
                value={TokenType.SMS}
                id="sms"
                style={{ marginRight: '8px' }}
              />
            )}
          />
          <Label>SMS</Label>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Controller
            name="tokenOption"
            control={form.control}
            render={({ field }) => (
              <input
                type="radio"
                {...field}
                value={TokenType.EMAIL}
                id="email"
                style={{ marginRight: '8px' }}
              />
            )}
          />
          <Label>E-mail</Label>
        </Box>
      </Box>

      <Box sx={{ width: '100%', mb: 3 }}>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={handleSendToken}
          disabled={!selectedOption || sendingToken || countdown > 0}
          sx={{
            mb: 1,
            borderRadius: '26px',
            padding: '14px 0',
            fontSize: '16px',
            lineHeight: '16px',
            opacity: !selectedOption || countdown > 0 ? 0.9 : 1,
            position: 'relative',
          }}
        >
          {sendingToken ? (
            <CircularProgress size={24} />
          ) : countdown > 0 ? (
            `Aguarde ${formatCountdown(countdown)} para reenviar`
          ) : !selectedOption ? (
            'Selecione um método de envio'
          ) : (
            'Enviar Token'
          )}
        </Button>

        {isTokenSent && countdown === 0 && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 1,
              color: '#666',
            }}
          >
            Não recebeu o token? Você pode enviar novamente.
          </Typography>
        )}
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 3, textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      <StyledForm onSubmit={form.handleSubmit(handleValidateToken)}>
        <ContainerInput>
          <Label>Insira o código recebido para continuar:</Label>
          <Controller
            name="token"
            control={form.control}
            render={({ field, fieldState }) => (
              <InputComponet
                {...field}
                fullWidth
                margin="normal"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                disabled={!isTokenSent}
                placeholder="Digite o código de 6 dígitos"
                InputProps={{
                  startAdornment: <LockIcon sx={{ mr: 1 }} />,
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
          disabled={!isTokenSent || form.formState.isSubmitting}
          sx={{
            mt: 8,
            borderRadius: '26px',
            padding: '14px 0',
            backgroundColor: '#3B5C69',
            '&:hover': {
              backgroundColor: '#2d4752',
            },
            fontSize: '23px',
            lineHeight: '16px',
          }}
        >
          {form.formState.isSubmitting ? <CircularProgress size={24} /> : 'Continuar'}
        </Button>
      </StyledForm>
    </StyledPaper>
  );
};

export default TokenRegistration;
