
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
    if (!user?.id) {
      console.error("Cannot update profile: User ID is missing");
      toast.error("Пользователь не найден");
      throw new Error("Пользователь не найден");
    }
    
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

    if (error) {
      console.error("Supabase error updating profile:", error);
      throw error;
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
