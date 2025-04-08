import AppRoutes from '@/routes';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <AppRoutes />;
      <Toaster position="bottom-right" richColors closeButton expand={false} />
    </>
  );
}

export default App;
