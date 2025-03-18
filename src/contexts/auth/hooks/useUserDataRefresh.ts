
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserDocuments } from "@/types/auth";
import { fetchUserData } from "../utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useUserDataRefresh(
  user: UserProfile | null,
  userDocuments: UserDocuments | null,
  setLoading: (loading: boolean) => void,
  setUser: (user: UserProfile | null) => void,
  setUserDocuments: (docs: UserDocuments | null) => void
) {
  const navigate = useNavigate();

  const refreshUserData = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Error getting session for refresh:", sessionError);
      toast.error("Ошибка получения сессии");
      return { user, userDocuments };
    }
    
    if (!sessionData.session?.user.id) {
      console.log("Cannot refresh data: No active session");
      toast.error("Нет активной сессии");
      navigate("/auth");
      return { user: null, userDocuments: null };
    }
    
    try {
      console.log("Refreshing user data for ID:", sessionData.session.user.id);
      setLoading(true);
      const userData = await fetchUserData(sessionData.session.user.id);
      console.log("Refreshed user data:", userData);
      setUser(userData.user);
      setUserDocuments(userData.userDocuments);
      return userData;
    } catch (error) {
      console.error("Error refreshing user data:", error);
      toast.error("Ошибка обновления данных пользователя");
      return { user, userDocuments };
    } finally {
      setLoading(false);
    }
  };

  return refreshUserData;
}
