import { test } from "node:test";
import assert from "node:assert/strict";
import { fresh, reduce, parse, ending } from "../story.mjs";
test("all chapters persist, rewards are unique, replay preserves album", () => {
  let s = fresh();
  for (let i = 0; i < 6; i++) {
    s = reduce(s, { type: "choose", index: 0 });
    s = reduce(s, { type: "challenge" });
    s = reduce(s, { type: "win" });
    assert.deepEqual(reduce(s, { type: "win" }), s);
    s = reduce(s, { type: "next" });
    assert.deepEqual(parse(JSON.stringify(s)), s);
  }
  assert.equal(s.phase, "ending");
  assert.equal(s.album.length, 6);
  s = reduce(s, { type: "replay" });
  assert.equal(s.phase, "talk");
  assert.equal(s.album.length, 6);
  assert.equal(s.endings.length, 1);
});
test("three endings are reachable by choices", () => {
  const found = new Set();
  for (let bits = 0; bits < 64; bits++) {
    let s = fresh();
    for (let i = 0; i < 6; i++) {
      for (const a of [
        { type: "choose", index: (bits >> i) & 1 },
        { type: "challenge" },
        { type: "win" },
        { type: "next" },
      ])
        s = reduce(s, a);
    }
    found.add(ending(s));
  }
  assert.equal(found.size, 3);
});
test("invalid saves and phase skips are rejected", () => {
  assert.deepEqual(reduce(fresh(), { type: "win" }), fresh());
  for (const bad of [
    { ...fresh(), chapter: 7 },
    { ...fresh(), phase: "ending" },
    { ...fresh(), album: [8] },
    { ...fresh(), friend: -1 },
  ])
    assert.throws(() => parse(JSON.stringify(bad)));
});
