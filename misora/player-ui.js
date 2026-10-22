import {
  dressNames,
  pinNames,
  shoeNames,
  hairNames,
  colors,
  dates,
  freshPlayer,
} from "./player.mjs?v=uniform1";
import {
  playerFigure,
  pinIcon,
  shoeIcon,
  escapeHtml as esc,
} from "./player-art.js?v=uniform1";
import { figure } from "./school-ui.js?v=uniform1";
let category = "dress",
  dateReply = null;
const names = { dress: dressNames, pin: pinNames, shoes: shoeNames };
export function creatorView(state) {
  const p = state.player ?? freshPlayer();
  return `<div class="chapter-head"><div><span class="eyebrow">MY OWN SCHOOL STORY</span><h1>自分をつくる・着せ替え</h1></div><button data-action="romance">ミソラくんに会いにいく</button></div><nav class="school-nav"><button data-action="school">学園生活へ</button><button data-action="play">元の物語へ</button></nav><div class="player-layout"><aside class="player-mirror">${playerFigure(state)}<h2>${esc(p.name)}</h2><p>${dressNames[p.dress]}<br>${pinNames[p.pin]}・${shoeNames[p.shoes]}</p></aside><section class="player-editor"><section class="profile-form"><h2>あなたのプロフィール</h2><div class="rin-preset"><img src="assets/player/rin-portrait.png" alt="短いパステルピンクの髪と淡い紫の瞳のリンちゃん" width="1024" height="1536" loading="lazy"><div><h3>リンちゃん</h3><p>ふんわりショートボブ、パステルピンクの髪、淡い紫の瞳。</p><button data-action="player-rin">リンちゃんにする</button><p class="hint">服やピン、物語の続きはそのままです。</p><a href="assets/player/rin-portrait.png" target="_blank" rel="noopener">イラストを大きく見る</a></div></div><label>ゲーム内のニックネーム<input id="player-name" maxlength="24" value="${esc(p.name)}" autocomplete="off"></label><button data-action="player-name">名前を決める</button><p class="hint">本名でなく、好きな名前で遊べます。このブラウザだけに保存します。</p><label>髪型<select data-player-slot="hair">${hairNames.map((x, i) => `<option value="${i}" ${p.hair === i ? "selected" : ""}>${x}</option>`).join("")}</select></label><label>髪色<select data-player-slot="color" ${p.hair === 6 ? "disabled" : ""}>${colors.map((x, i) => `<option value="${i}" ${p.color === i ? "selected" : ""}>${x}</option>`).join("")}</select></label><label>瞳の色<select data-player-slot="eyes" ${p.hair === 6 ? "disabled" : ""}>${["すみれ", "ミント", "はちみつ", "青空", "パステルラベンダー"].map((x, i) => `<option value="${i}" ${p.eyes === i ? "selected" : ""}>${x}</option>`).join("")}</select></label>${p.hair === 6 ? '<p class="hint">リンちゃんのボブは専用のピンク髪・薄紫の瞳です。他の髪型では色も自由に選べます。</p>' : ""}</section><h2>わたしのクローゼット</h2><p>服20種類・髪飾り26種類・靴20種類。学園からのプレゼントで、全部すぐに選べます。</p><nav class="school-nav">${[
    ["dress", "お洋服"],
    ["pin", "髪飾り・猫耳"],
    ["shoes", "靴"],
  ]
    .map(
      ([k, label]) =>
        `<button data-action="player-tab-${k}" aria-pressed="${category === k}">${label} ${names[k].length}</button>`,
    )
    .join(
      "",
    )}</nav><div class="player-items">${names[category].map((name, i) => `<button class="player-item ${p[category] === i ? "selected" : ""}" data-action="player-equip-${category}-${i}" aria-pressed="${p[category] === i}">${category === "dress" ? playerFigure({ ...state, player: { ...p, dress: i } }, "preview") : category === "pin" ? pinIcon(i) : shoeIcon(i)}<span>${name}</span>${p[category] === i ? "<small>着用中</small>" : ""}</button>`).join("")}</div><p class="hint">お洋服は制服やカーディガンなど学生らしい20コーデ。靴は6デザインの色違いを含みます。髪飾りはピン20点に、カチューシャ・大きなリボン・猫耳6点を追加しました。</p></section></div>`;
}
export function romanceView(state) {
  const p = state.player ?? freshPlayer(),
    d = dates[dateReply ? Math.max(0, p.chapter - 1) : Math.min(p.chapter, 7)],
    locked = d.requires && !state.school?.completed.includes(d.requires);
  return `<div class="chapter-head"><div><span class="eyebrow">MISORA & ${esc(p.name)}</span><h1>ミソラくんとの恋の物語</h1></div><span class="coin-count">♡ ときめき ${p.heart}</span></div><nav class="school-nav"><button data-action="player">自分を着せ替える</button><button data-action="school">学園生活へ</button></nav><p>お話 ${Math.min(p.chapter + 1, 8)} / 8 · 選んだ気持ちを大切にする物語</p><section class="romance-stage"><div class="romance-cast">${playerFigure(state, "", p.ending || dateReply ? "shy" : "smile")}${figure(d.person === "rina" && !p.ending ? "rina" : (state.school?.equipped ?? "uniform"))}</div><div class="event-dialogue"><span>${d.person === "rina" && !p.ending ? "リナ" : "ミソラ"}</span><h2>${p.ending ? p.ending : d.title}</h2><p>${esc(dateReply?.text ?? (p.ending === "恋人の約束" ? `「${p.name}、好きだよ。これからも、きみがきみらしくいられるように、一緒に過ごそうね」` : p.ending === "大切な友だち" ? `「${p.name}、ずっと大切な友だちだよ。楽しいことも、困ったことも、一緒に話そうね」` : d.text.replaceAll("{name}", p.name)))}</p></div></section><section class="action-area">${dateReply ? '<button data-action="player-reply">つづける</button>' : p.ending ? `<p>ふたりで選んだ、これからの約束。自分の気持ちも、相手の気持ちも大切にしていこう。</p><p>リナとの友情 ${p.rival} · 選んだ服はこのまま引き継げます。</p><button data-action="player-replay">恋の物語をもう一度</button><button data-action="player">次のおでかけの服を選ぶ</button>` : locked ? `<h2>まずは、学園の思い出を作ろう</h2><p>${d.requires === "festival" ? "文化祭カフェ" : "運動会リレー"}をクリアすると、このお話が開きます。</p><button data-action="school">学園生活へ行く</button>` : `<p class="hint">あなたは、どう伝えたい？</p><div class="choices">${d.options.map((x, i) => `<button data-action="player-choice-${i}">${x}</button>`).join("")}</div>`}</section><details class="romance-history"><summary>これまで選んだ気持ち</summary>${p.choices.map((v, i) => `<p>${dates[i].title}：${dates[i].options[v]}</p>`).join("")}</details>`;
}
export function playerAction(a, { state, act, render }) {
  const p = state.player ?? freshPlayer();
  if (a === "player-rin") {
    act({ type: "player-rin" });
  } else if (a === "player-name") {
    const input = document.querySelector("#player-name");
    if (!input.value.trim()) {
      input.setCustomValidity("好きなニックネームを入れてね");
      input.reportValidity();
      return;
    }
    act({ type: "player-name", name: input.value });
  } else if (a.startsWith("player-tab-")) {
    const k = a.slice(11);
    if (names[k]) category = k;
    render();
  } else if (a.startsWith("player-equip-")) {
    const [, , slot, index] = a.split("-");
    act({ type: "player-equip", slot, index: Number(index) });
  } else if (a.startsWith("player-choice-")) {
    const index = Number(a.slice(14)),
      d = dates[p.chapter];
    if (
      !d ||
      ![0, 1].includes(index) ||
      (d.requires && !state.school?.completed.includes(d.requires))
    )
      return;
    dateReply = { text: d.reply[index] };
    act({ type: "player-choice", index });
  } else if (a === "player-reply") {
    dateReply = null;
    render();
  } else if (a === "player-replay") {
    dateReply = null;
    act({ type: "player-replay" });
  }
}
export function resetPlayerReply() {
  dateReply = null;
}
