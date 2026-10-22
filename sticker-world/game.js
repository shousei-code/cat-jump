import * as THREE from "./vendor/three.module.js";
import {
  names,
  themes,
  avatars,
  colors,
  books,
  rarity,
  fresh,
  parse,
  collect,
  gacha,
  jobReward,
  platforms,
  spawn,
  step,
} from "./core.mjs";
import { Room } from "./network.js";
const $ = (id) => document.getElementById(id),
  key = "sticker-island-v1";
let state = fresh(),
  blocked = false;
try {
  const raw = localStorage.getItem(key);
  if (raw) state = parse(raw);
} catch {
  blocked = true;
}
function save() {
  if (blocked) return;
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    toast("保存できません。ブラウザの保存容量を確認してね。");
  }
}
let toastTimer;
function toast(s) {
  $("toast").textContent = s;
  $("toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("show"), 3500);
}
function hud() {
  $("coins").textContent = `✧ ${state.coins} コイン`;
  $("progress").textContent =
    `シール ${state.owned.filter((n) => n > 0).length} / 24 · コース ${state.cleared.length} / 3`;
}
function sticker(i) {
  return `<span class="sticker" role="img" aria-label="${names[i]}" style="background-position:${(i % 6) * 20}% ${(Math.floor(i / 6) * 100) / 3}%"></span>`;
}
const dialog = $("dialog");
let currentPanel = "",
  selected = null,
  work = null,
  workTimer,
  netStatus = "一人であそんでいます";
function stopWork() {
  clearInterval(workTimer);
  workTimer = null;
  work = null;
}
function close() {
  if (work) {
    finishWork();
    return;
  }
  dialog.close();
  currentPanel = "";
  release();
}
$("close").onclick = close;
dialog.addEventListener("cancel", (e) => {
  e.preventDefault();
  close();
});
function show(name) {
  if (work) finishWork();
  release();
  currentPanel = name;
  dialog.showModal();
  renderPanel();
}
const room = new Room((msg) => {
  netStatus = msg;
  $("roomBadge").hidden = !room.code;
  $("roomBadge").textContent = msg;
  const el = $("netStatus");
  if (el) el.textContent = msg;
}, updateOthers);
function renderPanel() {
  let h = "";
  if (blocked) {
    h =
      '<h1>保存を読み込めませんでした</h1><p>前のデータを守るため、自動保存を止めています。</p><button data-do="recover">元のデータを保存する</button><p>再読み込みしても直らない場合は、データを保管してから遊び直してください。</p><button data-do="reset">データを保管したので遊び直す</button>';
  } else if (currentPanel === "welcome") {
    h = `<div class="welcome"><div><span class="eyebrow">A LITTLE WORLD TO COLLECT</span><h1>シールの島<br>きらめきアスレチック</h1><p>ふわふわの島で、宝物を見つけよう。<br>ジャンプで進んで、お仕事をして、<br>あなただけのシール帳を作ろう。</p><button data-do="play">一人で冒険する</button><button data-panel="online">友だちと遊ぶ</button><p class="note">本物のお金は使いません。シールとコインはこのブラウザに保存されます。</p></div><div class="welcome-art">${[0, 5, 11, 23].map(sticker).join("")}</div></div>`;
  } else if (currentPanel === "avatar") {
    h = `<span class="eyebrow">CHOOSE YOUR FRIEND</span><h1>どの子でおでかけする？</h1><div class="grid">${avatars.map((a, i) => `<button data-avatar="${i}" aria-pressed="${i === state.avatar}"><span class="avatar-swatch" style="color:${colors[i]}">${["🎀", "🐰", "🧢", "🌸", "⭐", "🐱"][i]}</span>${a}</button>`).join("")}</div><p>見た目だけが変わります。みんな同じ速さでジャンプできるよ。</p>`;
  } else if (currentPanel === "book") {
    h = `<span class="eyebrow">MY LITTLE STICKER BOOK</span><h1>わたしのシール帳</h1><div class="row">${books.map((b, i) => `<button data-book="${i}" aria-pressed="${i === state.book}">${b}</button>`).join("")}</div><p>下のコレクションからシールを選んで、好きなマスをタップ。貼ったシールをもう一度押すと外せます。</p><div class="book-page" style="--paper:${["#f4dce8", "#d7eee3", "#dbd8ef", "#f3e6cc"][state.book]}">${state.page.map((id, i) => `<button data-slot="${i}" aria-label="シール帳の${i + 1}番目">${id === null ? "＋" : sticker(id)}</button>`).join("")}</div><h2>コレクション ${state.owned.filter((n) => n > 0).length} / 24</h2><p class="note">同じシールを何度貼っても、持っている数は減りません。</p><div class="grid">${names.map((n, i) => `<button class="tile ${state.owned[i] ? "" : "locked"} ${selected === i ? "selected" : ""}" data-sticker="${i}" ${state.owned[i] ? "" : "disabled"}>${sticker(i)}<b>${state.owned[i] ? n : "？？？"}</b><small>${rarity(i)} · ${state.owned[i]}枚</small></button>`).join("")}</div>`;
  } else if (currentPanel === "gacha") {
    h = `<span class="eyebrow">CAPSULE BOUTIQUE</span><h1>きらめきガチャ通り</h1><p>1回30コイン。お仕事や冒険でもらえるコインだけで遊べます。</p><div class="grid">${themes.map((t, i) => `<article class="machine"><div class="globe">${["🐰", "🍓", "🌙", "🐚"][i]}</div><h2>${t}</h2><p class="note">あと${10 - state.pity[i]}回以内にレア以上</p><button data-gacha="${i}" ${state.coins < 30 ? "disabled" : ""}>30コインでまわす</button></article>`).join("")}</div><p class="note">通常：ノーマル88%・レア10%・伝説2%。10回連続でレア以上が出ない前に確定（レア90%・伝説10%）。同じシールは5コインおまけ。</p><button data-panel="job">コインを集めるお仕事へ</button><div id="gachaResult" aria-live="polite"></div>`;
  } else if (currentPanel === "job") {
    h = `<span class="eyebrow">LITTLE PACKING STUDIO</span><h1>シールのお届け屋さん</h1><p>注文と同じ箱を選んで10個お届け。30秒で何個できるかな？ 間違えてもやり直せます。</p><p>1個につき8コイン。途中でやめても、お届けできた分がもらえます。</p><button data-do="work">お仕事をはじめる</button><div id="workArea"></div>`;
  } else if (currentPanel === "online") {
    h = `<span class="eyebrow">YOUR FRIENDS, YOUR ISLAND</span><h1>友だちと同じ島へ <small>オンライン・試用版</small></h1><p>最大10人。ホストが部屋を開いている間、コードを知っている友だちが入れます。</p><p id="netStatus" role="status"></p><div class="row"><button data-do="host">部屋をつくる</button><button data-do="leave">一人に戻る</button></div><label>6けたの部屋コード <input id="roomCode" inputmode="numeric" maxlength="6" pattern="[0-9]{6}" placeholder="123456"></label><button data-do="join">部屋に入る</button><p class="note">コイン・シール帳は一人ずつのもの。文字チャットはありません。接続にはインターネットが必要です。学校や一部の回線ではつながらない場合があります。</p>`;
  }
  $("panel").innerHTML = h;
  if ($("netStatus")) $("netStatus").textContent = netStatus;
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.panel) {
    show(b.dataset.panel);
    return;
  }
  const a = b.dataset.do;
  if (a === "play") {
    dialog.close();
    currentPanel = "";
  }
  if (a === "host") room.start();
  if (a === "leave") room.leave();
  if (a === "join") {
    const code = $("roomCode").value.trim();
    if (/^\d{6}$/.test(code)) room.start(code);
    else toast("6けたの数字を入れてね。");
  }
  if (a === "work") startWork();
  if (a === "recover") {
    const url = URL.createObjectURL(
      new Blob([localStorage.getItem(key) || ""], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "sticker-save-backup.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  if (a === "reset" && confirm("シール帳とコインを最初からにしますか？")) {
    blocked = false;
    state = fresh();
    save();
    hud();
    show("welcome");
  }
  if (b.dataset.avatar !== undefined) {
    state.avatar = +b.dataset.avatar;
    setAvatar(playerMesh, state.avatar);
    save();
    renderPanel();
  }
  if (b.dataset.book !== undefined) {
    state.book = +b.dataset.book;
    save();
    renderPanel();
  }
  if (b.dataset.sticker !== undefined) {
    selected = +b.dataset.sticker;
    renderPanel();
  }
  if (b.dataset.slot !== undefined) {
    const ix = +b.dataset.slot;
    state.page[ix] = state.page[ix] !== null ? null : selected;
    save();
    renderPanel();
  }
  if (b.dataset.gacha !== undefined) {
    const result = gacha(state, +b.dataset.gacha);
    if (result) {
      save();
      hud();
      renderPanel();
      $("gachaResult").innerHTML =
        `<div class="result">${sticker(result.id)}<h2>${names[result.id]}</h2><p>${rarity(result.id)}！ ${result.duplicate ? "もう1枚！ 5コインおまけ" : "NEW ✧ シール帳に仲間入り"}</p><button data-panel="book">シール帳へ</button></div>`;
    }
  }
  if (b.dataset.pack !== undefined && work) {
    if (+b.dataset.pack === work.order) {
      work.correct++;
      work.order = (work.order + 1 + (work.correct % 2)) % 3;
      if (work.correct === 10) {
        finishWork();
        return;
      }
    } else toast("注文のマークをよく見てね！");
    paintWork();
  }
});
function startWork() {
  stopWork();
  work = { correct: 0, order: 0, end: performance.now() + 30000 };
  paintWork();
  workTimer = setInterval(() => {
    if (!work) return;
    if (performance.now() >= work.end) finishWork();
    else paintClock();
  }, 100);
}
function paintClock() {
  const el = $("workClock");
  if (el && work) {
    const text = `あと ${Math.max(0, Math.ceil((work.end - performance.now()) / 1000))} 秒 · ${work.correct} / 10 個`;
    if (el.textContent !== text) el.textContent = text;
  }
}
function paintWork() {
  if (!$("workArea") || !work) return;
  $("workArea").innerHTML =
    `<p id="workClock"></p><div class="work-order">注文：${["🐰", "🍓", "⭐"][work.order]}</div><div class="row">${["🐰", "🍓", "⭐"].map((v, i) => `<button data-pack="${i}" aria-label="${["うさぎ", "いちご", "星"][i]}の箱">${v} の箱</button>`).join("")}</div>`;
  paintClock();
}
function finishWork() {
  if (!work) return;
  const reward = jobReward(state, work.correct),
    count = work.correct;
  stopWork();
  save();
  hud();
  if (currentPanel === "job") {
    $("workArea").innerHTML =
      `<h2>${count}個お届け！ ＋${reward}コイン</h2><button data-do="work">もう一度お仕事</button>`;
  }
  toast(`おつかれさま！ ${reward}コインをもらったよ。`);
}
// Three-dimensional world: solid landing platforms, fixed camera and fair retries.
let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    canvas: $("world"),
    antialias: true,
    alpha: false,
  });
} catch {
  $("world").insertAdjacentHTML(
    "afterend",
    '<div id="error">3D画面を開けませんでした。WebGL対応のブラウザで開いてください。</div>',
  );
  throw Error("WebGL unavailable");
}
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
const scene = new THREE.Scene();
scene.background = new THREE.Color("#e8e6fa");
scene.fog = new THREE.Fog("#e8e6fa", 45, 100);
const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 160);
scene.add(new THREE.HemisphereLight(0xffffff, 0xb7a3ce, 2.5));
const sun = new THREE.DirectionalLight(0xfff4d8, 2);
sun.position.set(10, 25, 10);
scene.add(sun);
const mat = (color) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.75 });
function box(w, h, d, color, x = 0, y = 0, z = 0, parent = scene) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}
function sphere(r, color, x, y, z, parent = scene) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 8), mat(color));
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}
for (const p of platforms) {
  box(
    p.w,
    0.8,
    p.d,
    p.course < 0 ? "#f1d8e6" : colors[p.course],
    p.x,
    p.y - 0.4,
    p.z,
  );
  box(p.w + 0.1, 0.12, p.d + 0.1, "#fff8f1", p.x, p.y - 0.01, p.z);
  if (p.checkpoint && p.course >= 0) {
    box(0.12, 2, 0.12, "#b5a4c7", p.x + 1.6, p.y + 1, p.z);
    box(
      0.9,
      0.6,
      0.05,
      p.finish ? "#f4c960" : "#a1d5bc",
      p.x + 2,
      p.y + 1.7,
      p.z,
    );
  }
}
function sign(text, x, y, z) {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 128;
  const c = canvas.getContext("2d");
  c.fillStyle = "#fffaf5";
  c.fillRect(0, 0, 768, 128);
  c.strokeStyle = "#dfbddc";
  c.lineWidth = 8;
  c.strokeRect(4, 4, 760, 120);
  c.fillStyle = "#705b79";
  c.font = "bold 45px sans-serif";
  c.textAlign = "center";
  c.fillText(text, 384, 82);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
  sprite.position.set(x, y, z);
  sprite.scale.set(7, 1.17, 1);
  scene.add(sprite);
}
["どうぶつの小道", "おかしの雲", "ほしぞらジャンプ"].forEach((v, i) =>
  sign(v, (i - 1) * 16, 2.6, -3),
);
for (let i = 0; i < 9; i++) box(2, 0.04, 1, "#e5c5dd", 0, 0.08, 15 - i * 2);
// Decorative trees and gacha machines in the safe plaza.
for (const x of [-24, -20, 20, 24])
  for (const z of [0, 14]) {
    box(0.35, 2, 0.35, "#ccb39c", x, 1, z);
    sphere(1.8, x < 0 ? "#c9c0ed" : "#a7d8c7", x, 3, z);
  }
