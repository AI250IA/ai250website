export const projectId = import.meta.env.VITE_SUPABASE_ID as string;
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
export const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || (projectId ? `https://${projectId}.supabase.co` : '');

if (!supabaseUrl || !publicAnonKey) {
  // Non-fatal: log to help local setup; runtime features depending on Supabase may be disabled
  console.warn('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Auth features may be limited.');
}

