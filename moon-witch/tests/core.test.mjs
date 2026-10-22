import { test } from "node:test";
import assert from "node:assert/strict";
import {
  stageNames,
  fresh,
  parse,
  complete,
  createRun,
  cast,
  tick,
} from "../core.mjs";
test("20 stages, sequential unlock and save integrity", () => {
  assert.equal(stageNames.length, 20);
  assert.equal(new Set(stageNames).size, 20);
  const s = fresh();
  assert(!complete(s, 19, 100));
  for (let i = 0; i < 20; i++) assert(complete(s, i, 80));
  assert.equal(s.unlocked, 20);
  assert.equal(s.cleared.length, 20);
  complete(s, 19, 10);
  assert.equal(s.cleared.length, 20);
  assert.equal(s.stars[19], 3);
  assert.deepEqual(parse(JSON.stringify(s)), s);
  assert.throws(() => parse("{}"));
});
test("spells spend magic, freeze, heal, unicorn unlock and cooldown", () => {
  const r = createRun(5);
  r.x = 400;
  r.y = 100;
  assert(cast(r, "ice"));
  assert.equal(r.mp, 84);
  assert(r.enemies.some((e) => e.slow === 3));
  assert(!cast(r, "lightning"));
  r.hp = 40;
  assert(cast(r, "heal"));
  assert.equal(r.hp, 75);
  assert(cast(r, "unicorn"));
  assert(!cast(r, "unicorn"));
  assert(!cast(createRun(4), "unicorn"));
});
test("telegraphed damage, defeat and transformation gate", () => {
  const r = createRun(6);
  r.x = 790;
  r.y = 180;
  tick(r, {}, 0.01);
  assert(!r.crystals[2].got);
  cast(r, "unicorn");
  tick(r, {}, 0.01);
  assert(r.crystals[2].got);
  r.form = 0;
  r.hp = 5;
  r.hazards.push({ x: r.x, y: r.y, radius: 40, wait: 0, damage: 10 });
  tick(r, {}, 0.01);
  assert.equal(r.status, "lost");
});
test("all 20 stages beatable through movement and real spells, final boss phases", () => {
  for (let i = 0; i < 20; i++) {
    const r = createRun(i);
    let waypoint = 0,
      phase = new Set();
    const route = [
      [190, 95],
      [620, 445],
      [790, 180],
      [140, 440],
    ];
    for (let f = 0; f < 24000 && r.status === "playing"; f++) {
      let target = route[waypoint];
      const dx = target[0] - r.x,
        dy = target[1] - r.y,
        d = Math.hypot(dx, dy);
      if (d < 20) waypoint = (waypoint + 1) % route.length;
      cast(r, "star");
      if (r.hp < 65) cast(r, "heal");
      if (r.mp > 65) cast(r, "lightning");
      if (i >= 5 && Math.hypot(r.x - 790, r.y - 180) < 180) cast(r, "unicorn");
      tick(r, { x: dx / d || 0, y: dy / d || 0 }, 1 / 60);
      for (const e of r.enemies) if (e.boss) phase.add(e.phase);
    }
    assert.equal(
      r.status,
      "won",
      `stage ${i + 1}, hp ${r.hp}, enemies ${r.enemies.filter((e) => e.hp > 0).length}`,
    );
    if (i === 19) assert(phase.has(3));
  }
});
