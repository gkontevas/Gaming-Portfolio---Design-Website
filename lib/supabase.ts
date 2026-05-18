import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Reaction = 'praise' | 'brilliant' | 'beware'

export type BonfireMessage = {
  id: string
  text: string
  username: string
  created_at: string
  praise: number
  brilliant: number
  beware: number
}
