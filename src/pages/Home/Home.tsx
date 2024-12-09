import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bem-vindo à Página Inicial
      </Typography>
      <Button component={Link} to="/example" variant="contained">
        Ir para a Página de Exemplo
      </Button>
    </Box>
  );
};
