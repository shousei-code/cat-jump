import { playerFigure, escapeHtml } from "./player-art.js";
import {
  outfits,
  friends,
  events,
  freshSchool,
  rivals,
} from "./school.mjs?v=love1";
let figureIndex = 0;
let tab = "campus",
  active = null,
  result = null,
  reply = null,
  frame = 0,
  generation = 0;
export function stopSchool() {
  cancelAnimationFrame(frame);
  generation++;
}
export function figure(id, extra = "") {
  const item =
      outfits.find((x) => x.id === id) ||
      friends.find((x) => x.id === id) ||
      rivals.find((x) => x.id === id),
    i = item.frame;
  const clip = "outfit-frame-" + figureIndex++;
  const cols = item.sheet ? 3 : 4,
    cw = item.sheet ? 512 : 384,
    ch = 512,
    sheet = item.sheet ?? "wardrobe";
  return `<svg class="wardrobe-figure ${extra}" viewBox="0 0 ${cw} ${ch}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${item.name}" data-costume="${id}"><defs><clipPath id="${clip}"><rect width="${cw}" height="${ch}"/></clipPath></defs><g clip-path="url(#${clip})"><image href="assets/${sheet}.png?v=1" x="${-(i % cols) * cw}" y="${-Math.floor(i / cols) * ch}" width="1536" height="${item.sheet ? 1536 : 1024}"/></g></svg>`;
}
const btn = (text, a, disabled = false) =>
  `<button data-action="school-${a}" ${disabled ? "disabled" : ""}>${text}</button>`;
