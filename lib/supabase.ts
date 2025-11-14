import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a dummy client if env vars are missing to prevent app crashes
// This allows the app to load but auth features won't work
let supabase: ReturnType<typeof createClient>

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Authentication features will be disabled.')
  // Create a dummy client that won't actually connect
  supabase = createClient(
    'https://placeholder.supabase.co',
    'placeholder-key'
  )
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }
