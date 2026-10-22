import {
  stageNames,
  stories,
  themes,
  fresh,
  parse,
  complete,
  createRun,
  cast,
  tick,
} from "./core.mjs";
const $ = (id) => document.getElementById(id),
  canvas = $("game"),
  ctx = canvas.getContext("2d"),
  key = "moon-witch-v1";
let save = fresh(),
  blocked = false,
  run = null,
  keys = new Set(),
  touch = new Map(),
  last = performance.now(),
  finished = false,
  toastTimer;
try {
  const raw = localStorage.getItem(key);
  if (raw) save = parse(raw);
} catch {
  blocked = true;
}
const sprites = new Image();
sprites.src = "assets/sprites.png";
const backdrop = new Image();
backdrop.src = "assets/key-art.png";
function persist() {
  if (blocked) return;
  try {
    localStorage.setItem(key, JSON.stringify(save));
  } catch {
    toast("保存できません。このブラウザの空き容量を確認してください。");
  }
}
function toast(s) {
  $("toast").textContent = s;
  $("toast").className = "show";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($("toast").className = ""), 2400);
}
function release() {
  keys.clear();
  touch.clear();
}
function show(html) {
  release();
  $("panel").innerHTML = html;
  if (!$("dialog").open) $("dialog").showModal();
  $("dialog").scrollTop = 0;
}
function title() {
  show(
    `<div class="hero"><div><p class="eyebrow">A LITTLE WITCH, A GREAT ADVENTURE</p><h1>月の魔女と<br>ユニコーンの約束</h1><p>20の土地に、もう一度月の光を。</p></div></div><p>星・電気・氷の魔法とユニコーン変身で冒険しよう。<br>最後に待つ魔王を倒し、月のかけらを取り戻す物語。</p><div class="actions"><button id="begin" class="primary">${save.cleared.length ? "つづきから冒険する" : "冒険をはじめる"}</button><button id="select">20ステージの地図</button></div><p class="help">ひとり用 / 自動保存 / 課金なし${blocked ? " · 保存を読めなかったため元のデータを上書きしません" : ""}</p>`,
  );
  $("begin").onclick = () => intro(Math.min(19, save.unlocked - 1));
  $("select").onclick = map;
}
function map() {
  show(
    `<p class="eyebrow">THE TWENTY MOON FRAGMENTS</p><h2>冒険の地図</h2><p>クリア ${save.cleared.length}/20 · 星 ${save.stars.reduce((a, b) => a + b, 0)}/60</p><div class="map">${stageNames.map((n, i) => `<button data-stage="${i}" ${i >= save.unlocked ? "disabled" : ""}><small>STAGE ${String(i + 1).padStart(2, "0")} ${i % 5 === 4 ? "♛ BOSS" : ""}</small><b>${n}</b><small>${i >= save.unlocked ? "🔒 前の面をクリアしよう" : "★".repeat(save.stars[i]) + "☆".repeat(3 - save.stars[i])}</small></button>`).join("")}</div><div class="actions">${run?.status === "playing" ? '<button id="resume">冒険に戻る</button>' : ""}<button id="title">タイトルへ</button></div>`,
  );
  document
    .querySelectorAll("[data-stage]")
    .forEach((b) => (b.onclick = () => intro(+b.dataset.stage)));
  if ($("resume")) $("resume").onclick = () => $("dialog").close();
  $("title").onclick = title;
}
function intro(i) {
  show(
    `<p class="eyebrow">STAGE ${i + 1} / 20</p><h2>${stageNames[i]}</h2><div class="story"><div class="portrait"></div>${stories[i]}</div><p>目標：敵をすべて倒し、月のかけらを3つ集める。${i >= 6 && i % 3 === 0 ? "虹色のかけらはユニコーンに変身して取ろう！" : ""}</p><p class="help">星は魔力なしで連射できます。電気は複数の敵、氷は足止め、回復はハートを戻します。攻撃の赤い円から逃げてね。</p><div class="actions"><button id="start" class="primary">このステージに出発</button><button id="back">地図へ</button></div>`,
  );
  $("start").onclick = () => {
    run = createRun(i);
    finished = false;
    $("dialog").close();
    release();
  };
  $("back").onclick = map;
}
function result() {
  finished = true;
  if (run.status === "won") {
    complete(save, run.index, run.hp);
    persist();
    if (run.index === 19) {
      show(
        `<div class="ending"><p class="eyebrow">THE MOON SHINES AGAIN</p><h1>月の光が、帰ってきた！</h1><img src="assets/key-art.png" alt="魔女とユニコーンの冒険"><p>魔王の杖から闇が消え、20の土地に星が降りました。<br>ルル「君の勇気が、みんなの明日を守ったんだね。」<br>ユニコーンの祝福は、これからもあなたといっしょ。</p><h2>冒険クリア、おめでとう！</h2><p>全ステージの星3つにも挑戦してみよう。</p><button id="endMap">冒険の地図へ</button></div>`,
      );
      $("endMap").onclick = map;
      return;
    }
    show(
      `<p class="eyebrow">MOON FRAGMENT RESTORED</p><h2>ステージクリア！</h2><h1>${"★".repeat(save.stars[run.index])}</h1><p>${stageNames[run.index]}に光が戻ったよ。</p><p>残りHP ${Math.ceil(run.hp)} / 100 · ${Math.floor(run.time)}秒<br>残りHP75以上で星3つ！</p><div class="actions"><button id="next" class="primary">次のステージへ</button><button id="again">もう一度</button><button id="resultMap">地図へ</button></div>`,
    );
    $("next").onclick = () => intro(run.index + 1);
  } else {
    show(
      `<h2>ちょっとひと休み。</h2><p>ルル「だいじょうぶ。今度は赤い円から逃げよう！」<br>星の魔法は無料。氷で敵を遅くして、回復も使ってみてね。</p><div class="actions"><button id="again" class="primary">もう一度挑戦</button><button id="resultMap">地図へ</button></div>`,
    );
  }
  $("again").onclick = () => intro(run.index);
  $("resultMap").onclick = map;
}
$("menu").onclick = map;
$("dialog").addEventListener("cancel", (e) => {
  e.preventDefault();
  if (run?.status === "playing") $("dialog").close();
});
const spellKeys = {
  KeyJ: "star",
  KeyK: "lightning",
  KeyL: "ice",
  KeyH: "heal",
  KeyU: "unicorn",
};
function magic(s) {
  if (s === "star" && run?.cool > 0) return;
  if (!run || $("dialog").open) return;
  if (!cast(run, s))
    toast(
      s === "unicorn" && run.index < 5
        ? "変身は第6ステージで覚えるよ"
        : "魔力・待ち時間・敵との距離を確認してね",
    );
}
window.addEventListener("keydown", (e) => {
  if ($("dialog").open) return;
  if (
    [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "KeyW",
      "KeyA",
      "KeyS",
      "KeyD",
      ...Object.keys(spellKeys),
    ].includes(e.code)
  ) {
    e.preventDefault();
    keys.add(e.code);
    if (spellKeys[e.code] && !e.repeat) magic(spellKeys[e.code]);
  }
});
window.addEventListener("keyup", (e) => keys.delete(e.code));
window.addEventListener("blur", release);
document.addEventListener("visibilitychange", () => {
  release();
  if (document.hidden && run?.status === "playing") map();
});
document.querySelectorAll("[data-dir]").forEach((b) => {
  b.onpointerdown = (e) => {
    e.preventDefault();
    b.setPointerCapture(e.pointerId);
    touch.set(e.pointerId, b.dataset.dir);
  };
  for (const ev of ["pointerup", "pointercancel", "lostpointercapture"])
    b.addEventListener(ev, (e) => touch.delete(e.pointerId));
});
document
  .querySelectorAll("[data-spell]")
  .forEach((b) => (b.onclick = () => magic(b.dataset.spell)));
