export type Expression =
  | "calm"
  | "smile"
  | "joy"
  | "surprised"
  | "shy"
  | "sad"
  | "angry"
  | "worried"
  | "wink"
  | "closedSmile"
  | "heart"
  | "blink";
export const EXPRESSIONS: Record<Expression, { frame: number; label: string }> =
  {
    smile: { frame: 0, label: "笑顔" },
    joy: { frame: 1, label: "大喜び" },
    surprised: { frame: 2, label: "驚き" },
    shy: { frame: 3, label: "照れ" },
    sad: { frame: 4, label: "悲しい" },
    angry: { frame: 5, label: "怒る" },
    worried: { frame: 6, label: "困る" },
    wink: { frame: 7, label: "ウインク" },
    closedSmile: { frame: 8, label: "目を閉じて笑う" },
    heart: { frame: 9, label: "ドキドキ" },
    calm: { frame: 10, label: "通常" },
    blink: { frame: 11, label: "まばたき" },
  };
export type Sheet =
  | "koto-expressions"
  | "koto-hair"
  | "wardrobe-a"
  | "wardrobe-b"
  | "wardrobe-c"
  | "accessories"
  | "haruto-ren"
  | "aoi-kaito";
export const SHEETS: Record<Sheet, { cols: number; rows: number }> = {
  "koto-expressions": { cols: 4, rows: 3 },
  "koto-hair": { cols: 3, rows: 2 },
  "wardrobe-a": { cols: 2, rows: 2 },
  "wardrobe-b": { cols: 2, rows: 2 },
  "wardrobe-c": { cols: 2, rows: 2 },
  accessories: { cols: 4, rows: 2 },
  "haruto-ren": { cols: 2, rows: 3 },
  "aoi-kaito": { cols: 2, rows: 3 },
};
export const artUrl = (sheet: string) =>
  import.meta.env.BASE_URL + "art/characters/" + sheet + ".webp";
export interface BodyArt {
  sheet: Sheet;
  frame: number;
  neckX: number;
  neckY: number;
  footY: number;
}
export const BODIES: Record<string, BodyArt> = {
  "dress-uniform": {
    sheet: "wardrobe-a",
    frame: 0,
    neckX: 270,
    neckY: 35,
    footY: 761,
  },
  "dress-mint": {
    sheet: "wardrobe-a",
    frame: 1,
    neckX: 248,
    neckY: 35,
    footY: 761,
  },
  "dress-rose": {
    sheet: "wardrobe-a",
    frame: 2,
    neckX: 270,
    neckY: 18,
    footY: 747,
  },
  "dress-moon": {
    sheet: "wardrobe-a",
    frame: 3,
    neckX: 248,
    neckY: 19,
    footY: 748,
  },
  "dress-cardigan": {
    sheet: "wardrobe-b",
    frame: 0,
    neckX: 270,
    neckY: 35,
    footY: 760,
  },
  "dress-sailor": {
    sheet: "wardrobe-b",
    frame: 1,
    neckX: 246,
    neckY: 35,
    footY: 760,
  },
  "dress-flower": {
    sheet: "wardrobe-b",
    frame: 2,
    neckX: 270,
    neckY: 19,
    footY: 746,
  },
  "dress-coat": {
    sheet: "wardrobe-b",
    frame: 3,
    neckX: 246,
    neckY: 19,
    footY: 746,
  },
  "dress-princess": {
    sheet: "wardrobe-c",
    frame: 0,
    neckX: 272,
    neckY: 18,
    footY: 731,
  },
  "dress-secret": {
    sheet: "wardrobe-c",
    frame: 1,
    neckX: 248,
    neckY: 18,
    footY: 731,
  },
};
export const SHOES: Record<string, string> = {
  "shoes-basic": "dress-uniform",
  "shoes-mint": "dress-mint",
  "shoes-night": "dress-coat",
  "shoes-rose": "dress-rose",
  "shoes-pearl": "dress-cardigan",
  "shoes-star": "dress-princess",
};
export const HAIRS = [
  { frame: 0, scale: 0.4, x: 256, y: 2 },
  { frame: 1, scale: 0.44, x: 246, y: 18 },
  { frame: 2, scale: 0.44, x: 263, y: 20 },
  { frame: 3, scale: 0.44, x: 256, y: 19 },
  { frame: 4, scale: 0.44, x: 186, y: 11 },
  { frame: 5, scale: 0.44, x: 263, y: 27 },
];
// Position of each accessory on the same 512×768 registration canvas.
export const ACCESSORIES = [
  { x: 285, y: 29, w: 49, h: 49 },
  { x: 291, y: 49, w: 34, h: 34 },
  { x: 247, y: 164, w: 24, h: 24 },
  { x: 203, y: 19, w: 108, h: 65 },
  { x: 203, y: 0, w: 109, h: 71 },
  { x: 214, y: 109, w: 86, h: 27 },
  { x: 199, y: 17, w: 117, h: 87 },
  { x: 213, y: 0, w: 87, h: 60 },
];
export const BOYS: Record<string, { sheet: Sheet; column: number }> = {
  haruto: { sheet: "haruto-ren", column: 0 },
  ren: { sheet: "haruto-ren", column: 1 },
  aoi: { sheet: "aoi-kaito", column: 0 },
  kaito: { sheet: "aoi-kaito", column: 1 },
};
