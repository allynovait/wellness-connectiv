
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserDocuments, UserRole } from "@/types/auth";
import { getSession } from "@/integrations/customAuth/client";

export async function fetchUserData(userId: string) {
  console.log(`Fetching profile data for user ${userId}`);
  
  try {
    // Получаем данные профиля из таблицы profiles
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId as any)
      .single();

    if (userError) {
      console.error("Error fetching user profile:", userError);
      
      // Если возникает ошибка, пытаемся создать минимальный профиль
      // Это запасной вариант, чтобы пользователи все еще могли войти в систему
      const session = await getSession();
      if (!session) {
        throw new Error("Could not get authenticated user data");
      }
        
      // Создаем минимальный профиль
      return {
        user: {
          id: userId,
          full_name: "Unknown User",
          role: 'patient' as UserRole,
        } as UserProfile,
        userDocuments: null
      };
    }

    if (!userData) {
      console.error("No user profile found for ID:", userId);
      throw new Error("User profile not found");
    }

    // Преобразуем строковую роль в UserRole
    const userRole = validateRole(userData.role);

    const user: UserProfile = {
      id: userData.id,
      full_name: userData.full_name,
      birth_date: userData.birth_date,
      gender: userData.gender,
      photo: userData.photo,
      card_number: userData.card_number,
      attachment_date: userData.attachment_date,
      clinic: userData.clinic,
      role: userRole,
    };

    // Получаем данные документов пользователя
    const { data: documentsData, error: documentsError } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId as any)
      .single();

    if (documentsError && documentsError.code !== "PGRST116") {
      console.error("Error fetching user documents:", documentsError);
      throw documentsError;
    }

    const userDocuments: UserDocuments | null = documentsData
      ? {
          id: documentsData.id,
          user_id: documentsData.user_id,
          passport_series: documentsData.passport_series,
          passport_number: documentsData.passport_number,
          passport_issued_by: documentsData.passport_issued_by,
          passport_issued_date: documentsData.passport_issued_date,
          snils: documentsData.snils,
          inn: documentsData.inn,
        }
      : null;

    console.log("Successfully fetched user data:", { user, userDocuments });
    return { user, userDocuments };
  } catch (error) {
    console.error("Error in fetchUserData:", error);
    throw error;
  }
}

// Функция для проверки и преобразования строковой роли в UserRole
function validateRole(role: string): UserRole {
  if (role === 'admin' || role === 'doctor' || role === 'patient') {
    return role as UserRole;
  }
  // По умолчанию возвращаем 'patient', если роль не соответствует ожидаемым значениям
  return 'patient';
}
