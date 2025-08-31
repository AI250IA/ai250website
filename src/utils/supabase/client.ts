import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, publicAnonKey } from './info';

let cached: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!cached) {
    if (!supabaseUrl || !publicAnonKey) {
      console.warn('[Supabase] Missing configuration. Some auth flows may not work.');
    }
    cached = createClient(supabaseUrl || '', publicAnonKey || '');
  }
  return cached;
}

