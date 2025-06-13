// src/lib/toast.ts
import { toast as sonnerToast } from 'sonner';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import React from 'react';

// Toast de Erro
export const toastError = (title: string, description?: string) => {
  sonnerToast.error(title, {
    description,
    icon: React.createElement(AlertCircle, { className: 'w-4 h-4 text-red-500' }),
    className: 'bg-red-50 border-red-200 text-red-800',
    duration: 5000,
  });
};

// Toast de Sucesso
export const toastSuccess = (title: string, description?: string) => {
  sonnerToast.success(title, {
    description,
    icon: React.createElement(CheckCircle2, { className: 'w-4 h-4 text-green-500' }),
    className: 'bg-green-50 border-green-200 text-green-800',
    duration: 5000,
  });
};

export const toast = {
  error: toastError,
  success: toastSuccess,
};