export function schoolView(state) {
  const w = state.school ?? freshSchool(),
    outfit = outfits.find((x) => x.id === w.equipped);
  return `<div class="chapter-head"><div><span class="eyebrow">MISORA'S SCHOOL DAYS</span><h1>ミソラのわくわく学園生活</h1></div><span class="coin-count">✧ ${w.coins} コイン</span></div><nav class="school-nav" aria-label="学園生活の場所"><button data-action="player">自分の着せ替え</button><button data-action="romance">ミソラとの恋</button>${btn("学園におでかけ", "tab-campus")}${btn("洋服屋さん", "tab-shop")}${btn("友だち", "tab-friends")}<button data-action="play">物語へ戻る</button></nav>${tab === "shop" ? `<div class="shop-layout"><aside class="dressing-mirror">${figure(w.equipped)}<h2>${outfit.name}</h2><p>いま着ている服</p></aside><section><span class="eyebrow">CAPY CLOSET</span><h2>洋服屋さん「カピ・クローゼット」</h2><p>ミソラに似合う服を見つけよう。買った服は何度でも着替えられます。</p><div class="clothes-grid">${outfits.map((o) => `<article>${figure(o.id, "mini")}<span class="tag">${o.tag}</span><h3>${o.name}</h3><p>${o.desc}</p>${btn(w.owned.includes(o.id) ? (w.equipped === o.id ? "着用中" : "この服に着替える") : o.price + " コインで買って着る", "buy-" + o.id, !w.owned.includes(o.id) && w.coins < o.price)}</article>`).join("")}</div><p class="hint">足りないコインは学園のイベントや、友だちへの初めての挨拶で集めよう。現実のお金は使いません。</p></section></div>` : tab === "friends" ? `<p>部活や行事で、少しずつ仲良くなろう。初めての挨拶で20コイン。</p><div class="friend-list">${friends.map((f) => `<article>${figure(f.id)}<h2>${f.name}</h2><p>${f.role}</p><span>♡ 仲良し ${w.relations[f.id]} / 10</span><p>「${f.line}」</p>${btn("一緒に遊ぼうと話す", "greet-" + f.id)}</article>`).join("")}</div><article class="rival-card">${figure("rina")}<div><h2>ライバル・リナ</h2><p>${rivals[0].line}</p><button data-action="romance">恋の物語でリナと話す</button></div></article>${reply ? `<div class="friend-reply" role="status">${reply}</div>` : ""}` : active ? eventView(w, state) : `<section class="school-welcome"><div>${figure(w.equipped)}</div><div><span class="eyebrow">今日も、好きなことから。</span><h2>「今日はどこに行こう？」</h2><p>部活で作品を作ったり、運動会でバトンをつないだり。ミソラと友だちの学園生活を楽しもう！</p><p>現在の服：${outfit.name}</p>${btn("おでかけの服を選ぶ", "tab-shop")}<p class="hint">着せ替えはこの学園生活の立ち絵に反映されます。物語の6枚のイベントイラストは、それぞれの場面の衣装です。</p></div></section><div class="event-grid">${events.map((e) => `<article><span class="eyebrow">${e.place}</span><h2>${e.name}</h2><p>${e.intro}</p><p>${w.completed.includes(e.id) ? "✦ クリア済み" : "◇ 初クリアで80コイン"} ${w.styled.includes(e.id) ? "· おしゃれスター獲得" : ""}</p>${btn("みんなと参加する", "event-" + e.id)}</article>`).join("")}</div><section class="school-awards"><h2>学園の思い出</h2><p>イベント ${w.completed.length}/3 · おしゃれスター ${w.styled.length}/3 · お洋服 ${w.owned.length}/20</p>${w.completed.length === 3 ? "<p>🏅 みんなで楽しんだ学園マスター！ 次は服を合わせておしゃれスターも集めよう。</p>" : ""}</section>`}`;
}
function eventView(w, state) {
  const e = events.find((x) => x.id === active),
    f = friends.find((x) => x.id === e.buddy);
  return `${btn("学園に戻る", "tab-campus")}<section class="school-event ${e.id}"><div class="event-cast with-player">${playerFigure(state)}${figure(w.equipped)}${figure(f.id)}</div><div class="event-dialogue"><span>${f.name}とミソラ</span><h2>${e.name}</h2><p>${result === "win" ? e.reply : e.intro}</p><p class="hint">おすすめ：${outfits.find((x) => x.id === e.outfit).name}。合わせてクリアすると初回おしゃれボーナス20コイン。</p></div></section><section id="school-challenge" class="action-area">${result === "win" ? `<h2>✧ みんなでクリア！</h2><p>初クリアなら80コイン。おすすめの服を着て初めて成功した場合は、おしゃれスターと20コインも自動で受け取れます。受け取り済みの報酬は増えません。</p>${btn("もう一度遊ぶ", "event-" + e.id)}${btn("洋服屋さんに行く", "tab-shop")}` : result === "fail" ? `<h2>大丈夫、もう一度やってみよう！</h2><p>コインも服も減りません。みんなが応援しているよ。</p>${btn("再挑戦する", "event-" + e.id)}` : `<p>準備ができたら始めよう。途中で離れると挑戦の最初から再開します。</p>${btn("イベント開始", "start")}`}</section>`;
}
export function schoolAction(action, { state, act, render }) {
  const a = action.slice(7);
  if (a.startsWith("tab-")) {
    tab = a.slice(4);
    active = null;
    result = null;
    reply = null;
    render();
  } else if (a.startsWith("event-")) {
    active = a.slice(6);
    result = null;
    tab = "campus";
    render();
  } else if (a.startsWith("buy-")) act({ type: "school-buy", id: a.slice(4) });
  else if (a.startsWith("greet-")) {
    const f = friends.find((x) => x.id === a.slice(6));
    if (!f) return;
    reply = f.name + "「" + f.reply + "」";
    act({ type: "school-greet", id: f.id });
  } else if (a === "start" && active) playEvent(state, act, render);
}
function playEvent(state, act, render) {
  stopSchool();
  const token = generation,
    e = events.find((x) => x.id === active),
    box = document.querySelector("#school-challenge"),
    w = state.school ?? freshSchool();
  let elapsed = 0,
    last = performance.now(),
    hits = 0,
    miss = 0,
    cooldown = 0,
    position = 0,
    done = false;
  const marks = ["★", "♥", "◆", "☾"],
    orders = [0, 2, 1, 2, 0, 1],
    food = ["🍪 クッキー", "☕ ココア", "🍓 ケーキ"],
    sequence = [2, 0, 3, 1];
  const finish = (won) => {
    if (done) return;
    done = true;
    stopSchool();
    result = won ? "win" : "fail";
    if (won) act({ type: "school-win", id: e.id });
    else render();
  };
  box.innerHTML = `<h2>${e.id === "sports" ? "バトンをつなごう！" : e.id === "club" ? "光る順番を覚えよう" : "注文を届けよう"}</h2><p id="school-status" role="status"></p>${e.id === "sports" ? `<div class="meter"><div class="zone" style="left:${w.equipped === "sport" ? 30 : 40}%;width:${w.equipped === "sport" ? 40 : 20}%"></div><div id="needle"></div></div><button id="relay-hit">バトンを渡す</button>` : `<div class="tiles">${(e.id === "club" ? marks : food).map((x, i) => `<button data-school-tile="${i}" ${e.id === "club" ? "disabled" : ""}>${x}</button>`).join("")}</div>`}<p class="hint">別のタブを見ている間は時間が止まります。</p>`;
  box.scrollIntoView({ block: "start", behavior: "instant" });
  const status = box.querySelector("#school-status"),
    tiles = [...box.querySelectorAll("[data-school-tile]")];
  box.onclick = (ev) => {
    if (done) return;
    const b = ev.target.closest("[data-school-tile],#relay-hit");
    if (!b) return;
    if (e.id === "club") {
      if (elapsed < 4000) return;
      if (+b.dataset.schoolTile !== sequence[hits]) finish(false);
      else if (++hits === 4) finish(true);
    } else if (e.id === "festival") {
      if (+b.dataset.schoolTile === orders[hits]) {
        if (++hits === 6) finish(true);
      } else if (++miss === 3) finish(false);
    } else if (elapsed >= cooldown) {
      cooldown = elapsed + 650;
      const size = w.equipped === "sport" ? 20 : 10;
      if (Math.abs(position - 50) <= size) {
        if (++hits === 3) finish(true);
      } else if (++miss === 5) finish(false);
    }
  };
  const tick = (now) => {
    if (done || token !== generation) return;
    const dt = now - last;
    last = now;
    if (!document.hidden && dt < 1000) elapsed += dt;
    if (e.id === "club") {
      status.textContent =
        elapsed < 4000 ? "光る順番を見よう" : "同じ順番で押そう " + hits + "/4";
      tiles.forEach((b, i) => {
        b.disabled = elapsed < 4000;
        b.classList.toggle(
          "lit",
          elapsed < 3600 &&
            elapsed % 900 < 650 &&
            sequence[Math.floor(elapsed / 900)] === i,
        );
      });
    } else if (e.id === "festival") {
      status.textContent = `注文：${food[orders[hits]]}　${hits}/6人　残り${Math.max(0, Math.ceil((30000 - elapsed) / 1000))}秒　お手つき ${miss}/3`;
      if (elapsed >= 30000) {
        finish(false);
        return;
      }
    } else {
      position = (Math.sin(elapsed / 650 - Math.PI / 2) + 1) * 50;
      box.querySelector("#needle").style.left = position + "%";
      box.querySelector("#relay-hit").disabled = elapsed < cooldown;
      status.textContent = `成功 ${hits}/3　お手つき ${miss}/5`;
    }
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
}
