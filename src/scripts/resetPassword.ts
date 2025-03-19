
import { resetUserPassword } from "../integrations/customAuth/client";
import { toast } from "sonner";

export async function resetPasswordForUser(email: string, newPassword: string): Promise<void> {
  try {
    console.log(`Attempting to reset password for user: ${email}`);
    
    const success = await resetUserPassword(email, newPassword);
    
    if (success) {
      console.log("Password reset successful!");
      toast.success("Пароль успешно изменен");
    } else {
      console.error("Password reset failed");
      toast.error("Не удалось изменить пароль");
    }
  } catch (error) {
    console.error("Error during password reset:", error);
    toast.error("Ошибка при изменении пароля");
  }
}

// Removing auto-execution to prevent errors
// The function will be called from the admin panel
