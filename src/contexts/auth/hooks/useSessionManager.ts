
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserDocuments } from "@/types/auth";
import { fetchUserData } from "../utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useSessionManager() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userDocuments, setUserDocuments] = useState<UserDocuments | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const navigate = useNavigate();

  const handleAuthStateChange = async (
    event: string,
    newSession: Session | null
  ) => {
    console.log("Auth state changed:", event, newSession?.user?.email);
    
    if (event !== 'TOKEN_REFRESHED' || newSession) {
      setSession(newSession);
    }
    
    if (newSession) {
      console.log("User is authenticated, email confirmed at:", newSession.user?.email_confirmed_at);
      setIsEmailVerified(newSession.user?.email_confirmed_at != null);
      
      try {
        console.log("Fetching user data after auth state change");
        setLoading(true);
        const userData = await fetchUserData(newSession.user.id);
        
        if (!userData) {
          throw new Error("Failed to fetch user data");
        }
        
        setUser(userData.user);
        setUserDocuments(userData.userDocuments);
      } catch (error) {
        console.error("Error fetching user data after auth state change:", error);
        toast.error("Ошибка загрузки данных пользователя");
        
        if (error && (error as any).code === '42P17') {
          console.log("Recursion error detected, but we have a fallback");
          setLoading(false);
          return;
        }
        
        if (event !== 'SIGNED_IN') {
          setSession(null);
          setUser(null);
          setUserDocuments(null);
          setIsEmailVerified(false);
        }
      } finally {
        setLoading(false);
      }
    } else if (event === 'SIGNED_OUT') {
      console.log("User is signed out");
      setUser(null);
      setUserDocuments(null);
      setIsEmailVerified(false);
      setLoading(false);
      navigate("/auth");
    } else if (event === 'PASSWORD_RECOVERY') {
      setSession(null);
      setUser(null);
      setUserDocuments(null);
      setIsEmailVerified(false);
      setLoading(false);
    } else if (!newSession) {
      setSession(null);
      setUser(null);
      setUserDocuments(null);
      setIsEmailVerified(false);
      setLoading(false);
    }
  };

  return {
    session,
    setSession,
    user,
    setUser,
    userDocuments,
    setUserDocuments,
    loading,
    setLoading,
    isEmailVerified,
    setIsEmailVerified,
    handleAuthStateChange,
  };
}
