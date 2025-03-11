
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserDocuments } from "@/types/auth";
import { toast } from "sonner";
import { fetchUserData } from "./utils";

export const updateProfile = async (
  profile: Partial<UserProfile>,
  user: UserProfile | null,
  refreshUserData: () => Promise<{ user: UserProfile | null; userDocuments: UserDocuments | null }>
): Promise<boolean> => {
  try {
    // Проверяем наличие авторизованной сессии
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.error("Cannot update profile: No active session");
      toast.error("Вы не авторизованы");
      throw new Error("Вы не авторизованы");
    }
    
    const userId = sessionData.session.user.id;
    console.log("Current session user ID:", userId);
    
    // Используем ID из сессии, даже если объект user не передан
    if (!userId) {
      console.error("Cannot update profile: User ID is missing in session");
      toast.error("Ошибка идентификации пользователя");
      throw new Error("Ошибка идентификации пользователя");
    }
    
    console.log("Updating profile for user ID:", userId, "with data:", profile);

    const updates = {
      ...profile,
      id: userId,
      updated_at: new Date().toISOString(),
    };

    // Сначала проверяем, существует ли профиль пользователя
    const { data: existingProfile, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
      
    console.log("Profile check result:", existingProfile, checkError);
    
    let result;
    
    if (!existingProfile) {
      console.log("Profile not found, creating new one");
      // Профиль не существует, создаем новый
      // Make sure full_name is provided, fallback to user email if missing
      const createData = {
        ...updates,
        id: userId,
        created_at: new Date().toISOString(),
        // Ensure full_name is always provided as it's required by the database schema
        full_name: profile.full_name || sessionData.session.user.email?.split('@')[0] || 'Новый пользователь',
        role: 'patient', // Устанавливаем роль по умолчанию
      };
      
      result = await supabase
        .from("profiles")
        .insert(createData)
        .select();
        
      console.log("Profile creation result:", result);
    } else {
      console.log("Profile found, updating existing one");
      // Профиль существует, обновляем
      result = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select();
        
      console.log("Profile update result:", result);
    }

    if (result.error) {
      console.error("Supabase error updating profile:", result.error);
      throw result.error;
    }
    
    const refreshedData = await refreshUserData();
    console.log("Profile updated and data refreshed:", refreshedData);
    toast.success("Профиль обновлен");
    return true;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    toast.error(error.message || "Ошибка обновления профиля");
    return false;
  }
};

export const updateDocuments = async (
  documents: Partial<UserDocuments>,
  user: UserProfile | null,
  userDocuments: UserDocuments | null,
  refreshUserData: () => Promise<{ user: UserProfile | null; userDocuments: UserDocuments | null }>
): Promise<boolean> => {
  try {
    // Проверяем наличие авторизованной сессии
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.error("Cannot update documents: No active session");
      toast.error("Вы не авторизованы");
      throw new Error("Вы не авторизованы");
    }
    
    const userId = sessionData.session.user.id;
    console.log("Current session user ID for documents update:", userId);

    if (!userId) {
      console.error("Cannot update documents: User ID is missing in session");
      toast.error("Ошибка идентификации пользователя");
      throw new Error("Ошибка идентификации пользователя");
    }

    console.log("Updating documents for user ID:", userId);
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
      console.log("Creating new documents record for user ID:", userId);
      const newDocument = {
        ...documents,
        user_id: userId,
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

    // Улучшенная обработка ошибок
    if (response?.error) {
      console.error("Error in Supabase operation:", response.error);
      toast.error("Ошибка сохранения: " + (response.error.message || "Неизвестная ошибка"));
      throw response.error;
    }

    // Обновляем все данные пользователя для обеспечения консистентности
    console.log("Refreshing all user data after document update");
    const refreshedData = await refreshUserData();
    console.log("Documents updated and data refreshed:", refreshedData);
    
    toast.success("Документы обновлены");
    return true;
  } catch (error: any) {
    console.error("Error updating documents:", error);
    toast.error(error.message || "Ошибка обновления документов");
    return false;
  }
};
