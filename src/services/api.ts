import axios, { InternalAxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Define a URL base para todas as requisições
  headers: { 'Content-Type': 'application/json' },
});

// Adiciona um interceptador para todas as requisições
api.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    const data = localStorage.getItem('@garantias:session');

    if (!data) {
      return config;
    }

    try {
      const session = JSON.parse(data);

      if (session.accessToken) {
        config.headers['Authorization'] = `Bearer ${session.accessToken}`;
      }

      return config;
    } catch (error) {
      console.log('error', error);

      return config;
    }
  },
  function (error) {
    return Promise.reject(error);
  }
);
