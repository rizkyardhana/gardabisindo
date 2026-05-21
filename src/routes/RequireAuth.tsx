import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

interface RequireRoleProps {
  role?: string;
  roles?: string[];
  children: ReactNode;
}

export function RequireRole({ role, roles, children }: RequireRoleProps) {
  const token = localStorage.getItem('auth_token');
  const currentRole = localStorage.getItem('auth_role');
  const allowedRoles = roles || (role ? [role] : []);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (!currentRole || !allowedRoles.includes(currentRole)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

