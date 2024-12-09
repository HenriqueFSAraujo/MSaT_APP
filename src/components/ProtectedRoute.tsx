import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const data = localStorage.getItem('@garantias:session');

      if (!data) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const session = JSON.parse(data) as {
          accessToken: string;
          token: string;
        };

        const decodedToken = jwtDecode(session.accessToken);

        if (!decodedToken?.exp) {
          setIsAuthenticated(false);
          return;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        const isExpired = decodedToken.exp < currentTime;

        if (isExpired) {
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.log('error', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
