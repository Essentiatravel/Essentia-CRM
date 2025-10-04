import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase environment variables are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export async function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

export async function getAllUsers() {
  const client = await getSupabaseClient();
  const { data, error } = await client.from("users").select("*");
  if (error) throw error;
  return data ?? [];
}