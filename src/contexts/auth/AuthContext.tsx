
import { createContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { UserProfile, UserDocuments } from "@/types/auth";
import { AuthContextType } from "./types";
import { fetchUserData } from "./utils";
import { 
  signIn as authSignIn, 
  signUp as authSignUp, 
  signOut as authSignOut,
  resendVerificationEmail as authResendVerificationEmail 
} from "./authOperations";
import { 
  updateProfile as updateUserProfile,
  updateDocuments as updateUserDocuments
} from "./profileOperations";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userDocuments, setUserDocuments] = useState<UserDocuments | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        
        if (session) {
          setIsEmailVerified(session.user?.email_confirmed_at != null);
          const userData = await fetchUserData(session.user.id);
          setUser(userData.user);
          setUserDocuments(userData.userDocuments);
        } else {
          setUser(null);
          setUserDocuments(null);
          setIsEmailVerified(false);
        }
        setLoading(false);
      }
    );

    const initSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session:", session?.user?.email);
        setSession(session);
        
        if (session) {
          setIsEmailVerified(session.user?.email_confirmed_at != null);
          const userData = await fetchUserData(session.user.id);
          setUser(userData.user);
          setUserDocuments(userData.userDocuments);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    initSession();
    return () => subscription.unsubscribe();
  }, []);

  const refreshUserData = async () => {
    if (session?.user.id) {
      try {
        console.log("Refreshing user data for ID:", session.user.id);
        const userData = await fetchUserData(session.user.id);
        console.log("Refreshed user data:", userData);
        setUser(userData.user);
        setUserDocuments(userData.userDocuments);
        return userData; // Return the data for chaining
      } catch (error) {
        console.error("Error refreshing user data:", error);
        throw error;
      }
    }
    return { user: null, userDocuments: null };
  };

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
