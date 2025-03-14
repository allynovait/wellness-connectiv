
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
import { toast } from "sonner";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userDocuments, setUserDocuments] = useState<UserDocuments | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Initializing auth state listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        // Do not set session to null if we're just refreshing token
        if (event !== 'TOKEN_REFRESHED' || session) {
          setSession(session);
        }
        
        if (session) {
          console.log("User is authenticated, email confirmed at:", session.user?.email_confirmed_at);
          setIsEmailVerified(session.user?.email_confirmed_at != null);
          
          try {
            console.log("Fetching user data after auth state change");
            setLoading(true);
            const userData = await fetchUserData(session.user.id);
            setUser(userData.user);
            setUserDocuments(userData.userDocuments);
          } catch (error) {
            console.error("Error fetching user data after auth state change:", error);
            toast.error("Ошибка загрузки данных пользователя");
          } finally {
            setLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("User is signed out");
          setUser(null);
          setUserDocuments(null);
          setIsEmailVerified(false);
          setLoading(false);
        }
      }
    );

    const initSession = async () => {
      console.log("Initializing session");
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting initial session:", error);
          throw error;
        }
        
        console.log("Initial session:", session?.user?.email);
        setSession(session);
        
        if (session) {
          setIsEmailVerified(session.user?.email_confirmed_at != null);
          console.log("Fetching initial user data for ID:", session.user.id);
          const userData = await fetchUserData(session.user.id);
          console.log("Initial user data:", userData);
          setUser(userData.user);
          setUserDocuments(userData.userDocuments);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        toast.error("Ошибка инициализации сессии");
      } finally {
        setLoading(false);
      }
    };

    initSession();
    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, []);

  const refreshUserData = async () => {
    // Get the current session to ensure we have the latest data
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Error getting session for refresh:", sessionError);
      toast.error("Ошибка получения сессии");
      return { user, userDocuments }; // Return current state on error
    }
    
    if (!sessionData.session?.user.id) {
      console.log("Cannot refresh data: No active session");
      return { user: null, userDocuments: null };
    }
    
    try {
      console.log("Refreshing user data for ID:", sessionData.session.user.id);
      setLoading(true);
      const userData = await fetchUserData(sessionData.session.user.id);
      console.log("Refreshed user data:", userData);
      setUser(userData.user);
      setUserDocuments(userData.userDocuments);
      return userData; // Return the data for chaining
    } catch (error) {
      console.error("Error refreshing user data:", error);
      toast.error("Ошибка обновления данных пользователя");
      return { user, userDocuments }; // Return current state on error
    } finally {
      setLoading(false);
    }
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
