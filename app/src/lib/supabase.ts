import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a single instance to avoid multiple client warnings
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For client components - use the same instance
export const createClientSupabase = () => supabase;
