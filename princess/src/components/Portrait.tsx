import { Avatar } from "./Avatar";
import { useArtReady } from "../art/useArtReady";
import { RasterSprite } from "./RasterSprite";
import { BOYS, type Expression } from "../art/manifest";
import { PEOPLE } from "../game/data";
import { freshState } from "../game/engine";
import type { Person } from "../game/types";
export function Portrait({
  person,
  happy = false,
  small = false,
  expression = "calm",
}: {
  person: Person;
  happy?: boolean;
  small?: boolean;
  expression?: Expression;
}) {
  const mood = happy ? "joy" : expression,
    p = PEOPLE[person],
    boy = BOYS[person];
  const artStatus = useArtReady(boy ? [boy.sheet] : [], !!boy && !small);
  if (boy) {
    const row = ["joy", "smile", "wink", "closedSmile", "heart"].includes(mood)
      ? 1
      : ["sad", "worried", "angry"].includes(mood)
        ? 2
        : 0;
    return (
      <div
        className={`portrait illustrated-portrait ${small ? "small" : ""}`}
        role="img"
        aria-label={p.name + "のイラスト"}
        data-person={person}
        data-expression={mood}
        data-art-status={artStatus}
      >
        {artStatus !== "ready" && (
          <span className="portrait-loading" role="status">
            {artStatus === "error"
              ? "画像を読み込めません"
              : "イラストを読み込み中…"}
          </span>
        )}
        <RasterSprite
          sheet={boy.sheet}
          frame={row * 2 + boy.column}
          eager={!small}
        />
      </div>
    );
  }
  const state = freshState();
  state.hairColor = { mio: "#b880a7", yui: "#d6a65e", seira: "#8580b7" }[
    person as "mio" | "yui" | "seira"
  ];
  state.equipped = {
    hair:
      person === "mio"
        ? "hair-twin"
        : person === "yui"
          ? "hair-braid"
          : "hair-long",
    outfit: person === "seira" ? "dress-moon" : "dress-rose",
    shoes: "shoes-rose",
    accessory: person === "seira" ? "acc-moon" : "acc-ribbon",
  };
  return (
    <div className={`portrait drawn ${small ? "small" : ""}`}>
      <Avatar state={state} expression={mood} label={p.name} animate={!small} />
    </div>
  );
}
