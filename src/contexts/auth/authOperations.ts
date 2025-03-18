import { supabase, getAuthRedirectOptions } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile, UserDocuments } from "@/types/auth";
import { fetchUserData } from "./utils";

export const signIn = async (
  email: string, 
  password: string,
  setLoading: (loading: boolean) => void,
  setIsEmailVerified: (verified: boolean) => void,
  navigate: (path: string) => void
) => {
  try {
    setLoading(true);
    console.log("Attempting login with email:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      console.error("Login error:", error);
      throw error;
    }
    
    console.log("Login successful:", data);
    
    if (data.user && !data.user.email_confirmed_at) {
      setIsEmailVerified(false);
      toast.warning("Необходимо подтвердить email. Проверьте свою почту.");
      return; // Exit early if email not verified
    } else {
      setIsEmailVerified(true);
      toast.success("Успешный вход");
      // Wait for the auth state to update with the session
      setTimeout(() => {
        console.log("Redirecting to home page");
        navigate("/");
      }, 800); // Giving more time for the auth state to update
    }
  } catch (error: any) {
    console.error("Login error caught:", error);
    if (error.message === "Email not confirmed") {
      toast.error("Необходимо подтвердить email. Проверьте свою почту.");
    } else if (error.message === "Invalid login credentials") {
      toast.error("Неверный логин или пароль");
    } else {
      toast.error(error.message || "Ошибка входа");
    }
    setLoading(false); // Explicitly set loading to false here on error
  } finally {
    // Only set loading to false if no error was thrown
    // because we've already set it to false in the catch block
    if (!setLoading.toString().includes('finally')) {
      setLoading(false);
    }
  }
};

export const signUp = async (
  email: string, 
  password: string, 
  full_name: string, 
  role: string,
  setLoading: (loading: boolean) => void,
  setIsEmailVerified: (verified: boolean) => void,
  navigate: (path: string) => void
) => {
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
  } finally {
    setLoading(false);
  }
};

export const resendVerificationEmail = async (
  email: string,
  setLoading: (loading: boolean) => void
) => {
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
  } finally {
    setLoading(false);
  }
};

export const signOut = async (
  setLoading: (loading: boolean) => void,
  setSession: (session: null) => void,
  setUser: (user: null) => void,
  setUserDocuments: (userDocuments: null) => void,
  setIsEmailVerified: (verified: boolean) => void,
  navigate: (path: string) => void
) => {
  try {
    console.log("Signing out...");
    setLoading(true);
    
    // First clear UI state to prevent flashing
    setSession(null);
    setUser(null);
    setUserDocuments(null);
    setIsEmailVerified(false);
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    console.log("Signed out successfully");
    
    // Navigate to auth page and show success message
    navigate("/auth");
    toast.success("Вы вышли из системы");
  } catch (error: any) {
    console.error("Error signing out:", error);
    toast.error(error.message || "Ошибка выхода");
    
    // Even on error, redirect to auth page for safety
    navigate("/auth");
  } finally {
    setLoading(false);
  }
};