for (let i = 0; i < 4; i++) {
  const x = -9 + i * 6;
  box(2.3, 2.4, 1.6, colors[i], x, 1.2, 12);
  sphere(1.2, "#fff5f5", x, 3, 12);
  sphere(0.4, colors[(i + 2) % 6], x, 3, 12.9);
  box(0.8, 0.25, 0.25, "#b68aaa", x, 1.1, 12.9);
}
function makeAvatar(index) {
  const group = new THREE.Group();
  const body = box(0.85, 0.95, 0.55, colors[index], 0, 1.15, 0, group);
  body.name = "shirt";
  box(0.75, 0.35, 0.58, "#586180", 0, 0.58, 0, group);
  box(0.27, 0.55, 0.3, "#fff6f2", -0.22, 0.3, 0, group);
  box(0.27, 0.55, 0.3, "#fff6f2", 0.22, 0.3, 0, group);
  sphere(0.48, "#ffe2d4", 0, 1.95, 0, group);
  const hair = sphere(0.5, colors[index], 0, 2.1, -0.07, group);
  hair.scale.y = 0.65;
  hair.name = "hair";
  for (const x of [-0.18, 0.18]) sphere(0.055, "#604e78", x, 1.96, 0.43, group);
  box(0.25, 0.7, 0.3, "#ffe2d4", -0.58, 1.12, 0, group);
  box(0.25, 0.7, 0.3, "#ffe2d4", 0.58, 1.12, 0, group);
  scene.add(group);
  setAvatar(group, index);
  return group;
}
function setAvatar(group, i) {
  for (const name of ["shirt", "hair"])
    group.getObjectByName(name).material.color.set(colors[i]);
  group.userData.avatar = i;
  const old = group.getObjectByName("detail");
  if (old) {
    group.remove(old);
    old.traverse((o) => {
      o.geometry?.dispose();
      o.material?.dispose();
    });
  }
  const detail = new THREE.Group();
  detail.name = "detail";
  group.add(detail);
  if (i === 0) {
    sphere(0.17, "#f184bb", -0.16, 2.45, 0.13, detail);
    sphere(0.17, "#f184bb", 0.16, 2.45, 0.13, detail);
  }
  if (i === 1) {
    box(0.17, 0.65, 0.2, "#fff5ef", -0.23, 2.65, 0, detail);
    box(0.17, 0.65, 0.2, "#fff5ef", 0.23, 2.65, 0, detail);
  }
  if (i === 2) box(1, 0.15, 0.7, "#7094d1", 0, 2.4, 0.1, detail);
  if (i === 3) {
    sphere(0.24, colors[i], -0.47, 2, 0, detail);
    sphere(0.24, colors[i], 0.47, 2, 0, detail);
  }
  if (i === 4) sphere(0.18, "#ffe18c", 0.35, 2.3, 0.2, detail);
  if (i === 5)
    for (const x of [-0.28, 0.28]) {
      const ear = new THREE.Mesh(
        new THREE.ConeGeometry(0.23, 0.4, 4),
        mat("#a9a6df"),
      );
      ear.position.set(x, 2.5, 0);
      detail.add(ear);
    }
}
const playerMesh = makeAvatar(state.avatar),
  player = spawn();
