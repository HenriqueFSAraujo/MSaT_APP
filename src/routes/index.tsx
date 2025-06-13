import { Routes, Route, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Login from '@/pages/Login/Login';
import Users from '@/pages/Users/Users';
import StudentForm from '@/pages/StudentForm/StudentForm';
import { Header } from '@/components/Header/Header';
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
          path="/students-form"
          element={isAuthenticated() ? <StudentForm /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard-Users"
          element={isAuthenticated() ? <Users /> : <Navigate to="/" />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
