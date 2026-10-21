import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
type Quality = "full" | "light" | "still";
const MotionContext = createContext<Quality>("full");
export const useMotionQuality = () => useContext(MotionContext);
export function MotionProvider({ children }: { children: ReactNode }) {
  const [quality, setQuality] = useState<Quality>("full");
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0,
      last = 0,
      frames = 0,
      elapsed = 0,
      slowWindows = 0,
      measuring = true;
    const apply = () => {
      setQuality(media.matches || document.hidden ? "still" : "full");
      last = 0;
      frames = 0;
      elapsed = 0;
      slowWindows = 0;
      measuring = !media.matches && !document.hidden;
    };
    const frame = (now: number) => {
      if (measuring && last) {
        const dt = now - last;
        if (dt < 500) {
          elapsed += dt;
          frames++;
        }
        if (elapsed > 2500) {
          if ((frames / elapsed) * 1000 < 45) slowWindows++;
          else slowWindows = 0;
          if (slowWindows >= 2) {
            setQuality("light");
            measuring = false;
          }
          frames = 0;
          elapsed = 0;
        }
      }
      last = now;
      raf = requestAnimationFrame(frame);
    };
    apply();
    raf = requestAnimationFrame(frame);
    media.addEventListener("change", apply);
    document.addEventListener("visibilitychange", apply);
    return () => {
      cancelAnimationFrame(raf);
      media.removeEventListener("change", apply);
      document.removeEventListener("visibilitychange", apply);
    };
  }, []);
  return (
    <MotionContext.Provider value={quality}>
      <div className={"motion-root quality-" + quality}>{children}</div>
    </MotionContext.Provider>
  );
}
