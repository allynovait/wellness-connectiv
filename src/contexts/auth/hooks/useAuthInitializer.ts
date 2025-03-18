
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
    const initSession = async () => {
      console.log("Initializing session");
      setLoading(true);
      try {
        const session = await getSession();
        
        console.log("Initial session:", session?.user?.email);
        setSession(session);
        
        if (session) {
          setIsEmailVerified(session.user?.email_confirmed_at != null);
          console.log("Fetching initial user data for ID:", session.user.id);
          try {
            const userData = await fetchUserData(session.user.id);
            
            if (!userData) {
              throw new Error("Failed to fetch initial user data");
            }
            
            console.log("Initial user data:", userData);
            setUser(userData.user);
            setUserDocuments(userData.userDocuments);
          } catch (error) {
            console.error("Error fetching initial user data:", error);
            
            setSession(null);
            setUser(null);
            setUserDocuments(null);
            setIsEmailVerified(false);
            toast.error("Ошибка загрузки данных пользователя");
          }
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        setSession(null);
        setUser(null);
        setUserDocuments(null);
        setIsEmailVerified(false);
        toast.error("Ошибка инициализации сессии");
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, [setSession, setUser, setUserDocuments, setIsEmailVerified, setLoading]);
}
