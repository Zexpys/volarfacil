import { createClient } from '@supabase/supabase-js'

// Admin client with service role key — bypasses RLS.
// ONLY use in server-side code (API routes, webhooks). Never expose to the client.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// Helper: get authenticated user from Bearer token
export async function getUserFromToken(token: string) {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null
  return user
}
