import {
  campaignReduce,
  validateCampaign,
  type CampaignAction,
} from "../campaign/engine";
import { CHAPTERS } from "../campaign/data";
import {
  CLUES,
  INITIAL_OUTFIT,
  INITIAL_OWNED,
  ITEMS,
  PEOPLE,
  SCENES,
  THEMES,
  getItem,
  HAIR_COLORS,
  EYE_COLORS,
  SKIN_COLORS,
} from "./data";
import type {
  GameState,
  Outfit,
  Difficulty,
  Tag,
  Person,
  Node,
  Slot,
} from "./types";
export const SAVE_KEY = "kirakira-princess-save-v1";
export const MAX_XP = 24500;
export const levelFor = (xp: number) => Math.min(50, Math.floor(xp / 500) + 1);
export const freshState = (): GameState => ({
  version: 1,
  started: false,
  node: "letter",
  coins: 120,
  xp: 0,
  owned: [...INITIAL_OWNED],
  equipped: { ...INITIAL_OUTFIT },
  hairColor: HAIR_COLORS[0],
  eyeColor: EYE_COLORS[0],
  skinColor: SKIN_COLORS[0],
  difficulty: "normal",
  relations: Object.fromEntries(
    Object.keys(PEOPLE).map((k) => [k, 0]),
  ) as Record<Person, number>,
  traits: { kind: 0, brave: 0, curious: 0 },
  choices: [],
  clues: [],
  claimed: [],
  achievements: [],
  chapterClear: false,
  battle: null,
  best: 0,
  themeIndex: 0,
  history: [],
  updatedAt: "",
});
export interface Score {
  total: number;
  theme: number;
  primary: number;
  secondary: number;
  harmony: number;
  paletteCount: number;
  tags: Record<Tag, number>;
}
export function scoreOutfit(outfit: Outfit, themeId: string): Score {
  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const items = Object.values(outfit).map(getItem);
  const tags: Record<Tag, number> = { cute: 0, elegant: 0, cool: 0, nature: 0 };
  const palettes: Record<string, number> = {};
  for (const item of items) {
    for (const t of Object.keys(tags) as Tag[]) tags[t] += item.tags[t];
    palettes[item.palette] = (palettes[item.palette] || 0) + 1;
  }
  const paletteCount = Math.max(...Object.values(palettes));
  const harmony =
    paletteCount === 4
      ? 12
      : paletteCount === 3
        ? 7
        : paletteCount === 2
          ? 3
          : 0;
  const primary = tags[theme.primary] * 3,
    secondary = tags[theme.secondary] * 2;
  return {
    total: primary + secondary + harmony,
    theme: primary + secondary,
    primary,
    secondary,
    harmony,
    paletteCount,
    tags,
  };
}
// Rival strategies have fully visible fixed component scores, never a random roll.
export function rivalFor(difficulty: Difficulty, themeId: string) {
  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const strategies = [
    {
      name: "初舞台のローズ",
      primary: 32,
      secondary: 8,
      harmony: 3,
      palette: "rose" as const,
      description: "好きな色を中心に。テーマは少しだけ意識。",
    },
    {
      name: "テーマ重視の装い",
      primary: 42,
      secondary: 16,
      harmony: 7,
      palette: theme.id === "garden" ? ("mint" as const) : ("navy" as const),
      description: "テーマの得意タグをそろえ、3点の配色も合わせる。",
    },
    {
      name: "セイラの完成コーデ",
      primary: 48,
      secondary: 16,
      harmony: 12,
      palette: theme.id === "garden" ? ("mint" as const) : ("navy" as const),
      description: "2つのテーマタグと全身の配色を計画して選ぶ。",
    },
  ];
  const available = strategies.slice(
    0,
    { normal: 1, hard: 2, expert: 3 }[difficulty],
  );
  const best = available.reduce((a, b) =>
    a.primary + a.secondary + a.harmony > b.primary + b.secondary + b.harmony
      ? a
      : b,
  );
  return { ...best, score: best.primary + best.secondary + best.harmony };
}
function grant(
  s: GameState,
  key: string,
  coins: number,
  xp: number,
  items: string[] = [],
) {
  if (s.claimed.includes(key)) return false;
  s.claimed.push(key);
  s.coins += coins;
  s.xp = Math.min(MAX_XP, s.xp + xp);
  for (const item of items) if (!s.owned.includes(item)) s.owned.push(item);
  return true;
}
function log(s: GameState, line: string) {
  s.history = [...s.history, line].slice(-35);
}
export type Action =
  | CampaignAction
  | { type: "START" }
  | {
      type: "APPEARANCE";
      key: "hairColor" | "eyeColor" | "skinColor";
      value: string;
    }
  | { type: "EQUIP"; id: string }
  | { type: "BUY"; id: string }
  | { type: "CHOICE"; id: string }
  | { type: "DIFFICULTY"; value: Difficulty }
  | { type: "THEME"; index: number }
  | { type: "BATTLE" }
  | { type: "CLEAR_RESULT" }
  | { type: "CLUE"; id: string }
  | { type: "SOLVE"; symbols: string[] }
  | { type: "REPLAY" };