const otherMeshes = new Map();
function updateOthers(others) {
  for (const [id, mesh] of otherMeshes)
    if (!others[id]) {
      scene.remove(mesh);
      mesh.traverse((o) => {
        o.geometry?.dispose();
        o.material?.dispose();
      });
      otherMeshes.delete(id);
    }
  for (const [id, p] of Object.entries(others)) {
    let mesh = otherMeshes.get(id);
    if (!mesh) {
      mesh = makeAvatar(p.avatar);
      otherMeshes.set(id, mesh);
    }
    if (mesh.userData.avatar !== p.avatar) setAvatar(mesh, p.avatar);
    mesh.userData.target = p;
  }
}
const pickups = [];
for (let i = 0; i < 3; i++) {
  const coursePlatforms = platforms.filter((p) => p.course === i && !p.finish);
  for (let j = 0; j < 4; j++) {
    const q = coursePlatforms[j + 1];
    pickups.push({ id: i * 6 + j, x: q.x, y: q.y + 1.1, z: q.z });
  }
  const end = platforms.find((p) => p.course === i && p.finish);
  pickups.push({ id: i * 6 + 5, x: end.x, y: end.y + 1.1, z: end.z });
}
for (let i = 0; i < 4; i++)
  pickups.push({ id: 18 + i, x: -18 + i * 12, y: 1.1, z: 9 });
