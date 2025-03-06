
export type UserRole = 'admin' | 'doctor' | 'patient';

export interface UserProfile {
  id: string;
  full_name: string;
  birth_date?: string;
  gender?: string;
  photo?: string;
  card_number?: string;
  attachment_date?: string;
  clinic?: string;
  role: UserRole;
}

export interface UserDocuments {
  id: string;
  user_id: string;
  passport_series?: string;
  passport_number?: string;
  passport_issued_by?: string;
  passport_issued_date?: string;
  snils?: string;
  inn?: string;
}
