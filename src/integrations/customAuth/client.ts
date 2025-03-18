
import { supabase } from "../supabase/client";
import { ProfileWithSession, Session } from "./types";
import { UserProfile, UserRole } from "@/types/auth";

// Проверка активной сессии
export const getSession = async (): Promise<Session | null> => {
  try {
    // Получаем сессию из localStorage
    const sessionToken = localStorage.getItem('session_token');
    if (!sessionToken) return null;

    // Валидируем сессию через нашу БД
    const { data, error } = await supabase
      .rpc('validate_session', { session_token: sessionToken });

    if (error || !data) {
      console.error("Ошибка валидации сессии:", error);
      localStorage.removeItem('session_token');
      return null;
    }

    // Если сессия валидна, получаем данные пользователя
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data)
      .single();

    if (userError || !userData) {
      console.error("Ошибка получения данных пользователя:", userError);
      localStorage.removeItem('session_token');
      return null;
    }

    return {
      token: sessionToken,
      user: {
        id: userData.id,
        email: userData.email,
        email_confirmed_at: userData.email_confirmed_at
      },
      // Add the missing properties
      access_token: sessionToken,
      refresh_token: sessionToken,
      expires_in: 3600,
      token_type: 'bearer'
    };
  } catch (error) {
    console.error("Ошибка при получении сессии:", error);
    localStorage.removeItem('session_token');
    return null;
  }
};

// Вход пользователя
export const signIn = async (email: string, password: string): Promise<ProfileWithSession | null> => {
  try {
    // Аутентификация пользователя через нашу RPC-функцию
    const { data: userId, error: authError } = await supabase
      .rpc('authenticate_user', { user_email: email, user_password: password });
    
    if (authError || !userId) {
      console.error("Ошибка аутентификации:", authError);
      return null;
    }
    
    // Создаем новую сессию
    const { data: sessionToken, error: sessionError } = await supabase
      .rpc('create_session', { user_id: userId });
    
    if (sessionError || !sessionToken) {
      console.error("Ошибка создания сессии:", sessionError);
      return null;
    }
    
    // Сохраняем токен в localStorage
    localStorage.setItem('session_token', sessionToken);
    
    // Получаем данные профиля пользователя
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError || !profileData) {
      console.error("Ошибка получения профиля:", profileError);
      return null;
    }
    
    // Получаем документы пользователя
    const { data: docsData } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Преобразуем строковую role в UserRole
    const userRole = validateRole(profileData.role);
    
    // Создаем объект профиля с правильным типом role
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
    console.error("Ошибка при входе:", error);
    return null;
  }
};

// Функция для проверки и преобразования строковой роли в UserRole
function validateRole(role: string): UserRole {
  if (role === 'admin' || role === 'doctor' || role === 'patient') {
    return role as UserRole;
  }
  // По умолчанию возвращаем 'patient', если роль не соответствует ожидаемым значениям
  return 'patient';
}

// Регистрация пользователя
export const signUp = async (
  email: string, 
  password: string, 
  full_name: string, 
  role: string
): Promise<boolean> => {
  try {
    // Проверяем, существует ли пользователь с таким email
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
    
    if (existingUser) {
      console.error("Пользователь с таким email уже существует");
      return false;
    }
    
    // Создаем нового пользователя
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: crypto.randomUUID(), // Генерируем UUID на клиенте
        email,
        password,
        full_name,
        role: validateRole(role), // Проверяем роль при сохранении
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true
      })
      .select()
      .single();
    
    if (createError || !newProfile) {
      console.error("Ошибка создания пользователя:", createError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    return false;
  }
};

// Выход пользователя
export const signOut = async (): Promise<boolean> => {
  try {
    const sessionToken = localStorage.getItem('session_token');
    if (sessionToken) {
      // Удаляем сессию из базы данных
      await supabase
        .from('sessions')
        .delete()
        .eq('token', sessionToken);
    }
    
    // Очищаем localStorage
    localStorage.removeItem('session_token');
    
    return true;
  } catch (error) {
    console.error("Ошибка при выходе:", error);
    return false;
  }
};
