import {
  friends,
  days,
  fresh,
  parse,
  choose,
  leaveSchool,
  pet,
  practice,
  nextDay,
  recordRound,
  total,
  finish,
  sequence,
  timingScore,
  targetPosition,
} from "./core.mjs";
const $ = (id) => document.getElementById(id),
  key = "umi-gamer-v1",
  symbols = ["🎮", "🐱", "🌟", "🎀"],
  titles = ["おぼえてコンボ", "きらめきリズム", "スターキャッチ"];
let state = fresh(),
  blocked = false,
  mini = null,
  raf = 0,
  toastTimer;
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
    toast("保存できません。ブラウザの空き容量を確認してください。");
  }
}
function toast(s) {
  $("toast").textContent = s;
  $("toast").className = "show";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($("toast").className = ""), 3000);
}
function page(html) {
  cancelAnimationFrame(raf);
  $("app").innerHTML = html;
  window.scrollTo(0, 0);
}
function show(html) {
  $("panel").innerHTML = html;
  if (!$("dialog").open) $("dialog").showModal();
}
function title() {
  mini = null;
  page(
    `<section class="hero"><div><p class="eyebrow">UMI'S AFTER SCHOOL · 7 DAYS</p><h1>海ちゃんの放課後♡<br>ゲーマー日記</h1><p>学校では、みんなが憧れるゲームの天才。<br>おうちでは、猫と犬に囲まれた小学6年生。<br>友達と過ごす7日間が、海の力になる。</p><div class="actions"><button id="begin" class="primary">${state.day > 1 || state.phase !== "school" ? "つづきから遊ぶ" : "海ちゃんになって遊ぶ"}</button><button id="how">あそびかた</button></div><div class="chips"><span>学校とおうち</span><span>3つのミニゲーム</span><span>ゲーム大会</span></div><p class="muted">一人用・課金なし・このブラウザに自動保存${blocked ? "。保存が読めないため、元データを保護して保存を停止しています" : ""}</p></div></section>`,
  );
  $("begin").onclick = render;
  $("how").onclick = help;
}
function week() {
  return `<div class="week">${Array.from({ length: 7 }, (_, i) => `<span class="${i + 1 < state.day ? "done" : i + 1 === state.day ? "today" : ""}">${i + 1}</span>`).join("")}</div>`;
}
function render() {
  mini = null;
  if (state.phase === "school" || state.phase === "reply") school();
  else if (state.phase === "home") home();
  else if (state.phase === "tournament") tournament();
  else ending();
}
function school() {
  const d = days[state.day - 1],
    reply = state.phase === "reply",
    speaker = friends[d.speaker];
  page(
    `<div class="topline"><div><p class="eyebrow">SCHOOL LIFE</p><h2>${d.title}</h2></div>${week()}</div><section class="scene"><span class="dayLabel">DAY ${state.day} / 7 · 6年生の教室 · 休み時間</span><div class="dialogue"><strong>${reply ? "海ちゃんとクラスのみんな" : speaker.icon + " " + speaker.name}</strong><p>${reply ? d.choices[state.dialogChoice ?? 0][3] : d.line}</p></div></section>${reply ? `<div class="actions"><button id="leave" class="primary">${state.day === 7 ? "大会会場へ行こう" : "学校が終わったら、おうちへ"}</button></div>` : `<div class="choices">${d.choices.map((c, i) => `<button data-choice="${i}">${c[0]}</button>`).join("")}</div>`}<p class="muted">選んだ言葉で、友達とのなかよし度が変わります。好きな気持ちで答えてね。</p>`,
  );
  document.querySelectorAll("[data-choice]").forEach(
    (b) =>
      (b.onclick = () => {
        if (choose(state, +b.dataset.choice)) {
          save();
          school();
        }
      }),
  );
  if ($("leave"))
    $("leave").onclick = () => {
      leaveSchool(state);
      save();
      render();
    };
}
function skills() {
  return `<div class="skills"><span>🧠 記憶 ${state.skill[0]}</span><span>♫ リズム ${state.skill[1]}</span><span>⚡ 反射 ${state.skill[2]}</span><span>✧ きらめき ${state.coins}</span></div>`;
}
function home() {
  page(
    `<div class="topline"><div><p class="eyebrow">HOME SWEET GAMING HOME</p><h2>ただいま！ 放課後のじかん</h2></div>${week()}</div>${skills()}<div class="homeGrid"><section class="scene home"><span class="dayLabel">DAY ${state.day} · おうち</span><div class="dialogue"><strong>海ちゃん</strong><p>${state.practiced.length >= 2 ? "今日もがんばった！ 明日に備えて、そろそろ休もうかな。" : "今日は何をしよう？ 練習は1日2回まで。ペットとも遊びたいな♡"}</p></div></section><div class="cards">${titles.map((n, i) => `<article class="card"><h3>${["🧠", "♫", "⚡"][i]} ${n}</h3><p>${["順番を覚えて、同じマークを押そう。", "星が真ん中に来たら、タイミングよくタップ！", "次々に出る星を素早くタップしよう。"][i]}</p><button data-practice="${i}" ${state.practiced.includes(i) || state.practiced.length >= 2 ? "disabled" : ""}>${state.practiced.includes(i) ? "今日は練習済み" : "練習する"}</button></article>`).join("")}<article class="card"><h3>🐱 猫ちゃんとパオパオ</h3><p>大好きなふたりと、ほっとひと休み。</p><button id="pet" ${state.petted ? "disabled" : ""}>${state.petted ? "今日もなかよし♡" : "なでて遊ぶ"}</button></article></div></div><div class="actions"><button id="sleep" class="primary">🌙 今日は休んで、次の日へ</button><button id="friends">友達ノート</button></div><p class="muted">練習 ${state.practiced.length}/2 回。練習を休んでも物語は進みます。大会では何度でも再挑戦できます。</p>`,
  );
  document
    .querySelectorAll("[data-practice]")
    .forEach((b) => (b.onclick = () => miniIntro(+b.dataset.practice, false)));
  $("pet").onclick = () => {
    if (pet(state)) {
      save();
      home();
      show(
        '<h2>🐱 なでなで、ありがとう！ 🐶</h2><p>猫ちゃんはごろごろ。パオパオはしっぽをふりふり。<br>海「ふたりがいると、元気になるね♡」</p><p>きらめき +5</p><button id="closePet">おうちに戻る</button>',
      );
      $("closePet").onclick = () => $("dialog").close();
    }
  };
  $("sleep").onclick = () => {
    nextDay(state);
    save();
    render();
  };
  $("friends").onclick = friendBook;
}
function friendBook() {
  show(
    `<h2>海ちゃんの友達ノート</h2><p>学校での会話が、みんなとの思い出になります。</p><div class="friendGrid">${friends.map((f, i) => `<article class="card"><h3>${f.icon} ${f.name}</h3><p>${f.kind}</p><div class="heartbar"><i style="width:${Math.min(100, (state.bonds[i] / 12) * 100)}%"></i></div><small>なかよし ${state.bonds[i]}</small></article>`).join("")}</div><div class="actions"><button id="closeFriends">閉じる</button></div>`,
  );
  $("closeFriends").onclick = () => $("dialog").close();
}
function tournament() {
  page(
    `<p class="eyebrow">KIRAMEKI SCHOOL GAME CUP</p><h1>きらめきゲーム大会</h1><p>クラスのみんなと挑戦する、3種目のゲーム大会！<br>ナナ「全力で楽しもうね、海ちゃん！」</p>${skills()}<div class="cards">${titles.map((n, i) => `<article class="card"><h3>ROUND ${i + 1} · ${n}</h3><p>${state.rounds[i] === null ? "これから挑戦するよ" : `ベスト記録 ${state.rounds[i]} / 100 点`}</p><button data-round="${i}">${state.rounds[i] === null ? "挑戦する" : "もう一度挑戦する"}</button></article>`).join("")}</div><p class="muted">各種目のベスト記録を採用。3種目の平均×85%に、練習ボーナス（最大10点）と友達の応援（最大5点）を加えます。80点で金、55点で銀。</p><div class="actions"><button id="finish" class="primary" ${total(state) === null ? "disabled" : ""}>${total(state) === null ? "3種目をプレイして結果へ" : `結果発表へ · 総合 ${total(state)}点`}</button><button id="friends">応援してくれる友達</button></div>`,
  );
  document
    .querySelectorAll("[data-round]")
    .forEach((b) => (b.onclick = () => miniIntro(+b.dataset.round, true)));
  $("finish").onclick = () => {
    if (finish(state)) {
      save();
      ending();
    }
  };
  $("friends").onclick = friendBook;
}
function miniIntro(type, contest) {
  mini = { type, contest, active: false, score: 0 };
  page(
    `<section class="gameBox"><p class="eyebrow">${contest ? "TOURNAMENT" : "AFTER SCHOOL PRACTICE"}</p><h2>${titles[type]}</h2><div class="score">${["🧠", "♫", "🌟"][type]}</div><p>${["マークの順番をよく見て覚えよう。<br>「覚えた！」を押したら、同じ順番にボタンを押してね。<br>ゆっくり覚えて大丈夫！ 間違えても最後まで挑戦できるよ。", "星が中央の緑色の場所に来たらタップ！<br>全部で12回。中央ぴったりほど高得点。<br>スペースキーでも遊べます。", "12秒の間に、次々に出る星をタップ！<br>全部で12個。星が出てから押してね。<br>パソコンはマウスでクリック。"][type]}</p><div class="actions"><button id="startGame" class="primary">スタート</button><button id="back">${contest ? "大会会場" : "おうち"}へ戻る</button></div></section>`,
  );
  $("startGame").onclick = () => startMini(type, contest);
  $("back").onclick = render;
}
function startMini(type, contest) {
  mini = {
    type,
    contest,
    active: true,
    score: 0,
    start: performance.now(),
    done: 0,
    hits: new Set(),
    points: 0,
  };
  if (type === 0) {
    mini.seq = sequence(state.day, contest);
    mini.revealed = true;
    page(
      `<section class="gameBox"><h2>${titles[type]}</h2><p id="memoryPrompt">左から順番を覚えてね。</p><div id="sequence" class="memoryRow">${mini.seq.map((i) => `<span class="symbol" data-symbol="${i}">${symbols[i]}</span>`).join("")}</div><button id="remember" class="primary">覚えた！</button><div id="keys" class="memoryKeys" hidden>${symbols.map((s, i) => `<button data-symbol="${i}" aria-label="${["ゲーム", "ねこ", "ほし", "リボン"][i]}">${s}</button>`).join("")}</div><p id="feedback" role="status"></p><button id="abandon">この回をやめる</button></section>`,
    );
    $("remember").onclick = () => {
      mini.revealed = false;
      $("sequence").hidden = true;
      $("remember").hidden = true;
      $("keys").hidden = false;
      $("memoryPrompt").textContent = `1番目は？ 全${mini.seq.length}個`;
      $("keys").querySelector("button").focus();
    };
    document.querySelectorAll("#keys [data-symbol]").forEach(
      (b) =>
        (b.onclick = () => {
          if (!mini?.active || mini.revealed) return;
          const correct = +b.dataset.symbol === mini.seq[mini.done];
          if (correct) mini.points++;
          mini.done++;
          $("feedback").textContent = correct
            ? "正解！ その調子♡"
            : "おしい！ 次のマークに進もう";
          if (mini.done === mini.seq.length)
            completeMini(Math.round((mini.points / mini.seq.length) * 100));
          else
            $("memoryPrompt").textContent =
              `${mini.done + 1}番目は？ 全${mini.seq.length}個`;
        }),
    );
  } else if (type === 1) {
    page(
      `<section class="gameBox"><h2>${titles[type]}</h2><p>星が真ん中に来たらタップ！ 全12回</p><div class="track"><span id="note" class="note">🌟</span></div><button id="hit" class="hit">タップ！</button><p id="feedback" role="status">タイミングを合わせよう</p><p id="counter"></p><button id="abandon">この回をやめる</button></section>`,
    );
    $("hit").onclick = rhythmHit;
    raf = requestAnimationFrame(updateMini);
  } else {
    page(
      `<section class="gameBox"><h2>${titles[type]}</h2><p id="counter">12秒で星を12個集めよう</p><div class="arena"><button id="target" class="target" aria-label="星をつかまえる">⭐</button></div><button id="abandon">この回をやめる</button></section>`,
    );
    positionTarget();
    $("target").onclick = () => {
      if (!mini?.active) return;
      if ((performance.now() - mini.start) / 1000 >= 12) {
        completeMini(Math.round((mini.done / 12) * 100));
        return;
      }
      mini.done++;
      if (mini.done === 12) completeMini(100);
      else positionTarget();
    };
    raf = requestAnimationFrame(updateMini);
  }
  $("abandon").onclick = () => {
    mini = null;
    render();
  };
}
function positionTarget() {
  const [x, y] = targetPosition(mini.done);
  $("target").style.left = x + "%";
  $("target").style.top = y + "%";
}
function rhythmHit() {
  if (!mini?.active || mini.type !== 1) return;
  const time = (performance.now() - mini.start) / 1000,
    i = Math.round((time - 1) / 0.9);
  if (i < 0 || i >= 12 || mini.hits.has(i)) return;
  const score = timingScore(time - (1 + i * 0.9));
  mini.hits.add(i);
  mini.points += score;
  $("feedback").textContent =
    score >= 85
      ? "PERFECT！ ✨"
      : score >= 50
        ? "GOOD！ ♡"
        : "もう少し真ん中をねらおう！";
}
function updateMini(now) {
  if (!mini?.active) return;
  const time = (now - mini.start) / 1000;
  if (mini.type === 1) {
    const i = Math.max(0, Math.min(11, Math.floor((time - 0.55) / 0.9))),
      target = 1 + i * 0.9;
    const x = Math.max(-10, Math.min(110, 50 + ((time - target) / 0.9) * 100));
    $("note").style.left = x + "%";
    $("counter").textContent = `${i + 1}/12 回 · 押せた数 ${mini.hits.size}`;
    if (time >= 11.5) {
      completeMini(Math.round(mini.points / 12));
      return;
    }
  } else if (mini.type === 2) {
    $("counter").textContent =
      `あと ${Math.max(0, Math.ceil(12 - time))}秒 · ${mini.done}/12個`;
    if (time >= 12) {
      completeMini(Math.round((mini.done / 12) * 100));
      return;
    }
  }
  raf = requestAnimationFrame(updateMini);
}
function completeMini(score) {
  if (!mini?.active) return;
  const { type, contest } = mini;
  mini.active = false;
  cancelAnimationFrame(raf);
  if (contest) recordRound(state, type, score);
  else practice(state, type, score);
  save();
  page(
    `<section class="gameBox"><p class="eyebrow">NICE PLAY, UMI!</p><h2>${titles[type]} · 結果</h2><div class="score">${score}<small> / 100</small></div><p>${score >= 80 ? "すごい！ 天才ゲーマーのひらめき！" : score >= 50 ? "いい感じ！ 少しずつ上手になっているね。" : "最後まで挑戦できたね！ 次はきっとうまくいくよ。"}</p><p>${contest ? `大会ベスト ${state.rounds[type]}点を保存しました。再挑戦しても記録は下がりません。` : "練習の成長と、きらめきを保存しました。"}</p><div class="actions"><button id="return" class="primary">${contest ? "大会会場" : "おうち"}へ戻る</button>${contest ? '<button id="retry">もう一度挑戦する</button>' : ""}</div></section>`,
  );
  $("return").onclick = render;
  if ($("retry")) $("retry").onclick = () => miniIntro(type, contest);
}
function ending() {
  const rank = state.ending ?? "friendship",
    label = {
      gold: "🏆 金メダル！ 天才ゲーマーの笑顔",
      silver: "🥈 銀メダル！ 次の夢ができた日",
      friendship: "💗 みんなと遊ぶのが、いちばん！",
    }[rank];
  page(
    `<p class="eyebrow">SEVEN DAYS, ONE PRECIOUS MEMORY</p><h1>${label}</h1><img class="resultArt" src="assets/school.png" alt="制服の海ちゃんと学校の友達"><div class="card"><h2>総合 ${total(state)}点 · 7日間クリア！</h2><p>${rank === "gold" ? "海の見事なプレイに、教室いっぱいの拍手が響いた。ナナ「次こそ負けないよ！」海「また一緒に練習しよう！」" : rank === "silver" ? "あと少しで頂点。でも、海には新しい目標ができた。ソラ「今日のプレイ、かっこよかったよ！」海「ありがとう。次はもっと上手になるね！」" : "結果よりもうれしかったのは、みんなの応援。ハル「海ちゃんと遊ぶの、やっぱり楽しい！」海「私も！ また遊ぼうね。」"}</p><p>家では猫ちゃんとパオパオがお出迎え。<br>海「明日も、みんなと楽しい世界をつくりたいな♡」</p><p class="muted">最高記録 ${state.best}点。記録はこのブラウザに保存されています。</p></div><div class="actions"><button id="retryCup" class="primary">大会にもう一度挑戦</button><button id="newWeek">新しい7日間をはじめる</button><button id="friends">友達ノート</button></div>`,
  );
  $("retryCup").onclick = () => {
    state.phase = "tournament";
    save();
    render();
  };
  $("newWeek").onclick = confirmNew;
  $("friends").onclick = friendBook;
}
function confirmNew() {
  show(
    '<h2>新しい7日間をはじめる？</h2><p>最高記録は残し、今週の友達との記録・練習・大会記録を最初からにします。</p><div class="actions"><button id="confirmNew" class="primary">新しい週をはじめる</button><button id="cancelNew">戻る</button></div>',
  );
  $("confirmNew").onclick = () => {
    const best = state.best;
    state = fresh();
    state.best = best;
    save();
    $("dialog").close();
    render();
  };
  $("cancelNew").onclick = () => $("dialog").close();
}
function help() {
  show(
    '<h2>海ちゃんの1週間</h2><p>① 学校で友達との会話を選ぶ。<br>② 家では1日2種目まで練習。ペットとも遊べる。<br>③ 「次の日へ」で学校に進む。<br>④ 7日目は3種目の大会！ 何度でも再挑戦できるよ。</p><p>きらめきは頑張った記録です。課金や買い物はありません。<br>学校の友達はゲーム内キャラクターで、オンラインチャットはありません。</p><button id="closeHelp">わかった！</button>',
  );
  $("closeHelp").onclick = () => $("dialog").close();
}
function menu() {
  if (mini?.active) {
    mini = null;
    render();
    toast("プレイ中のミニゲームを中断しました。何度でもやり直せます。");
  }
  show(
    '<h2>メニュー</h2><div class="actions"><button id="closeMenu">ゲームに戻る</button><button id="menuFriends">友達ノート</button><button id="menuHelp">あそびかた</button><button id="menuTitle">タイトルへ</button></div><p class="muted">会話・練習結果・大会ベストは自動保存。ミニゲームの途中経過は保存されません。</p>',
  );
  $("closeMenu").onclick = () => $("dialog").close();
  $("menuFriends").onclick = friendBook;
  $("menuHelp").onclick = help;
  $("menuTitle").onclick = () => {
    $("dialog").close();
    title();
  };
}
$("menu").onclick = menu;
document.addEventListener("keydown", (e) => {
  if (
    e.code === "Space" &&
    mini?.active &&
    mini.type === 1 &&
    !$("dialog").open
  ) {
    e.preventDefault();
    if (!e.repeat) rhythmHit();
  }
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && mini?.active) {
    mini = null;
    render();
    toast("画面を離れたのでミニゲームを中断しました。もう一度挑戦できます。");
  }
});
title();
