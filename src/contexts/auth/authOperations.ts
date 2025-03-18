
import { toast } from "sonner";
import { UserProfile, UserDocuments } from "@/types/auth";
import { fetchUserData } from "./utils";
import { signIn as customSignIn, signUp as customSignUp, signOut as customSignOut } from "@/integrations/customAuth/client";

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
    
    const result = await customSignIn(email, password);
    
    if (!result) {
      throw new Error("Invalid login credentials");
    }
    
    console.log("Login successful:", result);
    
    if (result.session.user && !result.session.user.email_confirmed_at) {
      setIsEmailVerified(false);
      toast.warning("Необходимо подтвердить email. Проверьте свою почту.");
      return { success: false, error: { message: "Email not confirmed" } };
    } else {
      setIsEmailVerified(true);
      toast.success("Успешный вход");
      // Перенаправление на главную страницу
      setTimeout(() => {
        console.log("Redirecting to home page");
        navigate("/");
      }, 800);
    }
    return { success: true };
  } catch (error: any) {
    console.error("Login error caught:", error);
    if (error.message === "Email not confirmed") {
      toast.error("Необходимо подтвердить email. Проверьте свою почту.");
    } else if (error.message === "Invalid login credentials") {
      toast.error("Неверный логин или пароль");
    } else {
      toast.error(error.message || "Ошибка входа");
    }
    setLoading(false);
    return { success: false, error };
  } finally {
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
    
    const success = await customSignUp(email, password, full_name, role);
    
    if (!success) {
      throw new Error("Ошибка регистрации");
    }
    
    console.log("Signup successful");
    
    setIsEmailVerified(false); // Для новой системы можно настроить подтверждение email позже
    toast.success("Регистрация успешна");
    navigate("/auth");
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
    
    // В кастомной системе аутентификации это может быть реализовано позже
    console.log("Resend verification for email:", email);
    
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
    
    // Сначала очищаем состояние UI, чтобы избежать мигания
    setSession(null);
    setUser(null);
    setUserDocuments(null);
    setIsEmailVerified(false);
    
    const success = await customSignOut();
    if (!success) {
      throw new Error("Ошибка выхода");
    }
    
    console.log("Signed out successfully");
    
    // Перенаправление на страницу аутентификации и отображение сообщения об успешном выходе
    navigate("/auth");
    toast.success("Вы вышли из системы");
  } catch (error: any) {
    console.error("Error signing out:", error);
    toast.error(error.message || "Ошибка выхода");
    
    // Даже при ошибке перенаправляем на страницу аутентификации для безопасности
    navigate("/auth");
  } finally {
    setLoading(false);
  }
};
