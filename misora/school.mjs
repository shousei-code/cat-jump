export const outfits = [
  {
    id: "uniform",
    name: "桜坂学園の制服",
    price: 0,
    frame: 0,
    tag: "きちんと",
    desc: "紺のブレザーにラベンダーのネクタイ。いつものミソラ。",
  },
  {
    id: "hoodie",
    name: "カピバラパーカー",
    price: 0,
    frame: 1,
    tag: "部活",
    desc: "ゲーム制作にぴったりの、ふわっとしたピンク。",
  },
  {
    id: "sport",
    name: "ピンクチームの体操服",
    price: 60,
    frame: 2,
    tag: "運動会",
    desc: "バトンをつなごう！ リレーの成功ゾーンが広がる。",
  },
  {
    id: "cafe",
    name: "文化祭カフェエプロン",
    price: 80,
    frame: 3,
    tag: "文化祭",
    desc: "クッキーの香りが似合う、かわいいお店の制服。",
  },
  {
    id: "casual",
    name: "放課後カーディガン",
    price: 60,
    frame: 4,
    tag: "おでかけ",
    desc: "ラベンダーとベージュのやさしいおしゃれ。",
  },
  {
    id: "winter",
    name: "雪の日のおでかけ",
    price: 80,
    frame: 5,
    tag: "冬",
    desc: "紺のコートとピンクのマフラーでぽかぽか。",
  },
];

const extraOutfits = [
  "青空の夏制服",
  "ワイン色のカーディガン",
  "白い部活ジャケット",
  "文化祭の王子さま",
  "カフェのベスト",
  "夏祭りの浴衣",
  "雨の日のコート",
  "森色のセーター",
  "文化祭ステージスーツ",
  "冬のダッフルコート",
  "図書室のベスト",
  "カピバラシェフ",
  "しましまパーカー",
  "白いコンサートスーツ",
];
extraOutfits.forEach((name, i) =>
  outfits.push({
    id: "extra-" + i,
    name,
    price: 0,
    frame: i < 9 ? i : i - 9,
    sheet: i < 9 ? "boys-extra-a" : "boys-extra-b",
    tag: "入学のお祝い",
    desc: "新しい学園生活を楽しむ、ミソラの特別な一着。",
  }),
);
export const friends = [
  {
    id: "haru",
    name: "ハル",
    frame: 6,
    role: "陸上部・元気な応援係",
    line: "ミソラ、今日は一緒に走ろう！ 勝っても負けても、最後までバトンをつなごうね。",
    reply: "いいね！ きみの応援があると、最後まで走れそう！",
  },
  {
    id: "yui",
    name: "ユイ",
    frame: 7,
    role: "美術部・カフェのデザイン係",
    line: "文化祭のメニュー、カピバラの形にしたんだ。一緒に看板も飾ってくれる？",
    reply: "ありがとう！ みんなの好きなものが集まるお店にしよう。",
  },
];

