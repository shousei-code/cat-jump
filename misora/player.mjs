export const dressNames = [
  "学園プリンセス制服",
  "ミントフリル",
  "ローズドレス",
  "月夜のドレス",
  "放課後カーディガン",
  "セーラー制服",
  "花びらワンピース",
  "冬のおでかけコート",
  "プリンセスドレス",
  "星空パーティー",
  "文化祭メイドカフェ",
  "いちごカフェエプロン",
  "学園の体操服",
  "文化祭ステージ",
  "桜色フリル",
  "ラベンダーローズ",
  "青空セーラー",
  "あじさいワンピース",
  "夕焼けプリンセス",
  "ミントステージ",
];
export const pinNames = [
  "ピンクリボン",
  "ラベンダーリボン",
  "金の星",
  "パールピン",
  "桜の花",
  "カピバラピン",
  "三日月",
  "青い蝶",
  "ルビーハート",
  "クローバー",
  "いちご",
  "デイジー",
  "雪の結晶",
  "音符",
  "空の雲",
  "チェックリボン",
  "白いレース",
  "虹の貝がら",
  "ぶどう",
  "宝石の王冠",
];
export const shoeNames = [
  "学園ローファー",
  "ミントシューズ",
  "夜色ブーツ",
  "ローズリボン靴",
  "パールシューズ",
  "星のパンプス",
  "桜ローファー",
  "青空シューズ",
  "ラベンダーブーツ",
  "ピーチリボン靴",
  "月のパール靴",
  "ミントの星靴",
  "雪ローファー",
  "若草シューズ",
  "ベリーのブーツ",
  "紫のリボン靴",
  "空色パール靴",
  "金の星靴",
  "キャラメルローファー",
  "銀色シューズ",
];
export const hairNames = [
  "ふんわりボブ",
  "さらさらロング",
  "ゆるふわツイン",
  "サイドアレンジ",
  "おだんご",
  "軽やかショート",
  "リンちゃんのショートボブ",
];
export const colors = [
  "ピンクブラウン",
  "ダークブラウン",
  "はちみつ",
  "ローズ",
  "ラベンダー",
  "パステルピンク",
];
export const freshPlayer = () => ({
  name: "リンちゃん",
  hair: 6,
  color: 5,
  eyes: 4,
  dress: 0,
  pin: 0,
  shoes: 0,
  heart: 0,
  chapter: 0,
  choices: [],
  ending: null,
  rival: 0,
});
export function validPlayer(p) {
  return (
    !!p &&
    typeof p.name === "string" &&
    p.name.trim().length > 0 &&
    p.name.length <= 24 &&
    !/[\u0000-\u001f]/.test(p.name) &&
    [
      "hair",
      "color",
      "eyes",
      "dress",
      "pin",
      "shoes",
      "heart",
      "chapter",
      "rival",
    ].every((k) => Number.isInteger(p[k]) && p[k] >= 0) &&
    p.hair < 7 &&
    p.color < 6 &&
    p.eyes < 5 &&
    p.dress < 20 &&
    p.pin < 20 &&
    p.shoes < 20 &&
    p.heart <= 16 &&
    p.chapter <= 8 &&
    p.rival <= 8 &&
    Array.isArray(p.choices) &&
    p.choices.length === p.chapter &&
    p.choices.every((n) => n === 0 || n === 1) &&
    [null, "恋人の約束", "大切な友だち"].includes(p.ending) &&
    (p.chapter === 8 ? p.ending !== null : p.ending === null)
  );
}
export const dates = [
  {
    title: "桜の下で、名前を呼んで",
    place: "校門",
    person: "misora",
    text: "「{name}、一緒に教室に行こう。きみの好きなこと、もっと知りたいな」",
    options: ["ミソラくんの好きなことも教えて", "まずはみんなで仲良くなろう"],
    reply: [
      "「うん！ 放課後、たくさん話そうね」",
      "「もちろん。みんなで楽しいクラスにしよう！」",
    ],
  },
  {
    title: "放課後の約束",
    place: "ゲーム制作部",
    person: "misora",
    text: "「きみと作っていると、アイデアがいっぱい浮かぶんだ。今日は隣に座ってもいい？」",
    options: ["隣に来てほしいな", "みんなの席も用意しよう"],
    reply: [
      "「ありがとう。ちょっとドキドキするね」",
      "「きみの優しいところ、素敵だと思う」",
    ],
  },
  {
    title: "ライバルのリナ",
    place: "文化祭準備室",
    person: "rina",
    text: "リナ「ミソラくんと同じ係なの？ 私も彼のこと、気になってるの。でも、文化祭はみんなで成功させたいわ」",
    options: ["お互いの気持ちも大切にしよう", "まずはカフェを一緒に頑張ろう"],
    reply: [
      "リナ「そうね。正々堂々と、友だちとしても仲良くしましょ」",
      "リナ「ありがとう。あなたのアイデアも聞かせて」",
    ],
  },
  {
    title: "文化祭・メイドカフェ",
    place: "カピバラカフェ",
    person: "misora",
    requires: "festival",
    text: "「{name}、今日のカフェ、楽しかったね。似合う服を自分で選んだところも素敵だな。休憩、一緒にどう？」",
    options: ["ふたりで休憩したいな", "友だちのみんなも呼ぼう"],
    reply: [
      "「じゃあ、中庭へ。きみと少し話したかったんだ」",
      "「うん！ みんなの頑張りをお祝いしよう」",
    ],
  },
  {
    title: "運動会の応援",
    place: "グラウンド",
    person: "misora",
    requires: "sports",
    text: "「応援、聞こえたよ！ {name}の声で、最後まで走れた気がする。ありがとう」",
    options: ["一番に応援してたよ", "チームのみんな、かっこよかったね"],
    reply: [
      "「嬉しい。今度は僕が、きみを一番に応援するね」",
      "「ハルもきっと喜ぶよ。みんなで写真を撮ろう！」",
    ],
  },
  {
    title: "リナの本当の気持ち",
    place: "図書室",
    person: "rina",
    text: "リナ「あなたとミソラくん、楽しそうね。少し悔しいけど、私も自分の好きなことを大切にするわ。これからも友だちでいてくれる？」",
    options: ["もちろん、ずっと友だちだよ", "一緒に新しい部活の企画を考えよう"],
    reply: [
      "リナ「ありがとう。あなたの恋、応援するわ」",
      "リナ「いいわね！ 今度は私たちが主役よ」",
    ],
  },
  {
    title: "バレンタインの小さな勇気",
    place: "冬の教室",
    person: "misora",
    text: "「{name}、今日も話せて嬉しい。きみといると、何でもない日が特別になるんだ」",
    options: [
      "好きな気持ちを込めたチョコを渡す",
      "友だちとしてありがとうを伝える",
    ],
    reply: [
      "「僕のために？ 大切に食べるね。ありがとう」",
      "「こちらこそ。きみは大切な友だちだよ」",
    ],
  },
  {
    title: "ふたりで選ぶ、これから",
    place: "桜の帰り道",
    person: "misora",
    text: "「これからも、きみの気持ちを大切にしたい。{name}は、僕とどんなふうに過ごしたい？」",
    options: [
      "恋人として、もっと仲良くなりたい",
      "大切な友だちとして一緒にいたい",
    ],
    reply: [
      "「僕も同じ気持ち。お互いのペースで、少しずつ仲良くなろう」",
      "「うん。これからも、きみの好きなことを一緒に楽しもう！」",
    ],
  },
];
export function playerReduce(s, a) {
  const n = structuredClone(s);
  n.player ??= freshPlayer();
  const p = n.player;
  if (a.type === "player-rin") {
    Object.assign(p, { name: "リンちゃん", hair: 6, color: 5, eyes: 4 });
  } else if (a.type === "player-name") {
    const name = String(a.name ?? "").trim();
    if (!name || name.length > 24 || /[\u0000-\u001f]/.test(name)) return s;
    p.name = name;
  } else if (a.type === "player-equip") {
    const limits = {
      hair: 7,
      color: 6,
      eyes: 5,
      dress: 20,
      pin: 20,
      shoes: 20,
    };
    if (
      !Object.hasOwn(limits, a.slot) ||
      !Number.isInteger(a.index) ||
      a.index < 0 ||
      a.index >= limits[a.slot]
    )
      return s;
    if (p.hair === 6 && ["color", "eyes"].includes(a.slot)) return s;
    p[a.slot] = a.index;
    if (a.slot === "hair" && a.index === 6) { p.color = 5; p.eyes = 4; }
  } else if (a.type === "player-choice") {
    if (p.chapter >= dates.length || ![0, 1].includes(a.index)) return s;
    const d = dates[p.chapter];
    if (d.requires && !n.school?.completed.includes(d.requires)) return s;
    p.choices.push(a.index);
    if (d.person === "rina") p.rival += 1;
    else p.heart += a.index === 0 ? 2 : 1;
    p.chapter++;
    if (p.chapter === dates.length)
      p.ending = a.index === 0 ? "恋人の約束" : "大切な友だち";
  } else if (a.type === "player-replay") {
    p.heart = 0;
    p.chapter = 0;
    p.choices = [];
    p.ending = null;
    p.rival = 0;
  } else return s;
  return n;
}
