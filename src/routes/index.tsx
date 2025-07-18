import { Routes, Route, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Login from '@/pages/Login/Login';
import Users from '@/pages/Users/Users';
import StudentForm from '@/pages/StudentForm/StudentForm';
import { Header } from '@/components/Header/Header';
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage';
import { useAuthStore } from '@/store/useAuthStore';
import SocioeconomicReport from '@/pages/SocioeconomicReport/SocioeconomicReport';

const AppRoutes = () => {
  const { token: isAuthenticated, role } = useAuthStore();

  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <>
      {!isLoginPage && isAuthenticated && <Header shouldRender={true} />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/students-form"
          element={
            (isAuthenticated && role === 'ROLE_USER') || role === 'ROLE_ADMIN' ? (
              <StudentForm />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/dashboard-Users"
          element={isAuthenticated && role === 'ROLE_ADMIN' ? <Users /> : <Navigate to="/" />}
        />
        <Route
          path="/socioeconomic-report/:id"
          element={
            isAuthenticated && role === 'ROLE_ADMIN' ? <SocioeconomicReport /> : <Navigate to="/" />
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
