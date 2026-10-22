export const stageNames = [
  "はじまりの魔法学園",
  "月あかりの庭",
  "光るきのこの森",
  "妖精の小川",
  "雷の時計塔",
  "ユニコーンの草原",
  "虹のかけ橋",
  "お菓子の丘",
  "水晶の洞窟",
  "氷の女王の湖",
  "雲の上の図書館",
  "星砂の砂漠",
  "眠る遺跡",
  "竜の火山",
  "天空の神殿",
  "影の森",
  "魔王城への道",
  "魔王城・鏡の回廊",
  "魔王城・星の封印",
  "魔王の玉座",
];
export const stories = [
  "黒猫ルル「月のかけらが20の土地に散らばったよ。魔法で取り戻そう！」",
  "庭の花が眠っている。かけらを集めて朝を呼ぼう。",
  "きのこの灯りが道しるべ。影のしずくを追いはらおう。",
  "妖精たちの川を守って。赤い円からはなれると攻撃をよけられるよ。",
  "雷の番人が待っている！電気魔法で盾をくずそう。",
  "月の祝福でユニコーンに変身できるようになった！",
  "虹の門はユニコーンの姿だけが通れるよ。",
  "甘い香りに誘われた影たち。お菓子の国を守ろう。",
  "水晶が魔力を映している。氷魔法で敵をゆっくりに。",
  "凍った湖で番人との対決。雷が弱点だよ。",
  "空の本たちが失われた呪文を教えてくれる。",
  "星砂の風を切って走ろう。遠いかけらへ変身ダッシュ！",
  "遺跡の壁に、魔王が月を閉じ込めた理由が書かれている。",
  "火山の熱から逃げるには、止まらず動くこと。",
  "天空の番人が最後の試練を与えてくる。",
  "ルル「こわくても、ひとりじゃないよ。」",
  "魔王城が見えてきた。集めた月のかけらが輝く。",
  "鏡の騎士は雷が苦手。魔力を残しながら進もう。",
  "20個目の封印は玉座にある。虹の門を抜けよう。",
  "魔王「月の光は渡さぬ！」予告の円をよけて、3段階の決戦に挑もう！",
];
export const themes = [
  ["#282a50", "#536783", "#e9c8ed"],
  ["#233f47", "#4b7b68", "#b4e8ca"],
  ["#38365c", "#74678c", "#d7b9f3"],
  ["#264b65", "#4c8b9a", "#b3e9ed"],
  ["#3b294c", "#715066", "#f3c89e"],
];
export const fresh = () => ({
  version: 1,
  unlocked: 1,
  cleared: [],
  stars: Array(20).fill(0),
  sound: false,
});
export function parse(raw) {
  const s = JSON.parse(raw);
  if (
    !s ||
    s.version !== 1 ||
    !Number.isInteger(s.unlocked) ||
    s.unlocked < 1 ||
    s.unlocked > 20 ||
    !Array.isArray(s.cleared) ||
    s.cleared.some((i) => !Number.isInteger(i) || i < 0 || i > 19) ||
    new Set(s.cleared).size !== s.cleared.length ||
    !Array.isArray(s.stars) ||
    s.stars.length !== 20 ||
    s.stars.some((n) => !Number.isInteger(n) || n < 0 || n > 3) ||
    typeof s.sound !== "boolean"
  )
    throw Error("Invalid save");
  return s;
}
export function complete(s, index, hp) {
  if (!Number.isInteger(index) || index < 0 || index >= s.unlocked)
    return false;
  if (!s.cleared.includes(index)) s.cleared.push(index);
  s.unlocked = Math.max(s.unlocked, Math.min(20, index + 2));
  s.stars[index] = Math.max(s.stars[index], hp >= 75 ? 3 : hp >= 35 ? 2 : 1);
  return true;
}
export function createRun(index) {
  const boss = index % 5 === 4;
  const count = boss ? 3 : 3 + Math.floor(index / 4);
  return {
    index,
    time: 0,
    hp: 100,
    mp: 100,
    x: 100,
    y: 270,
    cool: 0,
    inv: 0,
    form: 0,
    transformCool: 0,
    healCool: 0,
    status: "playing",
    kills: 0,
    bolts: [],
    hazards: [],
    effects: [],
    crystals: [
      { x: 190, y: 95, got: false },
      { x: 620, y: 445, got: false },
      { x: 790, y: 180, got: false, gate: index >= 6 && index % 3 === 0 },
    ],
    enemies: Array.from({ length: count }, (_, i) => ({
      x: 460 + (i % 3) * 130,
      y: 100 + Math.floor(i / 3) * 150 + (i % 2) * 100,
      hp:
        boss && i === 0
          ? index === 19
            ? 520
            : 180 + index * 8
          : 45 + index * 3,
      maxHp:
        boss && i === 0
          ? index === 19
            ? 520
            : 180 + index * 8
          : 45 + index * 3,
      type:
        boss && i === 0
          ? 5
          : index >= 12 && i % 2 === 0
            ? 4
            : i % 2 === 0
              ? 2
              : 3,
      boss: boss && i === 0,
      slow: 0,
      attack: 1 + i * 0.45,
      phase: 1,
    })),
    message: "",
  };
}
export function cast(r, spell) {
  if (r.status !== "playing") return false;
  if (spell === "heal") {
    if (r.mp < 35 || r.healCool > 0 || r.hp >= 100) return false;
    r.mp -= 35;
    r.hp = Math.min(100, r.hp + 35);
    r.healCool = 8;
    r.effects.push({ x: r.x, y: r.y, t: 0.7, color: "#95efb7", radius: 65 });
    return true;
  }
  if (spell === "unicorn") {
    if (r.index < 5 || r.transformCool > 0) return false;
    r.form = 6;
    r.transformCool = 14;
    r.effects.push({ x: r.x, y: r.y, t: 1, color: "#f5caec", radius: 80 });
    return true;
  }
  if (r.cool > 0) return false;
  const enemies = r.enemies
    .filter((e) => e.hp > 0)
    .sort(
      (a, b) =>
        Math.hypot(a.x - r.x, a.y - r.y) - Math.hypot(b.x - r.x, b.y - r.y),
    );
  if (!enemies.length) return false;
  const cost = spell === "lightning" ? 22 : spell === "ice" ? 16 : 0;
  if (r.mp < cost) return false;
  r.mp -= cost;
  r.cool = spell === "star" ? 0.32 : 0.8;
  const targets =
    spell === "lightning" ? enemies.slice(0, 3) : enemies.slice(0, 1);
  for (const e of targets) {
    const range = spell === "lightning" ? 500 : spell === "ice" ? 400 : 330;
    if (Math.hypot(e.x - r.x, e.y - r.y) > range) continue;
    const damage =
      spell === "lightning"
        ? e.type === 4 || e.boss
          ? 70
          : 48
        : spell === "ice"
          ? 18
          : 14;
    e.hp -= damage;
    if (spell === "ice") e.slow = 3;
    r.bolts.push({ x: r.x, y: r.y, tx: e.x, ty: e.y, t: 0.22, spell });
    if (e.hp <= 0) {
      r.kills++;
      r.mp = Math.min(100, r.mp + 10);
      r.effects.push({ x: e.x, y: e.y, t: 0.7, color: "#ffe8af", radius: 40 });
    }
  }
  return true;
}
export function tick(r, input, dt) {
  if (r.status !== "playing") return;
  r.time += dt;
  dt = Math.min(0.05, Math.max(0, dt));
  for (const k of ["cool", "inv", "form", "transformCool", "healCool"])
    r[k] = Math.max(0, r[k] - dt);
  r.mp = Math.min(100, r.mp + dt * 8);
  let x = input.x || 0,
    y = input.y || 0,
    n = Math.hypot(x, y);
  if (n > 1) {
    x /= n;
    y /= n;
  }
  const speed = r.form > 0 ? 250 : 160;
  r.x = Math.max(35, Math.min(865, r.x + x * speed * dt));
  r.y = Math.max(55, Math.min(485, r.y + y * speed * dt));
  for (const c of r.crystals)
    if (
      !c.got &&
      Math.hypot(c.x - r.x, c.y - r.y) < 38 &&
      (!c.gate || r.form > 0)
    ) {
      c.got = true;
      r.mp = Math.min(100, r.mp + 18);
      r.effects.push({ x: c.x, y: c.y, t: 0.8, color: "#e8c5ff", radius: 35 });
    }
  for (const e of r.enemies) {
    if (e.hp <= 0) continue;
    e.slow = Math.max(0, e.slow - dt);
    e.phase = e.boss
      ? e.hp / e.maxHp < 0.33
        ? 3
        : e.hp / e.maxHp < 0.66
          ? 2
          : 1
      : 1;
    const dx = r.x - e.x,
      dy = r.y - e.y,
      d = Math.hypot(dx, dy);
    const speed = (e.boss ? 20 : 25 + r.index) * (e.slow > 0 ? 0.35 : 1);
    if (d > 130) {
      e.x += (dx / d) * speed * dt;
      e.y += (dy / d) * speed * dt;
    }
    e.attack -= dt;
    if (e.attack <= 0) {
      e.attack = (e.boss ? 2.5 - e.phase * 0.25 : 3.5) - r.index * 0.025;
      r.hazards.push({
        x: r.x,
        y: r.y,
        radius: e.boss ? 62 + e.phase * 9 : 42,
        wait: e.boss ? 1.1 : 0.95,
        damage: e.boss ? 18 : 10,
      });
      if (e.boss && e.phase >= 2)
        r.hazards.push({
          x: Math.max(50, Math.min(850, r.x + x * 90)),
          y: Math.max(60, Math.min(480, r.y + y * 90)),
          radius: 55,
          wait: 1.45,
          damage: 15,
        });
    }
  }
  for (const h of r.hazards) {
    h.wait -= dt;
    if (h.wait <= 0 && !h.done) {
      h.done = true;
      r.effects.push({
        x: h.x,
        y: h.y,
        t: 0.3,
        color: "#f490ab",
        radius: h.radius,
      });
      if (r.inv <= 0 && Math.hypot(r.x - h.x, r.y - h.y) < h.radius) {
        r.hp = Math.max(0, r.hp - h.damage * (r.form > 0 ? 0.5 : 1));
        r.inv = 0.8;
      }
    }
  }
  r.hazards = r.hazards.filter((h) => !h.done);
  for (const a of [r.bolts, r.effects]) for (const e of a) e.t -= dt;
  r.bolts = r.bolts.filter((e) => e.t > 0);
  r.effects = r.effects.filter((e) => e.t > 0);
  if (r.hp <= 0) r.status = "lost";
  else if (r.enemies.every((e) => e.hp <= 0) && r.crystals.every((c) => c.got))
    r.status = "won";
}
