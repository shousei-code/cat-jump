import { useState } from "react";
import { SCENES, PEOPLE } from "../game/data";
import type { GameState, Person, Scene } from "../game/types";
import type { Action } from "../game/engine";
import { Avatar } from "./Avatar";
import { Portrait } from "./Portrait";
import type { Expression } from "../art/manifest";
export function Story({
  state,
  dispatch,
  go,
}: {
  state: GameState;
  dispatch: (a: Action) => void;
  go: (s: string) => void;
}) {
  const [reply, setReply] = useState<{
    text: string;
    scene: Scene;
    speaker: Person | "narrator";
    mood: Expression;
  } | null>(null);
  if (state.node === "complete")
    return (
      <section className="completion panel">
        <span className="eyebrow">CHAPTER 01 · COMPLETE</span>
        <div className="crown">♛</div>
        <h1>はじまりのプリンセス</h1>
        <p>
          自分で選んだ色。勇気を出した一歩。
          <br />
          ことちゃんだけの物語が、ここに生まれました。
        </p>
        <p className="reward-line">
          初回クリア：100コイン・300EXP
          <br />
          プリンセスドレス ＆ 王冠をコレクションに追加
        </p>
        <div className="button-row">
          <button
            className="primary"
            onClick={() => dispatch({ type: "CAMPAIGN_START" })}
          >
            物語の第2章へ
          </button>
          <button onClick={() => go("closet")}>ごほうびを着てみる</button>
          <button onClick={() => go("map")}>温室の秘密を探す</button>
          <button onClick={() => go("battle")}>次のテーマで腕だめし</button>
        </div>
        <p className="fine">
          第1章クリア！
          第2章からは、文化祭・冬休み・バレンタインを経て、12章の結末へ進みます。
        </p>
      </section>
    );
  if (state.node === "brief")
    return (
      <section className="invitation panel">
        <span className="eyebrow">YOU ARE INVITED</span>
        <div className="crown">✉</div>
        <h1>歓迎祭の招待状</h1>
        <h2>春風のガーデンパーティー</h2>
        <p>
          キュートとナチュラルが主役のコンテスト。
          <br />
          クローゼットで衣装のタグと配色を見比べよう。
        </p>
        <p>初めから持っている衣装でも、全難易度に勝てます。</p>
        <div className="button-row">
          <button className="primary" onClick={() => go("closet")}>
            ✿ コーディネートを考える
          </button>
          <button onClick={() => go("battle")}>対決へ進む →</button>
        </div>
        <p className="fine">お友達ボーナスを受け取りました：30コイン・120EXP</p>
      </section>
    );
  const scene = reply?.scene || SCENES[state.node];
  const speaker = reply?.speaker || scene.speaker;
  const mood: Expression =
    reply?.mood ||
    (
      {
        letter: "calm",
        gate: "heart",
        welcome: "smile",
        invite: "worried",
        festival: "joy",
        epilogue: "surprised",
      } as Record<string, Expression>
    )[scene.id] ||
    "calm";
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">CHAPTER 01 · はじまりの招待状</span>
          <h1>{scene.title}</h1>
        </div>
        <span className="pill">{scene.location}</span>
      </div>
      <section className="story-stage academy-art">
        <div className="location-label">✧ {scene.location}</div>
        <div className="story-cast" key={speaker}>
          {speaker === "narrator" ? (
            <Avatar state={state} expression={mood} />
          ) : (
            <Portrait person={speaker} expression={reply ? "smile" : "calm"} />
          )}
        </div>
        {speaker !== "narrator" && (
          <div className="story-koto">
            <Avatar state={state} expression={mood} />
          </div>
        )}
        <div className="dialogue">
          <span className="speaker">
            {speaker === "narrator" ? "ことちゃんの物語" : PEOPLE[speaker].name}
          </span>
          <p>{reply?.text || scene.text}</p>
        </div>
      </section>
      <div className="choices">
        {reply ? (
          <button className="primary" onClick={() => setReply(null)}>
            つづける →
          </button>
        ) : (
          scene.choices.map((c) => (
            <button
              key={c.id}
              data-choice={c.id}
              onClick={() => {
                dispatch({ type: "CHOICE", id: c.id });
                setReply({
                  text: c.reply,
                  scene,
                  speaker: c.person || scene.speaker,
                  mood:
                    c.trait === "kind"
                      ? "shy"
                      : c.trait === "brave"
                        ? "joy"
                        : "surprised",
                });
              }}
            >
              <span>{c.label}</span>
              <small>{c.hint} →</small>
            </button>
          ))
        )}
      </div>
    </>
  );
}
