import type { CampaignState } from "../campaign/engine";
export type Tag = "cute" | "elegant" | "cool" | "nature";
export type Slot = "hair" | "outfit" | "shoes" | "accessory";
export type Palette = "rose" | "lavender" | "mint" | "navy" | "gold" | "ivory";
export type Difficulty = "normal" | "hard" | "expert";
export type Person =
  "haruto" | "ren" | "aoi" | "kaito" | "mio" | "yui" | "seira";
export type Trait = "kind" | "brave" | "curious";
export type Outfit = Record<Slot, string>;
export interface Item {
  id: string;
  name: string;
  slot: Slot;
  palette: Palette;
  tags: Record<Tag, number>;
  price: number;
  shape: number;
  rarity: "basic" | "rare" | "secret";
  unlock?: "chapter" | "mystery";
  description: string;
  tint?: string;
}
export type Node =
  | "letter"
  | "gate"
  | "welcome"
  | "invite"
  | "brief"
  | "festival"
  | "epilogue"
  | "complete";
export interface BattleResult {
  win: boolean;
  score: number;
  rivalScore: number;
  themeId: string;
  difficulty: Difficulty;
  outfit: Outfit;
  rewarded: boolean;
}
export interface GameState {
  campaign?: CampaignState;
  version: 1;
  started: boolean;
  node: Node;
  coins: number;
  xp: number;
  owned: string[];
  equipped: Outfit;
  hairColor: string;
  eyeColor: string;
  skinColor: string;
  difficulty: Difficulty;
  relations: Record<Person, number>;
  traits: Record<Trait, number>;
  choices: string[];
  clues: string[];
  claimed: string[];
  achievements: string[];
  chapterClear: boolean;
  battle: BattleResult | null;
  best: number;
  themeIndex: number;
  history: string[];
  updatedAt: string;
}
export interface Choice {
  id: string;
  label: string;
  hint: string;
  next: Node;
  person?: Person;
  trait: Trait;
  reply: string;
}
export interface Scene {
  id: Node;
  location: string;
  speaker: Person | "narrator";
  title: string;
  text: string;
  choices: Choice[];
}
