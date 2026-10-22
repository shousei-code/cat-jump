import * as THREE from "../sticker-world/vendor/three.module.js";
import { maps, mapLoot, goals, level, spawn, step, sheets } from "./core.mjs";
export async function createWorld({ state, onFind, onFinish, onFall, paused }) {
  const $ = (id) => document.getElementById(id),
    colors = ["#ed9cbe", "#85cbbb", "#8ab7e4", "#d9adf0", "#e6ba80", "#a9a6df"];
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: $("world"),
      antialias: true,
      alpha: false,
    });
  } catch {
    $("world").insertAdjacentHTML(
      "afterend",
      '<div id="error">3D画面を開けませんでした。WebGL対応のブラウザで開いてください。</div>',
    );
    throw Error("WebGL unavailable");
  }
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#e8e6fa");
  scene.fog = new THREE.Fog("#e8e6fa", 45, 100);
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 160);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb7a3ce, 2.5));
  const sun = new THREE.DirectionalLight(0xfff4d8, 2);
  sun.position.set(10, 25, 10);
  scene.add(sun);
  const mat = (color) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.75 });
  function box(w, h, d, color, x = 0, y = 0, z = 0, parent = worldRoot) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  }
  function sphere(r, color, x, y, z, parent = worldRoot) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 8), mat(color));
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  }
  const worldRoot = new THREE.Group();
  scene.add(worldRoot);
  function makeAvatar(index) {
    const group = new THREE.Group();
    const body = box(0.85, 0.95, 0.55, colors[index], 0, 1.15, 0, group);
    body.name = "shirt";
    box(0.75, 0.35, 0.58, "#586180", 0, 0.58, 0, group);
    box(0.27, 0.55, 0.3, "#fff6f2", -0.22, 0.3, 0, group);
    box(0.27, 0.55, 0.3, "#fff6f2", 0.22, 0.3, 0, group);
    sphere(0.48, "#ffe2d4", 0, 1.95, 0, group);
    const hair = sphere(0.5, colors[index], 0, 2.1, -0.07, group);
    hair.scale.y = 0.65;
    hair.name = "hair";
    for (const x of [-0.18, 0.18])
      sphere(0.055, "#604e78", x, 1.96, 0.43, group);
    box(0.25, 0.7, 0.3, "#ffe2d4", -0.58, 1.12, 0, group);
    box(0.25, 0.7, 0.3, "#ffe2d4", 0.58, 1.12, 0, group);
    scene.add(group);
    setAvatar(group, index);
    return group;
  }
  function setAvatar(group, i) {
    for (const name of ["shirt", "hair"])
      group.getObjectByName(name).material.color.set(colors[i]);
    group.userData.avatar = i;
    const old = group.getObjectByName("detail");
    if (old) {
      group.remove(old);
      old.traverse((o) => {
        o.geometry?.dispose();
        o.material?.dispose();
      });
    }
    const detail = new THREE.Group();
    detail.name = "detail";
    group.add(detail);
    if (i === 0) {
      sphere(0.17, "#f184bb", -0.16, 2.45, 0.13, detail);
      sphere(0.17, "#f184bb", 0.16, 2.45, 0.13, detail);
    }
    if (i === 1) {
      box(0.17, 0.65, 0.2, "#fff5ef", -0.23, 2.65, 0, detail);
      box(0.17, 0.65, 0.2, "#fff5ef", 0.23, 2.65, 0, detail);
    }
    if (i === 2) box(1, 0.15, 0.7, "#7094d1", 0, 2.4, 0.1, detail);
    if (i === 3) {
      sphere(0.24, colors[i], -0.47, 2, 0, detail);
      sphere(0.24, colors[i], 0.47, 2, 0, detail);
    }
    if (i === 4) sphere(0.18, "#ffe18c", 0.35, 2.3, 0.2, detail);
    if (i === 5)
      for (const x of [-0.28, 0.28]) {
        const ear = new THREE.Mesh(
          new THREE.ConeGeometry(0.23, 0.4, 4),
          mat("#a9a6df"),
        );
        ear.position.set(x, 2.5, 0);
        detail.add(ear);
      }
  }
  const avatar = makeAvatar(state.avatar),
    textures = await Promise.all(
      sheets.map((s) => new THREE.TextureLoader().loadAsync(`assets/${s}.png`)),
    );
  textures.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));
  let platforms = [],
    pickups = [],
    player,
    mapIndex = 0;
  function clear() {
    while (worldRoot.children.length) {
      const o = worldRoot.children[0];
      worldRoot.remove(o);
      o.traverse((m) => {
        m.geometry?.dispose();
        if (m.material) {
          m.material.map?.dispose();
          m.material.dispose();
        }
      });
    }
  }
  function tree(x, z, m) {
    box(0.4, 2, 0.4, "#ba997d", x, 1, z);
    sphere(1.6, m.kind === "forest" ? "#a6d4a4" : m.accent, x, 2.9, z);
    if (m.kind === "forest") {
      sphere(0.24, "#61485e", x - 0.45, 3, z + 1.5);
      sphere(0.24, "#61485e", x + 0.45, 3, z + 1.5);
      sphere(0.55, m.accent, x - 0.8, 4.1, z);
      sphere(0.55, m.accent, x + 0.8, 4.1, z);
    }
  }
  function build(index) {
    clear();
    mapIndex = index;
    platforms = level(index);
    player = spawn(platforms);
    const m = maps[index];
    scene.background.set(m.sky);
    scene.fog = new THREE.Fog(m.sky, 45, 130);
    for (const p of platforms) {
      box(p.w, 0.8, p.d, m.floor, p.x, p.y - 0.4, p.z);
      box(p.w + 0.06, 0.1, p.d + 0.06, m.accent, p.x, p.y - 0.02, p.z);
      if (p.checkpoint && p !== platforms[0]) {
        box(0.1, 1.7, 0.1, "#8e7b9d", p.x + p.w / 2 - 0.3, p.y + 0.85, p.z);
        box(
          0.8,
          0.5,
          0.08,
          p.finish ? "#ffe18a" : "#fffaf5",
          p.x + p.w / 2 + 0.05,
          p.y + 1.5,
          p.z,
        );
      }
    }
    for (let i = 0; i < 10; i++) {
      const z = 12 - i * 10,
        x = i % 2 ? 12 : -12;
      if (m.kind === "candy") {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(1.1, 0.45, 8, 20),
          mat(i % 2 ? "#c78b64" : "#ef9ec6"),
        );
        ring.position.set(x, 1.7, z);
        worldRoot.add(ring);
        box(0.3, 1.5, 0.3, "#f7dfb6", x, 0.6, z);
        sphere(1.8, "#edcf9e", x, 0, z);
      } else if (m.kind === "forest") tree(x, z, m);
      else if (m.kind === "ocean") {
        for (let j = 0; j < 3; j++)
          box(
            0.4,
            1.5 + j * 0.6,
            0.4,
            j % 2 ? "#d4b6e3" : "#edabc9",
            x + j * 0.5,
            1,
            z,
          );
        sphere(0.5, "#faf5e4", x + 1, 2.5, z);
      } else if (m.kind === "ice") {
        const cone = new THREE.Mesh(
          new THREE.ConeGeometry(1.2, 2.5, 8),
          mat("#e8c69a"),
        );
        cone.position.set(x, 1, z);
        cone.rotation.z = Math.PI;
        worldRoot.add(cone);
        sphere(1.2, m.accent, x, 2.4, z);
      } else if (m.kind === "space") {
        sphere(1.1, i % 2 ? "#eac58d" : "#c1b5e9", x, 3, z);
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(1.6, 0.12, 6, 24),
          mat("#fff2cf"),
        );
        ring.position.set(x, 3, z);
        ring.rotation.x = 0.7;
        worldRoot.add(ring);
      } else {
        for (let j = 0; j < 3; j++) sphere(1.2, "#fffaf5", x + j, 1.5, z);
      }
    }
    pickups = mapLoot[index].map((id, j) => {
      const q =
        j < 4
          ? { x: [-6, 6, -10, 10][j], y: 0, z: j < 2 ? 8 : 0 }
          : platforms[1 + Math.floor(((j - 4) * (platforms.length - 2)) / 10)];
      const tex = textures[Math.floor(id / 25)].clone(),
        frame = id % 25;
      tex.repeat.set(0.18, 0.18);
      tex.offset.set(
        (frame % 5) / 5 + 0.01,
        1 - (Math.floor(frame / 5) + 1) / 5 + 0.01,
      );
      const mesh = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
      mesh.position.set(q.x, q.y + 1.1, q.z);
      mesh.scale.set(1.5, 1.5, 1);
      mesh.visible = !state.found.includes(id);
      worldRoot.add(mesh);
      return { id, x: q.x, y: q.y + 1.1, z: q.z, mesh };
    });
    camera.position.set(0, 12, 24);
    release();
  }
  const keys = new Set(),
    held = new Map();
  let jump = false;
  function release() {
    keys.clear();
    held.clear();
    jump = false;
  }
  window.addEventListener("keydown", (e) => {
    if (paused()) return;
    if (
      [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "KeyW",
        "KeyA",
        "KeyS",
        "KeyD",
        "Space",
      ].includes(e.code)
    ) {
      e.preventDefault();
      keys.add(e.code);
      if (e.code === "Space" && !e.repeat) jump = true;
    }
  });
  window.addEventListener("keyup", (e) => keys.delete(e.code));
  window.addEventListener("blur", release);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) release();
  });
  document.querySelectorAll("[data-move]").forEach((b) => {
    b.onpointerdown = (e) => {
      e.preventDefault();
      b.setPointerCapture(e.pointerId);
      held.set(e.pointerId, b.dataset.move);
    };
    for (const ev of ["pointerup", "pointercancel", "lostpointercapture"])
      b.addEventListener(ev, (e) => held.delete(e.pointerId));
  });
  $("jump").onpointerdown = (e) => {
    e.preventDefault();
    jump = true;
  };
  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();
  build(state.map);
  let last = performance.now(),
    renderAt = 0;
  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min(0.04, Math.max(0, (now - last) / 1000));
    last = now;
    if (document.hidden || (paused() && now - renderAt < 100)) return;
    renderAt = now;
    if (!paused()) {
      const has = (dir, ...codes) =>
        [...held.values()].includes(dir) || codes.some((k) => keys.has(k));
      const r = step(
        player,
        {
          x:
            Number(has("right", "ArrowRight", "KeyD")) -
            Number(has("left", "ArrowLeft", "KeyA")),
          z:
            Number(has("down", "ArrowDown", "KeyS")) -
            Number(has("up", "ArrowUp", "KeyW")),
          jump,
        },
        dt,
        platforms,
      );
      jump = false;
      if (r.fell) onFall();
      if (r.landed?.finish) onFinish(mapIndex);
      for (const p of pickups)
        if (
          p.mesh.visible &&
          Math.hypot(player.x - p.x, player.z - p.z) < 1.3 &&
          Math.abs(player.y + 0.9 - p.y) < 1.4
        ) {
          if (onFind(p.id)) p.mesh.visible = false;
        }
    } else release();
    avatar.position.set(player.x, player.y, player.z);
    if (!paused() && Math.hypot(player.vx, player.vz) > 0.1)
      avatar.rotation.y = Math.atan2(player.vx, player.vz);
    camera.position.lerp(
      new THREE.Vector3(player.x, player.y + 12, player.z + 17),
      Math.min(1, dt * 7),
    );
    camera.lookAt(player.x, player.y + 1, player.z - 3);
    for (const p of pickups)
      p.mesh.position.y = p.y + Math.sin(now * 0.002 + p.id) * 0.12;
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
  return {
    build,
    release,
    setAvatar: (i) => setAvatar(avatar, i),
    restart: () => {
      player = spawn(platforms);
      release();
    },
  };
}