for (const p of pickups) {
  p.mesh = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.48),
    mat(rarity(p.id) === "伝説" ? "#ffd768" : "#e5a2d6"),
  );
  p.mesh.position.set(p.x, p.y, p.z);
  scene.add(p.mesh);
  p.mesh.visible = !state.found.includes(p.id);
}
new THREE.TextureLoader().load("stickers.png", (texture) => {
  texture.colorSpace = THREE.SRGBColorSpace;
  for (const p of pickups) {
    const map = texture.clone();
    map.repeat.set(1 / 6, 1 / 4);
    map.offset.set((p.id % 6) / 6, 1 - (Math.floor(p.id / 6) + 1) / 4);
    const card = new THREE.Sprite(new THREE.SpriteMaterial({ map }));
    card.position.copy(p.mesh.position);
    card.scale.set(1.35, 1.35, 1);
    card.visible = p.mesh.visible;
    scene.remove(p.mesh);
    p.mesh.geometry.dispose();
    p.mesh.material.dispose();
    p.mesh = card;
    scene.add(card);
  }
});
const keys = new Set(),
  held = new Map();
let jumpWanted = false;
function release() {
  keys.clear();
  held.clear();
  jumpWanted = false;
}
window.addEventListener("keydown", (e) => {
  if (dialog.open) return;
  if (
    [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Space",
      "KeyW",
      "KeyA",
      "KeyS",
      "KeyD",
    ].includes(e.code)
  ) {
    e.preventDefault();
    keys.add(e.code);
    if (e.code === "Space" && !e.repeat) jumpWanted = true;
  }
});
window.addEventListener("keyup", (e) => keys.delete(e.code));
window.addEventListener("blur", release);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) release();
});
document.querySelectorAll("[data-move]").forEach((b) => {
  b.onpointerdown = (e) => {
    e.preventDefault();
    b.setPointerCapture(e.pointerId);
    held.set(e.pointerId, b.dataset.move);
  };
  for (const ev of ["pointerup", "pointercancel", "lostpointercapture"])
    b.addEventListener(ev, (e) => held.delete(e.pointerId));
});
$("jump").onpointerdown = (e) => {
  e.preventDefault();
  jumpWanted = true;
};
$("home").onclick = () => {
  Object.assign(player, spawn());
  release();
  toast("広場に戻ったよ。別のコースにも挑戦してね！");
};
function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);
resize();
let last = performance.now(),
  netTime = 0,
  lastRender = 0;
