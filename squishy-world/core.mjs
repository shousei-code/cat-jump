export const groups = ["おかし", "どうぶつ", "海のおともだち", "魔法と星"];
export const sheets = ["sweets", "animals", "ocean", "magic"];
export const names = [
  "いちごドーナツ",
  "チョコドーナツ",
  "クロワッサン",
  "桃色マカロン",
  "ミントマカロン",
  "いちごミルク",
  "かめメロンパン",
  "パンケーキ",
  "カップケーキ",
  "虹のケーキ",
  "たい焼き",
  "ぷるぷるプリン",
  "いちごアイス",
  "キャンディサボテン",
  "マシュマロ雲",
  "クッキーサンド",
  "パイナップルパン",
  "ハートワッフル",
  "いちごロール",
  "いちごサンド",
  "くまのケーキ",
  "虹わたあめ",
  "キャンディらくだ",
  "水晶キャンディ",
  "黄金ユニコーン",
  "ピンクうさぎ",
  "クリームねこ",
  "パンダ",
  "こぐま",
  "ミントかえる",
  "すみれきつね",
  "ひよこ",
  "コーギー",
  "ハムスター",
  "ふわふわひつじ",
  "ぞうさん",
  "こどもライオン",
  "コアラ",
  "レッサーパンダ",
  "カピバラ",
  "きらめくふくろう",
  "ハリネズミ",
  "ペンギン",
  "ラッコ",
  "リス",
  "こじか",
  "三毛ねこ",
  "アライグマ",
  "白いとら",
  "虹の羽うさぎ",
  "くじら",
  "ピンクくらげ",
  "あざらし",
  "真珠のかいがら",
  "いるか",
  "ヒトデ",
  "うみがめ",
  "ピンクたこ",
  "タツノオトシゴ",
  "クマノミ",
  "にこにこカニ",
  "えび",
  "マンタ",
  "ふぐ",
  "珊瑚",
  "うみうさぎ",
  "イッカク",
  "青いおさかな",
  "泳ぐペンギン",
  "海のスポンジ",
  "砂のお城",
  "貝がらバッグ",
  "泡のウーパールーパー",
  "月の真珠",
  "虹のシードラゴン",
  "おつきさま",
  "おほしさま",
  "ロケット",
  "土星",
  "流れ星",
  "ラベンダークリスタル",
  "雲のお城",
  "雪だるま",
  "オーロラしろくま",
  "雪うさぎ",
  "小さな虹",
  "ハート風船",
  "魔法の本",
  "ピンクドラゴン",
  "ティーカップねこ",
  "音符",
  "ちきゅう",
  "アイスの惑星",
  "妖精きのこ",
  "ラベンダーちょうちょ",
  "幸運のクローバー",
  "おもちゃロボット",
  "桜の妖精",
  "水晶きつね",
  "虹のフェニックス",
];
export const goals = [24, 49, 74, 99, 23, 98];
export const maps = [
  {
    name: "おかしの国の砂漠",
    icon: "🍩",
    sky: "#f8dfcf",
    floor: "#eac49b",
    accent: "#ed9fba",
    kind: "candy",
    difficulty: "やさしい",
    steps: 10,
    width: 5.4,
    gap: 5.4,
    rise: 0.45,
  },
  {
    name: "どうぶつの森",
    icon: "🐰",
    sky: "#dbeee0",
    floor: "#abd6a4",
    accent: "#d9b6e8",
    kind: "forest",
    difficulty: "ふつう",
    steps: 12,
    width: 4.6,
    gap: 5.6,
    rise: 0.5,
  },
  {
    name: "真珠の海の洞窟",
    icon: "🐚",
    sky: "#d0eafa",
    floor: "#92c9d2",
    accent: "#d3b9ea",
    kind: "ocean",
    difficulty: "ふつう",
    steps: 12,
    width: 4.4,
    gap: 5.6,
    rise: 0.5,
  },
  {
    name: "星空の超アスレチック",
    icon: "🌠",
    sky: "#bdbbdf",
    floor: "#a2a4cf",
    accent: "#e5b8da",
    kind: "space",
    difficulty: "むずかしい",
    steps: 18,
    width: 2.8,
    gap: 5.8,
    rise: 0.6,
  },
  {
    name: "アイスクリーム雪山",
    icon: "🍦",
    sky: "#e4eff6",
    floor: "#b9dbe7",
    accent: "#e9bed7",
    kind: "ice",
    difficulty: "ちょいむず",
    steps: 14,
    width: 3.8,
    gap: 5.7,
    rise: 0.55,
  },
  {
    name: "虹の雲のてっぺん",
    icon: "🌈",
    sky: "#e8dff3",
    floor: "#d7c8e7",
    accent: "#b7dfd6",
    kind: "cloud",
    difficulty: "むずかしい",
    steps: 18,
    width: 2.6,
    gap: 5.8,
    rise: 0.6,
  },
];
export const rarity = (id) =>
  goals.includes(id) ? "冒険限定" : id % 25 >= 20 ? "レア" : "ノーマル";
