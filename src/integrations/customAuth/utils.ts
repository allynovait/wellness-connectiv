
import { UserRole } from "@/types/auth";

/**
 * Validate and transform string role into UserRole type
 */
export function validateRole(role: string): UserRole {
  if (role === 'admin' || role === 'doctor' || role === 'patient') {
    return role as UserRole;
  }
  // Default to 'patient' if role doesn't match expected values
  return 'patient';
}