function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min(0.04, (now - last) / 1000);
  last = now;
  if (document.hidden || (dialog.open && now - lastRender < 100)) return;
  lastRender = now;
  if (!dialog.open && !document.hidden && !blocked) {
    const has = (dir, ...codes) =>
      [...held.values()].includes(dir) || codes.some((c) => keys.has(c));
    const result = step(
      player,
      {
        x:
          Number(has("right", "ArrowRight", "KeyD")) -
          Number(has("left", "ArrowLeft", "KeyA")),
        z:
          Number(has("down", "ArrowDown", "KeyS")) -
          Number(has("up", "ArrowUp", "KeyW")),
        jump: jumpWanted,
      },
      dt,
    );
    jumpWanted = false;
    if (result.fell) toast("大丈夫！ チェックポイントからもう一度。");
    if (
      result.landed?.finish &&
      !state.cleared.includes(result.landed.course)
    ) {
      state.cleared.push(result.landed.course);
      state.coins += 50;
      save();
      hud();
      toast("コースクリア！ ＋50コイン ✧");
    }
    for (const p of pickups)
      if (
        p.mesh.visible &&
        Math.hypot(player.x - p.x, player.z - p.z) < 1.3 &&
        Math.abs(player.y + 0.9 - p.y) < 1.4
      ) {
        if (collect(state, p.id)) {
          p.mesh.visible = false;
          save();
          hud();
          toast(`${rarity(p.id)}シール「${names[p.id]}」を発見！ ＋10コイン`);
        }
      }
  }
  playerMesh.position.set(player.x, player.y, player.z);
  if (Math.hypot(player.vx, player.vz) > 0.1 && !dialog.open)
    playerMesh.rotation.y = Math.atan2(player.vx, player.vz);
  for (const mesh of otherMeshes.values()) {
    const p = mesh.userData.target;
    if (p)
      mesh.position.lerp(
        new THREE.Vector3(p.x, p.y, p.z),
        Math.min(1, dt * 12),
      );
  }
  for (const p of pickups) {
    if (!p.mesh.isSprite) p.mesh.rotation.y += dt;
    p.mesh.position.y = p.y + Math.sin(now * 0.002 + p.id) * 0.12;
  }
  camera.position.lerp(
    new THREE.Vector3(player.x, player.y + 12, player.z + 17),
    Math.min(1, dt * 7),
  );
  camera.lookAt(player.x, player.y + 0.8, player.z - 3);
  if (now - netTime > 100) {
    room.update({ ...player, avatar: state.avatar });
    netTime = now;
  }
  renderer.render(scene, camera);
}
camera.position.set(0, 12, 24);
hud();
show("welcome");
requestAnimationFrame(animate);
