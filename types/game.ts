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
  image?: string;           // optional card background — path relative to /public
};