const starButton = document.querySelector('[data-spell="star"]');
starButton.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  starButton.setPointerCapture(e.pointerId);
  keys.add("KeyJ");
});
for (const ev of ["pointerup", "pointercancel", "lostpointercapture"])
  starButton.addEventListener(ev, () => keys.delete("KeyJ"));
function circle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
function sprite(i, x, y, size) {
  if (sprites.complete && sprites.naturalWidth) {
    const w = sprites.naturalWidth / 3,
      h = sprites.naturalHeight / 2;
    ctx.drawImage(
      sprites,
      (i % 3) * w,
      Math.floor(i / 3) * h,
      w,
      h,
      x - size / 2,
      y - size * 0.75,
      size,
      size,
    );
  } else {
    circle(x, y, size * 0.25, "#d3a4d8");
    ctx.fillStyle = "#fff";
    ctx.font = "24px serif";
    ctx.fillText(i === 0 ? "✦" : i === 1 ? "♞" : "◆", x - 10, y + 7);
  }
}
function draw() {
  const r = run,
    t = r ? r.index : 0,
    theme = themes[Math.floor(t / 4)];
  ctx.fillStyle = theme[0];
  ctx.fillRect(0, 0, 900, 540);
  const g = ctx.createRadialGradient(450, 250, 30, 450, 250, 570);
  g.addColorStop(0, theme[1]);
  g.addColorStop(1, theme[0]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 900, 540);
  if (backdrop.complete && backdrop.naturalWidth) {
    ctx.globalAlpha = 0.1;
    ctx.drawImage(backdrop, 0, 0, 900, 540);
    ctx.globalAlpha = 1;
  }
  ctx.strokeStyle = theme[2] + "35";
  ctx.lineWidth = 2;
  for (let ring = 0; ring < 3; ring++) {
    ctx.beginPath();
    ctx.arc(450, 270, 75 + ring * 32 + (t % 4) * 10, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.font = "30px serif";
  ctx.textAlign = "center";
  ctx.fillStyle = theme[2] + "88";
  const emblems = [
    "✦",
    "☾",
    "♧",
    "❀",
    "ϟ",
    "♞",
    "虹",
    "♡",
    "◇",
    "❄",
    "本",
    "☆",
    "古",
    "炎",
    "空",
    "影",
    "城",
    "鏡",
    "封",
    "王",
  ];
  ctx.fillText(emblems[t], 450, 280);
  ctx.textAlign = "left";
  ctx.strokeStyle = theme[2] + "25";
  for (let x = 0; x < 900; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 50);
    ctx.lineTo(x, 490);
    ctx.stroke();
  }
  for (let y = 50; y < 500; y += 55) {
    ctx.beginPath();
    ctx.moveTo(30, y);
    ctx.lineTo(870, y);
    ctx.stroke();
  }
  for (let j = 0; j < 13; j++) {
    const x = 35 + j * 70,
      y = j % 2 ? 515 : 28;
    ctx.fillStyle = theme[2] + "77";
    if (t >= 16) {
      ctx.fillRect(x - 16, y - 18, 32, 45);
      ctx.fillStyle = "#e5b67f";
      ctx.fillRect(x - 4, y - 4, 8, 12);
    } else if (t >= 8 && t <= 9) {
      ctx.beginPath();
      ctx.moveTo(x, y - 28);
      ctx.lineTo(x + 18, y + 10);
      ctx.lineTo(x - 18, y + 10);
      ctx.fill();
    } else {
      circle(x, y, 18, theme[2] + "55");
      circle(x + 8, y - 10, 13, theme[2] + "33");
    }
  }
  ctx.strokeStyle = "#e6c28a66";
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 48, 844, 442);
  if (!r) {
    ctx.fillStyle = "#f1dcb8";
    ctx.font = "26px serif";
    ctx.fillText("月のかけらを探す冒険へ", 300, 270);
    return;
  }
  for (const c of r.crystals)
    if (!c.got) {
      circle(c.x, c.y, 27, c.gate ? "#f6bdeb44" : "#dce8ff22");
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = c.gate ? "#f4bbf1" : "#fff0bc";
      ctx.fillRect(-10, -10, 20, 20);
      ctx.restore();
      if (c.gate) {
        ctx.fillStyle = "#fff";
        ctx.font = "20px serif";
        ctx.fillText("🦄", c.x - 13, c.y - 33);
      }
    }
  for (const h of r.hazards) {
    circle(h.x, h.y, h.radius, "#f66b8b33");
    ctx.strokeStyle = "#ff9ba5";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
    ctx.stroke();
    circle(h.x, h.y, h.radius * Math.max(0, 1 - h.wait / 1.45), "#ff8b9e44");
  }
  for (const e of r.enemies)
    if (e.hp > 0) {
      sprite(e.type, e.x, e.y, e.boss ? 115 : 76);
      ctx.fillStyle = "#251c36";
      ctx.fillRect(e.x - 27, e.y + 28, 54, 5);
      ctx.fillStyle = e.slow > 0 ? "#9be7ef" : "#eea4c4";
      ctx.fillRect(e.x - 27, e.y + 28, 54 * Math.max(0, e.hp / e.maxHp), 5);
      if (e.boss) {
        ctx.fillStyle = "#f4d9ac";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          `${r.index === 19 ? "魔王" : "番人"} · 第${e.phase}形態`,
          e.x,
          e.y - 70,
        );
        ctx.textAlign = "left";
      }
    }
  if (r.inv <= 0 || Math.floor(performance.now() / 90) % 2 === 0)
    sprite(r.form > 0 ? 1 : 0, r.x, r.y, 110);
  for (const b of r.bolts) {
    ctx.strokeStyle =
      b.spell === "lightning"
        ? "#ffe49a"
        : b.spell === "ice"
          ? "#b0f3ff"
          : "#f2b8e7";
    ctx.lineWidth = b.spell === "lightning" ? 5 : 3;
    ctx.beginPath();
    ctx.moveTo(b.x, b.y - 15);
    if (b.spell === "lightning") {
      ctx.lineTo((b.x + b.tx) / 2 - 15, (b.y + b.ty) / 2 - 25);
      ctx.lineTo((b.x + b.tx) / 2 + 15, (b.y + b.ty) / 2 + 5);
    }
    ctx.lineTo(b.tx, b.ty);
    ctx.stroke();
  }
  for (const e of r.effects) {
    ctx.globalAlpha = Math.min(1, e.t);
    ctx.strokeStyle = e.color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.radius * (1 - e.t * 0.5), 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  $("stageLabel").textContent = `${r.index + 1}/20 ${stageNames[r.index]}`;
  $("stats").textContent = `♡ ${Math.ceil(r.hp)}　✦ ${Math.floor(r.mp)}`;
  $("objective").textContent =
    `敵 ${r.enemies.filter((e) => e.hp > 0).length}体 · 月のかけら ${r.crystals.filter((c) => c.got).length}/3${r.form > 0 ? " · 🦄 変身中 " + Math.ceil(r.form) + "秒" : ""}`;
  for (const b of document.querySelectorAll("[data-spell]")) {
    const s = b.dataset.spell;
    b.disabled =
      s === "unicorn"
        ? r.index < 5 || r.transformCool > 0
        : s === "heal"
          ? r.mp < 35 || r.healCool > 0 || r.hp >= 100
          : s === "lightning"
            ? r.mp < 22
            : s === "ice"
              ? r.mp < 16
              : false;
    b.querySelector("small").textContent =
      s === "unicorn"
        ? r.index < 5
          ? "第6面から"
          : r.transformCool > 0
            ? `あと${Math.ceil(r.transformCool)}秒`
            : "U · 6秒変身"
        : s === "heal" && r.healCool > 0
          ? `あと${Math.ceil(r.healCool)}秒`
          : {
              star: "J · 魔力0",
              lightning: "K · 魔力22",
              ice: "L · 魔力16",
              heal: "H · 魔力35",
            }[s];
  }
}
let drawAt = 0;
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (document.hidden) return;
  if (run && !$("dialog").open) {
    const has = (dir, ...codes) =>
      [...touch.values()].includes(dir) || codes.some((c) => keys.has(c));
    tick(
      run,
      {
        x:
          Number(has("right", "KeyD", "ArrowRight")) -
          Number(has("left", "KeyA", "ArrowLeft")),
        y:
          Number(has("down", "KeyS", "ArrowDown")) -
          Number(has("up", "KeyW", "ArrowUp")),
      },
      dt,
    );
    if (keys.has("KeyJ")) cast(run, "star");
    if (run.status !== "playing" && !finished) result();
  }
  if (!$("dialog").open || now - drawAt > 150) {
    draw();
    drawAt = now;
  }
}
title();
requestAnimationFrame(frame);
