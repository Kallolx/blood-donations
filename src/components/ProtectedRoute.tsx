import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '@/utils/authService';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      const { role } = await getCurrentUser();
      setIsAuth(auth);
      setUserRole(role);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blood-600" />
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  // Check if user is accessing the correct dashboard
  const currentPath = window.location.pathname;
  const expectedPath = `/${userRole}-dashboard`;
  if (currentPath !== expectedPath) {
    return <Navigate to={expectedPath} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 