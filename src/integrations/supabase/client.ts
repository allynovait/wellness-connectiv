
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tajrxpkgtmfkggwbgjgs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhanJ4cGtndG1ma2dnd2JnamdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4Nzg4MjgsImV4cCI6MjA1MjQ1NDgyOH0.7_hnGKc6O90sGAg-Pw8fjhn2AnAlH9Id5gjqWS0QcNg";

// Use the actual deployment URL or fall back to the window location
const getRedirectUrl = () => {
  // In browser environment
  if (typeof window !== 'undefined') {
    // Extract the base URL (protocol + hostname + port)
    const baseUrl = window.location.origin;
    return `${baseUrl}/auth?verified=true`;
  }
  // Fallback if not in browser
  return 'https://tajrxpkgtmfkggwbgjgs.lovableproject.com/auth?verified=true';
};

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      redirectTo: getRedirectUrl()
    }
  }
);
