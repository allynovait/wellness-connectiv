
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserDocuments } from "@/types/auth";

export const fetchUserData = async (userId: string): Promise<{
  user: UserProfile | null;
  userDocuments: UserDocuments | null;
}> => {
  try {
    if (!userId) {
      console.error("Cannot fetch user data: User ID is missing");
      return { user: null, userDocuments: null };
    }
    
    console.log("Fetching user profile data for ID:", userId);
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Error fetching profile data:", profileError);
      throw profileError;
    }
    
    console.log("Fetched profile data:", profileData);
    
    console.log("Fetching user documents data for ID:", userId);
    const { data: docsData, error: docsError } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (docsError) {
      console.error("Error fetching documents data:", docsError);
      throw docsError;
    }
    
    console.log("Fetched documents data:", docsData);
    
    // Add a timeout to avoid immediate state changes
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      user: profileData as UserProfile || null,
      userDocuments: docsData as UserDocuments || null
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
