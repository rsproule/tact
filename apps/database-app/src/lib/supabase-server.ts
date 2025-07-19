import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Server-side Supabase client (for use in server components/API routes)  
export const createServerSupabaseClient = () => createServerComponentClient({ cookies });