
-- Function to get a user's ID by their email
CREATE OR REPLACE FUNCTION public.get_user_by_email(user_email TEXT)
RETURNS TABLE(id UUID)
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
