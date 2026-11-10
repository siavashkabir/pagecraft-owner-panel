import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'آدرس-Project-URL-را-اینجا-بگذار';
const supabaseAnonKey = 'کلید-anon-public-را-اینجا-بگذار';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
