export const friends = [
  { name: "ハル", icon: "☀️", kind: "明るいクラスメイト" },
  { name: "ソラ", icon: "🎮", kind: "ゲーム好きの友達" },
  { name: "レン", icon: "📚", kind: "作戦を考えるのが得意" },
  { name: "ユイ", icon: "🎀", kind: "おしゃれが好きな親友" },
  { name: "モモ", icon: "🌷", kind: "応援上手な友達" },
  { name: "ナナ", icon: "⭐", kind: "負けず嫌いのライバル" },
];
export const days = [
  {
    title: "天才ゲーマーの新学期",
    speaker: 0,
    line: "海ちゃん、昨日のゲームすごかった！ 今度コツを教えてくれない？",
    choices: [
      [
        "もちろん！ 一緒に練習しよう",
        0,
        3,
        "「やった！ 海ちゃんと遊ぶの楽しみ！」ハルがうれしそうに笑った。",
      ],
      [
        "勝つには落ち着いて見るのが大事だよ",
        2,
        2,
        "レンもノートを開いた。「その考え方、授業にも使えそうだね。」",
      ],
    ],
  },
  {
    title: "休み時間のひみつ作戦",
    speaker: 1,
    line: "週末に、みんなでゲーム大会をしようよ。海ちゃんも出る？",
    choices: [
      [
        "出る！ みんなで楽しもう",
        1,
        3,
        "ソラが小さくガッツポーズ。「じゃあ決まり！ 放課後は練習だね。」",
      ],
      [
        "まずはみんなの得意なことを聞こう",
        4,
        3,
        "モモがにっこり。「海ちゃんは、みんなのことも考えてくれるんだね。」",
      ],
    ],
  },
  {
    title: "ライバルからの挑戦状",
    speaker: 5,
    line: "海ちゃん、私も負けないよ！ 記憶ゲームで勝負しよう？",
    choices: [
      [
        "いいよ！ お互い全力でいこう",
        5,
        3,
        "「約束ね！」ナナと笑顔で握手した。ライバルだけど、大切な友達。",
      ],
      [
        "練習のあとでコツも交換しよう",
        5,
        2,
        "ナナが少し照れた。「そういうところ、好きだな。友達としてね！」",
      ],
    ],
  },
  {
    title: "制服のリボンと応援メモ",
    speaker: 3,
    line: "大会の日の応援メモ、クラスで作ってるんだ。海ちゃんの好きな色は？",
    choices: [
      [
        "ピンクと水色！ ありがとう",
        3,
        3,
        "ユイがリボンを指さす。「今日の制服にもぴったり！」",
      ],
      [
        "みんなの好きな色も入れてほしいな",
        4,
        3,
        "色とりどりのメモが集まった。海の机の上が、ぱっと明るくなった。",
      ],
    ],
  },
  {
    title: "人気者にも、苦手はある",
    speaker: 2,
    line: "海ちゃんでも緊張する？ 僕は人に見られるとドキドキするんだ。",
    choices: [
      [
        "私もするよ。一緒に深呼吸しよう",
        2,
        3,
        "ゆっくり息を吸って、吐いた。「海ちゃんと話すと安心するよ。」",
      ],
      [
        "失敗しても、もう一回やれば大丈夫",
        0,
        3,
        "ハルもうなずいた。「その言葉、明日の僕にも貸してね！」",
      ],
    ],
  },
  {
    title: "大会前日の約束",
    speaker: 4,
    line: "みんな、海ちゃんを応援してるよ。でも、無理はしないでね。",
    choices: [
      [
        "ありがとう！ 今日は早めに休むね",
        4,
        3,
        "「それがいちばん！」モモから星のシールをもらった。",
      ],
      [
        "勝っても負けても、またみんなで遊ぼう",
        1,
        3,
        "ソラが答えた。「もちろん。大会のあとも、ずっと友達だよ。」",
      ],
    ],
  },
  {
    title: "きらめきゲーム大会",
    speaker: 5,
    line: "いよいよ本番！ 海ちゃん、今日は全力で勝負しよう！",
    choices: [
      [
        "うん！ みんなで最高の大会にしよう",
        5,
        3,
        "先生が始まりを告げた。「相手を大切に、楽しく競いましょう！」",
      ],
      [
        "応援ありがとう。自分のペースでいくね",
        3,
        3,
        "「海ちゃんなら大丈夫！」友達の声が、背中をそっと押してくれた。",
      ],
    ],
  },
];
export const fresh = () => ({
  version: 1,
  day: 1,
  phase: "school",
  bonds: Array(6).fill(0),
  skill: [0, 0, 0],
  practiced: [],
  petted: false,
  coins: 0,
  rounds: [null, null, null],
  best: 0,
  ending: null,
  dialogChoice: null,
});
export function parse(raw) {
  const s = JSON.parse(raw),
    ints = (a, n, max) =>
      Array.isArray(a) &&
      a.length === n &&
      a.every((x) => Number.isInteger(x) && x >= 0 && x <= max);
  if (
    !s ||
    s.version !== 1 ||
    !Number.isInteger(s.day) ||
    s.day < 1 ||
    s.day > 7 ||
    !["school", "reply", "home", "tournament", "ending"].includes(s.phase) ||
    !ints(s.bonds, 6, 99) ||
    !ints(s.skill, 3, 60) ||
    !Array.isArray(s.practiced) ||
    s.practiced.some((x) => !Number.isInteger(x) || x < 0 || x > 2) ||
    new Set(s.practiced).size !== s.practiced.length ||
    typeof s.petted !== "boolean" ||
    !Number.isInteger(s.coins) ||
    s.coins < 0 ||
    s.coins > 9999 ||
    !Array.isArray(s.rounds) ||
    s.rounds.length !== 3 ||
    s.rounds.some(
      (n) => n !== null && (!Number.isInteger(n) || n < 0 || n > 100),
    ) ||
    !Number.isInteger(s.best) ||
    s.best < 0 ||
    s.best > 100 ||
    ![null, "gold", "silver", "friendship"].includes(s.ending) ||
    ![null, 0, 1].includes(s.dialogChoice)
  )
    throw Error("invalid save");
  return s;
}
export function choose(s, i) {
  if (s.phase !== "school" || ![0, 1].includes(i)) return false;
  const c = days[s.day - 1].choices[i];
  s.bonds[c[1]] = Math.min(99, s.bonds[c[1]] + c[2]);
  s.dialogChoice = i;
  s.phase = "reply";
  return true;
}
export function leaveSchool(s) {
  if (s.phase !== "reply") return false;
  s.phase = s.day === 7 ? "tournament" : "home";
  return true;
}
export function pet(s) {
  if (s.phase !== "home" || s.petted) return false;
  s.petted = true;
  s.coins += 5;
  return true;
}
export function practice(s, i, score) {
  if (
    s.phase !== "home" ||
    !Number.isFinite(score) ||
    !Number.isInteger(i) ||
    i < 0 ||
    i > 2 ||
    s.practiced.includes(i) ||
    s.practiced.length >= 2
  )
    return false;
  s.practiced.push(i);
  s.skill[i] = Math.min(
    60,
    s.skill[i] + 3 + Math.floor(Math.max(0, Math.min(100, score)) / 20),
  );
  s.coins += 5 + Math.floor(Math.max(0, Math.min(100, score)) / 10);
  return true;
}
export function nextDay(s) {
  if (s.phase !== "home" || s.day >= 7) return false;
  s.day++;
  s.phase = "school";
  s.practiced = [];
  s.petted = false;
  s.dialogChoice = null;
  return true;
}
export function recordRound(s, i, score) {
  if (
    s.phase !== "tournament" ||
    !Number.isInteger(i) ||
    i < 0 ||
    i > 2 ||
    !Number.isFinite(score)
  )
    return false;
  s.rounds[i] = Math.max(
    s.rounds[i] ?? 0,
    Math.round(Math.max(0, Math.min(100, score))),
  );
  return true;
}
export function total(s) {
  if (s.rounds.some((x) => x === null)) return null;
  const raw = s.rounds.reduce((a, b) => a + b, 0) / 3;
  const practice = s.skill.reduce((a, b) => a + b, 0) / 12;
  const support = Math.min(5, s.bonds.reduce((a, b) => a + b, 0) / 5);
  return Math.min(
    100,
    Math.round(raw * 0.85 + Math.min(10, practice) + support),
  );
}
export function finish(s) {
  const score = total(s);
  if (s.phase !== "tournament" || score === null) return false;
  s.ending = score >= 80 ? "gold" : score >= 55 ? "silver" : "friendship";
  s.best = Math.max(s.best, score);
  s.phase = "ending";
  return true;
}
export function sequence(day, hard = false) {
  return Array.from(
    { length: hard ? 6 : Math.min(6, 3 + Math.floor(day / 2)) },
    (_, i) => (day * 7 + i * 3 + i * i * 5 + Math.floor(i / 2)) % 4,
  );
}
export function timingScore(offset) {
  return Math.max(0, Math.round(100 * (1 - Math.abs(offset) / 0.45)));
}
export function targetPosition(n) {
  const points = [
    [18, 25],
    [70, 65],
    [40, 42],
    [80, 20],
    [22, 70],
    [61, 35],
    [45, 75],
    [83, 52],
    [15, 45],
    [55, 20],
    [34, 58],
    [74, 78],
  ];
  return points[n % points.length];
}
