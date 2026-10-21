import { describe, it, expect } from "vitest";
import {
  freshState,
  reduce,
  scoreOutfit,
  rivalFor,
  parseSave,
  loadSave,
  levelFor,
  MAX_XP,
} from "./engine";
import { ITEMS, INITIAL_OWNED, THEMES, SCENES } from "./data";
import type { GameState, Outfit } from "./types";
const ready = () => {
  let s = reduce(freshState(), { type: "START" });
  while (s.node !== "brief") {
    s = reduce(s, { type: "CHOICE", id: SCENES[s.node].choices[0].id });
  }
  return s;
};
const mint = (s: GameState) =>
  ["hair-twin", "dress-mint", "shoes-mint", "acc-clover"].reduce(
    (a, id) => reduce(a, { type: "EQUIP", id }),
    s,
  );
describe("complete chapter and strategic battle", () => {
  it("completes chapter with deterministic score and one-time rewards", () => {
    let s = mint(ready());
    expect(scoreOutfit(s.equipped, "garden").total).toBe(84);
    s = reduce(s, { type: "BATTLE" });
    expect(s.node).toBe("festival");
    while (s.node !== "complete")
      s = reduce(s, { type: "CHOICE", id: SCENES[s.node].choices[0].id });
    expect(s.chapterClear).toBe(true);
    expect(s.owned).toContain("dress-princess");
    expect(levelFor(s.xp)).toBeGreaterThan(1);
    const coins = s.coins;
    s = reduce(s, { type: "BATTLE" });
    expect(s.coins).toBe(coins);
    expect(s.battle?.rewarded).toBe(false);
    expect(parseSave(JSON.stringify(s))).toEqual(s);
  });
  it("allows a loss followed by free strategic retry", () => {
    let s = ready();
    s = reduce(s, { type: "DIFFICULTY", value: "expert" });
    const before = s.coins;
    s = reduce(s, { type: "BATTLE" });
    expect(s.battle?.win).toBe(false);
    expect(s.node).toBe("brief");
    expect(s.coins).toBe(before);
    s = reduce(mint(s), { type: "BATTLE" });
    expect(s.battle?.win).toBe(true);
  });
  it("has a winning starter outfit for every theme and difficulty", () => {
    for (const theme of THEMES) {
      let maximum = 0;
      const bySlot = ["hair", "outfit", "shoes", "accessory"].map((slot) =>
        ITEMS.filter((i) => i.slot === slot && INITIAL_OWNED.includes(i.id)),
      );
      for (const h of bySlot[0])
        for (const o of bySlot[1])
          for (const s of bySlot[2])
            for (const a of bySlot[3])
              maximum = Math.max(
                maximum,
                scoreOutfit(
                  { hair: h.id, outfit: o.id, shoes: s.id, accessory: a.id },
                  theme.id,
                ).total,
              );
      for (const diff of ["normal", "hard", "expert"] as const)
        expect(maximum).toBeGreaterThan(rivalFor(diff, theme.id).score);
    }
  });
  it("ignores repeated or out-of-order choices", () => {
    const s = reduce(freshState(), { type: "START" }),
      id = SCENES.letter.choices[0].id,
      next = reduce(s, { type: "CHOICE", id });
    expect(reduce(next, { type: "CHOICE", id })).toEqual(next);
    expect(reduce(s, { type: "CHOICE", id: "festival-thanks" })).toEqual(s);
  });
  it("does not farm chapter rewards through replay", () => {
    let s = mint(ready());
    s = reduce(s, { type: "BATTLE" });
    while (s.node !== "complete")
      s = reduce(s, { type: "CHOICE", id: SCENES[s.node].choices[0].id });
    const coins = s.coins;
    s = reduce(s, { type: "REPLAY" });
    while (s.node !== "brief")
      s = reduce(s, { type: "CHOICE", id: SCENES[s.node].choices[0].id });
    s = reduce(s, { type: "BATTLE" });
    while (s.node !== "complete")
      s = reduce(s, { type: "CHOICE", id: SCENES[s.node].choices[0].id });
    expect(s.coins).toBe(coins);
  });
});
describe("collection, exploration and validation", () => {
  it("protects purchases, locks and equip slots", () => {
    let s = freshState();
    expect(reduce(s, { type: "EQUIP", id: "dress-secret" })).toEqual(s);
    expect(reduce(s, { type: "BUY", id: "dress-secret" })).toEqual(s);
    s = reduce(s, { type: "BUY", id: "dress-flower" });
    expect(s.coins).toBe(30);
    expect(reduce(s, { type: "BUY", id: "dress-flower" })).toEqual(s);
    expect(reduce(s, { type: "BUY", id: "dress-coat" })).toEqual(s);
  });
  it("requires clues, solves one time, rejects wrong order", () => {
    let s = reduce(freshState(), { type: "START" });
    expect(reduce(s, { type: "SOLVE", symbols: ["☾", "✿", "✦"] })).toEqual(s);
    s = reduce(s, { type: "CLUE", id: "fountain" });
    s = reduce(s, { type: "CLUE", id: "library" });
    expect(reduce(s, { type: "SOLVE", symbols: ["✿", "☾", "✦"] })).toEqual(s);
    s = reduce(s, { type: "SOLVE", symbols: ["☾", "✿", "✦"] });
    expect(s.owned).toContain("dress-secret");
    expect(reduce(s, { type: "SOLVE", symbols: ["☾", "✿", "✦"] }).coins).toBe(
      s.coins,
    );
  });
  it("rejects corrupt and incompatible saves without destroying the raw content", () => {
    expect(() => parseSave("{}")).toThrow();
    expect(() =>
      parseSave(JSON.stringify({ ...freshState(), coins: -1 })),
    ).toThrow();
    expect(() =>
      parseSave(
        JSON.stringify({
          ...freshState(),
          equipped: { ...freshState().equipped, hair: "dress-mint" },
        }),
      ),
    ).toThrow();
    expect(loadSave({ getItem: () => "{broken" })).toEqual({
      kind: "invalid",
      raw: "{broken",
    });
    expect(
      loadSave({
        getItem: () => {
          throw Error("denied");
        },
      }),
    ).toEqual({ kind: "unavailable" });
    expect(parseSave(JSON.stringify(freshState()))).toEqual(freshState());
  });
  it("caps level at 50", () => {
    expect(levelFor(0)).toBe(1);
    expect(levelFor(MAX_XP)).toBe(50);
    expect(levelFor(MAX_XP * 2)).toBe(50);
  });
});
