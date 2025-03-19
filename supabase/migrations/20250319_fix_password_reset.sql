
-- Function to get a user by email without using RLS
CREATE OR REPLACE FUNCTION public.get_user_by_email(user_email TEXT)
RETURNS TABLE (id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT profiles.id
  FROM public.profiles
  WHERE profiles.email = user_email;
END;
$$;

-- Function to update a user's password without using RLS
CREATE OR REPLACE FUNCTION public.update_user_password(user_id UUID, new_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    password = new_password,
    updated_at = NOW()
  WHERE id = user_id;
  
  RETURN FOUND;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;
