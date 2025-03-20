
import { useEffect } from "react";
import { fetchUserData } from "../utils";
import { toast } from "sonner";
import { getSession } from "@/integrations/customAuth/client";

export function useAuthInitializer(setters: {
  setSession: (session: any) => void;
  setUser: (user: any) => void;
  setUserDocuments: (docs: any) => void;
  setIsEmailVerified: (verified: boolean) => void;
  setLoading: (loading: boolean) => void;
}) {
  const { setSession, setUser, setUserDocuments, setIsEmailVerified, setLoading } = setters;

  useEffect(() => {
    let isMounted = true; // Для предотвращения обновления состояния после размонтирования

    const initSession = async () => {
      console.log("Initializing session");
      setLoading(true);
      try {
        const session = await getSession();
        
        if (!isMounted) return;
        
        console.log("Initial session:", session?.user?.email);
        setSession(session);
        
        if (session) {
          setIsEmailVerified(session.user?.email_confirmed_at != null);
          console.log("Fetching initial user data for ID:", session.user.id);
          try {
            const userData = await fetchUserData(session.user.id);
            
            if (!isMounted) return;
            
            if (!userData) {
              console.log("Failed to fetch initial user data");
              return;
            }
            
            console.log("Initial user data:", userData);
            setUser(userData.user);
            setUserDocuments(userData.userDocuments);
          } catch (error) {
            if (!isMounted) return;
            
            console.error("Error fetching initial user data:", error);
            // Не сбрасываем сессию при ошибке загрузки данных
            // чтобы не создавать цикл повторных попыток
          }
        }
      } catch (error) {
        if (!isMounted) return;
        
        console.error("Error getting initial session:", error);
        // Не показываем ошибку пользователю при проблемах с инициализацией
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initSession();

    return () => {
      isMounted = false;
    };
  }, [setSession, setUser, setUserDocuments, setIsEmailVerified, setLoading]);
}
