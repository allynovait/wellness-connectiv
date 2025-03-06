
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, loading, isEmailVerified } = useAuth();
  const location = useLocation();
  
  // Check if we're returning from email verification
  const isVerifiedRedirect = location.search.includes('verified=true');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clinic-primary mb-4"></div>
        <div className="text-clinic-primary font-medium">Загрузка...</div>
      </div>
    );
  }
  
  // If we're returning from email verification, don't redirect immediately
  // Give the auth state time to update
  if (isVerifiedRedirect) {
    return <>{children}</>;
  }
  
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!isEmailVerified) {
    return <Navigate to="/auth?verification=pending" replace />;
  }

  return <>{children}</>;
};
