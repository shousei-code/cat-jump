import { useState } from "react";
import { CLUES, PEOPLE } from "../game/data";
import type { GameState, Person } from "../game/types";
import type { Action } from "../game/engine";
import { Portrait } from "./Portrait";
import { Avatar } from "./Avatar";
export function Academy({
  state,
  dispatch,
  toast,
}: {
  state: GameState;
  dispatch: (a: Action) => void;
  toast: (s: string) => void;
}) {
  const [symbols, setSymbols] = useState(["✦", "☾", "✿"]);
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">AFTER SCHOOL EXPLORATION</span>
          <h1>寄り道にも、きらめきを。</h1>
          <p>小さな手がかりを集めて、温室の扉を開こう。</p>
        </div>
        <span className="pill">手がかり {state.clues.length} / 2</span>
      </div>
      <div className="map-hero academy-art">
        <span>
          キラキラ学園
          <br />
          <small>花と秘密の、小さな学園</small>
        </span>
      </div>
      <div className="location-grid">
        {CLUES.map((c) => (
          <section className="panel" key={c.id}>
            <span className="location-icon">{c.symbol}</span>
            <h2>{c.place}</h2>
            <p>
              {state.clues.includes(c.id)
                ? c.text
                : "何かが、あなたを待っている。"}
            </p>
            <button
              onClick={() => {
                dispatch({ type: "CLUE", id: c.id });
                toast(
                  state.clues.includes(c.id)
                    ? c.text
                    : "手がかりを発見！ 10コイン・40EXP",
                );
              }}
            >
              {state.clues.includes(c.id) ? "手がかりを読み直す" : "調べてみる"}
            </button>
          </section>
        ))}
        <section className="panel greenhouse">
          <span className="location-icon">❦</span>
          <h2>秘密の温室</h2>
          {state.claimed.includes("mystery") ? (
            <>
              <p>
                扉の向こうに、月の光で咲く花。
                <br />
                秘密のドレスを手に入れました。
              </p>
              <div className="magic-prize">
                <Avatar
                  state={state}
                  outfit={{ ...state.equipped, outfit: "dress-secret" }}
                  expression="joy"
                  className="magic-reveal"
                  label="秘密の温室ドレスのごほうび"
                />
              </div>
              <span className="tag">✧ 謎解きクリア</span>
            </>
          ) : (
            <>
              <p>扉の3つの紋章を、正しい順番に。</p>
              {state.difficulty !== "expert" && (
                <small>中庭と図書室の言葉をつなげてみよう。</small>
              )}
              <div className="symbol-row">
                {symbols.map((v, i) => (
                  <select
                    key={i}
                    aria-label={"紋章 " + (i + 1)}
                    value={v}
                    onChange={(e) =>
                      setSymbols(
                        symbols.map((x, j) => (j === i ? e.target.value : x)),
                      )
                    }
                  >
                    {["☾", "✿", "✦"].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                ))}
              </div>
              <button
                className="primary"
                disabled={state.clues.length < 2}
                onClick={() => {
                  dispatch({ type: "SOLVE", symbols });
                  toast(
                    symbols.join(",") === "☾,✿,✦"
                      ? "扉が開いた！ 秘密のドレスを獲得しました。"
                      : "まだ開かないみたい。手がかりを読み直そう。",
                  );
                }}
              >
                {state.clues.length < 2 ? "手がかりを2つ集めよう" : "扉を開く"}
              </button>
            </>
          )}
        </section>
      </div>
    </>
  );
}
export function Album({
  state,
  onReplay,
}: {
  state: GameState;
  onReplay: () => void;
}) {
  const names: Record<string, string> = {
    "first-friends": "はじめての仲間",
    "first-win": "ランウェイの一番星",
    "chapter-1": "はじまりのプリンセス",
    "expert-win": "工夫の達人",
    mystery: "温室の秘密",
    "trial-fashion": "おしゃれの魔法",
    "trial-rhythm": "きらめくリズム",
    "trial-memory": "思い出の達人",
    "trial-puzzle": "学園の名探偵",
    "trial-mission": "笑顔を届ける係",
    "story-complete": "未来への約束",
    "true-ending": "運命は、みんなでつくる",
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">OUR PRECIOUS MEMORIES</span>
          <h1>思い出のアルバム</h1>
          <p>選んだ言葉が、みんなとの距離を変えていく。</p>
        </div>
      </div>
      <div className="trait-row">
        <span>
          ♡ やさしさ <b>{state.traits.kind}</b>
        </span>
        <span>
          ♧ 勇気 <b>{state.traits.brave}</b>
        </span>
        <span>
          ✧ 知りたさ <b>{state.traits.curious}</b>
        </span>
      </div>
      <div className="friends-grid">
        {(Object.keys(PEOPLE) as Person[]).map((id) => (
          <section className="friend-card" key={id}>
            <Portrait person={id} small />
            <div>
              <small>{PEOPLE[id].role}</small>
              <h2>{PEOPLE[id].name}</h2>
              <p>{PEOPLE[id].quote}</p>
              <span className="tag">♡ なかよし {state.relations[id]}</span>
            </div>
          </section>
        ))}
      </div>
      <section className="panel">
        <h2>
          ✧ 実績 {state.achievements.length} / {Object.keys(names).length}
        </h2>
        <div className="achievement-list">
          {Object.entries(names).map(([id, name]) => (
            <span
              className={state.achievements.includes(id) ? "earned" : ""}
              key={id}
            >
              {state.achievements.includes(id) ? "✦" : "◇"} {name}
            </span>
          ))}
        </div>
        <h3>ことちゃんの日記</h3>
        {state.history.length ? (
          <ol className="history">
            {state.history
              .slice()
              .reverse()
              .map((x, i) => (
                <li key={i}>{x}</li>
              ))}
          </ol>
        ) : (
          <p>物語を始めると、思い出が増えていきます。</p>
        )}
        {state.chapterClear && (
          <>
            <button onClick={onReplay}>
              {state.campaign
                ? "続きの物語へ戻る"
                : "別の選択で第1章をもう一度"}
            </button>
            <p className="fine">
              {state.campaign
                ? "物語の進行はそのまま。続きの章やエンディング図鑑に戻れます。"
                : "衣装・コイン・実績は引き継ぎます。関係と性格はリセット。初回報酬は再取得できません。"}
            </p>
          </>
        )}
      </section>
    </>
  );
}
