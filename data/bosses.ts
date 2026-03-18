/*
  BOSSES DATA
  ───────────
  Add your own images to /public/bosses/ and set the image path here.
  Supported formats: .jpg .png .webp .avif

  If image is left as an empty string, the panel renders a dark
  atmospheric gradient fallback — still looks great.
*/

export type Boss = {
  id: string
  name: string
  title: string   // subtitle shown below the name
  game: string
  image: string   // e.g. '/bosses/isshin.jpg' — leave '' until you add the file
  quote: string   // your personal verdict — raw, honest, Souls-flavored
  objectPosition?: string  // CSS object-position — where to focus on mobile crop e.g. 'top', '50% 20%'
}

export const bosses: Boss[] = [
  {
    id: 'simon',
    name: 'Simon',
    title: 'The Painter · Wielder of the Lost Melody',
    game: 'Clair Obscur: Expedition 33',
    image: '/simon3.webp',
    objectPosition: 'top',
    quote: `He painted ruin with a steady hand and a grieving heart. To face him was to understand
that some antagonists are right. The hardest part was not winning — it was accepting what he
was fighting for.`,
  },
  {
    id: 'isshin',
    name: 'Isshin',
    title: 'Sword Saint · The Old Warrior\'s Last Wish',
    game: 'Sekiro: Shadows Die Twice',
    image: '/isshin.jpg',
    objectPosition: 'top',
    quote: `An old man who wanted a worthy death. I spent hours learning what worthy meant. The final
breach felt less like victory — more like a gift freely given.`,
  },
  {
    id: 'ozma',
    name: 'Ozma',
    title: 'The Transcended · Final Reckoning of Khazan',
    game: 'The First Berserker: Khazan',
    image: '/ozma.png',
    objectPosition: 'top',
    quote: `Every phase a revelation. Every death a debt paid toward understanding. A demon lord who
did not overwhelm — it educated. The hardest fight I have had in years.`,
  },
  {
    id: 'maliketh',
    name: 'Maliketh',
    title: 'The Black Blade · Shadow of the Elden Beast',
    game: 'Elden Ring',
    image: '/maliketh.webp',
    objectPosition: 'top',
    quote: `The Black Blade unmakes. Health, flasks, certainty — all diminished with each swing. I
learned his rhythm the way you learn a language: by failing to speak it, again and again,
until the words came naturally.`,
  },
  {
    id: 'soul-of-cinder',
    name: 'Soul of Cinder',
    title: 'The Last Lord · Keeper of the First Flame',
    game: 'Dark Souls III',
    image: '/soul-of-cinder.jpg',
    objectPosition: 'top',
    quote: `Every lord of cinder, every flame ever linked, compressed into one final guardian. Fighting
the Soul of Cinder felt like saying goodbye to the entire series at once. It deserved that
weight.`,
  },
  {
    id: 'artorias',
    name: 'Artorias',
    title: 'The Abysswalker · Knight of Gwyn, Consumed',
    game: 'Dark Souls: Remastered',
    image: '/artorias.jpg',
    objectPosition: 'top',
    quote: `He was already corrupted before you arrived. A knight who never stopped trying to be noble
even as darkness moved his limbs. That dignity in defeat — it never fully leaves you.`,
  },
  {
    id: 'erlang',
    name: 'Erlang Shen',
    title: 'The Illustrious Sage · God of War and Virtue',
    game: 'Black Myth: Wukong',
    image: '/erlang.webp',
    objectPosition: 'top',
    quote: `A god who was never truly trying until he was. He gave you room to grow before taking it
all back. The restraint was the lesson. Humility, administered with a staff and a smirk.`,
  },
  {
    id: 'lady-maria',
    name: 'Lady Maria',
    title: 'Of the Astral Clocktower · Last of the Hunters',
    game: 'Bloodborne',
    image: '/lady.avif',
    objectPosition: 'top',
    quote: `She did not want to be found. The clocktower was her penance, and we were the
interruption. The most elegant fight Bloodborne offers — and the most sorrowful.`,
  },
  {
    id: 'ludwig',
    name: 'Ludwig',
    title: 'The Accursed · The Holy Blade',
    game: 'Bloodborne',
    image: '/ludwig.jpg',
    objectPosition: 'top',
    quote: `A beast who remembered being a man, mid-fight. That moment — when he finds the sword and
the music changes — is the single greatest boss cutscene in any game I have played.`,
  },
  {
    id: 'lu-bu',
    name: 'Lu Bu',
    title: 'Mightiest Under Heaven · Vessel of the Demonic',
    game: 'Wo Long: Fallen Dynasty',
    image: '/lubu.jpg',
    objectPosition: '50% 30%',
    quote: `No introduction needed. The moment that name appears on screen, you already know what
is coming. A wall of force dressed as a man — and the single most satisfying kill the game
offers.`,
  },
]
