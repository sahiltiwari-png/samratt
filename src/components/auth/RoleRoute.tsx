import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

const RoleRoute = ({ children, allowedRoles, redirectTo = '/dashboard' }: RoleRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication/role
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const role = user?.role;
  const isAllowed = role ? allowedRoles.includes(role) : false;

  if (!isAllowed) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ accessDenied: true, from: location.pathname }}
      />
    );
  }

  return <>{children}</>;
};

export default RoleRoute;