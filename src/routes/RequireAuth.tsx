import { Navigate } from 'react-router-dom';

export function RequireAuth({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('auth_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export function RequireRole({ role, roles, children }: { role?: string; roles?: string[]; children: JSX.Element }) {
  const token = localStorage.getItem('auth_token');
  const currentRole = localStorage.getItem('auth_role');

  if (!token) return <Navigate to="/login" replace />;
  
  const allowedRoles = roles || (role ? [role] : []);
  if (!currentRole || !allowedRoles.includes(currentRole)) return <Navigate to="/" replace />;

  return children;
}