export function reduce(state: GameState, action: Action): GameState {
  if (action.type.startsWith("CAMPAIGN_")) {
    const theme = CHAPTERS.find(
      (c) => c.number === (state.campaign?.chapter ?? 2),
    )!.theme;
    return campaignReduce(
      state,
      action as CampaignAction,
      scoreOutfit(state.equipped, theme).total,
    );
  }
  const s: GameState = structuredClone(state);
  switch (action.type) {
    case "START":
      if (s.started) return state;
      s.started = true;
      log(s, "金色の招待状を手に、学園へ。");
      break;
    case "APPEARANCE": {
      const allowed = {
        hairColor: HAIR_COLORS,
        eyeColor: EYE_COLORS,
        skinColor: SKIN_COLORS,
      }[action.key];
      if (!allowed.includes(action.value)) return state;
      s[action.key] = action.value;
      break;
    }
    case "EQUIP": {
      const item = ITEMS.find((i) => i.id === action.id);
      if (!item || !s.owned.includes(item.id)) return state;
      s.equipped[item.slot] = item.id;
      break;
    }
    case "BUY": {
      const item = ITEMS.find((i) => i.id === action.id);
      if (
        !item ||
        item.unlock ||
        s.owned.includes(item.id) ||
        s.coins < item.price
      )
        return state;
      s.coins -= item.price;
      s.owned.push(item.id);
      break;
    }
    case "CHOICE": {
      const scene = SCENES[s.node],
        choice = scene?.choices.find((c) => c.id === action.id);
      if (!s.started || !choice || s.choices.includes(choice.id)) return state;
      s.traits[choice.trait]++;
      if (choice.person) s.relations[choice.person] += 2;
      s.choices.push(choice.id);
      s.node = choice.next;
      log(s, choice.reply);
      if (s.node === "brief") {
        grant(s, "welcome", 30, 120);
        s.achievements = [...new Set([...s.achievements, "first-friends"])];
      }
      if (s.node === "complete") {
        s.chapterClear = true;
        grant(s, "chapter-1", 100, 300, ["dress-princess", "acc-crown"]);
        s.achievements = [...new Set([...s.achievements, "chapter-1"])];
      }
      break;
    }
    case "DIFFICULTY":
      s.difficulty = action.value;
      s.battle = null;
      break;
    case "THEME":
      if (!s.chapterClear || !THEMES[action.index]) return state;
      s.themeIndex = action.index;
      s.battle = null;
      break;
    case "BATTLE": {
      if (!s.started || !["brief", "complete"].includes(s.node)) return state;
      const theme = THEMES[s.themeIndex],
        score = scoreOutfit(s.equipped, theme.id).total,
        rival = rivalFor(s.difficulty, theme.id).score;
      const win = score >= rival;
      const rewarded = win
        ? grant(s, "battle-" + theme.id + "-" + s.difficulty, 40, 150)
        : false;
      s.best = Math.max(s.best, score);
      s.battle = {
        win,
        score,
        rivalScore: rival,
        themeId: theme.id,
        difficulty: s.difficulty,
        outfit: { ...s.equipped },
        rewarded,
      };
      if (win) {
        s.achievements = [
          ...new Set([
            ...s.achievements,
            "first-win",
            ...(s.difficulty === "expert" ? ["expert-win"] : []),
          ]),
        ];
        if (s.node === "brief") s.node = "festival";
      }
      log(
        s,
        win
          ? `歓迎祭で${score}点！ セイラに勝利した。`
          : `${score}点。セイラの${rival}点まで、あと${rival - score}点。`,
      );
      break;
    }
    case "CLEAR_RESULT":
      s.battle = null;
      break;
    case "CLUE": {
      if (
        !s.started ||
        !CLUES.some((c) => c.id === action.id) ||
        s.clues.includes(action.id)
      )
        return state;
      s.clues.push(action.id);
      grant(s, "clue-" + action.id, 10, 40);
      log(s, CLUES.find((c) => c.id === action.id)!.text);
      break;
    }
    case "SOLVE":
      if (s.clues.length < 2 || action.symbols.join(",") !== "☾,✿,✦")
        return state;
      if (grant(s, "mystery", 30, 150, ["dress-secret"])) {
        s.achievements = [...new Set([...s.achievements, "mystery"])];
        log(s, "月、花、星。温室の扉が開き、秘密のドレスを見つけた。");
      }
      break;
    case "REPLAY":
      if (!s.chapterClear || s.campaign) return state;
      s.node = "letter";
      s.chapterClear = false;
      s.themeIndex = 0;
      s.choices = [];
      s.battle = null;
      s.relations = freshState().relations;
      s.traits = freshState().traits;
      log(s, "コレクションを持って、もう一度第1章へ。");
      break;
  }
  s.updatedAt = new Date().toISOString();
  return s;
}
const strings = (v: unknown, max: number): v is string[] =>
  Array.isArray(v) &&
  v.length <= max &&
  v.every((x) => typeof x === "string" && x.length < 1000) &&
  new Set(v).size === v.length;
