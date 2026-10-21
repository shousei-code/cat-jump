import { Avatar } from "./Avatar";
import { PEOPLE } from "../game/data";
import { freshState } from "../game/engine";
import type { Person } from "../game/types";
export function Portrait({
  person,
  happy = false,
  small = false,
}: {
  person: Person;
  happy?: boolean;
  small?: boolean;
}) {
  const p = PEOPLE[person];
  if (p.portrait !== null)
    return (
      <div
        className={`portrait ${small ? "small" : ""} ${happy ? "happy" : ""}`}
        role="img"
        aria-label={`${p.name}のイラスト`}
        style={{
          backgroundPosition: `${(p.portrait % 3) * 50}% ${Math.floor(p.portrait / 3) * 100}%`,
        }}
      />
    );
  const state = freshState();
  state.hairColor = { mio: "#a87183", yui: "#9d805d", seira: "#8273a0" }[
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
      <Avatar
        state={state}
        expression={happy ? "happy" : "calm"}
        label={p.name}
      />
    </div>
  );
}
