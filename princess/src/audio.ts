let context: AudioContext | undefined,
  master: GainNode | undefined,
  timer: ReturnType<typeof setInterval> | undefined;
let tick = 0,
  next = 0,
  volume = 0.18;
function voice(f: number, t: number, len: number) {
  if (!context || !master) return;
  const o = context.createOscillator(),
    g = context.createGain();
  o.type = "sine";
  o.frequency.value = f;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.12, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.001, t + len);
  o.connect(g);
  g.connect(master);
  o.start(t);
  o.stop(t + len + 0.02);
  o.onended = () => {
    o.disconnect();
    g.disconnect();
  };
}
export async function startAudio() {
  try {
    context ??= new AudioContext();
    if (!master) {
      master = context.createGain();
      master.connect(context.destination);
    }
    await context.resume();
    master.gain.value = volume;
    if (timer) return true;
    next = context.currentTime + 0.05;
    tick = 0;
    const melody = [
      523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 783.99, 659.25,
      523.25, 587.33, 659.25, 523.25, 392, 440, 493.88,
    ];
    timer = setInterval(() => {
      if (!context) return;
      while (next < context.currentTime + 0.15) {
        voice(melody[tick % 16], next, 0.65);
        if (tick % 4 === 0)
          voice(
            [130.81, 146.83, 164.81, 130.81][Math.floor(tick / 4) % 4],
            next,
            1.5,
          );
        next += 0.47;
        tick++;
      }
    }, 40);
    return true;
  } catch {
    return false;
  }
}
export function stopAudio() {
  clearInterval(timer);
  timer = undefined;
  if (context && master) {
    master.gain.value = 0;
    void context.suspend();
  }
}
export function setAudioVolume(v: number) {
  volume = v;
  if (context && master)
    master.gain.setTargetAtTime(v, context.currentTime, 0.03);
}
export function chime() {
  if (context?.state === "running") voice(1046.5, context.currentTime, 0.25);
}
