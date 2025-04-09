import { Routes, Route, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Login from '@/pages/Login/Login';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Students from '@/pages/Students/Students';
import CadastroSenha from '@/pages/Cadastro/Senha/CadastroSenha';
import NewDashboard from '@/pages/StudentForm/StudentForm';
import { Header } from '@/components/layout/Header/Header';
import { Logins } from '@/utils/logins';
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage';

const AppRoutes = () => {
  const userName = localStorage.getItem('nameUser');

  const isAuthenticated = () => {
    return Logins.some((login) => login.name === userName);
  };

  const location = useLocation();

  const isLoginPage = location.pathname === '/';

  return (
    <>
      {!isLoginPage && isAuthenticated() && <Header shouldRender={true} />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/studants-form"
          element={isAuthenticated() ? <NewDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/formulario-antigo"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard-students"
          element={isAuthenticated() ? <Students /> : <Navigate to="/" />}
        />
        {/* <Route
          path="/empresa/consulta"
          element={isAuthenticated() ? <ConsultaEmpresa /> : <Navigate to="/" />}
        /> */}
        <Route
          path="/cadastrarSenha/:id"
          element={isAuthenticated() ? <CadastroSenha /> : <Navigate to="/" />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
