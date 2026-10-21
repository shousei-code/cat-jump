import type { GameState, Person } from "../game/types";
import {
  CHAPTERS,
  ENDINGS,
  beatsFor,
  type CampaignDifficulty,
  type ChallengeKind,
  type Route,
} from "./data";
export interface CampaignState {
  chapter: number;
  beat: number;
  phase: "story" | "challenge" | "clear" | "ending";
  route: Route | null;
  difficulty: CampaignDifficulty;
  choices: string[];
  records: Record<string, number>;
  endings: (Route | "true")[];
  ending: Route | "true" | null;
  cleared: number[];
}
export const freshCampaign = (): CampaignState => ({
  chapter: 2,
  beat: 0,
  phase: "story",
  route: null,
  difficulty: "normal",
  choices: [],
  records: {},
  endings: [],
  ending: null,
  cleared: [],
});
export type CampaignAction =
  | { type: "CAMPAIGN_START" }
  | { type: "CAMPAIGN_CHOICE"; index: number }
  | { type: "CAMPAIGN_NEXT" }
  | { type: "CAMPAIGN_ROUTE"; route: Route }
  | { type: "CAMPAIGN_DIFFICULTY"; value: CampaignDifficulty }
  | {
      type: "CAMPAIGN_RESULT";
      kind: ChallengeKind;
      score: number;
      practice: boolean;
    }
  | { type: "CAMPAIGN_REPLAY" }
  | { type: "CAMPAIGN_TRUE" };
export const threshold = (d: CampaignDifficulty) =>
  ({ normal: 55, hard: 70, expert: 85, secret: 95 })[d];
