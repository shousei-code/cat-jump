export const names = [
  "ぴんくうさぎ",
  "しろねこ",
  "おやすみくま",
  "みんとかえる",
  "すみれきつね",
  "虹のユニコーン",
  "いちごミルク",
  "ハートドーナツ",
  "カップケーキ",
  "チェリーソーダ",
  "マカロン",
  "虹のケーキ",
  "おつきさま",
  "きらきらスター",
  "ロケット",
  "土星",
  "流れ星",
  "星のクリスタル",
  "くじら",
  "くらげ",
  "あざらし",
  "真珠のかいがら",
  "いるか",
  "海のティアラ",
];
export const themes = ["どうぶつ", "スイーツ", "星空", "海のおともだち"];
export const avatars = ["リン", "ミント", "ソラ", "モモ", "レオ", "ルナ"];
export const colors = [
  "#ed9cbe",
  "#85cbbb",
  "#8ab7e4",
  "#d9adf0",
  "#e6ba80",
  "#a9a6df",
];
export const books = [
  "さくらピンク",
  "ミント日記",
  "星空ノート",
  "クリーム手帳",
];
export const rarity = (i) =>
  i % 6 === 5 ? "伝説" : i % 6 === 4 ? "レア" : "ノーマル";
export const fresh = () => ({
  version: 1,
  coins: 60,
  owned: Array(24).fill(0),
  found: [],
  cleared: [],
  avatar: 0,
  book: 0,
  page: Array(12).fill(null),
  pity: [0, 0, 0, 0],
  draws: 0,
  jobs: 0,
});
export function parse(raw) {
  const s = JSON.parse(raw);
  if (
    !s ||
    s.version !== 1 ||
    !Number.isInteger(s.coins) ||
    s.coins < 0 ||
    s.coins > 1e8 ||
    !Array.isArray(s.owned) ||
    s.owned.length !== 24 ||
    s.owned.some((n) => !Number.isInteger(n) || n < 0 || n > 1e7) ||
    !Array.isArray(s.found) ||
    s.found.some((n) => !Number.isInteger(n) || n < 0 || n > 23) ||
    new Set(s.found).size !== s.found.length ||
    !Array.isArray(s.cleared) ||
    s.cleared.some((n) => ![0, 1, 2].includes(n)) ||
    new Set(s.cleared).size !== s.cleared.length ||
    !Number.isInteger(s.avatar) ||
    s.avatar < 0 ||
    s.avatar >= 6 ||
    !Number.isInteger(s.book) ||
    s.book < 0 ||
    s.book >= 4 ||
    !Array.isArray(s.page) ||
    s.page.length !== 12 ||
    s.page.some(
      (n) =>
        n !== null &&
        (!Number.isInteger(n) || n < 0 || n > 23 || s.owned[n] < 1),
    ) ||
    !Array.isArray(s.pity) ||
    s.pity.length !== 4 ||
    s.pity.some((n) => !Number.isInteger(n) || n < 0 || n > 9) ||
    ![s.draws, s.jobs].every((n) => Number.isInteger(n) && n >= 0 && n < 1e7)
  )
    throw Error("セーブデータを読み込めません");
  return s;
}
export function collect(s, id) {
  if (!Number.isInteger(id) || id < 0 || id >= 24 || s.found.includes(id))
    return false;
  s.found.push(id);
  s.owned[id]++;
  s.coins += 10;
  return true;
}
export function gacha(s, theme, roll = Math.random()) {
  if (!Number.isInteger(theme) || theme < 0 || theme > 3 || s.coins < 30)
    return null;
  const r = Math.max(0, Math.min(0.999999, Number.isFinite(roll) ? roll : 0));
  let ix =
    r < 0.22
      ? 0
      : r < 0.44
        ? 1
        : r < 0.66
          ? 2
          : r < 0.88
            ? 3
            : r < 0.98
              ? 4
              : 5;
  if (s.pity[theme] === 9) ix = r < 0.9 ? 4 : 5;
  s.pity[theme] = ix >= 4 ? 0 : s.pity[theme] + 1;
  s.coins -= 30;
  const id = theme * 6 + ix,
    duplicate = s.owned[id] > 0;
  s.owned[id]++;
  s.draws++;
  if (duplicate) s.coins += 5;
  return { id, duplicate };
}
export function jobReward(s, correct) {
  const n = Math.max(0, Math.min(10, Math.floor(correct)));
  const reward = n * 8;
  s.coins += reward;
  s.jobs++;
  return reward;
}
export const platforms = [
  { x: 0, z: 7, y: 0, w: 54, d: 20, checkpoint: true, course: -1 },
];
for (let course = 0; course < 3; course++) {
  const base = (course - 1) * 16;
  for (let i = 0; i < 6; i++)
    platforms.push({
      x: base + (i % 2 ? 1.3 : -1.3),
      z: -7 - i * 5.8,
      y: 0.7 + i * 0.65,
      w: course === 2 ? 4.2 : 5.2,
      d: 4.2,
      checkpoint: i === 2,
      course,
      step: i,
    });
  platforms.push({
    x: base,
    z: -43,
    y: 4.6,
    w: 8,
    d: 6,
    checkpoint: true,
    course,
    finish: true,
  });
}
export function spawn(p = platforms[0]) {
  return {
    x: p.x,
    y: p.y,
    z: p.z,
    vx: 0,
    vy: 0,
    vz: 0,
    onGround: true,
    checkpoint: platforms.indexOf(p),
  };
}
export function step(p, input, dt) {
  dt = Math.min(0.04, Math.max(0, dt));
  let dx = input.x || 0,
    dz = input.z || 0,
    n = Math.hypot(dx, dz);
  if (n > 1) {
    dx /= n;
    dz /= n;
  }
  p.vx = dx * 7;
  p.vz = dz * 7;
  if (input.jump && p.onGround) {
    p.vy = 9;
    p.onGround = false;
  }
  const oldY = p.y;
  p.vy -= 20 * dt;
  p.x += p.vx * dt;
  p.z += p.vz * dt;
  p.y += p.vy * dt;
  p.onGround = false;
  let landed = null;
  for (const q of platforms) {
    if (
      Math.abs(p.x - q.x) < q.w / 2 + 0.2 &&
      Math.abs(p.z - q.z) < q.d / 2 + 0.2 &&
      p.vy <= 0 &&
      oldY >= q.y - 0.05 &&
      p.y <= q.y
    ) {
      p.y = q.y;
      p.vy = 0;
      p.onGround = true;
      landed = q;
      if (q.checkpoint) p.checkpoint = platforms.indexOf(q);
      break;
    }
  }
  let fell = false;
  if (p.y < -12 || Math.abs(p.x) > 70 || Math.abs(p.z) > 90) {
    const cp = p.checkpoint;
    Object.assign(p, spawn(platforms[cp]));
    fell = true;
  }
  return { landed, fell };
}
