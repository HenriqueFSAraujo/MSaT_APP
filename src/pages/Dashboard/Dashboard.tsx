import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { defineAbilitiesFor } from '@/hooks/permission';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const permission = defineAbilitiesFor(localStorage.getItem("@garantias:role")!)

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Paper
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '1rem',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Resumo
        </Typography>
        <Typography>Bem-vindo ao seu dashboard.</Typography>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginTop: '10px',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Ações Rápidas
          </Typography>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              marginTop: '5px',
            }}
          >
            <Button variant="contained" onClick={() => navigate('/dashboard/consulta')}>
              Ir para Consulta
            </Button>
            {permission.can("Get", "User") ? (
              <Button variant="contained" onClick={() => navigate('/dashboard/users')}>
                Ir para Usuários
              </Button>
            ) : null}
          </div>
        </div>
      </Paper>
    </Box>
  );
};

export default Dashboard;