friends.push(
  {
    id: "ren",
    name: "レン",
    frame: 5,
    sheet: "boys-extra-b",
    role: "図書委員・静かな男の子",
    line: "調べものなら一緒に探そう。きみの好きな本も教えて。",
    reply: "一緒に考えると、新しい発見があるね。",
  },
  {
    id: "souta",
    name: "ソウタ",
    frame: 6,
    sheet: "boys-extra-b",
    role: "軽音部・音楽好きの男の子",
    line: "文化祭で演奏するんだ。どんな曲が好き？",
    reply: "ありがとう！ 次の曲は、きみが楽しめる曲にするよ。",
  },
  {
    id: "mio",
    name: "ミオ",
    frame: 7,
    sheet: "boys-extra-b",
    role: "おしゃれが大好きな女の子",
    line: "髪のピン、かわいいね！ 一緒にお店を見に行こう。",
    reply: "自分が好きだと思う服を選ぶのが、いちばん素敵だよ！",
  },
);
export const rivals = [
  {
    id: "rina",
    name: "リナ",
    frame: 8,
    sheet: "boys-extra-b",
    role: "文化祭のライバル・本当は優しい女の子",
    line: "私もミソラくんが気になるの。お互いの気持ちを大切に、文化祭を成功させましょう。",
  },
];
export function normalizeSchool(w) {
  if (w?.relations && typeof w.relations === "object") {
    for (const id of ["ren", "souta", "mio"])
      if (w.relations[id] === undefined) w.relations[id] = 0;
  }
  return w;
}
export const events = [
  {
    id: "club",
    name: "みんなでゲーム制作部",
    place: "放課後の部室",
    buddy: "yui",
    outfit: "hoodie",
    intro:
      "ユイが描いたゲームのコマンドを、ミソラと順番に覚えよう。4つの印が光った順番を押してね。",
    reply: "ユイ「動きがつながった！ これならみんなも遊べるね！」",
  },
  {
    id: "sports",
    name: "運動会・友情リレー",
    place: "学園のグラウンド",
    buddy: "haru",
    outfit: "sport",
    intro:
      "ハルからミソラへ、バトンをつなごう！ 印がピンクのゾーンに入ったら「バトンを渡す」。3回成功でゴール。体操服ならゾーンが広がるよ。",
    reply: "ハル「ゴール！ みんなの力を合わせた、最高のリレーだったね！」",
  },
  {
    id: "festival",
    name: "文化祭・カピバラカフェ",
    place: "文化祭の教室",
    buddy: "yui",
    outfit: "cafe",
    intro:
      "ユイが注文を聞いて、ミソラがお届け！ 注文と同じ品物を選んで、30秒以内に6人に届けよう。",
    reply: "ユイ「お客さん、みんな笑顔！ また一緒にお店を開こうね。」",
  },
];
export const freshSchool = () => ({
  coins: 120,
  owned: ["uniform", "hoodie"],
  equipped: "uniform",
  relations: { haru: 0, yui: 0, ren: 0, souta: 0, mio: 0 },
  completed: [],
  greeted: [],
  styled: [],
});
export function schoolReduce(state, a) {
  const s = structuredClone(state);
  s.school ??= freshSchool();
  const w = normalizeSchool(s.school);
  if (a.type === "school-buy") {
    const o = outfits.find((x) => x.id === a.id);
    if (!o) return state;
    if (!w.owned.includes(o.id)) {
      if (w.coins < o.price) return state;
      w.coins -= o.price;
      w.owned.push(o.id);
    }
    w.equipped = o.id;
  } else if (a.type === "school-greet") {
    if (!friends.some((f) => f.id === a.id)) return state;
    w.relations[a.id] = Math.min(10, w.relations[a.id] + 1);
    if (!w.greeted.includes(a.id)) {
      w.greeted.push(a.id);
      w.coins += 20;
    }
  } else if (a.type === "school-win") {
    const e = events.find((x) => x.id === a.id);
    if (!e) return state;
    if (!w.completed.includes(e.id)) {
      w.completed.push(e.id);
      w.coins += 80;
      w.relations[e.buddy] = Math.min(10, w.relations[e.buddy] + 2);
    }
    if (w.equipped === e.outfit && !w.styled.includes(e.id)) {
      w.styled.push(e.id);
      w.coins += 20;
    }
  } else return state;
  return s;
}
export function validSchool(w) {
  return (
    !!w &&
    Number.isInteger(w.coins) &&
    w.coins >= 0 &&
    w.coins <= 1000 &&
    Array.isArray(w.owned) &&
    w.owned.length <= 20 &&
    new Set(w.owned).size === w.owned.length &&
    w.owned.every((x) => outfits.some((o) => o.id === x)) &&
    w.owned.includes(w.equipped) &&
    !!w.relations &&
    friends.every(
      (f) =>
        Number.isInteger(w.relations[f.id]) &&
        w.relations[f.id] >= 0 &&
        w.relations[f.id] <= 10,
    ) &&
    ["completed", "styled", "greeted"].every(
      (k) =>
        Array.isArray(w[k]) &&
        w[k].length <= (k === "greeted" ? 5 : 3) &&
        new Set(w[k]).size === w[k].length &&
        w[k].every((id) =>
          (k === "greeted" ? friends : events).some((x) => x.id === id),
        ),
    ) &&
    w.styled.every((x) => w.completed.includes(x))
  );
}
