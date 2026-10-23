import { test } from "node:test";
import assert from "node:assert/strict";
import * as c from "../core.mjs";
test("seven days reach tournament, one choice and pet reward per day", () => {
  const s = c.fresh();
  for (let day = 1; day <= 7; day++) {
    assert.equal(s.day, day);
    assert(c.choose(s, day % 2));
    assert(!c.choose(s, 0));
    assert(c.leaveSchool(s));
    if (day < 7) {
      assert(c.pet(s));
      assert(!c.pet(s));
      assert(c.practice(s, 0, 100));
      assert(!c.practice(s, 0, 100));
      assert(c.practice(s, 1, 80));
      assert(!c.practice(s, 2, 100));
      assert(c.nextDay(s));
    }
  }
  assert.equal(s.phase, "tournament");
  assert(!c.nextDay(s));
  assert.equal(s.skill[0], 48);
  assert.deepEqual(c.parse(JSON.stringify(s)), s);
});
test("three endings, completed rounds required, retries never lower record", () => {
  for (const [score, ending] of [
    [100, "gold"],
    [70, "silver"],
    [10, "friendship"],
  ]) {
    const s = c.fresh();
    s.day = 7;
    s.phase = "tournament";
    assert(!c.finish(s));
    for (let i = 0; i < 3; i++) assert(c.recordRound(s, i, score));
    c.recordRound(s, 0, 0);
    assert.equal(s.rounds[0], score);
    assert(c.finish(s));
    assert.equal(s.ending, ending);
    assert.equal(s.best, c.total(s));
    assert(!c.recordRound(s, 0, 100));
  }
});
test("scores bounded and invalid input rejected", () => {
  const s = c.fresh();
  s.phase = "home";
  assert(!c.practice(s, 0, NaN));
  assert(!c.practice(s, 8, 100));
  assert.equal(c.timingScore(0), 100);
  assert.equal(c.timingScore(0.9), 0);
  assert.equal(c.timingScore(-0.225), 50);
  assert.throws(() => c.parse("{}"));
  assert.throws(() => c.parse(JSON.stringify({ ...s, day: 99 })));
  for (let day = 1; day <= 7; day++)
    assert(c.sequence(day).every((i) => i >= 0 && i < 4));
});
test("story can finish with no practice or perfect scores", () => {
  const s = c.fresh();
  for (let d = 1; d <= 7; d++) {
    c.choose(s, 0);
    c.leaveSchool(s);
    if (d < 7) c.nextDay(s);
  }
  for (let i = 0; i < 3; i++) c.recordRound(s, i, 0);
  assert(c.finish(s));
  assert.equal(s.ending, "friendship");
});
