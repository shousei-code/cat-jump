import { test } from "node:test";
import assert from "node:assert/strict";
import {
  fresh,
  parse,
  collect,
  gacha,
  jobReward,
  platforms,
  spawn,
  step,
} from "../core.mjs";
test("save round trip, invalid inventory rejected, found cannot pay twice", () => {
  const s = fresh();
  assert.equal(collect(s, 0), true);
  assert.equal(collect(s, 0), false);
  assert.equal(s.coins, 70);
  s.page[0] = 0;
  assert.deepEqual(parse(JSON.stringify(s)), s);
  s.owned[0] = -1;
  assert.throws(() => parse(JSON.stringify(s)));
});
test("gacha costs, pity, duplicate bonus and insufficient funds", () => {
  const s = fresh();
  s.coins = 1000;
  for (let i = 0; i < 9; i++) assert.equal(gacha(s, 0, 0).id, 0);
  assert.equal(s.pity[0], 9);
  assert.equal(gacha(s, 0, 0).id, 4);
  assert.equal(s.pity[0], 0);
  assert.equal(gacha(s, 3, 0.999).id, 23);
  s.coins = 29;
  const copy = structuredClone(s);
  assert.equal(gacha(s, 0), null);
  assert.deepEqual(s, copy);
});
test("work rewards depend on delivered packages", () => {
  const s = fresh();
  assert.equal(jobReward(s, 10), 80);
  assert.equal(jobReward(s, 0), 0);
  assert.equal(s.coins, 140);
});
test("all three courses are reachable with ordinary jump physics and falling returns to flag", () => {
  for (let c = 0; c < 3; c++) {
    const p = spawn();
    p.x = (c - 1) * 16;
    p.z = -1.7;
    let finish = false;
    for (let i = 0; i < 1200 && !finish; i++) {
      const r = step(p, { x: 0, z: -1, jump: p.onGround }, 1 / 120);
      finish = !!r.landed?.finish;
    }
    assert.equal(finish, true, `course ${c}`);
    const cp = p.checkpoint;
    p.y = -13;
    step(p, {}, 1 / 60);
    assert.equal(p.checkpoint, cp);
    assert.equal(p.y, platforms[cp].y);
  }
});
