import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { JSX } from 'react';

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, state:{ processing} } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? '/dashboard';

  if (processing) {
    return <div className="flex justify-center items-center h-screen">
      <span>Chargement...</span>
    </div>;
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace state={{ from: location }} />;
  }

  return children;
};