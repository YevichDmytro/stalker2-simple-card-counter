import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const authed = sessionStorage.getItem('authed') === '1';
  if (!authed) return <Navigate to='/auth' replace />;
  return children;
}