const regular = Array.from({ length: 100 }, (_, i) => i).filter(
  (i) => !goals.includes(i),
);
export const mapLoot = maps.map((_, m) => regular.slice(m * 14, m * 14 + 14));
export const gachaPool = (g) => regular.filter((i) => Math.floor(i / 25) === g);
export const fresh = () => ({
  version: 1,
  coins: 80,
  owned: Array.from({ length: 100 }, (_, i) => (i === 0 ? 1 : 0)),
  found: [0],
  cleared: [],
  shelves: Array.from({ length: 100 }, (_, i) => (i === 0 ? 0 : null)),
  cared: [],
  pity: [0, 0, 0, 0],
  map: 0,
  avatar: 0,
  wall: 0,
  sound: false,
  jobs: 0,
});
export function parse(raw) {
  const s = JSON.parse(raw);
  const range = (n, max) => Number.isInteger(n) && n >= 0 && n < max;
  const ids = (a) =>
    Array.isArray(a) &&
    a.every((i) => range(i, 100)) &&
    new Set(a).size === a.length;
  if (
    !s ||
    s.version !== 1 ||
    !range(s.coins, 1e9) ||
    !Array.isArray(s.owned) ||
    s.owned.length !== 100 ||
    s.owned.some((n) => !range(n, 1e8)) ||
    !ids(s.found) ||
    !ids(s.cared) ||
    s.cared.some((i) => !s.owned[i]) ||
    !Array.isArray(s.cleared) ||
    s.cleared.some((i) => !range(i, 6)) ||
    new Set(s.cleared).size !== s.cleared.length ||
    !Array.isArray(s.shelves) ||
    s.shelves.length !== 100 ||
    s.shelves.some((i) => i !== null && (!range(i, 100) || !s.owned[i])) ||
    new Set(s.shelves.filter((i) => i !== null)).size !==
      s.shelves.filter((i) => i !== null).length ||
    !Array.isArray(s.pity) ||
    s.pity.length !== 4 ||
    s.pity.some((i) => !range(i, 10)) ||
    !range(s.map, 6) ||
    !range(s.avatar, 6) ||
    !range(s.wall, 4) ||
    typeof s.sound !== "boolean" ||
    !range(s.jobs, 1e8)
  )
    throw Error("セーブデータを読み込めません");
  return s;
}
export function collect(s, id) {
  if (
    !Number.isInteger(id) ||
    id < 0 ||
    id >= 100 ||
    goals.includes(id) ||
    s.found.includes(id)
  )
    return false;
  s.found.push(id);
  receive(s, id);
  s.coins += 10;
  return true;
}
export function finish(s, m) {
  if (!Number.isInteger(m) || m < 0 || m > 5 || s.cleared.includes(m))
    return false;
  s.cleared.push(m);
  receive(s, goals[m]);
  s.coins += 60;
  return true;
}
export function place(s, slot, id) {
  if (
    !Number.isInteger(slot) ||
    slot < 0 ||
    slot >= 100 ||
    (id !== null &&
      (!Number.isInteger(id) || id < 0 || id >= 100 || !s.owned[id]))
  )
    return false;
  if (id !== null) {
    const old = s.shelves.indexOf(id);
    if (old >= 0) s.shelves[old] = null;
  }
  s.shelves[slot] = id;
  return true;
}
export function care(s, id) {
  if (
    !Number.isInteger(id) ||
    id < 0 ||
    id >= 100 ||
    !s.owned[id] ||
    s.cared.includes(id)
  )
    return 0;
  s.cared.push(id);
  s.coins += 5;
  return 5;
}
export function gacha(s, g, r = Math.random(), pick = Math.random()) {
  if (!Number.isInteger(g) || g < 0 || g > 3 || s.coins < 30) return null;
  const rare = r >= 0.85 || s.pity[g] === 9;
  let pool = gachaPool(g).filter((i) => i % 25 >= 20 === rare);
  const index = Math.min(
    pool.length - 1,
    Math.max(0, Math.floor((Number.isFinite(pick) ? pick : 0) * pool.length)),
  );
  const id = pool[index];
  s.coins -= 30;
  s.pity[g] = rare ? 0 : s.pity[g] + 1;
  const duplicate = s.owned[id] > 0;
  receive(s, id);
  if (duplicate) s.coins += 5;
  return { id, duplicate };
}
export function jobReward(s, n) {
  const amount = Math.min(10, Math.max(0, Math.floor(n))) * 8;
  s.coins += amount;
  s.jobs++;
  return amount;
}
export function level(m) {
  const a = maps[m],
    hard = m === 3 || m === 5;
  const p = [{ x: 0, y: 0, z: 7, w: 30, d: 20, checkpoint: true }];
  for (let i = 0; i < a.steps; i++)
    p.push({
      x: hard ? (i % 2 ? 1.4 : -1.4) : Math.sin(i * 1.1) * 1.2,
      y: 0.6 + i * a.rise,
      z: -7 - i * a.gap,
      w: a.width,
      d: hard ? 3.1 : 4.2,
      checkpoint: (i + 1) % 4 === 0,
    });
  const end = p.at(-1);
  p.push({
    x: 0,
    y: end.y + 0.3,
    z: end.z - 5.5,
    w: 7,
    d: 5,
    finish: true,
    checkpoint: true,
  });
  return p;
}
export function spawn(p, cp = 0) {
  return {
    x: p[cp].x,
    y: p[cp].y,
    z: p[cp].z,
    vx: 0,
    vy: 0,
    vz: 0,
    onGround: true,
    checkpoint: cp,
  };
}
export function step(p, input, dt, platforms) {
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
  const old = p.y;
  p.vy -= 20 * dt;
  p.x += p.vx * dt;
  p.z += p.vz * dt;
  p.y += p.vy * dt;
  p.onGround = false;
  let landed = null;
  for (const q of platforms) {
    if (
      Math.abs(p.x - q.x) < q.w / 2 + 0.18 &&
      Math.abs(p.z - q.z) < q.d / 2 + 0.18 &&
      p.vy <= 0 &&
      old >= q.y - 0.05 &&
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
  if (p.y < -12 || Math.abs(p.x) > 70 || Math.abs(p.z) > 150) {
    Object.assign(p, spawn(platforms, p.checkpoint));
    fell = true;
  }
  return { landed, fell };
}

export function receive(s, id) {
  const first = s.owned[id] === 0;
  s.owned[id]++;
  if (first) {
    const slot = s.shelves.indexOf(null);
    if (slot >= 0) s.shelves[slot] = id;
  }
}
