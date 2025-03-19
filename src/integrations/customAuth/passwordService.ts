
import { supabase } from "../supabase/client";

/**
 * Resets a user's password
 */
export const resetUserPassword = async (
  email: string,
  newPassword: string
): Promise<boolean> => {
  try {
    console.log("Attempting to reset password for:", email);
    
    // Get user ID by email
    const { data: userData, error: userError } = await supabase
      .rpc('get_user_by_email', { user_email: email }) as { 
        data: { id: string }[] | null; 
        error: any 
      };
    
    if (userError || !userData || userData.length === 0) {
      console.error("Error finding user:", userError);
      return false;
    }
    
    // Get user ID from result
    const userId = userData[0].id;
    
    console.log("Found user ID:", userId);
    
    // Update password through RPC function, which will hash it on server side
    const { data: updateResult, error: updateError } = await supabase
      .rpc('update_user_password', { 
        user_id: userId, 
        new_password: newPassword 
      }) as {
        data: boolean | null;
        error: any
      };
    
    if (updateError) {
      console.error("Error updating password:", updateError);
      return false;
    }
    
    console.log("Password update result:", updateResult);
    
    return updateResult === true;
  } catch (error) {
    console.error("Error resetting password:", error);
    return false;
  }
};
