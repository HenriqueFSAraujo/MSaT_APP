import AppRoutes from '@/routes';
import { Toaster } from 'sonner';
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster position="bottom-right" richColors closeButton expand={false} />
    </>
  )
}

export default App

