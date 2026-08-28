import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Se usa anidado dentro de ProtectedRoute (ya garantiza sesión iniciada).
// Solo verifica que el rol del usuario esté en la lista permitida; si no,
// redirige al dashboard. El backend es la autoridad real — esto es UX.
export default function RoleRoute({ roles }) {
  const { user } = useAuth();

  return roles.includes(user?.rol) ? <Outlet /> : <Navigate to="/" replace />;
}
