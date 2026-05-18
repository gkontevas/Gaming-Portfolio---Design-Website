import { games } from '@/data/games'
import { notFound } from 'next/navigation'
import GamePageContent from '@/components/GamePageContent'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return games.map(g => ({ id: g.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const game = games.find(g => g.id === id)
  if (!game) return {}
  return {
    title: `${game.title} — Vestiges of the Unlit`,
    description: game.lore,
  }
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const game = games.find(g => g.id === id)
  if (!game) notFound()
  return <GamePageContent game={game} />
}
