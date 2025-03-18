
import { UserProfile, UserDocuments } from "@/types/auth";
import { Session } from "@/integrations/customAuth/types";

export interface AuthContextType {
  session: Session | null;
  user: UserProfile | null;
  userDocuments: UserDocuments | null;
  loading: boolean;
  isEmailVerified: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: any } | undefined>;
  signUp: (email: string, password: string, full_name: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<{ user: UserProfile | null; userDocuments: UserDocuments | null }>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<boolean>;
  updateDocuments: (documents: Partial<UserDocuments>) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
}
