import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

import LoadingSpinner from '@/components/LoadingSpinner';

const Login = lazy(() => import('@/pages/Login/Login'));
const StudentPortal = lazy(() => import('@/pages/StudentPortal/StudentPortal'));
const Users = lazy(() => import('@/pages/Users/Users'));
const StudentForm = lazy(() => import('@/pages/StudentForm/StudentForm'));
const NotFoundPage = lazy(() =>
  import('@/pages/NotFound/NotFoundPage').then(module => ({ default: module.NotFoundPage }))
);
const SocioeconomicReport = lazy(() => import('@/pages/SocioeconomicReport/SocioeconomicReport'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student-portal/:id" element={<StudentPortal />} />
        <Route path="/dashboard-users" element={<Users />} />
        <Route path="/students-form/:id" element={<StudentForm />} />
        <Route path="/socioeconomic-report/:id" element={<SocioeconomicReport />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="bottom-right" richColors closeButton expand={false} />
    </Suspense>
  );
}

export default App;
