export function cleanPlayer(p) {
  if (
    !p ||
    ![p.x, p.y, p.z].every(Number.isFinite) ||
    Math.abs(p.x) > 70 ||
    Math.abs(p.z) > 90 ||
    p.y < -15 ||
    p.y > 30 ||
    !Number.isInteger(p.avatar) ||
    p.avatar < 0 ||
    p.avatar > 5
  )
    return null;
  return { x: p.x, y: p.y, z: p.z, avatar: p.avatar };
}
export class Room {
  constructor(onState, onPlayers) {
    this.onState = onState;
    this.onPlayers = onPlayers;
    this.links = new Map();
    this.players = {};
    this.code = "";
    this.count = 1;
    this.timer = null;
  }
  leave() {
    clearTimeout(this.timer);
    this.timer = null;
    this.peer?.destroy();
    this.peer = null;
    this.links.clear();
    this.players = {};
    this.code = "";
    this.count = 1;
    this.host = false;
    this.onPlayers({});
    this.onState("一人であそんでいます");
  }
  start(code) {
    this.leave();
    this.host = !code;
    this.code =
      code ||
      String((crypto.getRandomValues(new Uint32Array(1))[0] % 900000) + 100000);
    const prefix = "sticker-island-v1-";
    const local =
      ["localhost", "127.0.0.1"].includes(location.hostname) &&
      new URLSearchParams(location.search).has("localPeer");
    const opts = local
      ? {
          host: location.hostname,
          port: 9000,
          path: "/peerjs",
          secure: false,
          config: { iceServers: [] },
        }
      : {};
    const peer = (this.peer = new Peer(
      this.host ? prefix + this.code : undefined,
      opts,
    ));
    this.onState("友だちの島につないでいます…");
    this.timer = setTimeout(() => {
      if (this.peer === peer) {
        this.leave();
        this.onState(
          "接続できませんでした。通信環境を変えて試すか、一人で遊べます。",
        );
      }
    }, 15000);
    const fail = () => {
      if (this.peer !== peer) return;
      this.leave();
      this.onState("接続できませんでした。部屋コードと通信環境を確認してね。");
    };
    peer.on("error", fail);
    peer.on("disconnected", fail);
    peer.on("open", () => {
      if (this.peer !== peer) return;
      if (this.host) {
        clearTimeout(this.timer);
        this.onState(`部屋 ${this.code} · 1 / 10 人`);
      } else
        this.attach(
          peer.connect(prefix + this.code, { reliable: true }),
          false,
          peer,
        );
    });
    peer.on("connection", (conn) => {
      if (!this.host || this.links.size >= 9) {
        conn.on("open", () => {
          conn.send({ type: "full" });
          setTimeout(() => conn.close(), 200);
        });
        return;
      }
      this.attach(conn, true, peer);
    });
  }
  attach(conn, hosting, peer) {
    this.links.set(conn.peer, conn);
    const waiting = setTimeout(() => {
      if (!conn.open) {
        this.links.delete(conn.peer);
        delete this.players[conn.peer];
        conn.close();
      }
    }, 20000);
    let last = 0;
    conn.on("open", () => {
      clearTimeout(waiting);
      if (this.peer !== peer) return;
      if (!hosting) {
        clearTimeout(this.timer);
        this.onState(`部屋 ${this.code} に入りました`);
      }
    });
    conn.on("data", (m) => {
      if (this.peer !== peer || !m || typeof m !== "object") return;
      if (m.type === "full") {
        this.leave();
        this.onState("この部屋は10人でいっぱいです。");
        return;
      }
      if (hosting) {
        const now = performance.now();
        if (now - last < 40) return;
        last = now;
        const p = cleanPlayer(m.player);
        if (m.type === "move" && p) this.players[conn.peer] = p;
      } else if (
        m.type === "world" &&
        Array.isArray(m.players) &&
        m.players.length <= 10
      ) {
        const others = {};
        for (const entry of m.players) {
          if (!entry || typeof entry.id !== "string" || entry.id.length > 100)
            continue;
          const p = cleanPlayer(entry.player);
          if (p && entry.id !== peer.id) others[entry.id] = p;
        }
        this.count = Object.keys(others).length + 1;
        this.onPlayers(others);
        this.onState(`部屋 ${this.code} · ${this.count} / 10 人`);
      }
    });
    const remove = () => {
      clearTimeout(waiting);
      if (this.peer !== peer) return;
      this.links.delete(conn.peer);
      delete this.players[conn.peer];
      if (!hosting) {
        this.leave();
        this.onState("ホストが退出しました。一人で続けられます。");
      }
    };
    conn.on("close", remove);
    conn.on("error", remove);
  }
  update(player) {
    if (!this.peer?.open) return;
    const p = cleanPlayer(player);
    if (!p) return;
    if (this.host) {
      this.players[this.peer.id] = p;
      const live = {};
      for (const [id, v] of Object.entries(this.players))
        if (id === this.peer.id || this.links.get(id)?.open) live[id] = v;
      const packet = {
        type: "world",
        players: Object.entries(live).map(([id, player]) => ({ id, player })),
      };
      for (const c of this.links.values()) if (c.open) c.send(packet);
      const others = { ...live };
      delete others[this.peer.id];
      this.count = Object.keys(live).length;
      this.onPlayers(others);
      this.onState(`部屋 ${this.code} · ${this.count} / 10 人`);
    } else
      for (const c of this.links.values())
        if (c.open) c.send({ type: "move", player: p });
  }
}
