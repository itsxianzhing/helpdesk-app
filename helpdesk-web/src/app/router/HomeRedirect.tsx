import { Navigate } from 'react-router';
import { useAuth } from '../../features/auth/hooks/useAuth';

function HomeRedirect() {
  const { auth } = useAuth();

  if (auth?.role === 'Admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

export default HomeRedirect;
