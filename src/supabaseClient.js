import { createClient } from '@supabase/supabase-js';

// Konfigurasi URL dan Key dari Supabase (Mendukung environment variables dan fallback)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://whporlafezrjbntbyajo.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_m8yMgbTtpp95E3TjOLOYIg_heZtrAh6';

export const supabase = createClient(supabaseUrl, supabaseKey);

