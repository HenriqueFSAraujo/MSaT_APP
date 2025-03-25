import React from 'react';
import { Route, Routes } from 'react-router-dom';
// import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login/Login';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Consulta from '@/pages/Consulta/Consulta';
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage';
import { Layout } from '@/components/layout/Layout';
import Users from '@/pages/Users/Users';
import CadastroSenha from '@/pages/Cadastro/Senha/CadastroSenha';
import ConsultaEmpresa from '@/pages/Empresa/Consulta/ConsultaEmpresa';
import NewDashboard from '@/pages/NewDashboard/NewDashboard';

const AppRoutes: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/formulario-aluno" element={<NewDashboard />} />

        {/* <Route element={<ProtectedRoute />}> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/consulta" element={<Consulta />} />
        <Route path="/dashboard/users" element={<Users />} />
        <Route path="/empresa/consulta" element={<ConsultaEmpresa />} />
        {/* </Route> */}
        <Route path="/cadastrarSenha/:id" element={<CadastroSenha />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
