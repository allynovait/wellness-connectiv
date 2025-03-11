
import { createContext, useState, useEffect, ReactNode } from "react";
import { supabase, getAuthRedirectOptions } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { UserProfile, UserDocuments } from "@/types/auth";
import { toast } from "sonner";
import { AuthContextType } from "./types";
import { fetchUserData } from "./utils";

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
      
      const redirectOptions = getAuthRedirectOptions();
      console.log("Signup redirect options:", redirectOptions);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            role,
          },
          ...redirectOptions,
        },
      });
      
      if (error) throw error;
      
      console.log("Signup response:", data);
      
      if (data?.user) {
        setIsEmailVerified(false);
        toast.success("Регистрация успешна. Проверьте вашу почту для подтверждения.");
        navigate("/auth?verification=pending");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Ошибка регистрации");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      setLoading(true);
      
      const redirectOptions = getAuthRedirectOptions();
      console.log("Resend verification redirect options:", redirectOptions);
      
      const { error, data } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: redirectOptions,
      });
      
      console.log("Resend verification response:", data);
      
      if (error) throw error;
      
      toast.success("Письмо для подтверждения отправлено повторно");
    } catch (error: any) {
      console.error("Resend verification error:", error);
      toast.error(error.message || "Ошибка отправки письма");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out...");
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear all auth state
      setSession(null);
      setUser(null);
      setUserDocuments(null);
      setIsEmailVerified(false);
      
      console.log("Signed out successfully");
      navigate("/auth");
      toast.success("Вы вышли из системы");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error(error.message || "Ошибка выхода");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    try {
      if (!user?.id) throw new Error("Пользователь не найден");
      console.log("Updating profile for user ID:", user.id, "with data:", profile);

      const updates = {
        ...profile,
        id: user.id,
        updated_at: new Date().toISOString(),
      };

      const { error, data } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select();

      console.log("Profile update response:", data, error);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setUser(prev => prev ? { ...prev, ...profile } : null);
        console.log("Updated user state with new profile data");
      }
      
      const refreshedData = await refreshUserData();
      console.log("Profile updated and data refreshed:", refreshedData);
      toast.success("Профиль обновлен");
      return true;
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Ошибка обновления профиля");
      throw error;
    }
  };

  const updateDocuments = async (documents: Partial<UserDocuments>) => {
    try {
      if (!user?.id) {
        console.error("Cannot update documents: User ID is missing");
        toast.error("Пользователь не найден");
        throw new Error("Пользователь не найден");
      }

      console.log("Updating documents for user ID:", user.id);
      console.log("Document data:", documents);
      console.log("Existing documents:", userDocuments);

      let response;
      
      if (userDocuments?.id) {
        console.log("Updating existing documents with ID:", userDocuments.id);
        const updates = {
          ...documents,
          updated_at: new Date().toISOString(),
        };

        console.log("Sending update to Supabase with data:", updates);
        response = await supabase
          .from("documents")
          .update(updates)
          .eq("id", userDocuments.id)
          .select();
          
        console.log("Documents update complete. Response:", response);
      } else {
        console.log("Creating new documents record for user ID:", user.id);
        const newDocument = {
          ...documents,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        console.log("Sending insert to Supabase with data:", newDocument);
        response = await supabase
          .from("documents")
          .insert(newDocument)
          .select();
          
        console.log("Documents insert complete. Response:", response);
      }

      // Better error handling
      if (response?.error) {
        console.error("Error in Supabase operation:", response.error);
        toast.error("Ошибка сохранения: " + (response.error.message || "Неизвестная ошибка"));
        throw response.error;
      }

      // Update local state immediately if we have data
      if (response?.data && response.data.length > 0) {
        console.log("Updating local documents state with:", response.data[0]);
        setUserDocuments(response.data[0]);
      } else {
        console.warn("No data returned from documents operation");
      }

      // Refresh all user data to ensure consistency
      console.log("Refreshing all user data after document update");
      const refreshedData = await refreshUserData();
      console.log("Documents updated and data refreshed:", refreshedData);
      
      toast.success("Документы обновлены");
      return true;
    } catch (error: any) {
      console.error("Error updating documents:", error);
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
