
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, loading, isEmailVerified } = useAuth();
  const location = useLocation();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Check if we're returning from email verification
  const isVerifiedRedirect = location.search.includes('verified=true');

  // Set a timeout to avoid infinite loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoadComplete(true);
    }, 3000); // Reduced to 3 seconds max loading time

    return () => clearTimeout(timer);
  }, []);

  // If we're still loading but not for too long
  if (loading && !initialLoadComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clinic-primary mb-4"></div>
        <div className="text-clinic-primary font-medium">Загрузка...</div>
      </div>
    );
  }
  
  // If loading takes too long, we'll proceed with redirection if needed
  console.log("Auth state:", { loading, session, isEmailVerified, initialLoadComplete });
  
  // If we're returning from email verification, don't redirect immediately
  // Give the auth state time to update
  if (isVerifiedRedirect) {
    return <>{children}</>;
  }
  
  // Если нет сессии, перенаправляем на страницу авторизации
  if (!session) {
    console.log("No session, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }
  
  // Если email не подтвержден, перенаправляем на страницу подтверждения
  if (!isEmailVerified) {
    console.log("Email not verified, redirecting to verification page");
    return <Navigate to="/auth?verification=pending" replace />;
  }

  // Если все проверки пройдены, показываем защищенный контент
  return <>{children}</>;
};
