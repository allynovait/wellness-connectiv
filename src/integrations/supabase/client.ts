
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tajrxpkgtmfkggwbgjgs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhanJ4cGtndG1ma2dnd2JnamdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4Nzg4MjgsImV4cCI6MjA1MjQ1NDgyOH0.7_hnGKc6O90sGAg-Pw8fjhn2AnAlH9Id5gjqWS0QcNg";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
