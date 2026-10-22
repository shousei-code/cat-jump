import {
  groups,
  sheets,
  names,
  goals,
  maps,
  mapLoot,
  fresh,
  parse,
  collect,
  finish,
  place,
  care,
  gacha,
  jobReward,
  rarity,
} from "./core.mjs";
import { createWorld } from "./world.js";
const $ = (id) => document.getElementById(id),
  key = "squishy-world-v1";
let state = fresh(),
  saveBlocked = false,
  world,
  room = 0,
  selected = 0,
  work = null,
  timer,
  toastTimer;
try {
  const raw = localStorage.getItem(key);
  if (raw) state = parse(raw);
} catch {
  saveBlocked = true;
}
function toast(s) {
  $("toast").textContent = s;
  $("toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("show"), 3500);
}
function save() {
  if (!saveBlocked)
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      toast("保存できません。ブラウザの空き容量を確認してください。");
    }
  hud();
}
function hud() {
  $("coins").textContent = `✧ ${state.coins}`;
  $("progress").textContent =
    `コレクション ${state.owned.filter(Boolean).length} / 100 ・クリア ${state.cleared.length} / 6`;
  $("mapName").textContent = maps[state.map].icon + " " + maps[state.map].name;
}
function art(id, extra = "") {
  const f = id % 25;
  return `<span class="toy ${extra}" style="background-image:url(assets/${sheets[Math.floor(id / 25)]}.png);background-position:${(f % 5) * 25}% ${Math.floor(f / 5) * 25}%" role="img" aria-label="${names[id]}"></span>`;
}
function show(html) {
  world?.release();
  $("panel").innerHTML = html;
  if (!$("dialog").open) $("dialog").showModal();
  $("dialog").scrollTop = 0;
}
function close() {
  if (work) endWork();
  $("dialog").close();
  world?.release();
}
$("close").onclick = close;
$("dialog").addEventListener("cancel", (e) => {
  e.preventDefault();
  close();
});
$("home").onclick = () => world?.restart();
document
  .querySelectorAll("[data-panel]")
  .forEach((b) => (b.onclick = () => panels[b.dataset.panel]()));
