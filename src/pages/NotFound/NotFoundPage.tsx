import { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/404', { replace: true });
  }, [navigate]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        404 - Página Não Encontrada
      </Typography>
      <Typography paragraph>Desculpe, a página que você está procurando não existe.</Typography>
      <Button component={Link} to="/" variant="contained">
        Voltar para a Página Inicial
      </Button>
    </Box>
  );
};
