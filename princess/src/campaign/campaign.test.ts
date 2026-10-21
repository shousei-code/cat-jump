import { describe, it, expect } from "vitest";
import { freshState, reduce, parseSave, levelFor } from "../game/engine";
import { ITEMS } from "../game/data";
import { CHAPTERS, ENDINGS, type Route, type CampaignDifficulty } from "./data";
import { trueConditions } from "./engine";
import type { GameState } from "../game/types";
function firstChapter() {
  let s = freshState();
  s = reduce(s, { type: "START" });
  for (const id of [
    "letter-kind",
    "gate-haruto",
    "welcome-mio",
    "invite-kaito",
  ])
    s = reduce(s, { type: "CHOICE", id });
  for (const id of ["hair-twin", "dress-mint", "shoes-mint", "acc-clover"])
    s = reduce(s, { type: "EQUIP", id });
  s = reduce(s, { type: "BATTLE" });
  for (const id of ["festival-thanks", "epilogue-promise"])
    s = reduce(s, { type: "CHOICE", id });
  return s;
}
function complete(s: GameState, route: Route) {
  if (!s.campaign) s = reduce(s, { type: "CAMPAIGN_START" });
  for (const chapter of CHAPTERS) {
    if (chapter.number === 9) s = reduce(s, { type: "CAMPAIGN_ROUTE", route });
    for (let i = 0; i < 3; i++)
      s = reduce(s, { type: "CAMPAIGN_CHOICE", index: 0 });
    expect(s.campaign!.phase).toBe("challenge");
    s = parseSave(JSON.stringify(s));
    const outfit =
      chapter.theme === "garden"
        ? ["hair-twin", "dress-mint", "shoes-mint", "acc-clover"]
        : ["hair-long", "dress-moon", "shoes-night", "acc-moon"];
    for (const id of outfit) s = reduce(s, { type: "EQUIP", id });
    s = reduce(s, {
      type: "CAMPAIGN_RESULT",
      kind: chapter.kind,
      score: 100,
      practice: false,
    });
    expect(s.campaign!.phase).toBe(chapter.number === 12 ? "ending" : "clear");
    s = parseSave(JSON.stringify(s));
    if (chapter.number < 12) s = reduce(s, { type: "CAMPAIGN_NEXT" });
  }
  return s;
}
describe("complete academy story", () => {
  it("preserves an old chapter-one save and reaches each of the five route endings", () => {
    for (const route of [
      "haruto",
      "ren",
      "aoi",
      "kaito",
      "friendship",
    ] as Route[]) {
      const old = firstChapter();
      expect(parseSave(JSON.stringify(old))).toEqual(old);
      const s = complete(old, route);
      expect(s.campaign!.ending).toBe(route);
      expect(s.campaign!.cleared).toHaveLength(11);
      expect(s.campaign!.choices).toHaveLength(33);
      expect(ENDINGS[route].text.length).toBeGreaterThan(70);
    }
  });
  it("rejects skipped chapters, premature secret difficulty, wrong challenges, and duplicate rewards", () => {
    let s = reduce(firstChapter(), { type: "CAMPAIGN_START" });
    expect(reduce(s, { type: "CAMPAIGN_NEXT" })).toEqual(s);
    expect(reduce(s, { type: "CAMPAIGN_DIFFICULTY", value: "secret" })).toEqual(
      s,
    );
    expect(
      reduce(s, {
        type: "CAMPAIGN_RESULT",
        kind: "memory",
        score: 100,
        practice: false,
      }),
    ).toEqual(s);
    for (let i = 0; i < 3; i++)
      s = reduce(s, { type: "CAMPAIGN_CHOICE", index: 0 });
    const before = structuredClone(s);
    s = reduce(s, {
      type: "CAMPAIGN_RESULT",
      kind: "memory",
      score: 0,
      practice: false,
    });
    expect(s.coins).toBe(before.coins);
    expect(s.campaign!.phase).toBe("challenge");
    s = reduce(s, {
      type: "CAMPAIGN_RESULT",
      kind: "memory",
      score: 100,
      practice: false,
    });
    expect(
      reduce(s, {
        type: "CAMPAIGN_RESULT",
        kind: "memory",
        score: 100,
        practice: false,
      }),
    ).toEqual(s);
    const coins = s.coins;
    s = reduce(s, {
      type: "CAMPAIGN_RESULT",
      kind: "memory",
      score: 100,
      practice: true,
    });
    expect(s.coins).toBe(coins);
  });
  it("unlocks the true ending only after the listed conditions and preserves collection on replay", () => {
    let s = complete(firstChapter(), "friendship");
    expect(trueConditions(s).every((x) => x.done)).toBe(false);
    expect(reduce(s, { type: "CAMPAIGN_TRUE" })).toEqual(s);
    for (const id of ["fountain", "library"])
      s = reduce(s, { type: "CLUE", id });
    s = reduce(s, { type: "SOLVE", symbols: ["☾", "✿", "✦"] });
    s = reduce(s, { type: "CAMPAIGN_DIFFICULTY", value: "hard" });
    for (const kind of ["rhythm", "memory", "mission"] as const)
      s = reduce(s, {
        type: "CAMPAIGN_RESULT",
        kind,
        score: 100,
        practice: true,
      });
    expect(trueConditions(s).every((x) => x.done)).toBe(true);
    s = reduce(s, { type: "CAMPAIGN_TRUE" });
    expect(s.campaign!.ending).toBe("true");
    const saved = parseSave(JSON.stringify(s));
    s = reduce(s, { type: "CAMPAIGN_REPLAY" });
    expect(s.campaign!.chapter).toBe(2);
    expect(s.owned).toEqual(saved.owned);
    expect(s.coins).toBe(saved.coins);
    expect(s.campaign!.endings).toEqual(["friendship", "true"]);
    // The ending book remains available during a replay before choosing a route.
    s.campaign!.chapter = 9;
    expect(parseSave(JSON.stringify(s))).toEqual(s);
    s = reduce(s, { type: "CAMPAIGN_TRUE" });
    expect(s.campaign!.route).toBeNull();
    expect(parseSave(JSON.stringify(s))).toEqual(s);
  });
  it("provides enough finite rewards for level 50 and all shop items, with 102 real collectible variants", () => {
    let s = complete(firstChapter(), "ren");
    for (const difficulty of [
      "normal",
      "hard",
      "expert",
      "secret",
    ] as CampaignDifficulty[]) {
      s = reduce(s, { type: "CAMPAIGN_DIFFICULTY", value: difficulty });
      for (const kind of [
        "rhythm",
        "memory",
        "puzzle",
        "mission",
        "fashion",
      ] as const) {
        for (const id of [
          "hair-twin",
          "dress-mint",
          "shoes-mint",
          "acc-clover",
        ])
          s = reduce(s, { type: "EQUIP", id });
        s = reduce(s, {
          type: "CAMPAIGN_RESULT",
          kind,
          score: 100,
          practice: true,
        });
      }
    }
    expect(levelFor(s.xp)).toBe(50);
    expect(ITEMS).toHaveLength(102);
    expect(new Set(ITEMS.map((i) => i.id)).size).toBe(102);
    const cost = ITEMS.filter(
      (i) => !i.unlock && !s.owned.includes(i.id),
    ).reduce((n, i) => n + i.price, 0);
    expect(s.coins).toBeGreaterThanOrEqual(cost);
    for (const i of ITEMS.filter((i) => !i.unlock))
      s = reduce(s, { type: "BUY", id: i.id });
    expect(
      s.owned.filter((id) => ITEMS.find((i) => i.id === id)!.tint),
    ).toHaveLength(72);
    expect(parseSave(JSON.stringify(s))).toEqual(s);
  });
  it("rejects malformed continuation saves without erasing the old data", () => {
    const s = reduce(firstChapter(), { type: "CAMPAIGN_START" });
    for (const campaign of [
      { ...s.campaign, chapter: 50 },
      { ...s.campaign, difficulty: "secret" },
      { ...s.campaign, records: { "memory:normal": NaN } },
      { ...s.campaign, endings: ["unknown"] },
      { ...s.campaign, phase: "ending" },
    ])
      expect(() => parseSave(JSON.stringify({ ...s, campaign }))).toThrow();
  });
});
