import type { Item, Palette, Person, Scene, Slot, Tag, Outfit } from "./types";
export const TAGS: Record<Tag, string> = {
  cute: "キュート",
  elegant: "エレガント",
  cool: "クール",
  nature: "ナチュラル",
};
export const SLOTS: Record<Slot, string> = {
  hair: "ヘア",
  outfit: "お洋服",
  shoes: "シューズ",
  accessory: "アクセサリー",
};
export const PALETTES: Record<Palette, { name: string; color: string }> = {
  rose: { name: "ローズ", color: "#d995b4" },
  lavender: { name: "ラベンダー", color: "#ad9bcf" },
  mint: { name: "ミント", color: "#92bcad" },
  navy: { name: "ネイビー", color: "#657895" },
  gold: { name: "ゴールド", color: "#d9b76d" },
  ivory: { name: "アイボリー", color: "#eadcc5" },
};
const cute = { cute: 4, elegant: 1, cool: 0, nature: 3 };
const cool = { cute: 0, elegant: 4, cool: 3, nature: 1 };
const balanced = { cute: 2, elegant: 2, cool: 2, nature: 2 };
const item = (
  id: string,
  name: string,
  slot: Slot,
  palette: Palette,
  tags: Record<Tag, number>,
  shape: number,
  price = 0,
  rarity: Item["rarity"] = "basic",
  unlock?: Item["unlock"],
): Item => ({
  id,
  name,
  slot,
  palette,
  tags,
  shape,
  price,
  rarity,
  unlock,
  description: `${PALETTES[palette].name}の${slot === "hair" ? "ヘアアレンジ" : slot === "outfit" ? "装い" : slot === "shoes" ? "一足" : "小さなきらめき"}。${
    Object.entries(tags)
      .filter(([, n]) => n >= 3)
      .map(([t]) => TAGS[t as Tag])
      .join("と") || "バランス"
  }が得意。`,
});
export const ITEMS: Item[] = [
  item("hair-bob", "放課後ボブ", "hair", "ivory", balanced, 0),
  item("hair-twin", "花びらツイン", "hair", "mint", cute, 1),
  item("hair-long", "月あかりロング", "hair", "navy", cool, 2),
  item(
    "hair-braid",
    "図書室の三つ編み",
    "hair",
    "rose",
    { cute: 3, elegant: 2, cool: 1, nature: 4 },
    3,
  ),
  item(
    "hair-pony",
    "風のポニーテール",
    "hair",
    "gold",
    { cute: 2, elegant: 2, cool: 4, nature: 3 },
    4,
    65,
  ),
  item(
    "hair-wave",
    "夢色ウェーブ",
    "hair",
    "lavender",
    { cute: 3, elegant: 4, cool: 2, nature: 1 },
    5,
    80,
  ),
  item(
    "dress-uniform",
    "桜坂の制服",
    "outfit",
    "navy",
    { cute: 1, elegant: 3, cool: 3, nature: 1 },
    0,
  ),
  item("dress-mint", "ミント・ピクニック", "outfit", "mint", cute, 1),
  item("dress-moon", "ミッドナイト・リボン", "outfit", "navy", cool, 2),
  item(
    "dress-rose",
    "ローズのワンピース",
    "outfit",
    "rose",
    { cute: 4, elegant: 3, cool: 0, nature: 1 },
    1,
  ),
  item("dress-cardigan", "放課後カーディガン", "outfit", "ivory", balanced, 3),
  item(
    "dress-sailor",
    "海風セーラー",
    "outfit",
    "lavender",
    { cute: 3, elegant: 2, cool: 3, nature: 1 },
    0,
    70,
  ),
  item(
    "dress-flower",
    "フラワー・バルーン",
    "outfit",
    "rose",
    { cute: 4, elegant: 2, cool: 0, nature: 3 },
    4,
    90,
  ),
  item(
    "dress-coat",
    "図書委員のコート",
    "outfit",
    "navy",
    { cute: 1, elegant: 4, cool: 3, nature: 2 },
    5,
    100,
  ),
  item(
    "dress-princess",
    "星冠のプリンセス",
    "outfit",
    "gold",
    { cute: 3, elegant: 5, cool: 2, nature: 1 },
    2,
    0,
    "rare",
    "chapter",
  ),
  item(
    "dress-secret",
    "秘密の温室ドレス",
    "outfit",
    "mint",
    { cute: 4, elegant: 2, cool: 1, nature: 4 },
    4,
    0,
    "secret",
    "mystery",
  ),
  item("shoes-basic", "はじめてのローファー", "shoes", "navy", balanced, 0),
  item("shoes-mint", "若葉のストラップ", "shoes", "mint", cute, 1),
  item("shoes-night", "夜空のショートブーツ", "shoes", "navy", cool, 2),
  item(
    "shoes-rose",
    "いちごのバレエシューズ",
    "shoes",
    "rose",
    { cute: 4, elegant: 2, cool: 0, nature: 2 },
    1,
  ),
  item(
    "shoes-pearl",
    "真珠のパンプス",
    "shoes",
    "ivory",
    { cute: 1, elegant: 4, cool: 2, nature: 2 },
    3,
    55,
  ),
  item(
    "shoes-star",
    "星くずのブーツ",
    "shoes",
    "gold",
    { cute: 2, elegant: 3, cool: 4, nature: 1 },
    2,
    70,
  ),
  item("acc-ribbon", "入学のリボン", "accessory", "rose", balanced, 0),
  item("acc-clover", "四つ葉の髪飾り", "accessory", "mint", cute, 1),
  item("acc-moon", "月のブローチ", "accessory", "navy", cool, 2),
  item(
    "acc-flower",
    "小さな花冠",
    "accessory",
    "rose",
    { cute: 3, elegant: 2, cool: 0, nature: 4 },
    3,
  ),
  item(
    "acc-pearl",
    "図書室のベレー",
    "accessory",
    "ivory",
    { cute: 2, elegant: 3, cool: 2, nature: 3 },
    4,
    45,
  ),
  item(
    "acc-star",
    "スター・イヤリング",
    "accessory",
    "gold",
    { cute: 2, elegant: 3, cool: 4, nature: 1 },
    5,
    60,
  ),
  item(
    "acc-lace",
    "夢色ヘッドドレス",
    "accessory",
    "lavender",
    { cute: 4, elegant: 3, cool: 0, nature: 1 },
    6,
    75,
  ),
  item(
    "acc-crown",
    "はじまりのティアラ",
    "accessory",
    "gold",
    { cute: 3, elegant: 4, cool: 3, nature: 0 },
    7,
    0,
    "rare",
    "chapter",
  ),
];
// 30 original designs plus 72 explicitly labeled color editions (102 collectibles).
const editions: { name: string; palette: Palette; filter: string }[] = [
  {
    name: "桜色",
    palette: "rose",
    filter: "hue-rotate(315deg) saturate(1.15)",
  },
  {
    name: "月紫",
    palette: "lavender",
    filter: "hue-rotate(260deg) saturate(.8)",
  },
  { name: "新緑", palette: "mint", filter: "hue-rotate(100deg) saturate(.8)" },
  {
    name: "星金",
    palette: "gold",
    filter: "hue-rotate(25deg) brightness(1.1)",
  },
  {
    name: "夜空",
    palette: "navy",
    filter: "hue-rotate(200deg) brightness(.8)",
  },
  { name: "雪白", palette: "ivory", filter: "saturate(.15) brightness(1.25)" },
];
for (const base of [...ITEMS].filter(
  (i) => i.slot === "hair" || i.slot === "accessory",
)) {
  for (const [n, edition] of editions
    .slice(0, base.slot === "hair" ? 4 : 6)
    .entries()) {
    ITEMS.push({
      ...base,
      id: base.id + "-edition-" + n,
      name: edition.name + "・" + base.name,
      palette: edition.palette,
      price: 40,
      unlock: undefined,
      rarity: "rare",
      tint: edition.filter,
      description:
        edition.name +
        "の色違いコレクション。原画の形を保ち、髪または装飾だけを染めた限定カラー。",
    });
  }
}
export const INITIAL_OWNED = ITEMS.filter((i) => !i.price && !i.unlock).map(
  (i) => i.id,
);
export const INITIAL_OUTFIT: Outfit = {
  hair: "hair-long",
  outfit: "dress-uniform",
  shoes: "shoes-basic",
  accessory: "acc-ribbon",
};
export const getItem = (id: string) => ITEMS.find((i) => i.id === id)!;
export const PEOPLE: Record<
  Person,
  {
    name: string;
    role: string;
    quote: string;
    portrait: number | null;
    color: string;
  }
