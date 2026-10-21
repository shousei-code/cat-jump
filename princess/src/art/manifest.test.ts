import { describe, it, expect } from "vitest";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { ITEMS, INITIAL_OWNED } from "../game/data";
import { freshState, parseSave } from "../game/engine";
import {
  BODIES,
  SHOES,
  HAIRS,
  ACCESSORIES,
  EXPRESSIONS,
  SHEETS,
  BOYS,
} from "./manifest";
describe("illustration manifest and save compatibility", () => {
  it("covers every existing wardrobe item with a real texture and an in-bounds frame", () => {
    for (const item of ITEMS) {
      if (item.slot === "outfit") {
        const art = BODIES[item.id];
        expect(art).toBeDefined();
        expect(art.frame).toBeLessThan(4);
        expect(art.neckY).toBeLessThan(art.footY);
        expect(art.footY).toBeLessThanOrEqual(768);
      } else if (item.slot === "shoes")
        expect(BODIES[SHOES[item.id]]).toBeDefined();
      else if (item.slot === "hair") expect(HAIRS[item.shape]).toBeDefined();
      else expect(ACCESSORIES[item.shape]).toBeDefined();
    }
    for (const sheet of Object.keys(SHEETS)) {
      const file = resolve("public/art/characters", sheet + ".webp");
      expect(existsSync(file)).toBe(true);
      expect(statSync(file).size).toBeGreaterThan(1000);
    }
  });
  it("has distinct frames for 10 expressions, a neutral pose and a blink", () => {
    expect(Object.keys(EXPRESSIONS)).toHaveLength(12);
    expect(new Set(Object.values(EXPRESSIONS).map((e) => e.frame)).size).toBe(
      12,
    );
    for (const boy of ["haruto", "ren", "aoi", "kaito"])
      expect(BOYS[boy]).toBeDefined();
  });
  it("preserves a version-one bob-haired save rather than imposing new appearance defaults", () => {
    const old = freshState();
    old.started = true;
    old.equipped = {
      hair: "hair-bob",
      outfit: "dress-rose",
      shoes: "shoes-mint",
      accessory: "acc-clover",
    };
    old.hairColor = "#624e61";
    old.eyeColor = "#658b93";
    old.skinColor = "#c58d6d";
    old.coins = 87;
    old.xp = 120;
    const restored = parseSave(JSON.stringify(old));
    expect(restored).toEqual(old);
    expect(restored.owned).toEqual(INITIAL_OWNED);
  });
});
