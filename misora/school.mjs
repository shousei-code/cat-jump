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
  relations: { haru: 0, yui: 0 },
  completed: [],
  greeted: [],
  styled: [],
});
export function schoolReduce(state, a) {
  const s = structuredClone(state);
  s.school ??= freshSchool();
  const w = s.school;
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
    w.owned.length <= 6 &&
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
        w[k].length <= (k === "greeted" ? 2 : 3) &&
        new Set(w[k]).size === w[k].length &&
        w[k].every((id) =>
          (k === "greeted" ? friends : events).some((x) => x.id === id),
        ),
    ) &&
    w.styled.every((x) => w.completed.includes(x))
  );
}
