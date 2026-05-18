export async function getGameScreenshots(title: string): Promise<string[]> {
  const key = process.env.RAWG_API_KEY
  if (!key) return []
  try {
    const searchRes = await fetch(
      `https://api.rawg.io/api/games?key=${key}&search=${encodeURIComponent(title)}&page_size=1`,
      { next: { revalidate: 86400 } }
    )
    const { results } = await searchRes.json()
    const slug = results?.[0]?.slug
    if (!slug) return []
    const shotsRes = await fetch(
      `https://api.rawg.io/api/games/${slug}/screenshots?key=${key}`,
      { next: { revalidate: 86400 } }
    )
    const { results: imgs } = await shotsRes.json()
    return imgs?.map((s: { image: string }) => s.image) ?? []
  } catch {
    return []
  }
}
