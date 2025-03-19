
import { supabase } from "../supabase/client";
import { ProfileWithSession } from "./types";
import { createSession } from "./sessionManager";
import { validateRole } from "./utils";
import { UserProfile, UserRole } from "@/types/auth";

/**
 * User authentication service
 */
export const signIn = async (email: string, password: string): Promise<ProfileWithSession | null> => {
  try {
    console.log("Attempting authentication for:", email);
    
    // Authenticate user through our RPC function
    const { data: userId, error: authError } = await supabase
      .rpc('authenticate_user', { user_email: email, user_password: password });
    
    if (authError || !userId) {
      console.error("Authentication error:", authError);
      return null;
    }
    
    console.log("Authentication successful for user ID:", userId);
    
    // Create new session in public.sessions
    const sessionToken = await createSession(userId);
    
    if (!sessionToken) {
      return null;
    }
    
    // Get user profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError || !profileData) {
      console.error("Error fetching profile:", profileError);
      return null;
    }
    
    // Get user documents if they exist
    const { data: docsData } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Create user profile with correct role type
    const userRole = validateRole(profileData.role);
    
    // Create profile object with correct role type
    const userProfile: UserProfile = {
      id: profileData.id,
      full_name: profileData.full_name,
      birth_date: profileData.birth_date,
      gender: profileData.gender,
      photo: profileData.photo,
      card_number: profileData.card_number,
      attachment_date: profileData.attachment_date,
      clinic: profileData.clinic,
      role: userRole
    };
    
    return {
      profile: userProfile,
      documents: docsData || null,
      session: {
        token: sessionToken,
        user: {
          id: userId,
          email: profileData.email,
          email_confirmed_at: profileData.email_confirmed_at
        },
        access_token: sessionToken,
        refresh_token: sessionToken,
        expires_in: 3600,
        token_type: 'bearer'
      }
    };
  } catch (error) {
    console.error("Error during login:", error);
    return null;
  }
};

/**
 * User registration service - doesn't create entries in documents table
 */
export const signUp = async (
  email: string, 
  password: string, 
  full_name: string, 
  role: string
): Promise<boolean> => {
  try {
    console.log("Starting registration process for:", email);
    
    // Check if user with this email already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email);
    
    if (checkError) {
      console.error("Error checking existing user:", checkError);
      return false;
    }
    
    if (existingUsers && existingUsers.length > 0) {
      console.error("User with this email already exists");
      return false;
    }
    
    // Hash password before saving
    const { data: hashedPassword, error: hashError } = await supabase
      .rpc('hash_password', { password });
    
    if (hashError) {
      console.error("Error hashing password:", hashError);
      return false;
    }
    
    console.log("Password hashed successfully");
    
    // Create new user with hashed password
    const userId = crypto.randomUUID();
    
    // Insert directly into profiles
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        password: hashedPassword,
        full_name,
        role: validateRole(role),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true
      });
    
    if (insertError) {
      console.error("Error creating user profile:", insertError);
      return false;
    }
    
    console.log("User profile created with ID:", userId);
    
    return true;
  } catch (error) {
    console.error("Error during registration:", error);
    return false;
  }
};

/**
 * User logout service
 */
export const signOut = async (): Promise<boolean> => {
  try {
    return await terminateSession();
  } catch (error) {
    console.error("Error during logout:", error);
    return false;
  }
};

// Import from sessionManager but re-export here for seamless transition
export { terminateSession } from "./sessionManager";
