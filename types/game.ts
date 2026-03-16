/*
  TYPE DEFINITION — Game

  A TypeScript type is a "shape contract."
  It says: "anything called a Game MUST have these fields."

  If you later create a game object missing a required field,
  TypeScript will catch it immediately in your editor — before you run anything.

  The '?' means the field is optional (not every game has full data yet).
*/

export type Game = {
  id: string;
  title: string;
  developer: string;
  year: number;
  hours?: number;           // optional — some games lack tracked data
  achievements?: {
    earned: number;
    total: number;
  };
  perfect: boolean;         // true = 100% achievements earned
  genre: "soulslike" | "action-rpg" | "jrpg" | "action" | "roguelike" | "other";
  lore: string;             // cryptic description, like a Souls item tooltip
  description?: string;     // spoiler-free world/premise description for the modal
  image?: string;           // optional card background — path relative to /public
  metacritic?: number;      // Metacritic score
  platforms?: string[];     // e.g. ['PC', 'PS5', 'Xbox']
  difficulty?: 1 | 2 | 3 | 4 | 5;  // 1 = accessible, 5 = punishing
  series?: string;          // e.g. 'Dark Souls Trilogy · Part 1'
  playtime?: { main: number; complete: number }; // hours
  features?: string[];      // 3–4 standout features, bullet-point style
};
