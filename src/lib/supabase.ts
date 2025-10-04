import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variáveis de ambiente do Supabase não configuradas. ' +
    'Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

// Instância global do Supabase com persistência de sessão
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Cliente admin com service role (apenas para uso no servidor)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

export const SUPABASE_URL = supabaseUrl;
export const SUPABASE_SERVICE_KEY = supabaseServiceKey ?? null;

// Helper para obter sessão atual
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Erro ao obter sessão:', error.message);
    return null;
  }
  
  return session;
}

// Helper para obter usuário atual
export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}

// Helper para obter token de acesso
export async function getAccessToken() {
  const session = await getCurrentSession();
  return session?.access_token ?? null;
}

// Helper para verificar se usuário é admin
export async function isUserAdmin(userId: string) {
  if (!supabaseAdmin) return false;
  
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('user_type')
    .eq('id', userId)
    .eq('user_type', 'admin')
    .maybeSingle();
    
  return !error && !!data;
}
