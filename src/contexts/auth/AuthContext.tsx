
import { createContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContextType } from "./types";
import { useSessionManager } from "./hooks/useSessionManager";
import { useAuthInitializer } from "./hooks/useAuthInitializer";
import { useUserDataRefresh } from "./hooks/useUserDataRefresh";
import { 
  signIn as authSignIn, 
  signUp as authSignUp, 
  signOut as authSignOut,
  resendVerificationEmail as authResendVerificationEmail,
  resetPassword as authResetPassword
} from "./authOperations";
import { 
  updateProfile as updateUserProfile,
  updateDocuments as updateUserDocuments
} from "./profileOperations";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    session,
    setSession,
    user,
    setUser,
    userDocuments,
    setUserDocuments,
    loading,
    setLoading,
    isEmailVerified,
    setIsEmailVerified,
    handleAuthStateChange
  } = useSessionManager();

  useAuthInitializer({
    setSession,
    setUser,
    setUserDocuments,
    setIsEmailVerified,
    setLoading
  });

  const refreshUserData = useUserDataRefresh(
    user,
    userDocuments,
    setLoading,
    setUser,
    setUserDocuments
  );

  const navigate = useNavigate();

  const value: AuthContextType = {
    session,
    user,
    userDocuments,
    loading,
    isEmailVerified,
    signIn: (email, password) => authSignIn(email, password, setLoading, setIsEmailVerified, navigate),
    signUp: (email, password, full_name, role) => 
      authSignUp(email, password, full_name, role, setLoading, setIsEmailVerified, navigate),
    signOut: () => authSignOut(setLoading, setSession, setUser, setUserDocuments, setIsEmailVerified, navigate),
    refreshUserData,
    updateProfile: (profile) => updateUserProfile(profile, user, refreshUserData),
    updateDocuments: (documents) => updateUserDocuments(documents, user, userDocuments, refreshUserData),
    resendVerificationEmail: (email) => authResendVerificationEmail(email, setLoading),
    resetPassword: (email, newPassword) => authResetPassword(email, newPassword, setLoading),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