> = {
  haruto: {
    name: "ハルト",
    role: "陽だまりの人気者",
    quote: "失敗したら、もう一回やってみようぜ！",
    portrait: 2,
    color: "#bf997c",
  },
  ren: {
    name: "レン",
    role: "静かな秀才",
    quote: "理由が分かれば、次の一歩が見えてくる。",
    portrait: 0,
    color: "#7d8ca6",
  },
  aoi: {
    name: "アオイ",
    role: "秘密を知る案内人",
    quote: "学園には、まだ知らない景色があるよ。",
    portrait: 3,
    color: "#a08eaf",
  },
  kaito: {
    name: "カイト",
    role: "気高きライバル",
    quote: "君が本気なら、僕も本気で応えよう。",
    portrait: 4,
    color: "#8899a2",
  },
  mio: {
    name: "ミオ",
    role: "ことちゃんの親友",
    quote: "好きな服で、自分らしく！",
    portrait: null,
    color: "#d29bb2",
  },
  yui: {
    name: "ユイ",
    role: "衣装づくりの名人",
    quote: "小さな色の違いで、世界は変わるよ。",
    portrait: null,
    color: "#a8bdb0",
  },
  seira: {
    name: "セイラ",
    role: "ランウェイの実力者",
    quote: "運じゃなく、工夫で勝負しましょう。",
    portrait: null,
    color: "#b29bc5",
  },
};
export const THEMES = [
  {
    id: "garden",
    name: "春風のガーデンパーティー",
    subtitle: "新しい友達を迎える、やさしい春の装い。",
    primary: "cute" as Tag,
    secondary: "nature" as Tag,
    icon: "✿",
  },
  {
    id: "moon",
    name: "月あかりの図書室",
    subtitle: "本の世界に似合う、凛とした夜の装い。",
    primary: "elegant" as Tag,
    secondary: "cool" as Tag,
    icon: "☾",
  },
];
export const HAIR_COLORS = [
  "#8a5663",
  "#624e61",
  "#d6a65e",
  "#b880a7",
  "#8580b7",
];
export const EYE_COLORS = ["#8b659d", "#658b93", "#a97f4a", "#57718e"];
export const SKIN_COLORS = ["#ffe2cd", "#ecc4a5", "#c58d6d"];
export const SCENES: Record<string, Scene> = {
  letter: {
    id: "letter",
    location: "ことちゃんの部屋",
    speaker: "narrator",
    title: "一通の、金色の招待状。",
    text: "「ようこそ、キラキラ学園へ。」\n封筒には、小さな王冠の紋章。夢中になれることを見つけた人だけが、その扉を開けられるという。\nことちゃんは、お気に入りの服をそっと取り出した。",
    choices: [
      {
        id: "letter-kind",
        label: "誰かと一緒に、楽しい思い出を作りたい",
        hint: "やさしさ ＋1",
        trait: "kind",
        next: "gate",
        reply: "誰かの笑顔が、自分の勇気にもなる気がした。",
      },
      {
        id: "letter-brave",
        label: "まだ知らない自分に、挑戦してみたい",
        hint: "勇気 ＋1",
        trait: "brave",
        next: "gate",
        reply: "緊張も、期待も。ぜんぶ連れて行こう。",
      },
    ],
  },
  gate: {
    id: "gate",
    location: "桜の校門",
    speaker: "haruto",
    title: "桜の向こうの、新しい友達。",
    text: "「ことちゃん、だよな？ ミオから聞いた！ 俺はハルト。」\n駆けてきた男の子が、ふっと笑う。\n「入学式、ちょっと迷うよね。一緒に行こうぜ！」",
    choices: [
      {
        id: "gate-haruto",
        label: "ありがとう！ 一緒に行こう",
        hint: "ハルト ＋2・勇気 ＋1",
        trait: "brave",
        person: "haruto",
        next: "welcome",
        reply: "ハルト「よし！ 今日を楽しい日にしような。」",
      },
      {
        id: "gate-ren",
        label: "校内図を見ていたレンにも声をかける",
        hint: "レン ＋2・知りたさ ＋1",
        trait: "curious",
        person: "ren",
        next: "welcome",
        reply: "レン「講堂はこちら。……みんなで行くのも、悪くないね。」",
      },
      {
        id: "gate-aoi",
        label: "落ちた花びらを拾っていた子に手を貸す",
        hint: "アオイ ＋2・やさしさ ＋1",
        trait: "kind",
        person: "aoi",
        next: "welcome",
        reply: "アオイ「ありがとう。この花びら、学園の秘密を知っているかも。」",
      },
    ],
  },
  welcome: {
    id: "welcome",
    location: "1年A組・教室",
    speaker: "mio",
    title: "おそろいじゃなくても、仲間。",
    text: "「ことちゃん！ 隣の席、空いてるよ。」\n親友のミオと、針仕事が得意なユイ。\n「今日は歓迎ファッションコンテストなの。お気に入りの組み合わせ、見つけてみよう！」",
    choices: [
      {
        id: "welcome-mio",
        label: "ミオと、お互いに似合う色を探す",
        hint: "ミオ ＋2・やさしさ ＋1",
        trait: "kind",
        person: "mio",
        next: "invite",
        reply: "ミオ「ことちゃんが選ぶ色、わたしも好き！」",
      },
      {
        id: "welcome-yui",
        label: "ユイに、衣装の組み合わせ方を聞く",
        hint: "ユイ ＋2・知りたさ ＋1",
        trait: "curious",
        person: "yui",
        next: "invite",
        reply:
          "ユイ「テーマのタグと色を見てね。高い服なら勝てる、じゃないんだよ。」",
      },
    ],
  },
  invite: {
    id: "invite",
    location: "白薔薇の回廊",
    speaker: "kaito",
    title: "ライバルからの招待。",
    text: "「君が、新入生のことちゃん？」\nカイトが、一枚のカードを差し出した。\n「今日の相手はセイラ。経験はあるけれど、勝負は衣装の工夫で決まる。君の本気を見せて。」",
    choices: [
      {
        id: "invite-kaito",
        label: "本気で挑戦します！",
        hint: "カイト ＋2・勇気 ＋1",
        trait: "brave",
        person: "kaito",
        next: "brief",
        reply:
          "カイト「その目、いいね。結果だけじゃなく、君の工夫を見ているよ。」",
      },
      {
        id: "invite-seira",
        label: "セイラにも、よろしくと挨拶する",
        hint: "セイラ ＋2・やさしさ ＋1",
        trait: "kind",
        person: "seira",
        next: "brief",
        reply:
          "セイラ「気持ちのいい挨拶ね。お互いに、納得できる勝負にしましょう。」",
      },
    ],
  },
  festival: {
    id: "festival",
    location: "歓迎祭のランウェイ",
    speaker: "seira",
    title: "きみだけの、きらめき。",
    text: "「おめでとう、ことちゃん。」\nセイラが拍手をしてくれた。\n「テーマを読み、自分で考えて選んだ衣装ね。次は、もっと強いライバルとして会いましょう。」",
    choices: [
      {
        id: "festival-thanks",
        label: "みんなのアドバイスのおかげだよ",
        hint: "ミオ ＋2・やさしさ ＋1",
        trait: "kind",
        person: "mio",
        next: "epilogue",
        reply: "ミオ「最後に選んで歩いたのは、ことちゃんだよ！」",
      },
      {
        id: "festival-challenge",
        label: "また一緒に、本気で勝負したい",
        hint: "セイラ ＋2・勇気 ＋1",
        trait: "brave",
        person: "seira",
        next: "epilogue",
        reply: "セイラ「ええ。工夫する楽しさ、これからも分かち合いましょう。」",
      },
    ],
  },
  epilogue: {
    id: "epilogue",
    location: "夕暮れの学園",
    speaker: "aoi",
    title: "王冠の紋章が、ひとつ光る。",
    text: "「素敵な一日になったね。」\nアオイの視線の先で、招待状の王冠が淡く光った。\n「学園の温室には、まだ開かない扉がある。手がかりを見つけたら、君にも分かるかもしれない。」",
    choices: [
      {
        id: "epilogue-promise",
        label: "みんなと、次の秘密も見つけたい",
        hint: "アオイ ＋2・知りたさ ＋1",
        trait: "curious",
        person: "aoi",
        next: "complete",
        reply: "ことちゃんの学園生活は、ここからはじまる。",
      },
    ],
  },
};
export const CLUES = [
  {
    id: "fountain",
    name: "噴水の手がかり",
    place: "中庭",
    text: "石の王冠に刻まれた文字。「はじまりは、夜を照らすもの」",
    symbol: "☾",
  },
  {
    id: "library",
    name: "古い本の手がかり",
    place: "図書室",
    text: "しおりには「月のあとに、花が咲く。最後に、小さな星がまたたく」",
    symbol: "✿",
  },
];
