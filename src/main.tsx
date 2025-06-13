import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import './globals.css';
import { AppProvider } from '@/AppProvider';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
)

