import { routeRoles } from '@/Auth/Login/Routes/routeRoles';
import { Layout } from '@/components/Layout/Layout';
import Login from '@/pages/Login/Login';
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage';
import SocioeconomicReport from '@/pages/SocioeconomicReport/SocioeconomicReport';
import StudentForm from '@/pages/StudentForm/StudentForm';
import StudentPortal from '@/pages/StudentPortal/StudentPortal';
import FormValidation from '@/pages/FormValidation';
import Users from '@/pages/Users/Users';
import { useAuthStore } from '@/store/useAuthStore';
import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

interface PrivateRouteProps {
  element: ReactElement;
  allowedRoles: string[];
}

const PrivateRoute = ({ element, allowedRoles }: PrivateRouteProps) => {
  const { token, role } = useAuthStore();


  return token && allowedRoles.includes(role) ? element : <Navigate to="/" />;
};

export const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard-users"
          element={<PrivateRoute element={<Users />} allowedRoles={routeRoles.admin} />}
        />

        <Route
          path="/socioeconomic-report/:id"
          element={
            <PrivateRoute element={<SocioeconomicReport />} allowedRoles={routeRoles.admin} />
          }
        />

        <Route
          path="/form-validation/:id"
          element={
            <PrivateRoute element={<FormValidation />} allowedRoles={routeRoles.admin} />
          }
        />

        <Route
          path="/student-portal/:id"
          element={<PrivateRoute element={<StudentPortal />} allowedRoles={routeRoles.users} />}
        />

        <Route
          path="/students-form/:id"
          element={<PrivateRoute element={<StudentForm />} allowedRoles={routeRoles.users} />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};
