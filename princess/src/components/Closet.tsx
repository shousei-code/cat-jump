import { CHAPTERS } from "../campaign/data";
import { useState } from "react";
import {
  ITEMS,
  SLOTS,
  TAGS,
  PALETTES,
  THEMES,
  HAIR_COLORS,
  EYE_COLORS,
  SKIN_COLORS,
  getItem,
} from "../game/data";
import { scoreOutfit, type Action } from "../game/engine";
import type { GameState, Slot, Tag } from "../game/types";
import { Avatar } from "./Avatar";
import { EXPRESSIONS, type Expression } from "../art/manifest";
export function Closet({
  state,
  dispatch,
  onBattle,
  toast,
}: {
  state: GameState;
  dispatch: (a: Action) => void;
  onBattle: () => void;
  toast: (t: string) => void;
}) {
  const [expression, setExpression] = useState<Expression>("calm");
  const [slot, setSlot] = useState<Slot>("outfit"),
    [selected, setSelected] = useState(state.equipped.outfit),
    [filter, setFilter] = useState<"owned" | "all">("owned");
  const item = getItem(selected),
    owned = state.owned.includes(item.id),
    theme = state.campaign
      ? THEMES.find(
          (t) =>
            t.id ===
            CHAPTERS.find((c) => c.number === state.campaign!.chapter)!.theme,
        )!
      : THEMES[state.themeIndex],
    score = scoreOutfit(state.equipped, theme.id);
  const list = ITEMS.filter(
    (i) => i.slot === slot && (filter === "all" || state.owned.includes(i.id)),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">MY LITTLE ATELIER</span>
          <h1>ことちゃんのクローゼット</h1>
          <p>好きな色を、今日の勇気に。</p>
        </div>
        <span className="pill">
          ✧ {state.owned.length} / {ITEMS.length} 点
        </span>
      </div>
      <div className="closet-layout">
        <section className="dressing-room">
          <div className="room-title">
            <span>KOTO’S COORDINATE</span>
            <b>✧</b>
          </div>
          <div className="mirror">
            <Avatar state={state} expression={expression} />
          </div>
          <div className="coordinate-tags">
            {Object.values(state.equipped).map((id) => (
              <span
                key={id}
                style={{ borderColor: PALETTES[getItem(id).palette].color }}
              >
                {getItem(id).name}
              </span>
            ))}
          </div>
          <details className="expression-studio">
            <summary>表情を見てみる</summary>
            <div className="expression-closeup">
              <Avatar state={state} expression={expression} animate={false} />
            </div>
            <div className="expression-buttons">
              {Object.entries(EXPRESSIONS)
                .filter(([id]) => id !== "blink")
                .map(([id, mood]) => (
                  <button
                    key={id}
                    aria-pressed={expression === id}
                    onClick={() => setExpression(id as Expression)}
                  >
                    {mood.label}
                  </button>
                ))}
            </div>
          </details>
          <div className="appearance">
            <p>髪色</p>
            <div className="swatches">
              {HAIR_COLORS.map((c, i) => (
                <button
                  key={c}
                  style={{ background: c }}
                  aria-label={`髪色 ${i + 1}`}
                  aria-pressed={state.hairColor === c}
                  onClick={() =>
                    dispatch({ type: "APPEARANCE", key: "hairColor", value: c })
                  }
                />
              ))}
            </div>
            <p>瞳の色</p>
            <div className="swatches">
              {EYE_COLORS.map((c, i) => (
                <button
                  key={c}
                  style={{ background: c }}
                  aria-label={`瞳の色 ${i + 1}`}
                  aria-pressed={state.eyeColor === c}
                  onClick={() =>
                    dispatch({ type: "APPEARANCE", key: "eyeColor", value: c })
                  }
                />
              ))}
            </div>
            <p>肌の色</p>
            <div className="swatches">
              {SKIN_COLORS.map((c, i) => (
                <button
                  key={c}
                  style={{ background: c }}
                  aria-label={`肌の色 ${i + 1}`}
                  aria-pressed={state.skinColor === c}
                  onClick={() =>
                    dispatch({ type: "APPEARANCE", key: "skinColor", value: c })
                  }
                />
              ))}
            </div>
          </div>
        </section>
        <section className="wardrobe-panel">
          <div className="wardrobe-tabs" role="group" aria-label="衣装の種類">
            {Object.entries(SLOTS).map(([id, label]) => (
              <button
                key={id}
                aria-pressed={slot === id}
                onClick={() => {
                  setSlot(id as Slot);
                  setSelected(state.equipped[id as Slot]);
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="filter-line">
            <div className="segmented">
              <button
                aria-pressed={filter === "owned"}
                onClick={() => setFilter("owned")}
              >
                持っている
              </button>
              <button
                aria-pressed={filter === "all"}
                onClick={() => setFilter("all")}
              >
                コレクション全部
              </button>
            </div>
            <span>{list.length} ITEMS</span>
          </div>
          <div className="item-grid">
            {list.map((i) => (
              <button
                className={`item-card ${selected === i.id ? "selected" : ""}`}
                key={i.id}
                data-item={i.id}
                aria-pressed={state.equipped[i.slot] === i.id}
                onClick={() => {
                  setSelected(i.id);
                  if (state.owned.includes(i.id)) {
                    dispatch({ type: "EQUIP", id: i.id });
                    toast(i.name + "を着用しました");
                  }
                }}
              >
                <div className={`item-preview ${i.slot}`}>
                  <Avatar
                    state={state}
                    outfit={{ ...state.equipped, [i.slot]: i.id }}
                    label={i.name}
                    animate={false}
                  />
                  {state.equipped[i.slot] === i.id && (
                    <span className="equipped-label">着用中</span>
                  )}
                  {!state.owned.includes(i.id) && (
                    <span className="lock-label">
                      {i.unlock ? "◇" : "◈ " + i.price}
                    </span>
                  )}
                </div>
                <strong>{i.name}</strong>
                <span className="item-palette">
                  <i style={{ background: PALETTES[i.palette].color }} />
                  {PALETTES[i.palette].name}
                  {i.rarity !== "basic" ? " · RARE" : ""}
                </span>
              </button>
            ))}
          </div>
          <div className="item-detail">
            <div>
              <span className="eyebrow">
                {item.rarity === "secret"
                  ? "SECRET COLLECTION"
                  : item.rarity === "rare"
                    ? "RARE COLLECTION"
                    : "ITEM DETAILS"}
              </span>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
            </div>
            <div className="tag-stats">
              {Object.entries(item.tags).map(([tag, n]) => (
                <span key={tag}>
                  {TAGS[tag as Tag]} <b>{n}</b>
                </span>
              ))}
            </div>
            {!owned &&
              (item.unlock ? (
                <p className="muted">
                  {item.unlock === "chapter"
                    ? "第1章クリアで手に入る衣装です。"
                    : "温室の小さな謎を解くと手に入ります。"}
                </p>
              ) : (
                <button
                  className="primary"
                  disabled={state.coins < item.price}
                  onClick={() => {
                    dispatch({ type: "BUY", id: item.id });
                    dispatch({ type: "EQUIP", id: item.id });
                    toast(item.name + "を購入して着用しました");
                  }}
                >
                  {state.coins < item.price
                    ? "コインが足りません"
                    : `◈ ${item.price} コインで購入して着る`}
                </button>
              ))}
          </div>
          <div className="closet-score">
            <span>
              {theme.icon} {theme.name}
              <small>いまのコーディネート</small>
            </span>
            <b>
              {score.total}
              <small>点</small>
            </b>
            <button onClick={onBattle}>対決を確認 →</button>
          </div>
          <p className="fine">
            髪色・瞳・肌の色は見た目だけの設定です。得点はアイテムのタグと表示された配色で決まります。
          </p>
        </section>
      </div>
    </>
  );
}
