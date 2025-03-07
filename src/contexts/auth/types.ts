
import { Session } from "@supabase/supabase-js";
import { UserProfile, UserDocuments } from "@/types/auth";

export interface AuthContextType {
  session: Session | null;
  user: UserProfile | null;
  userDocuments: UserDocuments | null;
  loading: boolean;
  isEmailVerified: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, full_name: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateDocuments: (documents: Partial<UserDocuments>) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
}
