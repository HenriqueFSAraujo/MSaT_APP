import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from '@/pages/Login/Login';
import Users from '@/pages/Users/Users';
import StudentForm from '@/pages/StudentForm/StudentForm';
import { Header } from '@/components/Header/Header';
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage';
import { useAuthStore } from '@/store/useAuthStore';
import SocioeconomicReport from '@/pages/SocioeconomicReport/SocioeconomicReport';
import StudentPortal from '@/pages/StudentPortal/StudentPortal';
import { routeRoles } from '@/Auth/Login/Routes/routeRoles';

interface PrivateRouteProps {
  element: JSX.Element;
  allowedRoles: string[];
}

const PrivateRoute = ({ element, allowedRoles }: PrivateRouteProps) => {
  const { token, role } = useAuthStore();

  return token && allowedRoles.includes(role) ? element : <Navigate to="/" />;
};

export const AppRoutes = () => {
  const { token: isAuthenticated } = useAuthStore();
  const location = useLocation();

  const isLoginPage = location.pathname === '/';

  return (
    <>
      {!isLoginPage && isAuthenticated && <Header shouldRender />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* ADMIN ROLE */}
        <Route
          path="/dashboard-Users"
          element={<PrivateRoute element={<Users />} allowedRoles={routeRoles.admin} />}
        />

        <Route
          path="/socioeconomic-report/:id"
          element={
            <PrivateRoute element={<SocioeconomicReport />} allowedRoles={routeRoles.admin} />
          }
        />

        {/* STUDENT ROLE */}
        <Route
          path="/student-portal/:id"
          element={<PrivateRoute element={<StudentPortal />} allowedRoles={routeRoles.users} />}
        />

        <Route
          path="/students-form/:id"
          element={<PrivateRoute element={<StudentForm />} allowedRoles={routeRoles.users} />}
        />
      </Routes>
    </>
  );
};
