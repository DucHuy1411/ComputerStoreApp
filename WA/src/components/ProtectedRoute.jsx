import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Đang tải...</div>
      </div>
    );
  }

  // Tạm thời bỏ qua check user để test UI
  // if (!user) {
  //   return <Navigate to="/login" replace />;
  // }

  return children;
}

