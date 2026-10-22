import { freshPlayer, validPlayer, playerReduce } from "./player.mjs?v=uniform1";
import {
  freshSchool,
  schoolReduce,
  validSchool,
  normalizeSchool,
} from "./school.mjs?v=uniform1";
export const chapters = [
  {
    title: "桜の下で、はじめまして",
    season: "APRIL · 出会い",
    place: "桜坂学園・校門",
    art: 0,
    text: "「あっ、同じクラスだね！ 僕、ミソラ。カバンのこれ？ カピバラだよ。よかったら一緒に教室まで行こう！」",
    choices: [
      [
        "カピバラ、私も好き！",
        "「ほんと？ じゃあ今日からカピバラ仲間だね！」",
        "friend",
      ],
      [
        "教室まで競争しよう！",
        "「元気だね！ でも廊下は歩こう。約束！」",
        "brave",
      ],
    ],
    kind: "quiz",
    intro: "教室へ向かう前に、ミソラのことを覚えよう。",
    question: "ミソラが大好きな動物は？",
    answers: ["カピバラ", "ペンギン", "キツネ"],
    correct: 0,
  },
  {
    title: "隣の席の、小さな約束",
    season: "MAY · 授業",
    place: "1年2組・教室",
    art: 1,
    text: "「この問題、ふたりで考えよう。間違えても大丈夫。答えがわかった瞬間って、ゲームをクリアしたみたいだよね」",
    choices: [
      [
        "順番に説明し合おう",
        "「いいね！ 説明すると、僕ももっとわかる気がする」",
        "study",
      ],
      [
        "まずは挑戦してみる！",
        "「その勇気、いいね。困ったら一緒に考えよう」",
        "brave",
      ],
    ],
    kind: "quiz",
    intro:
      "3問の授業チャレンジ。全問正解でクリア。間違えたところは解説を読んで再挑戦！",
    questions: [
      {
        question: "ノートを3冊ずつ、4人に配る。全部で何冊？",
        answers: ["7冊", "12冊", "16冊"],
        correct: 1,
        why: "3＋3＋3＋3＝12。3×4でも求められるよ。",
      },
      {
        question: "「協力」の読み方は？",
        answers: ["きょうりょく", "きょうろく", "きょりょく"],
        correct: 0,
        why: "力を合わせることを「きょうりょく」というよ。",
      },
      {
        question: "植物が光を使って養分をつくる働きは？",
        answers: ["蒸発", "光合成", "結晶"],
        correct: 1,
        why: "葉などで光を使って養分をつくる働きが光合成だよ。",
      },
    ],
  },
  {
    title: "放課後、ゲーム制作部！",
    season: "JUNE · 部活動",
    place: "ゲーム制作部",
    art: 2,
    text: "「カピバラが星を集めるゲーム、作ってるんだ。動きの順番を一緒に覚えてくれる？ きみがいてくれると心強いな」",
    choices: [
      [
        "動きを覚える係になる",
        "「頼りにしてる！ 僕は音を作ってみるね」",
        "study",
      ],
      [
        "みんなが楽しめる工夫をしよう",
        "「その考え、すごく好き。ひとりずつ得意なことを持ち寄ろう！」",
        "friend",
      ],
    ],
    kind: "memory",
    intro: "4つの印が光る順番を覚え、同じ順番で押そう。",
    sequence: [0, 2, 1, 3],
  },
  {
    title: "ようこそ、カピバラカフェ",
    season: "OCTOBER · 文化祭",
    place: "1年2組・文化祭カフェ",
    art: 3,
    text: "「お客さんが来た！ 僕が飲み物を運ぶから、注文をお願いしてもいい？ 慌てなくて大丈夫。ふたりで笑顔のお店にしよう」",
    choices: [
      [
        "ひとつずつ丁寧に届ける",
        "「ありがとう。きみの優しさ、きっと伝わるよ」",
        "friend",
      ],
      [
        "お店を元気に盛り上げる！",
        "「いらっしゃいませー！ へへ、一緒だと楽しいね！」",
        "brave",
      ],
    ],
    kind: "cafe",
    intro: "注文と同じ品物を選んで6人に届けよう。制限時間30秒。",
    orders: [0, 2, 1, 0, 1, 2],
  },
  {
    title: "初めてのゲーム実況",
    season: "NOVEMBER · 配信ごっこ",
    place: "ミソラのゲーム部屋",
    art: 4,
    text: "「今日は部活のゲームを紹介する動画を撮るんだ。見てる人にも楽しさを届けたいな。最後のタイミング、一緒に決めよう！」",
    choices: [
      [
        "作った仲間を紹介しよう",
        "「そうしよう！ みんなで作った、大切なゲームだからね」",
        "friend",
      ],
      [
        "ゲームの工夫を説明しよう",
        "「わかりやすい！ 僕もきみの説明を聞いて練習しよう」",
        "study",
      ],
    ],
    kind: "timing",
    intro:
      "動く印がピンクのゾーンに入ったら「決める」！ 3回成功で撮影完了。これはゲーム内の配信ごっこで、実際の配信は行いません。",
  },
  {
    title: "冬空に、また明日の約束",
    season: "DECEMBER · 帰り道",
    place: "冬の通学路",
    art: 5,
    text: "「今年、きみといろんなことができて嬉しかった。授業も文化祭も、ゲームも。来年も一緒に新しいこと、見つけようね」",
    choices: [
      [
        "これからも一緒に遊ぼう",
        "「うん！ 約束。次はどんなゲームにしようかな」",
        "friend",
      ],
      [
        "来年はもっとすごいものを作ろう",
        "「きみとなら、できる気がする。楽しみにしてる！」",
        "brave",
      ],
    ],
    kind: "quiz",
    intro: "ふたりの思い出を振り返ろう。",
    question: "文化祭でふたりが開いたお店は？",
    answers: ["カピバラカフェ", "パン工場", "お花屋さん"],
    correct: 0,
  },
];
export const fresh = () => ({
  v: 1,
  chapter: 0,
  phase: "talk",
  chosen: null,
  friend: 0,
  brave: 0,
  study: 0,
  cleared: [],
  album: [],
  endings: [],
  sound: false,
  school: freshSchool(),
  player: freshPlayer(),
});
export function ending(s) {
  return s.study > s.friend && s.study > s.brave
    ? "未来のクリエイター"
    : s.brave > s.friend
      ? "きらめく冒険の相棒"
      : "ずっと、放課後の友だち";
}
export function reduce(s, a) {
  if (a.type.startsWith("player-")) return playerReduce(s, a);
  if (a.type.startsWith("school-")) return schoolReduce(s, a);
  const n = structuredClone(s);
  if (a.type === "choose" && s.phase === "talk" && [0, 1].includes(a.index)) {
    n.chosen = a.index;
    n[chapters[s.chapter].choices[a.index][2]]++;
    n.phase = "reply";
  } else if (a.type === "challenge" && s.phase === "reply")
    n.phase = "challenge";
  else if (a.type === "win" && s.phase === "challenge") {
    n.phase = "clear";
    n.cleared = [...new Set([...n.cleared, n.chapter])];
    n.album = [...new Set([...n.album, n.chapter])];
  } else if (a.type === "next" && s.phase === "clear") {
    if (n.chapter === 5) {
      n.phase = "ending";
      n.endings = [...new Set([...n.endings, ending(n)])];
    } else {
      n.chapter++;
      n.phase = "talk";
      n.chosen = null;
    }
  } else if (a.type === "replay" && s.phase === "ending") {
    return {
      ...fresh(),
      album: s.album,
      endings: s.endings,
      sound: s.sound,
      school: s.school ?? freshSchool(),
      player: s.player ?? freshPlayer(),
    };
  } else if (a.type === "sound") n.sound = !n.sound;
  else return s;
  return n;
}
export function parse(raw) {
  const s = JSON.parse(raw);
  if (
    !s ||
    s.v !== 1 ||
    !Number.isInteger(s.chapter) ||
    s.chapter < 0 ||
    s.chapter > 5 ||
    !["talk", "reply", "challenge", "clear", "ending"].includes(s.phase) ||
    !["friend", "brave", "study"].every(
      (k) => Number.isInteger(s[k]) && s[k] >= 0 && s[k] <= 6,
    ) ||
    typeof s.sound !== "boolean" ||
    ![null, 0, 1].includes(s.chosen) ||
    !["album", "cleared"].every(
      (k) =>
        Array.isArray(s[k]) &&
        s[k].length <= 6 &&
        new Set(s[k]).size === s[k].length &&
        s[k].every((x) => Number.isInteger(x) && x >= 0 && x <= 5),
    ) ||
    !Array.isArray(s.endings) ||
    s.endings.length > 3 ||
    !s.endings.every((x) =>
      [
        "未来のクリエイター",
        "きらめく冒険の相棒",
        "ずっと、放課後の友だち",
      ].includes(x),
    ) ||
    (s.phase !== "talk" && s.chosen === null) ||
    (s.phase === "ending" && (s.chapter !== 5 || s.cleared.length !== 6)) ||
    (["clear", "ending"].includes(s.phase) && !s.cleared.includes(s.chapter))
  )
    throw Error("セーブデータを読み込めませんでした");
  if (s.school !== undefined) normalizeSchool(s.school);
  if (s.school !== undefined && !validSchool(s.school))
    throw Error("学園生活のセーブデータが正しくありません");
  s.school ??= freshSchool();
  if (s.player !== undefined && !validPlayer(s.player))
    throw Error("自分のデータが正しくありません");
  s.player ??= freshPlayer();
  return s;
}
