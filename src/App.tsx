import { routeRoles } from '@/Auth/Login/Routes/routeRoles';
import { Layout } from '@/components/Layout/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuthStore } from '@/store/useAuthStore';
import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

const Login = lazy(() => import('@/pages/Login/Login'));
const StudentPortal = lazy(() => import('@/pages/StudentPortal/StudentPortal'));
const Users = lazy(() => import('@/pages/Users/Users'));
const Schools = lazy(() => import('@/pages/Schools/Schools'));
const SchoolForm = lazy(() => import('@/pages/Schools/SchoolForm'));
const StudentForm = lazy(() => import('@/pages/StudentForm/StudentForm'));
const NotFoundPage = lazy(() =>
  import('@/pages/NotFound/NotFoundPage').then(module => ({ default: module.NotFoundPage }))
);
const SocioeconomicReport = lazy(() => import('@/pages/SocioeconomicReport/SocioeconomicReport'));
const FormValidation = lazy(() => import('@/pages/FormValidation'));

interface PrivateRouteProps {
  element: React.ReactElement;
  allowedRoles: string[];
}

const PrivateRoute = ({ element, allowedRoles }: PrivateRouteProps) => {
  const { token, role } = useAuthStore();

  const hasPermission = token &&
    typeof role === 'string' &&
    role !== '' &&
    Array.isArray(allowedRoles) &&
    allowedRoles.includes(role);

  return hasPermission ? element : <Navigate to="/" />;
};

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/dashboard-users"
            element={<PrivateRoute element={<Users />} allowedRoles={routeRoles.admin} />}
          />
          <Route
            path="/schools"
            element={<PrivateRoute element={<Schools />} allowedRoles={routeRoles.admin} />}
          />
          <Route
            path="/schools/new"
            element={<PrivateRoute element={<SchoolForm />} allowedRoles={routeRoles.admin} />}
          />
          <Route
            path="/schools/:id/edit"
            element={<PrivateRoute element={<SchoolForm />} allowedRoles={routeRoles.admin} />}
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
      <Toaster position="bottom-right" richColors closeButton expand={false} />
    </Suspense>
  );
}

export default App;
