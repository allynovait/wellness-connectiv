
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserDocuments, UserRole } from "@/types/auth";

export async function fetchUserData(userId: string) {
  console.log(`Fetching profile data for user ${userId}`);
  
  try {
    // Get user profile data
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Error fetching user profile:", userError);
      throw userError;
    }

    if (!userData) {
      console.error("No user profile found for ID:", userId);
      throw new Error("User profile not found");
    }

    // Get user documents data
    const { data: documentsData, error: documentsError } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (documentsError && documentsError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" - normal if user has no documents yet
      console.error("Error fetching user documents:", documentsError);
      throw documentsError;
    }

    // Ensure the role is a valid UserRole type
    const userRole: UserRole = (userData.role as UserRole) || 'patient';

    const user: UserProfile = {
      id: userData.id,
      full_name: userData.full_name,
      birth_date: userData.birth_date,
      gender: userData.gender,
      photo: userData.photo,
      card_number: userData.card_number,
      attachment_date: userData.attachment_date,
      clinic: userData.clinic,
      role: userRole,
    };

    const userDocuments: UserDocuments | null = documentsData
      ? {
          id: documentsData.id,
          user_id: documentsData.user_id,
          passport_series: documentsData.passport_series,
          passport_number: documentsData.passport_number,
          passport_issued_by: documentsData.passport_issued_by,
          passport_issued_date: documentsData.passport_issued_date,
          snils: documentsData.snils,
          inn: documentsData.inn,
        }
      : null;

    console.log("Successfully fetched user data:", { user, userDocuments });
    return { user, userDocuments };
  } catch (error) {
    console.error("Error in fetchUserData:", error);
    throw error;
  }
}
