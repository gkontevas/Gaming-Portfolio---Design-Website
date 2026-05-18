'use server'

import { headers } from 'next/headers'
import crypto from 'crypto'
import { supabase } from '@/lib/supabase'
import type { BonfireMessage, Reaction } from '@/lib/supabase'

const PAGE_SIZE = 12

export async function getMessages(
  sort: 'recent' | 'top' = 'recent',
  offset = 0
): Promise<BonfireMessage[]> {
  const { data } = await supabase
    .from('bonfire_messages')
    .select('id, text, username, created_at, praise, brilliant, beware')
    .eq('hidden', false)
    .order(sort === 'top' ? 'praise' : 'created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  return data ?? []
}

export async function getMessageCount(): Promise<number> {
  const { count } = await supabase
    .from('bonfire_messages')
    .select('*', { count: 'exact', head: true })
    .eq('hidden', false)

  return count ?? 0
}

export async function addMessage(text: string, username: string): Promise<{ error?: string }> {
  if (!text || text.trim().length < 3) return { error: 'Too short' }
  if (text.length > 120) return { error: 'Too long' }

  // Server-side IP rate limiting — hashed, never stored raw
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim()
    || headersList.get('x-real-ip')
    || 'unknown'
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16)

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { data: recent } = await supabase
    .from('bonfire_messages')
    .select('id')
    .eq('ip_hash', ipHash)
    .gte('created_at', oneHourAgo)
    .limit(1)

  if (recent && recent.length > 0) return { error: 'Rate limited' }

  const name = username.trim().slice(0, 24) || 'Tarnished'

  const { error } = await supabase
    .from('bonfire_messages')
    .insert({ text: text.trim(), username: name, ip_hash: ipHash })

  if (error) return { error: error.message }
  return {}
}

export async function reactToMessage(
  id: string,
  reaction: Reaction,
  current: number
): Promise<void> {
  await supabase
    .from('bonfire_messages')
    .update({ [reaction]: current + 1 })
    .eq('id', id)
}
