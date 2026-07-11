import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente com service role — ignora RLS. Usar SOMENTE em código de servidor
 * que precisa agir sem sessão de usuário (webhooks, notificações).
 * Retorna null quando a chave não está configurada, para degradar sem quebrar.
 */
export function createAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key, { auth: { persistSession: false } });
}
