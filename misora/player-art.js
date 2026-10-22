import { dressNames, pinNames, shoeNames, freshPlayer } from "./player.mjs?v=rin1";
const bodies = [
  ["wardrobe-a", 0, 270, 35, 761],
  ["wardrobe-a", 1, 248, 35, 761],
  ["wardrobe-a", 2, 270, 18, 747],
  ["wardrobe-a", 3, 248, 19, 748],
  ["wardrobe-b", 0, 270, 35, 760],
  ["wardrobe-b", 1, 246, 35, 760],
  ["wardrobe-b", 2, 270, 19, 746],
  ["wardrobe-b", 3, 246, 19, 746],
  ["wardrobe-c", 0, 272, 18, 731],
  ["wardrobe-c", 1, 248, 18, 731],
  ["wardrobe-d", 0, 278, 24, 758],
  ["wardrobe-d", 1, 244, 30, 758],
  ["wardrobe-d", 2, 278, 8, 752],
  ["wardrobe-d", 3, 244, 9, 748],
];
const dressBases = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1, 2, 5, 6, 8, 13,
];
const hairs = [
  [0, 0.4, 256, 2],
  [1, 0.44, 246, 18],
  [2, 0.44, 263, 20],
  [3, 0.44, 256, 19],
  [4, 0.44, 186, 11],
  [5, 0.44, 263, 27],
];
const hairFilters = [
  "none",
  "saturate(.55) brightness(.66)",
  "hue-rotate(28deg) saturate(.75) brightness(1.2)",
  "hue-rotate(320deg) saturate(.8)",
  "hue-rotate(270deg) saturate(.65)",
  "hue-rotate(325deg) saturate(.45) brightness(1.55)",
];
const eyeFilters = [
  "none",
  "hue-rotate(290deg)",
  "hue-rotate(150deg)",
  "hue-rotate(325deg)",
  "saturate(.5) brightness(1.3)",
];
const tint = [
  "none",
  "hue-rotate(320deg) saturate(.8)",
  "hue-rotate(260deg) saturate(.7)",
  "saturate(.2) brightness(1.15)",
];
let counter = 0;
export const escapeHtml = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function sprite(sheet, frame, cols, rows, cw, ch, x, y, w, h, filter = "none") {
  const ext = sheet === "wardrobe-d" ? "png" : "webp";
  return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${cw} ${ch}" preserveAspectRatio="none" style="overflow:hidden;filter:${filter}"><image href="assets/player/${sheet}.${ext}" x="${-(frame % cols) * cw}" y="${-Math.floor(frame / cols) * ch}" width="${cw * cols}" height="${ch * rows}"/></svg>`;
}
function body(i, filter = "none") {
  const [sheet, frame, x, y, foot] = bodies[i],
    scale = 616 / (foot - y);
  return sprite(
    sheet,
    frame,
    2,
    2,
    512,
    768,
    256 - x * scale,
    130 - y * scale,
    512 * scale,
    768 * scale,
    filter,
  );
}
export function pinIcon(i, klass = "") {
  const cw = 307.2,
    ch = 256;
  return `<svg class="pin-icon ${klass}" viewBox="0 0 ${cw} ${ch}" preserveAspectRatio="xMidYMid meet" style="overflow:hidden"><svg width="${cw}" height="${ch}" style="overflow:hidden"><image href="assets/player/hairpins.png" x="${-(i % 5) * cw}" y="${-Math.floor(i / 5) * ch}" width="1536" height="1024"/></svg></svg>`;
}
export function shoeIcon(i) {
  return `<svg class="shoe-icon" viewBox="140 630 240 120" preserveAspectRatio="xMidYMid meet" style="overflow:hidden"><svg x="140" y="630" width="240" height="120" viewBox="140 630 240 120" style="overflow:hidden">${body([0, 1, 7, 2, 4, 8][i % 6], tint[Math.floor(i / 6)])}</svg></svg>`;
}
export function playerFigure(state, extra = "", expression = "smile") {
  const p = state.player ?? freshPlayer(),
    id = "player-" + counter++,
    hair = hairs[p.hair] ?? hairs[0],
    face = expression === "shy" ? 3 : expression === "joy" ? 1 : 0;
  const feetStart = p.dress === 10 && p.shoes % 6 !== 2 ? 700 : 629.76;
  const hs = sprite(
    "koto-hair",
    hair[0],
    3,
    2,
    512,
    512,
    256 - hair[2] * hair[1],
    hair[3],
    512 * hair[1],
    512 * hair[1],
    hairFilters[p.color],
  );
  const fs = (filter = "none") =>
    sprite(
      "koto-expressions",
      face,
      4,
      3,
      256,
      256,
      214.4,
      51.4,
      83.3,
      83.3,
      filter,
    );
  const rin = `<svg class="rin-head" x="176" y="-8" width="160" height="145" viewBox="0 0 512 464" preserveAspectRatio="none" style="overflow:hidden"><image href="assets/player/rin-heads.png" x="${-(expression === "shy" ? 2 : expression === "joy" ? 1 : 0) * 512}" y="0" width="1536" height="512"/></svg>`;
  return `<svg class="player-figure ${extra}" viewBox="0 0 512 768" role="img" aria-label="${escapeHtml(p.name)}のコーディネート" data-dress="${p.dress}" data-hair="${p.hair}" data-pin="${p.pin}" data-shoes="${p.shoes}"><defs><clipPath id="${id}-body"><rect width="512" height="${feetStart}"/></clipPath><clipPath id="${id}-feet"><rect y="${feetStart}" width="512" height="${750 - feetStart}"/></clipPath><clipPath id="${id}-front"><rect x="0" y="0" width="512" height="${hair[3] + 512 * hair[1] * 0.6}"/></clipPath><clipPath id="${id}-skirt"><rect x="110" y="270" width="292" height="300"/></clipPath><clipPath id="${id}-eyes"><ellipse cx="237.7" cy="93" rx="8.5" ry="7"/><ellipse cx="275.2" cy="90.5" rx="8.5" ry="7"/></clipPath><clipPath id="${id}-all"><rect width="512" height="768"/></clipPath></defs><g clip-path="url(#${id}-all)">${p.hair === 6 ? "" : hs}<g clip-path="url(#${id}-body)">${body(dressBases[p.dress])}</g>${p.dress >= 14 ? `<g clip-path="url(#${id}-skirt)">${body(dressBases[p.dress], `hue-rotate(${[310, 270, 30, 280, 20, 90][p.dress - 14]}deg)`)}</g>` : ""}<g clip-path="url(#${id}-feet)">${body([0, 1, 7, 2, 4, 8][p.shoes % 6], tint[Math.floor(p.shoes / 6)])}</g>${p.hair === 6 ? rin : `${fs()}<g clip-path="url(#${id}-eyes)">${fs(eyeFilters[p.eyes])}</g><g clip-path="url(#${id}-front)">${hs}</g>`}<svg x="282" y="35" width="44" height="37" viewBox="0 0 307.2 256" style="overflow:hidden"><image href="assets/player/hairpins.png" x="${-(p.pin % 5) * 307.2}" y="${-Math.floor(p.pin / 5) * 256}" width="1536" height="1024"/></svg></g></svg>`;
}
