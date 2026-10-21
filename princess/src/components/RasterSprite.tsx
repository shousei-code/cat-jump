import { useEffect, useState, type CSSProperties } from "react";
import { SHEETS, type Sheet } from "../art/manifest";
import { useSkinTexture } from "../art/useSkinTexture";
export function RasterSprite({
  sheet,
  frame,
  className = "",
  style,
  eager = false,
  skinColor,
}: {
  sheet: Sheet;
  frame: number;
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
  skinColor?: string;
}) {
  const { cols, rows } = SHEETS[sheet];
  const source = useSkinTexture(sheet, skinColor);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [source]);
  return (
    <span
      className={"raster-sprite " + className}
      style={style}
      data-sheet={sheet}
      data-frame={frame}
      aria-hidden="true"
    >
      {failed ? (
        <span className="art-missing">素材を読み込めません</span>
      ) : (
        <img
          src={source}
          alt=""
          draggable={false}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          style={{
            width: cols * 100 + "%",
            height: rows * 100 + "%",
            left: -(frame % cols) * 100 + "%",
            top: -Math.floor(frame / cols) * 100 + "%",
          }}
        />
      )}
    </span>
  );
}
