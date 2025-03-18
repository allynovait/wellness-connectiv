
import { UserProfile, UserDocuments, UserRole } from "@/types/auth";

export interface AuthUser {
  id: string;
  email: string;
  email_confirmed_at?: string | null;
}

export interface Session {
  token: string;
  user: AuthUser;
  // Adding the missing properties expected by the application
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface ProfileWithSession {
  profile: UserProfile;
  documents: UserDocuments | null;
  session: Session;
}

export interface CustomAuthContextType {
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
}
