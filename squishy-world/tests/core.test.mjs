import { test } from "node:test";
import assert from "node:assert/strict";
import * as c from "../core.mjs";
test("100 distinct designs, all obtainable, exclusive prizes", () => {
  assert.equal(new Set(c.names).size, 100);
  assert.equal(new Set(c.mapLoot.flat()).size, 84);
  const pool = [0, 1, 2, 3].flatMap(c.gachaPool);
  assert.equal(new Set([...pool, ...c.goals]).size, 100);
  assert(!pool.some((i) => c.goals.includes(i)));
});
test("collection, automatic shelf, care once, move, remove and save", () => {
  const s = c.fresh();
  assert(c.collect(s, 1));
  assert(!c.collect(s, 1));
  assert.equal(s.shelves[1], 1);
  assert.equal(c.care(s, 1), 5);
  assert.equal(c.care(s, 1), 0);
  c.place(s, 99, 1);
  assert.equal(s.shelves[1], null);
  assert.equal(s.shelves[99], 1);
  c.place(s, 99, null);
  assert.equal(s.owned[1], 1);
  assert.deepEqual(c.parse(JSON.stringify(s)), s);
  assert.throws(() => c.parse("{}"));
});
test("gacha pity, insufficient money, completion rewards once", () => {
  const s = c.fresh();
  s.coins = 1000;
  for (let n = 0; n < 9; n++) c.gacha(s, 0, 0, 0.1);
  assert.equal(c.rarity(c.gacha(s, 0, 0, 0).id), "レア");
  s.coins = 0;
  assert.equal(c.gacha(s, 0), null);
  for (let m = 0; m < 6; m++) {
    assert(c.finish(s, m));
    assert(!c.finish(s, m));
    assert.equal(s.owned[c.goals[m]], 1);
  }
  assert.equal(s.coins, 360);
});
test("every platform is reachable with controlled jumps from edge", () => {
  for (let m = 0; m < 6; m++) {
    const ps = c.level(m);
    for (let i = 0; i < ps.length - 1; i++) {
      const a = ps[i],
        b = ps[i + 1],
        p = c.spawn(ps, i);
      p.x = Math.max(a.x - a.w / 2 + 0.1, Math.min(b.x, a.x + a.w / 2 - 0.1));
      p.z = a.z - a.d / 2 + 0.1;
      let landed = false;
      for (let f = 0; f < 150; f++) {
        const dx = b.x - p.x,
          dz = b.z - p.z,
          n = Math.hypot(dx, dz);
        const r = c.step(
          p,
          { x: n > 0.1 ? dx / n : 0, z: n > 0.1 ? dz / n : 0, jump: f === 0 },
          1 / 60,
          ps,
        );
        if (r.landed === b) {
          landed = true;
          break;
        }
        if (r.fell) break;
      }
      assert(landed, `map ${m}, jump ${i}`);
    }
  }
});
test("fall restores checkpoint", () => {
  const ps = c.level(3),
    p = c.spawn(ps, 4);
  p.y = -20;
  assert(c.step(p, {}, 0.01, ps).fell);
  assert.equal(p.z, ps[4].z);
});
