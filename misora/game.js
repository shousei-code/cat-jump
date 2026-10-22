import {
  creatorView,
  romanceView,
  playerAction,
  resetPlayerReply,
} from "./player-ui.js?v=love1";
import { schoolView, schoolAction, stopSchool } from "./school-ui.js?v=love1";
import { chapters, fresh, reduce, parse, ending } from "./story.mjs?v=love1";
const key = "misora-school-v1",
  app = document.querySelector("#app");
let state = fresh(),
  screen = "title",
  blocked = false,
  saved = false,
  raf = 0,
  timer = 0,
  session = 0,
  audio,
  notice = "";
try {
  const raw = localStorage.getItem(key);
  if (raw) {
    state = parse(raw);
    saved = true;
  }
} catch {
  blocked = true;
  notice = "保存データを読み込めません。設定から元のデータを保存できます。";
}
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function save() {
  if (blocked) return;
  try {
    localStorage.setItem(key, JSON.stringify(state));
    saved = true;
    notice = "このブラウザに自動保存しました";
  } catch {
    notice = "保存できません。設定からセーブを書き出してください。";
  }
}
function act(a) {
  state = reduce(state, a);
  save();
  render();
}
function stop() {
  stopSchool();
  session++;
  cancelAnimationFrame(raf);
  clearTimeout(timer);
}
function sound() {
  if (!state.sound) return;
  try {
    audio ??= new AudioContext();
    audio.resume();
    const o = audio.createOscillator(),
      g = audio.createGain();
    o.type = "sine";
    o.frequency.value = 660;
    o.connect(g);
    g.connect(audio.destination);
    g.gain.setValueAtTime(0.05, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.18);
    o.start();
    o.stop(audio.currentTime + 0.2);
  } catch {}
}
function button(text, action, cls = "") {
  return `<button class="${cls}" data-action="${action}">${text}</button>`;
}
function scene(i, extra = "") {
  return `<svg class="scene ${extra}" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${chapters[i].place}のミソラ"><image href="assets/scenes.png?v=ofuda1" x="${-(i % 3) * 512}" y="${-Math.floor(i / 3) * 512}" width="1536" height="1024"/></svg>`;
}
function render() {
  stop();
  const c = chapters[state.chapter];
  app.innerHTML = `<header><a href="../">← ゲームひろば</a><button data-action="title" class="brand">Misora <span>AFTER SCHOOL</span></button><button data-action="settings" aria-label="設定">⚙ 設定</button></header><main>${screen === "title" ? `<section class="cover">${scene(0)}<div class="cover-copy"><span class="eyebrow">君となら、放課後はもっと輝く。</span><h1>ミソラと放課後<span>♡ きらめきスクール</span></h1><p>勉強も、ゲームも、文化祭も。<br>小さな「好き」から始まる、ふたりの学園生活。</p><div class="title-actions">${button(saved ? "物語のつづきから" : "ミソラに会いにいく", "play", "primary")}${button("自分をつくる・恋の物語", "player")}${button("学園生活・着せ替え", "school")}${button("思い出アルバム", "album")}</div><small>全6章＋エンディング · ひとりで遊ぶ友情アドベンチャー</small></div></section><div class="features"><span>✿ 選んで育つ友情</span><span>✧ 4つのチャレンジ</span><span>♡ 3つの結末</span></div>` : screen === "player" ? creatorView(state) : screen === "romance" ? romanceView(state) : screen === "school" ? schoolView(state) : screen === "settings" ? settings() : screen === "album" ? album() : `<div class="chapter-head"><div><span class="eyebrow">${c.season}</span><h1>${state.phase === "ending" ? "ふたりの、これから" : c.title}</h1></div><span class="chapter-count">${state.chapter + 1} / 6</span></div><div class="progress">${chapters.map((_, i) => `<i class="${i <= state.chapter ? "on" : ""}"></i>`).join("")}</div><div class="stats"><span>♡ 友情 ${state.friend}</span><span>✧ 勇気 ${state.brave}</span><span>✎ ひらめき ${state.study}</span>${button("自分をつくる・恋の物語", "player")}${button("学園生活・着せ替え", "school")}${button("アルバム", "album")}</div><section class="story-scene">${scene(c.art)}<span class="location">${c.place}</span><div class="dialogue"><span class="speaker">ミソラ</span><p>${state.phase === "talk" ? c.text : state.phase === "reply" ? c.choices[state.chosen][1] : state.phase === "clear" ? "「やったね！ きみと一緒だから、こんなに楽しいんだ。ありがとう！」" : state.phase === "ending" ? "「これからも、きみの好きなことを教えて。僕も、たくさん話したいな。また明日！」" : "「準備できた？ 大丈夫、何度でも一緒に挑戦しよう！」"}</p></div></section><section class="action-area" aria-live="polite">${state.phase === "talk" ? `<p class="hint">ミソラに、なんて答える？</p><div class="choices">${c.choices.map((x, i) => button(esc(x[0]), "choice-" + i)).join("")}</div>` : state.phase === "reply" ? button("一緒に挑戦する", "challenge", "primary") : state.phase === "challenge" ? `<div id="challenge"><span class="eyebrow">AFTER SCHOOL CHALLENGE</span><h2>${{ quiz: "ことばと知識のチャレンジ", memory: "動きの順番を覚えよう", cafe: "注文を届けよう", timing: "実況のタイミングを決めよう" }[c.kind]}</h2><p>${c.intro}</p><p class="hint">失敗しても何度でも再挑戦できます。途中で離れるとこの挑戦の最初から再開します。</p>${button("チャレンジ開始", "start", "primary")}</div>` : state.phase === "clear" ? `<span class="eyebrow">MEMORY UNLOCKED</span><h2>✧ ふたりでクリア！</h2><p>今日の思い出がアルバムに加わりました。</p>${button(state.chapter === 5 ? "ふたりの結末を見る" : "次の季節へ", "next", "primary")}` : `<span class="eyebrow">OUR ENDING</span><h2>${ending(state)}</h2><p>${ending(state) === "未来のクリエイター" ? "ふたりのアイデアから生まれたゲームが、学園のみんなを笑顔にしました。次の作品も、一緒に。" : ending(state) === "きらめく冒険の相棒" ? "初めてのことに踏み出すたび、隣にはミソラがいました。これからも、ふたりで新しい世界を見つけよう。" : "何気ない放課後が、かけがえのない宝物になりました。好きなものを話せる友だちと、これからも。"}</p><p>最後まで遊んでくれてありがとう。集めた思い出は次の周回でも残ります。</p>${button("思い出を見る", "album")}${button("違う選択でもう一度", "replay", "primary")}`}</section>`}</main><footer><span>${esc(notice)}</span><span>✿ 自分のペースで、楽しもう。</span></footer>`;
}
function album() {
  return `<div class="chapter-head"><div><span class="eyebrow">PRECIOUS MEMORIES</span><h1>ふたりの思い出</h1></div>${button("物語へ戻る", "play")}</div><div class="album-grid">${chapters.map((c, i) => `<article>${state.album.includes(i) ? `${scene(i, "memory-image")}<h2>${c.title}</h2><p>${c.place}</p>` : `<div class="locked">♡</div><h2>まだ見ぬ思い出 ${i + 1}</h2><p>この章をクリアすると開きます。</p>`}</article>`).join("")}</div><h2>結末コレクション ${state.endings.length} / 3</h2>${["ずっと、放課後の友だち", "未来のクリエイター", "きらめく冒険の相棒"].map((e) => `<p>${state.endings.includes(e) ? "✦ " + e : "◇ まだ見ぬ未来"}</p>`).join("")}<p>友情・勇気・ひらめきの選択で結末が変わります。同点なら友情を優先します。</p>`;
}
function settings() {
  return `<section class="settings"><span class="eyebrow">YOUR SCHOOL LIFE</span><h1>設定とセーブ</h1><p>この端末のブラウザに自動保存します。ほかの端末では、書き出したファイルを読み込んで続きを遊べます。</p>${button(state.sound ? "効果音：オン" : "効果音：オフ", "sound")}${button("セーブを書き出す", "export")}<label class="file-label">セーブを読み込む<input id="import" type="file" accept="application/json,.json"></label>${blocked ? `<p role="alert">壊れたデータを上書きせず保護しています。</p>${button("元の保存データを取り出す", "raw")}` : ""}${button("最初からやり直す", "reset", "danger")}${button("戻る", "play")}<p class="hint">配信は物語の演出です。カメラ・マイクは使用せず、実際の通信配信、チャット、広告、課金はありません。動きを減らす端末設定に対応しています。</p></section>`;
}
function download(raw) {
  const u = URL.createObjectURL(new Blob([raw], { type: "application/json" })),
    a = document.createElement("a");
  a.href = u;
  a.download = "misora-save.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
app.addEventListener("click", (e) => {
  const a = e.target.closest("[data-action]")?.dataset.action;
  if (!a) return;
  sound();
  if (a === "player" || a === "romance") {
    if (blocked) {
      screen = "settings";
      render();
      return;
    }
    screen = a;
    resetPlayerReply();
    save();
    render();
    return;
  }
  if (a.startsWith("player-")) {
    playerAction(a, { state, act, render });
    return;
  }
  if (a === "school") {
    if (blocked) {
      screen = "settings";
      render();
      return;
    }
    screen = "school";
    save();
    schoolAction("school-tab-campus", { state, act, render });
    return;
  }
  if (a.startsWith("school-")) {
    schoolAction(a, { state, act, render });
    return;
  }
  if (["title", "settings", "album"].includes(a)) {
    screen = a;
    render();
  } else if (a === "play") {
    if (blocked) {
      screen = "settings";
      render();
      return;
    }
    screen = "story";
    save();
    render();
  } else if (a.startsWith("choice-"))
    act({ type: "choose", index: Number(a.slice(7)) });
  else if (["challenge", "next", "replay", "sound"].includes(a))
    act({ type: a });
  else if (a === "start") start();
  else if (a === "retry") {
    render();
    document.querySelector(".action-area")?.scrollIntoView({ block: "start" });
  } else if (a === "export") download(JSON.stringify(state, null, 2));
  else if (a === "raw") {
    try {
      download(localStorage.getItem(key) || "");
    } catch {
      notice = "保存データにアクセスできません";
      render();
    }
  } else if (
    a === "reset" &&
    confirm("集めた思い出も含め、最初からやり直しますか？")
  ) {
    state = fresh();
    blocked = false;
    screen = "title";
    save();
    render();
  }
});
app.addEventListener("change", async (e) => {
  if (e.target.dataset.playerSlot) {
    act({
      type: "player-equip",
      slot: e.target.dataset.playerSlot,
      index: Number(e.target.value),
    });
    return;
  }
  if (e.target.id !== "import") return;
  try {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 50000) throw Error();
    const s = parse(await f.text());
    if (confirm("現在の進行をこのセーブに置き換えますか？")) {
      state = s;
      blocked = false;
      save();
      screen = "story";
      render();
    }
  } catch {
    notice = "読み込めませんでした。現在の進行は変更していません。";
    render();
  }
});
function start() {
  stop();
  const token = session,
    c = chapters[state.chapter],
    box = document.querySelector("#challenge");
  box.scrollIntoView({ block: "start", behavior: "instant" });
  let done = false;
  const fail = (msg) => {
    if (done) return;
    done = true;
    stop();
    box.innerHTML = `<h2>もう一度、やってみよう！</h2><p>${msg}</p>${button("再挑戦", "retry", "primary")}`;
  };
  const win = () => {
    if (done) return;
    done = true;
    sound();
    act({ type: "win" });
  };
  if (c.kind === "quiz") {
    let q = 0;
    const qs = c.questions || [c];
    const show = () => {
      const x = qs[q];
      box.innerHTML = `<span class="eyebrow">QUESTION ${q + 1} / ${qs.length}</span><h2>${x.question}</h2><div class="choices">${x.answers.map((x, i) => `<button data-answer="${i}">${x}</button>`).join("")}</div>`;
      box.onclick = (e) => {
        const b = e.target.closest("[data-answer]");
        if (!b) return;
        if (Number(b.dataset.answer) !== x.correct) {
          box.onclick = null;
          fail(
            x.why ||
              "ミソラとの会話を思い出してみよう。答えは「" +
                x.answers[x.correct] +
                "」だよ。",
          );
        } else if (++q === qs.length) {
          box.onclick = null;
          win();
        } else show();
      };
    };
    show();
    return;
  }
  let elapsed = 0,
    last = performance.now(),
    hits = 0,
    mistakes = 0;
  const symbols =
    c.kind === "memory"
      ? ["★", "♥", "◆", "☾"]
      : ["🍪 クッキー", "☕ ココア", "🍓 ケーキ"];
  box.innerHTML = `<h2>${c.kind === "memory" ? "順番を覚えよう" : c.kind === "cafe" ? "カフェのお手伝い" : "タイミングチャレンジ"}</h2><p id="status" role="status"></p>${c.kind === "timing" ? '<div class="meter"><div class="zone"></div><div id="needle"></div></div><button id="hit" class="primary">決める！</button>' : `<div class="tiles">${symbols.map((s, i) => `<button data-tile="${i}" aria-label="${c.kind === "memory" ? "印 " + (i + 1) : s}" ${c.kind === "memory" ? "disabled" : ""}>${s}</button>`).join("")}</div>`}<p class="hint">別のタブを見ている間は時間が止まります。</p>`;
  const status = box.querySelector("#status"),
    tiles = [...box.querySelectorAll("[data-tile]")];
  let position = 0,
    cooldown = 0;
  box.onclick = (e) => {
    if (done) return;
    const b = e.target.closest("[data-tile],#hit");
    if (!b) return;
    if (c.kind === "memory") {
      if (elapsed < 4000) return;
      if (Number(b.dataset.tile) !== c.sequence[hits]) {
        box.onclick = null;
        fail("光った順番を、もう一度ゆっくり見てみよう。");
        return;
      }
      if (++hits === 4) win();
    } else if (c.kind === "cafe") {
      if (Number(b.dataset.tile) === c.orders[hits]) {
        sound();
        if (++hits === 6) win();
      } else if (++mistakes === 3) {
        box.onclick = null;
        fail("注文をよく見てみよう。3回のお手つきで、今日は練習し直し！");
      }
    } else if (elapsed >= cooldown) {
      cooldown = elapsed + 650;
      if (position >= 38 && position <= 62) {
        sound();
        if (++hits === 3) win();
      } else if (++mistakes === 5) {
        box.onclick = null;
        fail(
          "ピンクのゾーンで押そう。速さは同じなので、練習するとつかめるよ。",
        );
      }
    }
  };
  const tick = (now) => {
    if (done || token !== session) return;
    const dt = now - last;
    last = now;
    if (!document.hidden && dt < 1000) elapsed += dt;
    if (c.kind === "memory") {
      status.textContent =
        elapsed < 4000
          ? "順番を見よう：★ → ◆ → ♥ → ☾".replace(
              "★ → ◆ → ♥ → ☾",
              `${Math.min(4, Math.floor(elapsed / 900) + 1)} / 4`,
            )
          : `同じ順番で押そう ${hits} / 4`;
      tiles.forEach((b, i) => {
        b.disabled = elapsed < 4000;
        b.classList.toggle(
          "lit",
          elapsed < 3600 &&
            elapsed % 900 < 650 &&
            c.sequence[Math.floor(elapsed / 900)] === i,
        );
      });
    } else if (c.kind === "cafe") {
      status.textContent = `注文：${symbols[c.orders[hits]]}　${hits}/6人　残り${Math.max(0, Math.ceil((30000 - elapsed) / 1000))}秒　お手つき${mistakes}/3`;
      if (elapsed >= 30000) {
        fail("時間になったよ。次は注文を順番に確認しよう！");
        return;
      }
    } else {
      position = (Math.sin(elapsed / 650 - Math.PI / 2) + 1) * 50;
      box.querySelector("#needle").style.left = position + "%";
      status.textContent = `成功 ${hits}/3　お手つき ${mistakes}/5`;
      box.querySelector("#hit").disabled = elapsed < cooldown;
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
}
render();
