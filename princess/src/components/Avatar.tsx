import { useEffect, useRef, useState, type CSSProperties } from "react";
import { getItem } from "../game/data";
import type { GameState, Outfit } from "../game/types";
import {
  BODIES,
  SHOES,
  HAIRS,
  ACCESSORIES,
  EXPRESSIONS,
  type Expression,
} from "../art/manifest";
import { RasterSprite } from "./RasterSprite";
import { useMotionQuality } from "../art/MotionProvider";
import { useArtReady } from "../art/useArtReady";

type Props = {
  state: Pick<GameState, "equipped" | "hairColor" | "eyeColor" | "skinColor">;
  outfit?: Outfit;
  expression?: Expression | "happy";
  className?: string;
  label?: string;
  animate?: boolean;
};
const place = (x: number, y: number, w: number, h: number): CSSProperties => ({
  left: (x / 512) * 100 + "%",
  top: (y / 768) * 100 + "%",
  width: (w / 512) * 100 + "%",
  height: (h / 768) * 100 + "%",
});
const hairFilters: Record<string, string> = {
  "#8a5663": "none",
  "#624e61": "saturate(.55) brightness(.66)",
  "#d6a65e": "hue-rotate(28deg) saturate(.75) brightness(1.2)",
  "#b880a7": "hue-rotate(320deg) saturate(.8)",
  "#8580b7": "hue-rotate(270deg) saturate(.65)",
};
const eyeFilters: Record<string, string> = {
  "#8b659d": "none",
  "#658b93": "hue-rotate(290deg)",
  "#a97f4a": "hue-rotate(150deg)",
  "#57718e": "hue-rotate(325deg)",
};
const skinFilters: Record<string, string> = {
  "#ffe2cd": "none",
  "#ecc4a5": "sepia(.12) brightness(.91) saturate(1.08)",
  "#c58d6d": "sepia(.25) brightness(.73) saturate(1.16)",
};
export function Avatar({
  state,
  outfit,
  expression = "calm",
  className = "",
  label = "ことちゃんのコーディネート",
  animate = true,
}: Props) {
  const eq = outfit || state.equipped,
    body = BODIES[eq.outfit] || BODIES["dress-uniform"],
    shoe = BODIES[SHOES[eq.shoes]],
    hair = HAIRS[getItem(eq.hair).shape],
    acc = ACCESSORIES[getItem(eq.accessory).shape];
  const ready = useArtReady(
    ["koto-hair", "koto-expressions", "accessories", body.sheet, shoe.sheet],
    animate,
  );
  const quality = useMotionQuality(),
    ref = useRef<HTMLDivElement>(null),
    [visible, setVisible] = useState(false),
    [blink, setBlink] = useState(false);
  const mood: Expression = expression === "happy" ? "joy" : expression;
  const signature = Object.values(eq).join("-");
  const [changing, setChanging] = useState(false);
  const [reacting, setReacting] = useState(false);
  const lastMood = useRef(mood);
  useEffect(() => {
    setReacting(false);
    if (lastMood.current === mood) return;
    lastMood.current = mood;
    if (!animate || quality === "still") return;
    setReacting(true);
    const timer = setTimeout(() => setReacting(false), 540);
    return () => clearTimeout(timer);
  }, [mood, animate, quality]);
  const previous = useRef(signature);
  useEffect(() => {
    if (animate && previous.current !== signature) {
      previous.current = signature;
      setChanging(true);
      const t = setTimeout(() => setChanging(false), 650);
      return () => clearTimeout(t);
    }
  }, [signature]);
  useEffect(() => {
    if (!animate) return;
    const observer = new IntersectionObserver(
      (entries) => setVisible(entries[0].isIntersecting),
      { threshold: 0.05 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animate]);
  useEffect(() => {
    setBlink(false);
    if (
      !animate ||
      !visible ||
      quality === "still" ||
      ["closedSmile", "blink", "wink"].includes(mood)
    )
      return;
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;
    const cycle = () => {
      timer = setTimeout(
        () => {
          if (stopped) return;
          setBlink(true);
          timer = setTimeout(() => {
            setBlink(false);
            cycle();
          }, 135);
        },
        quality === "light" ? 7000 : 4800,
      );
    };
    cycle();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [animate, visible, quality, mood]);
  const frame = EXPRESSIONS[mood].frame;
  const bodyScale = (746 - 130) / (body.footY - body.neckY),
    shoeScale = (746 - 130) / (shoe.footY - shoe.neckY);
  const bodyStyle = place(
    256 - body.neckX * bodyScale,
    130 - body.neckY * bodyScale,
    512 * bodyScale,
    768 * bodyScale,
  );
  const footStyle = place(
    256 - shoe.neckX * shoeScale,
    130 - shoe.neckY * shoeScale,
    512 * shoeScale,
    768 * shoeScale,
  );
  const hairStyle = {
    ...place(
      256 - hair.x * hair.scale,
      hair.y,
      512 * hair.scale,
      512 * hair.scale,
    ),
    filter: hairFilters[state.hairColor] || "none",
  };
  const faceStyle = place(
    214.4,
    51.4 + [0, 3, 8][Math.floor(frame / 4)],
    83.3,
    83.3,
  );
  const blinkStyle = place(214.4, 59.4, 83.3, 83.3);
  return (
    <div
      ref={ref}
      className={`avatar-art raster-avatar ${className} ${animate && visible ? "is-animated" : ""} ${changing ? "is-changing" : ""} ${reacting ? "is-reacting" : ""}`}
      role="img"
      aria-label={label + "・" + EXPRESSIONS[mood].label}
      data-expression={mood}
      data-art-status={ready}
      data-outfit={eq.outfit}
      data-hair={eq.hair}
      data-shoes={eq.shoes}
      data-accessory={eq.accessory}
    >
      {ready !== "ready" && (
        <span className="art-loading">
          {ready === "error"
            ? "イラストを読み込めませんでした。再読み込みしてください。"
            : "衣装を準備しています…"}
        </span>
      )}
      <div className="doll-frame">
        <div className="doll-shadow" />
        <div className="doll-pose">
          <RasterSprite
            sheet="koto-hair"
            frame={hair.frame}
            className="doll-hair-back"
            style={hairStyle}
            eager={animate}
          />
          <div className="doll-body-region">
            <RasterSprite
              sheet={body.sheet}
              skinColor={state.skinColor}
              frame={body.frame}
              style={bodyStyle}
              eager={animate}
            />
          </div>
          <div className="doll-feet-region">
            <RasterSprite
              sheet={shoe.sheet}
              skinColor={state.skinColor}
              frame={shoe.frame}
              style={footStyle}
              eager={animate}
            />
          </div>
          <RasterSprite
            sheet="koto-expressions"
            frame={frame}
            className="doll-face"
            style={{
              ...faceStyle,
              filter: skinFilters[state.skinColor] || "none",
            }}
            eager={animate}
          />
          <RasterSprite
            sheet="koto-expressions"
            frame={frame}
            className="doll-eyes-tint"
            style={
              {
                ...faceStyle,
                filter: eyeFilters[state.eyeColor] || "none",
                "--eye-y": ["49%", "46%", "38%"][Math.floor(frame / 4)],
              } as CSSProperties
            }
            eager={animate}
          />
          {blink && (
            <RasterSprite
              sheet="koto-expressions"
              frame={EXPRESSIONS.blink.frame}
              className="doll-blink"
              style={{
                ...blinkStyle,
                filter: skinFilters[state.skinColor] || "none",
              }}
              eager
            />
          )}
          <RasterSprite
            sheet="koto-hair"
            frame={hair.frame}
            className="doll-hair-front"
            style={hairStyle}
            eager={animate}
          />
          {getItem(eq.accessory).shape === 5 ? (
            <>
              <RasterSprite
                sheet="accessories"
                frame={5}
                className="doll-accessory earring-left"
                style={place(208, 98, 40, 40)}
                eager={animate}
              />
              <RasterSprite
                sheet="accessories"
                frame={5}
                className="doll-accessory earring-right"
                style={place(263, 98, 40, 40)}
                eager={animate}
              />
            </>
          ) : (
            <RasterSprite
              sheet="accessories"
              frame={getItem(eq.accessory).shape}
              className="doll-accessory"
              style={place(acc.x, acc.y, acc.w, acc.h)}
              eager={animate}
            />
          )}
        </div>
        <span className="doll-sparkle s1">✧</span>
        <span className="doll-sparkle s2">✦</span>
        <span className="doll-sparkle s3">✧</span>
      </div>
    </div>
  );
}
