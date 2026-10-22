import { test } from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { Room, cleanPlayer } from "../network.js";
test("room messages reject invalid positions and avatars", () => {
  assert.equal(cleanPlayer({ x: Infinity, y: 0, z: 0, avatar: 0 }), null);
  assert.equal(cleanPlayer({ x: 0, y: 0, z: 0, avatar: 7 }), null);
  assert.deepEqual(
    cleanPlayer({ x: 1, y: 2, z: 3, avatar: 2, extra: "ignored" }),
    { x: 1, y: 2, z: 3, avatar: 2 },
  );
});
test("room protocol admits ten, refuses eleventh, forwards positions and handles departure (simulated transport)", async () => {
  const peers = new Map();
  let next = 0;
  class Link extends EventEmitter {
    open = false;
    send(m) {
      queueMicrotask(() => this.partner.emit("data", structuredClone(m)));
    }
    close() {
      if (this.closed) return;
      this.closed = true;
      this.open = false;
      this.emit("close");
      this.partner.close();
    }
  }
  class FakePeer extends EventEmitter {
    constructor(id) {
      super();
      this.id = id ?? `guest-${next++}`;
      this.open = false;
      this.connections = [];
      peers.set(this.id, this);
      queueMicrotask(() => {
        this.open = true;
        this.emit("open");
      });
    }
    connect(id) {
      const target = peers.get(id),
        a = new Link(),
        b = new Link();
      a.peer = id;
      b.peer = this.id;
      a.partner = b;
      b.partner = a;
      this.connections.push(a);
      target.connections.push(b);
      queueMicrotask(() => {
        target.emit("connection", b);
        a.open = b.open = true;
        a.emit("open");
        b.emit("open");
      });
      return a;
    }
    destroy() {
      this.open = false;
      peers.delete(this.id);
      for (const c of this.connections) c.close();
    }
  }
  globalThis.Peer = FakePeer;
  globalThis.location = { hostname: "localhost", search: "?localPeer=1" };
  const states = [],
    views = [],
    rooms = [];
  const make = () => {
    const i = rooms.length,
      r = new Room(
        (s) => (states[i] = s),
        (p) => (views[i] = p),
      );
    rooms.push(r);
    return r;
  };
  const flush = () => new Promise((r) => setImmediate(r));
  try {
    make().start();
    await flush();
    for (let i = 0; i < 9; i++) {
      make().start(rooms[0].code);
      await flush();
    }
    for (let i = 0; i < 10; i++)
      rooms[i].update({ x: i, y: 0, z: 7, avatar: i % 6 });
    await flush();
    rooms[0].update({ x: 0, y: 0, z: 7, avatar: 0 });
    await flush();
    assert.equal(rooms[0].count, 10);
    assert.equal(Object.keys(views[1]).length, 9);
    make().start(rooms[0].code);
    await flush();
    assert.match(states[10], /いっぱい/);
    rooms[1].leave();
    await flush();
    rooms[0].update({ x: 0, y: 0, z: 7, avatar: 0 });
    await flush();
    assert.equal(rooms[0].count, 9);
    rooms[0].leave();
    await flush();
    assert.match(states[2], /ホストが退出/);
  } finally {
    rooms.forEach((r) => r.leave());
    delete globalThis.Peer;
    delete globalThis.location;
  }
});
