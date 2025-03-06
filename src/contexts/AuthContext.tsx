
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { UserProfile, UserDocuments } from "@/types/auth";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: UserProfile | null;
  userDocuments: UserDocuments | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, full_name: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateDocuments: (documents: Partial<UserDocuments>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userDocuments, setUserDocuments] = useState<UserDocuments | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session) {
          await fetchUserData(session.user.id);
        } else {
          setUser(null);
          setUserDocuments(null);
        }
        setLoading(false);
      }
    );

    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        await fetchUserData(session.user.id);
      }
      setLoading(false);
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
        .single();

      if (profileError) throw profileError;
      setUser(profileData as UserProfile);

      // Fetch user documents
      const { data: docsData, error: docsError } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", userId)
        .single();

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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/");
      toast.success("Успешный вход");
    } catch (error: any) {
      toast.error(error.message || "Ошибка входа");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, full_name: string, role: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            role,
          },
        },
      });
      if (error) throw error;
      toast.success("Регистрация успешна");
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message || "Ошибка регистрации");
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

      const { error } = await supabase
        .from("profiles")
        .update(profile)
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
        const { error } = await supabase
          .from("documents")
          .update(documents)
          .eq("id", userDocuments.id);

        if (error) throw error;
      } else {
        // Insert new documents
        const { error } = await supabase
          .from("documents")
          .insert({
            ...documents,
            user_id: user.id,
          });

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
    signIn,
    signUp,
    signOut,
    refreshUserData,
    updateProfile,
    updateDocuments,
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
