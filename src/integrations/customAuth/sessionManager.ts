
import { supabase } from "../supabase/client";
import { Session } from "./types";

/**
 * Validates and retrieves a user session based on stored token
 */
export const getSession = async (): Promise<Session | null> => {
  try {
    // Get session token from localStorage
    const sessionToken = localStorage.getItem('session_token');
    if (!sessionToken) return null;

    try {
      // Validate session through our database
      const { data, error } = await supabase
        .rpc('validate_session', { session_token: sessionToken });

      if (error || !data) {
        console.log("Session validation error:", error);
        localStorage.removeItem('session_token');
        return null;
      }

      // If session is valid, get user data
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data as any)
        .single();

      if (userError || !userData) {
        console.log("Error fetching user data:", userError);
        localStorage.removeItem('session_token');
        return null;
      }

      return {
        token: sessionToken,
        user: {
          id: userData.id,
          email: userData.email,
          email_confirmed_at: userData.email_confirmed_at
        },
        access_token: sessionToken,
        refresh_token: sessionToken,
        expires_in: 3600,
        token_type: 'bearer'
      };
    } catch (fetchError) {
      console.log("Network error during session validation:", fetchError);
      // В случае сетевой ошибки, не удаляем токен сессии, 
      // а возвращаем null, чтобы повторить попытку позже
      return null;
    }
  } catch (error) {
    console.error("Error retrieving session:", error);
    return null;
  }
};

/**
 * Creates a new session for a user
 */
export const createSession = async (userId: string): Promise<string | null> => {
  try {
    const { data: sessionToken, error: sessionError } = await supabase
      .rpc('create_session', { user_id: userId });
    
    if (sessionError || !sessionToken) {
      console.error("Error creating session:", sessionError);
      return null;
    }
    
    // Save token in localStorage
    const token = sessionToken as string;
    localStorage.setItem('session_token', token);
    return token;
  } catch (error) {
    console.error("Error creating session:", error);
    return null;
  }
};

/**
 * Terminates a user session
 */
export const terminateSession = async (): Promise<boolean> => {
  try {
    const sessionToken = localStorage.getItem('session_token');
    if (sessionToken) {
      try {
        // Remove session from database
        await supabase
          .from('sessions')
          .delete()
          .eq('token', sessionToken as any);
      } catch (error) {
        console.error("Network error during session termination:", error);
        // Продолжаем процесс выхода, даже если есть ошибка сети
      }
    }
    
    // Clear localStorage
    localStorage.removeItem('session_token');
    
    return true;
  } catch (error) {
    console.error("Error during logout:", error);
    // Всё равно пытаемся очистить localStorage
    localStorage.removeItem('session_token');
    return true; // Возвращаем true, чтобы UI обновился
  }
};
