import { useEffect, useRef, useState } from "react";
import { useMotionQuality } from "./MotionProvider";

// Small album portraits stay still. Timers only run for decoded, visible artwork.
export function usePortraitMotion(enabled: boolean, identity: string) {
  const ref = useRef<HTMLDivElement>(null);
  const quality = useMotionQuality();
  const [visible, setVisible] = useState(false);
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [enabled]);
  useEffect(() => {
    setBlink(false);
    if (!enabled || !visible || quality === "still") return;
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;
    const offset = [...identity].reduce((n, c) => n + c.charCodeAt(0), 0) % 900;
    const next = () => {
      timer = setTimeout(
        () => {
          if (stopped) return;
          setBlink(true);
          timer = setTimeout(() => {
            setBlink(false);
            next();
          }, 140);
        },
        (quality === "light" ? 6500 : 3800) + offset,
      );
    };
    next();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [enabled, visible, quality, identity]);
  return { ref, blink, moving: enabled && visible && quality !== "still" };
}
