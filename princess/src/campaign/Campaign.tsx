import { useState } from "react";
import type { GameState, Person } from "../game/types";
import type { Action } from "../game/engine";
import { scoreOutfit } from "../game/engine";
import { PEOPLE, TAGS, THEMES } from "../game/data";
import { Avatar } from "../components/Avatar";
import { Portrait } from "../components/Portrait";
import { Challenge } from "./Challenge";
import {
  CHAPTERS,
  ENDINGS,
  ROUTE_NAMES,
  KIND_NAMES,
  DIFFICULTY_NAMES,
  beatsFor,
  type ChallengeKind,
  type CampaignDifficulty,
  type Route,
} from "./data";
import { trueConditions } from "./engine";
export function Campaign({
  state,
  dispatch,
  go,
}: {
  state: GameState;
  dispatch: (a: Action) => void;
  go: (s: string) => void;
}) {
  const c = state.campaign!;
  const chapter = CHAPTERS.find((x) => x.number === c.chapter)!;
  const [mode, setMode] = useState<"story" | "practice" | "album">("story");
  const [practice, setPractice] = useState<ChallengeKind>("rhythm");
  const [attempt, setAttempt] = useState(0);
  const [reply, setReply] = useState<{
    text: string;
    speaker: Person | "narrator";
  } | null>(null);
  const challengeKind = mode === "practice" ? practice : chapter.kind;
  const retry = () => setAttempt((n) => n + 1);
  const conditions = trueConditions(state);
  const challenge = (
    <>
      <div className="button-row">
        <label>
          難易度{" "}
          <select
            aria-label="続きの難易度"
            value={c.difficulty}
            onChange={(e) => {
              dispatch({
                type: "CAMPAIGN_DIFFICULTY",
                value: e.target.value as CampaignDifficulty,
              });
              retry();
            }}
          >
            {Object.entries(DIFFICULTY_NAMES).map(([key, name]) => (
              <option
                key={key}
                value={key}
                disabled={key === "secret" && !c.endings.length}
              >
                {name}
                {key === "secret" && !c.endings.length
                  ? "（エンディング後）"
                  : ""}
              </option>
            ))}
          </select>
        </label>
        <button onClick={retry}>再挑戦</button>
      </div>
      {challengeKind === "fashion" && (
        <p>
          テーマ：{TAGS[THEMES.find((t) => t.id === chapter.theme)!.primary]} ＆{" "}
          {TAGS[THEMES.find((t) => t.id === chapter.theme)!.secondary]}
          。同じ配色も得点になります。
        </p>
      )}
      <Challenge
        key={`${mode}-${challengeKind}-${c.chapter}-${c.difficulty}-${attempt}`}
        kind={challengeKind}
        chapter={chapter}
        difficulty={c.difficulty}
        fashionScore={scoreOutfit(state.equipped, chapter.theme).total}
        onCloset={() => go("closet")}
        onResult={(score) =>
          dispatch({
            type: "CAMPAIGN_RESULT",
            kind: challengeKind,
            score,
            practice: mode === "practice",
          })
        }
      />
      <p className="fine">
        種類×難易度の初合格：180コイン・600EXP。章の初クリア：150コイン・1200EXP。再挑戦は無料、受け取り済みの報酬は増えません。
      </p>
    </>
  );
  const beat = beatsFor(chapter, c.route)[c.beat];
  const speaker = reply?.speaker ?? beat.speaker;
  return (
    <div className="campaign">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            CHAPTER {c.chapter} / 12 · {chapter.season}
          </span>
          <h1>{chapter.title}</h1>
          <p>
            {chapter.place} ·{" "}
            {c.route
              ? ROUTE_NAMES[c.route] + "のルート"
              : "自分の気持ちを見つける物語"}
          </p>
        </div>
        <span className="pill">結末 {c.endings.length} / 6</span>
      </div>
      <div className="button-row campaign-tabs">
        {(
          [
            ["story", "物語を進める"],
            ["practice", "ミニゲーム練習"],
            ["album", "結末と実績"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            aria-pressed={mode === id}
            onClick={() => {
              setMode(id);
              retry();
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {mode === "practice" ? (
        <>
          <p>
            自由に練習できます。合格記録と初回報酬は保存され、物語の進行は変わりません。
          </p>
          <div className="button-row">
            {Object.entries(KIND_NAMES).map(([id, name]) => (
              <button
                key={id}
                aria-pressed={practice === id}
                onClick={() => {
                  setPractice(id as ChallengeKind);
                  retry();
                }}
              >
                {name}
              </button>
            ))}
          </div>
          {challenge}
        </>
      ) : mode === "album" ? (
        <>
          <section className="panel">
            <h2>ことちゃんのエンディングブック</h2>
            {Object.entries(ENDINGS).map(([id, e]) => (
              <details key={id}>
                <summary>
                  {c.endings.includes(id as Route | "true")
                    ? "✧ " + e.title
                    : "◇ まだ見ていない結末"}
                </summary>
                <p>
                  {c.endings.includes(id as Route | "true")
                    ? e.text
                    : id === "true"
                      ? "下の条件をすべて満たすと開きます。"
                      : "第9章で、一緒に進む相手を選び直してみよう。"}
                </p>
              </details>
            ))}
            <h3>真のエンディングへの手がかり</h3>
            <ul>
              {conditions.map((x) => (
                <li key={x.label}>
                  {x.done ? "✓" : "◇"} {x.label}
                </li>
              ))}
            </ul>
            <div className="button-row">
              <button onClick={() => go("map")}>学園で温室を調べる</button>
              <button
                disabled={!conditions.every((x) => x.done)}
                onClick={() => {
                  dispatch({ type: "CAMPAIGN_TRUE" });
                  setMode("story");
                }}
              >
                約束の庭の奥へ
              </button>
            </div>
          </section>
          <section className="panel">
            <h2>チャレンジの記録</h2>
            {Object.entries(KIND_NAMES).map(([kind, name]) => (
              <p key={kind}>
                {name}：
                {Object.keys(DIFFICULTY_NAMES)
                  .map(
                    (d) =>
                      `${DIFFICULTY_NAMES[d as CampaignDifficulty]} ${c.records[kind + ":" + d] ?? "—"}`,
                  )
                  .join(" / ")}
              </p>
            ))}
            <p>
              最大レベル50。全章と各種類・難易度の初合格で経験値を集めよう。
            </p>
          </section>
        </>
      ) : reply ? (
        <section className="panel campaign-reply">
          <div className="campaign-reply-portrait">
            {speaker === "narrator" ? (
              <Avatar state={state} expression="shy" />
            ) : (
              <Portrait person={speaker} expression="smile" />
            )}
          </div>
          <h2>
            {speaker === "narrator" ? "ことちゃん" : PEOPLE[speaker].name}
          </h2>
          <p>{reply.text}</p>
          <button className="primary" onClick={() => setReply(null)}>
            つづける
          </button>
        </section>
      ) : c.phase === "ending" ? (
        <section className="panel campaign-ending">
          <span className="eyebrow">
            ENDING · {c.ending === "true" ? "TRUE STORY" : "YOUR STORY"}
          </span>
          <div className="ending-character">
            <Avatar state={state} expression="joy" />
          </div>
          <h2>{ENDINGS[c.ending!].title}</h2>
          <p>{ENDINGS[c.ending!].text}</p>
          <p>ことちゃんの物語を最後まで遊んでくれてありがとう。</p>
          <p>
            シークレット難易度が解放されました。別の選択や真の結末にも挑戦できます。
          </p>
          <div className="button-row">
            <button onClick={() => setMode("album")}>結末と実績を見る</button>
            <button
              onClick={() => {
                dispatch({ type: "CAMPAIGN_REPLAY" });
                setReply(null);
                retry();
              }}
            >
              衣装と記録を残して第2章から
            </button>
          </div>
          <p className="fine">
            再プレイで衣装・結末・経験値は失われません。初回報酬は再び受け取れません。
          </p>
        </section>
      ) : c.phase === "clear" ? (
        <section className="panel campaign-clear">
          <span className="eyebrow">CHAPTER CLEAR</span>
          <h2>第{c.chapter}章クリア！</h2>
          <p>一つの挑戦が、次の物語につながりました。</p>
          <p>
            所持コイン：{state.coins} · 経験値：{state.xp}
          </p>
          <div className="button-row">
            <button
              className="primary"
              onClick={() => {
                dispatch({ type: "CAMPAIGN_NEXT" });
                retry();
              }}
            >
              第{c.chapter + 1}章へ進む
            </button>
            <button onClick={() => go("closet")}>
              ごほうびでおしゃれを楽しむ
            </button>
          </div>
        </section>
      ) : c.phase === "challenge" ? (
        challenge
      ) : c.chapter === 9 && !c.route ? (
        <section className="panel">
          <h2>この先を、誰と歩こう？</h2>
          <p>
            恋のルートも、みんなとの友情も、どちらも素敵な選択です。結末を見たあとに選び直せます。
          </p>
          <div className="route-grid">
            {Object.entries(ROUTE_NAMES).map(([id, name]) => (
              <button
                key={id}
                className="route-card"
                onClick={() =>
                  dispatch({ type: "CAMPAIGN_ROUTE", route: id as Route })
                }
              >
                {id !== "friendship" && (
                  <Portrait person={id as Person} small />
                )}
                <strong>{name}</strong>
                {id !== "friendship" && (
                  <small>関係 {state.relations[id as Person]}</small>
                )}
              </button>
            ))}
          </div>
        </section>
      ) : (
        <>
          <section className="story-stage academy-art">
            <div className="location-label">{chapter.place}</div>
            <div className="story-cast" key={speaker}>
              {speaker === "narrator" ? (
                <Avatar state={state} expression="smile" />
              ) : (
                <Portrait
                  person={speaker}
                  expression={c.beat === 1 ? "worried" : "smile"}
                />
              )}
            </div>
            {speaker !== "narrator" && (
              <div className="story-koto">
                <Avatar
                  state={state}
                  expression={c.beat === 1 ? "worried" : "smile"}
                />
              </div>
            )}
            <div className="dialogue">
              <span className="speaker">
                {speaker === "narrator"
                  ? "ことちゃんの物語"
                  : PEOPLE[speaker].name}
              </span>
              <p>{beat.text}</p>
            </div>
          </section>
          <div className="choices">
            {beat.options.map((choice, i) => (
              <button
                key={`${c.chapter}-${c.beat}-${i}`}
                onClick={() => {
                  setReply({
                    text: choice.reply,
                    speaker: choice.person ?? speaker,
                  });
                  dispatch({ type: "CAMPAIGN_CHOICE", index: i });
                }}
              >
                {choice.label}
                <small>
                  {choice.trait === "kind" ? "やさしさ" : "勇気"} +1
                  {choice.person
                    ? " · " + PEOPLE[choice.person].name + " +2"
                    : ""}
                </small>
              </button>
            ))}
          </div>
        </>
      )}
      <details className="panel chapter-progress">
        <summary>一年の物語・進行状況</summary>
        <ol>
          <li>第1章 はじまりの招待状 ✓</li>
          {CHAPTERS.map((ch) => (
            <li key={ch.number}>
              第{ch.number}章 {ch.title}{" "}
              {c.cleared.includes(ch.number)
                ? "✓"
                : ch.number === c.chapter
                  ? "←いまここ"
                  : "◇"}
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