function title() {
  show(
    `<p class="eyebrow">100 LITTLE TREASURES</p><h1>ぷにぷにワールド</h1><p>冒険で見つけて、おうちに飾って。<br>世界にひとつの、かわいいコレクション。</p><div class="welcomeToys">${art(0)}${art(25)}${art(76)}</div><p>6つの世界・100種類のスクイーズ・5つのお部屋</p><button id="play" disabled>世界を読み込み中…</button><button id="visit">🏠 おうちでぷにぷに</button><p class="hint">自動保存はこのブラウザに保存されます。ひとり用・課金なし。</p>${saveBlocked ? '<p role="alert">以前の保存を読み込めませんでした。元のデータを守るため、この回は保存しません。</p>' : ""}`,
  );
  $("visit").onclick = house;
}
function mapPanel() {
  show(
    `<h2>どこへ冒険に行く？</h2><p>集めたものは自動でおうちへ。ゴールで限定スクイーズと60コイン！</p><div class="mapGrid">${maps.map((m, i) => `<button data-map="${i}"><span>${m.icon} ${m.name}</span>${art(goals[i])}<small>${m.difficulty} · ${state.cleared.includes(i) ? "クリア済み" : "限定 " + names[goals[i]]}</small></button>`).join("")}</div>`,
  );
  document.querySelectorAll("[data-map]").forEach(
    (b) =>
      (b.onclick = () => {
        if (!world) {
          toast("3Dの読み込み中です");
          return;
        }
        state.map = +b.dataset.map;
        world.build(state.map);
        save();
        close();
      }),
  );
}
function house() {
  show(
    `<p class="eyebrow">MY SQUISHY HOME</p><h2>わたしのぷにぷにルーム</h2><p>スクイーズを押すとお世話できます。新しい子は自動で飾られます。</p><div class="tabs">${Array.from({ length: 5 }, (_, i) => `<button data-room="${i}" class="${i === room ? "active" : ""}">お部屋 ${i + 1}</button>`).join("")}</div><div class="house wall${state.wall}"><div class="window">☁️ ☀️ ☁️</div><div class="shelves">${state.shelves
      .slice(room * 20, room * 20 + 20)
      .map(
        (id, i) =>
          `<button data-slot="${room * 20 + i}" aria-label="棚${room * 20 + i + 1}${id === null ? " 空き" : " " + names[id]}">${id === null ? '<span class="empty">＋</span>' : art(id)}</button>`,
      )
      .join(
        "",
      )}</div></div><p>空いている棚を押すと「${names[selected]}」を飾れます。移動する子はずかんから選んでね。</p><button id="choose">📖 飾る子を選ぶ</button><button id="wall">壁の色を変える</button>`,
  );
  document.querySelectorAll("[data-room]").forEach(
    (b) =>
      (b.onclick = () => {
        room = +b.dataset.room;
        house();
      }),
  );
  document.querySelectorAll("[data-slot]").forEach(
    (b) =>
      (b.onclick = () => {
        const slot = +b.dataset.slot,
          id = state.shelves[slot];
        if (id === null) {
          if (place(state, slot, selected)) {
            save();
            house();
          }
        } else detail(id, slot);
      }),
  );
  $("choose").onclick = collection;
  $("wall").onclick = () => {
    state.wall = (state.wall + 1) % 4;
    save();
    house();
  };
}
let audio;
function sound() {
  if (!state.sound) return;
  try {
    audio ??= new AudioContext();
    audio.resume();
    const o = audio.createOscillator(),
      g = audio.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(220, audio.currentTime);
    o.frequency.exponentialRampToValueAtTime(65, audio.currentTime + 0.18);
    g.gain.setValueAtTime(0.12, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.22);
    o.connect(g).connect(audio.destination);
    o.start();
    o.stop(audio.currentTime + 0.23);
  } catch {}
}
function detail(id, slot) {
  show(
    `<h2>${names[id]}</h2><p>${rarity(id)} · 持っている数 ${state.owned[id]}</p><button id="squeeze" aria-label="ぷにぷにする">${art(id)}</button><p id="careText">押して、ぷに〜っ！ はじめてのお世話は5コイン。</p><button id="decorate">この子をおうちに飾る</button>${slot !== undefined ? '<button id="remove">棚からしまう</button>' : ""}<button id="sound">音 ${state.sound ? "ON" : "OFF"}</button><button id="backHouse">おうちへ</button>`,
  );
  $("squeeze").onclick = () => {
    const el = $("squeeze").firstElementChild;
    el.animate(
      [
        { transform: "scale(1,1)" },
        { transform: "scale(1.2,.65)", offset: 0.18 },
        { transform: "scale(.97,1.05)", offset: 0.8 },
        { transform: "scale(1,1)" },
      ],
      { duration: 1100, easing: "ease-out" },
    );
    const n = care(state, id);
    $("careText").textContent = n
      ? "はじめてのお世話！ +5コイン"
      : "ぷに〜っ。ゆっくり元にもどるよ。";
    sound();
    save();
  };
  $("decorate").onclick = () => {
    selected = id;
    house();
  };
  if ($("remove"))
    $("remove").onclick = () => {
      place(state, slot, null);
      save();
      house();
    };
  $("sound").onclick = () => {
    state.sound = !state.sound;
    save();
    $("sound").textContent = "音 " + (state.sound ? "ON" : "OFF");
    sound();
  };
  $("backHouse").onclick = house;
}
function collection(g = 0) {
  show(
    `<h2>スクイーズずかん <small>${state.owned.filter(Boolean).length}/100</small></h2><div class="tabs">${groups.map((s, i) => `<button data-group="${i}" class="${g === i ? "active" : ""}">${s}</button>`).join("")}</div><div class="collection">${names
      .slice(g * 25, g * 25 + 25)
      .map((n, j) => {
        const id = g * 25 + j;
        return `<button data-toy="${id}" ${state.owned[id] ? "" : "disabled"} class="${state.owned[id] ? "" : "locked"}">${art(id)}<b>${n}</b><small>${state.owned[id] ? "所持 " + state.owned[id] + "個" : goals.includes(id) ? maps[goals.indexOf(id)].name + "のゴール" : mapLoot.some((a) => a.includes(id)) ? "探索・ガチャ" : "ガチャ限定"}</small></button>`;
      })
      .join("")}</div>`,
  );
  document
    .querySelectorAll("[data-group]")
    .forEach((b) => (b.onclick = () => collection(+b.dataset.group)));
  document
    .querySelectorAll("[data-toy]")
    .forEach((b) => (b.onclick = () => detail(+b.dataset.toy)));
}
function gachaPanel() {
  show(
    `<h2>かわいいガチャ屋さん</h2><p>1回30コイン。ノーマル85%・レア15%。10回目までに必ずレア！<br>冒険限定の6種類は、マップのゴールで見つけてね。</p><div class="mapGrid">${groups.map((g, i) => `<button data-gacha="${i}" ${state.coins < 30 ? "disabled" : ""}>${art(i * 25 + 1)}<b>${g}ガチャ</b><small>レア確定まで あと${10 - state.pity[i]}回</small></button>`).join("")}</div><div id="result" role="status"></div>`,
  );
  document.querySelectorAll("[data-gacha]").forEach(
    (b) =>
      (b.onclick = () => {
        const r = gacha(state, +b.dataset.gacha);
        if (!r) return;
        save();
        gachaPanel();
        $("result").innerHTML =
          `${art(r.id)}<h3>${names[r.id]}</h3><p>${r.duplicate ? "同じ子が来た！5コインお返し" : "NEW！ おうちに飾ったよ"}</p><button id="see">ぷにぷにする</button>`;
        $("see").onclick = () => detail(r.id);
        $("result").scrollIntoView({ block: "nearest" });
      }),
  );
}
function job() {
  show(
    `<h2>スクイーズのお届けバイト</h2><p>注文と同じ子を選んで箱に入れよう！30秒で最大10箱。1箱8コイン。</p><button id="startJob">お仕事スタート</button>`,
  );
  $("startJob").onclick = () => {
    work = { n: 0, end: Date.now() + 30000 };
    show(
      `<h2>お届け準備！</h2><p id="jobStatus"></p><div id="order"></div><div class="tabs">${[0, 25, 50].map((id, i) => `<button data-pack="${i}" aria-label="${names[id]}">${art(id)}</button>`).join("")}</div><button id="endJob">ここまでで受け取る</button>`,
    );
    const update = () => {
      if (!work) return;
      $("jobStatus").textContent =
        `残り ${Math.max(0, Math.ceil((work.end - Date.now()) / 1000))}秒 · ${work.n}/10箱`;
      $("order").innerHTML = "この子を届けてね " + art([0, 25, 50][work.n % 3]);
    };
    update();
    document.querySelectorAll("[data-pack]").forEach(
      (b) =>
        (b.onclick = () => {
          if (!work) return;
          if (Date.now() >= work.end) {
            endWork();
            return;
          }
          if (+b.dataset.pack !== work.n % 3) {
            toast("注文の子をよく見てね");
            return;
          }
          work.n++;
          if (work.n === 10) endWork();
          else update();
        }),
    );
    $("endJob").onclick = endWork;
    timer = setInterval(() => {
      if (work && Date.now() >= work.end) endWork();
      else if (work)
        $("jobStatus").textContent =
          `残り ${Math.max(0, Math.ceil((work.end - Date.now()) / 1000))}秒 · ${work.n}/10箱`;
    }, 250);
  };
}
function endWork() {
  if (!work) return;
  const n = jobReward(state, work.n);
  work = null;
  clearInterval(timer);
  save();
  show(
    `<h2>お仕事ありがとう！</h2><p>${n}コインもらったよ。</p><button id="againJob">もう一度お仕事</button>`,
  );
  $("againJob").onclick = job;
}
function memory() {
  const seq = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4)),
    ids = [0, 25, 50, 76];
  let pos = 0,
    active = false;
  show(
    `<h2>ぷにぷに順番メモリー</h2><p>左から順番を覚えてね。4つ正解で25コイン！</p><div id="sequence" class="tabs">${seq.map((i) => art(ids[i])).join("")}</div><button id="remember">覚えた！</button><div id="memoryKeys" class="tabs" hidden>${ids.map((id, i) => `<button data-memory="${i}" aria-label="${names[id]}">${art(id)}</button>`).join("")}</div><p id="memoryStatus"></p>`,
  );
  $("remember").onclick = () => {
    active = true;
    $("sequence").hidden = true;
    $("remember").hidden = true;
    $("memoryKeys").hidden = false;
    $("memoryStatus").textContent = "1番目はどの子？";
  };
  document.querySelectorAll("[data-memory]").forEach(
    (b) =>
      (b.onclick = () => {
        if (!active) return;
        if (+b.dataset.memory !== seq[pos]) {
          active = false;
          $("memoryStatus").textContent = "おしい！もう一度やってみよう";
        } else if (++pos === 4) {
          active = false;
          state.coins += 25;
          save();
          $("memoryStatus").textContent = "大正解！ +25コイン";
        } else $("memoryStatus").textContent = `${pos + 1}番目はどの子？`;
        if (!active) {
          $("memoryStatus").insertAdjacentHTML(
            "beforeend",
            '<br><button id="retryMemory">もう一度</button>',
          );
          $("retryMemory").onclick = memory;
        }
      }),
  );
}
function avatar() {
  show(
    `<h2>冒険する自分を選ぼう</h2><div class="mapGrid">${["🎀 ピンクリボン", "🐰 ミントうさぎ", "🧢 そらいろ帽子", "💜 ラベンダーツイン", "⭐ はちみつスター", "🐱 すみれねこ"].map((n, i) => `<button data-avatar="${i}" class="${state.avatar === i ? "active" : ""}">${n}</button>`).join("")}</div>`,
  );
  document.querySelectorAll("[data-avatar]").forEach(
    (b) =>
      (b.onclick = () => {
        state.avatar = +b.dataset.avatar;
        world?.setAvatar(state.avatar);
        save();
        avatar();
      }),
  );
}
const panels = {
  maps: mapPanel,
  house,
  collection: () => collection(),
  gacha: gachaPanel,
  job,
  memory,
  avatar,
};
hud();
title();
createWorld({
  state,
  paused: () => $("dialog").open,
  onFind: (id) => {
    if (!collect(state, id)) return false;
    save();
    toast(`${names[id]}を発見！ +10コイン・おうちに飾ったよ`);
    return true;
  },
  onFinish: (m) => {
    if (finish(state, m)) {
      save();
      toast(`クリア！ ${names[goals[m]]} と60コイン！`);
    }
  },
  onFall: () => toast("チェックポイントから、もう一度！"),
})
  .then((w) => {
    world = w;
    const b = $("play");
    if (b) {
      b.disabled = false;
      b.textContent = "冒険をはじめる";
      b.onclick = close;
    }
  })
  .catch(() => {
    toast("3Dを読み込めませんでした。ページを再読み込みしてください。");
    if ($("play")) $("play").textContent = "3Dを読み込めませんでした";
  });
