
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, getAuthRedirectOptions } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { UserProfile, UserDocuments } from "@/types/auth";
import { toast } from "sonner";

// Helper function to get the correct redirect URL
const getRedirectUrl = () => {
  // In browser environment
  if (typeof window !== 'undefined') {
    // Extract the base URL (protocol + hostname + port)
    const baseUrl = window.location.origin;
    return `${baseUrl}/auth?verified=true`;
  }
  // Fallback if not in browser
  return 'https://tajrxpkgtmfkggwbgjgs.lovableproject.com/auth?verified=true';
};

interface AuthContextType {
  session: Session | null;
  user: UserProfile | null;
  userDocuments: UserDocuments | null;
  loading: boolean;
  isEmailVerified: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, full_name: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateDocuments: (documents: Partial<UserDocuments>) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
          await fetchUserData(session.user.id);
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
          await fetchUserData(session.user.id);
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

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) throw profileError;
      if (profileData) setUser(profileData as UserProfile);

      // Fetch user documents
      const { data: docsData, error: docsError } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (docsError && docsError.code !== "PGRST116") throw docsError;
      if (docsData) setUserDocuments(docsData as UserDocuments);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const refreshUserData = async () => {
    if (session?.user.id) {
      await fetchUserData(session.user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      if (data.user && !data.user.email_confirmed_at) {
        setIsEmailVerified(false);
        toast.warning("Необходимо подтвердить email. Проверьте свою почту.");
      } else {
        setIsEmailVerified(true);
        navigate("/");
        toast.success("Успешный вход");
      }
    } catch (error: any) {
      if (error.message === "Email not confirmed") {
        toast.error("Необходимо подтвердить email. Проверьте свою почту.");
      } else {
        toast.error(error.message || "Ошибка входа");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, full_name: string, role: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            role,
          },
          ...getAuthRedirectOptions(),
        },
      });
      
      if (error) throw error;
      
      if (data?.user) {
        setIsEmailVerified(false);
        toast.success("Регистрация успешна. Проверьте вашу почту для подтверждения.");
        navigate("/auth?verification=pending");
      }
    } catch (error: any) {
      toast.error(error.message || "Ошибка регистрации");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: getAuthRedirectOptions(),
      });
      
      if (error) throw error;
      
      toast.success("Письмо для подтверждения отправлено повторно");
    } catch (error: any) {
      toast.error(error.message || "Ошибка отправки письма");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success("Вы вышли из системы");
    } catch (error: any) {
      toast.error(error.message || "Ошибка выхода");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    try {
      if (!user?.id) throw new Error("Пользователь не найден");

      const updates = {
        ...profile,
        id: user.id,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;
      await refreshUserData();
      toast.success("Профиль обновлен");
    } catch (error: any) {
      toast.error(error.message || "Ошибка обновления профиля");
      throw error;
    }
  };

  const updateDocuments = async (documents: Partial<UserDocuments>) => {
    try {
      if (!user?.id) throw new Error("Пользователь не найден");

      if (userDocuments?.id) {
        // Update existing documents
        const updates = {
          ...documents,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("documents")
          .update(updates)
          .eq("id", userDocuments.id);

        if (error) throw error;
      } else {
        // Insert new documents
        const newDocument = {
          ...documents,
          user_id: user.id,
        };

        const { error } = await supabase
          .from("documents")
          .insert(newDocument);

        if (error) throw error;
      }

      await refreshUserData();
      toast.success("Документы обновлены");
    } catch (error: any) {
      toast.error(error.message || "Ошибка обновления документов");
      throw error;
    }
  };

  const value = {
    session,
    user,
    userDocuments,
    loading,
    isEmailVerified,
    signIn,
    signUp,
    signOut,
    refreshUserData,
    updateProfile,
    updateDocuments,
    resendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
