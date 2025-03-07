
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserDocuments } from "@/types/auth";

export const fetchUserData = async (userId: string): Promise<{
  user: UserProfile | null;
  userDocuments: UserDocuments | null;
}> => {
  try {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) throw profileError;
    
    const { data: docsData, error: docsError } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (docsError && docsError.code !== "PGRST116") throw docsError;
    
    return {
      user: profileData as UserProfile || null,
      userDocuments: docsData as UserDocuments || null
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { user: null, userDocuments: null };
  }
};