const int = (v: unknown, max: number) =>
  typeof v === "number" && Number.isSafeInteger(v) && v >= 0 && v <= max;
function validOutfit(v: unknown, owned: string[]): v is Outfit {
  if (!v || typeof v !== "object") return false;
  const o = v as Outfit;
  return (["hair", "outfit", "shoes", "accessory"] as Slot[]).every(
    (slot) =>
      owned.includes(o[slot]) &&
      ITEMS.some((i) => i.id === o[slot] && i.slot === slot),
  );
}
export function parseSave(raw: string): GameState {
  if (raw.length > 150000) throw Error("セーブのサイズが大きすぎます。");
  const s = JSON.parse(raw) as GameState;
  if (!s || s.version !== 1) throw Error("対応していないセーブ形式です。");
  const nodes: Node[] = [
    "letter",
    "gate",
    "welcome",
    "invite",
    "brief",
    "festival",
    "epilogue",
    "complete",
  ];
  if (
    typeof s.started !== "boolean" ||
    !nodes.includes(s.node) ||
    !int(s.coins, 10000000) ||
    !int(s.xp, MAX_XP) ||
    !int(s.best, 1000) ||
    !strings(s.owned, ITEMS.length) ||
    !s.owned.every((id) => ITEMS.some((i) => i.id === id)) ||
    !INITIAL_OWNED.every((id) => s.owned.includes(id)) ||
    !validOutfit(s.equipped, s.owned)
  )
    throw Error("衣装または成長データが正しくありません。");
  if (
    !HAIR_COLORS.includes(s.hairColor) ||
    !EYE_COLORS.includes(s.eyeColor) ||
    !SKIN_COLORS.includes(s.skinColor) ||
    !["normal", "hard", "expert"].includes(s.difficulty) ||
    !int(s.themeIndex, THEMES.length - 1) ||
    typeof s.chapterClear !== "boolean"
  )
    throw Error("設定データが正しくありません。");
  for (const p of Object.keys(PEOPLE) as Person[])
    if (!s.relations || !int(s.relations[p], 100))
      throw Error("関係データが正しくありません。");
  for (const t of ["kind", "brave", "curious"] as const)
    if (!s.traits || !int(s.traits[t], 100))
      throw Error("性格データが正しくありません。");
  if (
    !strings(s.choices, 30) ||
    !s.choices.every((id) =>
      Object.values(SCENES).some((scene) =>
        scene.choices.some((c) => c.id === id),
      ),
    ) ||
    !strings(s.clues, 2) ||
    !s.clues.every((id) => CLUES.some((c) => c.id === id)) ||
    !strings(s.claimed, 100) ||
    !strings(s.achievements, 50) ||
    !Array.isArray(s.history) ||
    s.history.length > 35 ||
    !s.history.every((x) => typeof x === "string" && x.length < 1000) ||
    typeof s.updatedAt !== "string" ||
    s.updatedAt.length > 40
  )
    throw Error("進行データが正しくありません。");
  if (s.chapterClear !== (s.node === "complete"))
    throw Error("章の進行が一致しません。");
  if (s.battle !== null) {
    const b = s.battle;
    if (
      !b ||
      typeof b.win !== "boolean" ||
      typeof b.rewarded !== "boolean" ||
      !int(b.score, 1000) ||
      !int(b.rivalScore, 1000) ||
      !THEMES.some((t) => t.id === b.themeId) ||
      !["normal", "hard", "expert"].includes(b.difficulty) ||
      !validOutfit(b.outfit, s.owned)
    )
      throw Error("対戦データが正しくありません。");
    if (
      scoreOutfit(b.outfit, b.themeId).total !== b.score ||
      rivalFor(b.difficulty, b.themeId).score !== b.rivalScore ||
      b.win !== b.score >= b.rivalScore
    )
      throw Error("対戦の採点が一致しません。");
  }
  if (
    s.campaign !== undefined &&
    (!s.chapterClear || !validateCampaign(s.campaign))
  )
    throw Error("続きの物語のデータが正しくありません。");
  return s;
}
export type LoadedSave =
  | { kind: "empty" }
  | { kind: "ok"; state: GameState }
  | { kind: "invalid"; raw: string }
  | { kind: "unavailable" };
export function loadSave(storage: Pick<Storage, "getItem">): LoadedSave {
  let raw: string | null;
  try {
    raw = storage.getItem(SAVE_KEY);
  } catch {
    return { kind: "unavailable" };
  }
  if (raw === null) return { kind: "empty" };
  try {
    return { kind: "ok", state: parseSave(raw) };
  } catch {
    return { kind: "invalid", raw };
  }
}