export function trueConditions(s: GameState) {
  const c = s.campaign;
  return [
    { label: "いずれかのエンディングを見る", done: !!c?.endings.length },
    { label: "学園の温室の謎を解く", done: s.claimed.includes("mystery") },
    {
      label: "ハード以上のリズム・記憶・時間制限に合格する",
      done: (["rhythm", "memory", "mission"] as const).every((k) =>
        ["hard", "expert", "secret"].some(
          (d) =>
            (c?.records[k + ":" + d] ?? 0) >=
            threshold(d as CampaignDifficulty),
        ),
      ),
    },
    {
      label: "ミオ・ユイ・セイラとそれぞれ仲良くなる（関係2以上）",
      done: (["mio", "yui", "seira"] as Person[]).every(
        (p) => s.relations[p] >= 2,
      ),
    },
  ];
}
export function campaignReduce(
  state: GameState,
  a: CampaignAction,
  fashionScore: number,
): GameState {
  if (!state.chapterClear) return state;
  const s = structuredClone(state);
  const c = s.campaign ?? freshCampaign();
  s.campaign = c;
  const chapter = CHAPTERS.find((x) => x.number === c.chapter)!;
  const grant = (key: string, coins: number, xp: number) => {
    if (s.claimed.includes(key)) return;
    s.claimed.push(key);
    s.coins += coins;
    s.xp = Math.min(24500, s.xp + xp);
  };
  switch (a.type) {
    case "CAMPAIGN_START":
      if (state.campaign) return state;
      s.battle = null;
      break;
    case "CAMPAIGN_DIFFICULTY":
      if (
        !["normal", "hard", "expert", "secret"].includes(a.value) ||
        (a.value === "secret" && !c.endings.length)
      )
        return state;
      c.difficulty = a.value;
      break;
    case "CAMPAIGN_CHOICE": {
      if (c.phase !== "story" || (c.chapter === 9 && !c.route)) return state;
      const beat = beatsFor(chapter, c.route)[c.beat],
        choice = beat?.options[a.index];
      if (!choice) return state;
      const key = `${c.chapter}:${c.beat}`;
      if (c.choices.includes(key)) return state;
      c.choices.push(key);
      const person =
        choice.person ??
        (c.chapter >= 9 && c.route !== "friendship" ? c.route : null);
      if (person) s.relations[person] = Math.min(100, s.relations[person] + 2);
      s.traits[choice.trait] = Math.min(100, s.traits[choice.trait] + 1);
      s.history = [...s.history, choice.reply].slice(-35);
      if (c.beat === chapter.beats.length - 1) c.phase = "challenge";
      else c.beat++;
      break;
    }
    case "CAMPAIGN_ROUTE":
      if (
        c.chapter !== 9 ||
        c.phase !== "story" ||
        c.route ||
        !["haruto", "ren", "aoi", "kaito", "friendship"].includes(a.route)
      )
        return state;
      c.route = a.route;
      break;
    case "CAMPAIGN_RESULT": {
      if (
        !["fashion", "rhythm", "memory", "puzzle", "mission"].includes(
          a.kind,
        ) ||
        !Number.isInteger(a.score) ||
        a.score < 0 ||
        a.score > 100
      )
        return state;
      if (!a.practice && (c.phase !== "challenge" || a.kind !== chapter.kind))
        return state;
      const score =
        a.kind === "fashion"
          ? Math.min(100, Math.round((fashionScore / 80) * 100))
          : a.score;
      const key = a.kind + ":" + c.difficulty;
      c.records[key] = Math.max(c.records[key] ?? 0, score);
      if (score < threshold(c.difficulty)) break;
      grant("trial-" + key, 180, 600);
      s.achievements = [...new Set([...s.achievements, "trial-" + a.kind])];
      if (!a.practice) {
        grant("chapter-" + c.chapter, 150, 1200);
        c.cleared = [...new Set([...c.cleared, c.chapter])];
        if (c.chapter === 12) {
          if (!c.route) return state;
          c.phase = "ending";
          c.ending = c.route;
          c.endings = [...new Set([...c.endings, c.route])];
          s.achievements = [...new Set([...s.achievements, "story-complete"])];
        } else c.phase = "clear";
      }
      break;
    }
    case "CAMPAIGN_NEXT":
      if (c.phase !== "clear" || c.chapter >= 12) return state;
      c.chapter++;
      c.beat = 0;
      c.phase = "story";
      break;
    case "CAMPAIGN_REPLAY":
      if (!c.endings.length) return state;
      s.campaign = {
        ...freshCampaign(),
        records: c.records,
        endings: c.endings,
        cleared: c.cleared,
      };
      s.battle = null;
      break;
    case "CAMPAIGN_TRUE":
      if (!trueConditions(s).every((x) => x.done)) return state;
      c.endings = [...new Set([...c.endings, "true" as const])];
      c.ending = "true";
      c.phase = "ending";
      grant("true-ending", 300, 1000);
      s.achievements = [...new Set([...s.achievements, "true-ending"])];
      break;
  }
  s.updatedAt = new Date().toISOString();
  return s;
}
export function validateCampaign(value: unknown): value is CampaignState {
  if (!value || typeof value !== "object") return false;
  const c = value as CampaignState;
  const arr = (x: unknown, max: number) =>
    Array.isArray(x) && x.length <= max && new Set(x).size === x.length;
  if (
    !Number.isInteger(c.chapter) ||
    c.chapter < 2 ||
    c.chapter > 12 ||
    !Number.isInteger(c.beat) ||
    c.beat < 0 ||
    c.beat > 2 ||
    !["story", "challenge", "clear", "ending"].includes(c.phase) ||
    !["normal", "hard", "expert", "secret"].includes(c.difficulty)
  )
    return false;
  if (
    c.route !== null &&
    !["haruto", "ren", "aoi", "kaito", "friendship"].includes(c.route)
  )
    return false;
  if (
    !arr(c.endings, 6) ||
    !c.endings.every((e) => Object.hasOwn(ENDINGS, e)) ||
    (c.ending !== null && !c.endings.includes(c.ending)) ||
    (c.difficulty === "secret" && !c.endings.length)
  )
    return false;
  if (
    !arr(c.choices, 33) ||
    !c.choices.every(
      (k) => typeof k === "string" && /^(?:[2-9]|1[012]):[012]$/.test(k),
    )
  )
    return false;
  if (
    !arr(c.cleared, 11) ||
    !c.cleared.every((n) => Number.isInteger(n) && n >= 2 && n <= 12)
  )
    return false;
  if (
    !c.records ||
    typeof c.records !== "object" ||
    Array.isArray(c.records) ||
    Object.keys(c.records).length > 20 ||
    !Object.entries(c.records).every(
      ([k, v]) =>
        /^(fashion|rhythm|memory|puzzle|mission):(normal|hard|expert|secret)$/.test(
          k,
        ) &&
        Number.isInteger(v) &&
        v >= 0 &&
        v <= 100,
    )
  )
    return false;
  if (
    c.chapter >= 9 &&
    !(c.phase === "ending" && c.ending === "true") &&
    !(c.chapter === 9 && c.phase === "story" && c.beat === 0) &&
    !c.route
  )
    return false;
  if (
    (c.phase === "ending" && !c.ending) ||
    (c.phase === "clear" && !c.cleared.includes(c.chapter))
  )
    return false;
  return true;
}
