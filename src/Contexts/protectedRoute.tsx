import { Navigate, useLocation, Outlet} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated, state: {processing} } = useAuth();
  const location = useLocation();
  console.log("isAuthenticated user:", true);
  // const from = location.state?.from?.pathname ?? '/dashboard';
  
  
  if (processing) {
    return <div className="flex justify-center items-center h-screen">
      <span>Chargement...</span>
    </div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else {
   return <Outlet />
  }
};