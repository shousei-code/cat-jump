import { Avatar } from "./Avatar";
import { THEMES, TAGS } from "../game/data";
import { scoreOutfit, rivalFor, type Action } from "../game/engine";
import type { GameState, Difficulty } from "../game/types";
const names = { normal: "ノーマル", hard: "ハード", expert: "エキスパート" };
export function Battle({
  state,
  dispatch,
  onCloset,
  onStory,
}: {
  state: GameState;
  dispatch: (a: Action) => void;
  onCloset: () => void;
  onStory: () => void;
}) {
  const theme = THEMES[state.themeIndex],
    score = scoreOutfit(state.equipped, theme.id),
    rival = rivalFor(state.difficulty, theme.id),
    result = state.battle;
  const allowed = ["brief", "complete"].includes(state.node);
  if (!allowed && !result)
    return (
      <div className="empty-panel">
        <span>✉</span>
        <h1>招待状が届くまで、もう少し。</h1>
        <p>第1章のお話を進めると、歓迎祭の対決が始まります。</p>
        <button className="primary" onClick={onStory}>
          物語をつづける
        </button>
      </div>
    );
  const rivalState = {
    ...state,
    hairColor: "#8573a0",
    eyeColor: "#826397",
    equipped: {
      hair: "hair-long",
      outfit: theme.id === "garden" ? "dress-mint" : "dress-moon",
      shoes: theme.id === "garden" ? "shoes-mint" : "shoes-night",
      accessory: theme.id === "garden" ? "acc-clover" : "acc-moon",
    },
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">WELCOME FASHION CONTEST</span>
          <h1>はじまりのランウェイ</h1>
          <p>大切なのは、テーマを読んで工夫すること。</p>
        </div>
        <span className="pill">参加費 0 コイン</span>
      </div>
      {result ? (
        <section
          className={`battle-result ${result.win ? "win" : ""}`}
          aria-live="polite"
        >
          <span className="eyebrow">
            {result.win ? "YOUR FIRST SPARKLE" : "ONE MORE TRY"}
          </span>
          <h2>
            {result.win
              ? "✧ ことちゃんの勝利！"
              : "あと一歩。着替えてもう一度！"}
          </h2>
          <div className="result-score">
            <span>
              ことちゃん <b>{result.score}</b>
            </span>
            <i>vs</i>
            <span>
              セイラ <b>{result.rivalScore}</b>
            </span>
          </div>
          <p>
            {result.win
              ? "セイラ「テーマに合う組み合わせ、すてきだったわ。あなたの工夫に拍手を！」"
              : `セイラ「${Math.max(0, result.rivalScore - result.score)}点の差ね。${TAGS[theme.primary]}のタグと、そろえた色を見直してみて。」`}
          </p>
          {result.rewarded ? (
            <p className="reward-line">
              ◈ 40コイン　✧ 150EXP　初回勝利ボーナス
            </p>
          ) : (
            <p className="fine">
              {result.win
                ? "このテーマ・難易度の初回報酬は受け取り済み。何度でも練習できます。"
                : "コインや衣装は減りません。工夫して、何度でも再挑戦できます。"}
            </p>
          )}
          <div className="button-row">
            {result.win ? (
              <button
                className="primary"
                onClick={() => {
                  dispatch({ type: "CLEAR_RESULT" });
                  onStory();
                }}
              >
                {state.chapterClear
                  ? "学園生活へもどる"
                  : "勝利のあとの物語へ →"}
              </button>
            ) : (
              <button
                className="primary"
                onClick={() => {
                  dispatch({ type: "CLEAR_RESULT" });
                  onCloset();
                }}
              >
                クローゼットで着替える
              </button>
            )}
            {state.chapterClear && (
              <button onClick={() => dispatch({ type: "CLEAR_RESULT" })}>
                もう一度対決する
              </button>
            )}
          </div>
        </section>
      ) : (
        <>
          <section className="theme-banner">
            <div className="theme-symbol">{theme.icon}</div>
            <div>
              <span className="eyebrow">TODAY’S THEME</span>
              <h2>{theme.name}</h2>
              <p>{theme.subtitle}</p>
              <span className="tag">{TAGS[theme.primary]} ×3</span>
              <span className="tag">{TAGS[theme.secondary]} ×2</span>
              <span className="tag">同じ配色 最大＋12</span>
            </div>
          </section>
          <div className="battle-options">
            <div className="segmented" aria-label="難易度">
              {(["normal", "hard", "expert"] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  aria-pressed={state.difficulty === d}
                  onClick={() => dispatch({ type: "DIFFICULTY", value: d })}
                >
                  {names[d]}
                </button>
              ))}
            </div>
            {state.chapterClear && (
              <label>
                練習テーマ{" "}
                <select
                  value={state.themeIndex}
                  onChange={(e) =>
                    dispatch({ type: "THEME", index: Number(e.target.value) })
                  }
                >
                  {THEMES.map((t, i) => (
                    <option value={i} key={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <div className="runway">
            <div className="competitor">
              <span className="eyebrow">YOUR COORDINATE</span>
              <h2>ことちゃん</h2>
              <Avatar state={state} />
              <strong className="total-score">
                {score.total}
                <small>点</small>
              </strong>
            </div>
            <div className="versus">VS</div>
            <div className="competitor rival">
              <span className="eyebrow">RIVAL · {names[state.difficulty]}</span>
              <h2>セイラ</h2>
              <Avatar state={rivalState} />
              <strong className="total-score">
                {rival.score}
                <small>点</small>
              </strong>
            </div>
          </div>
          <div className="score-columns">
            <section className="score-card">
              <h3>ことちゃんの得点内訳</h3>
              <p>
                {TAGS[theme.primary]}{" "}
                <b>
                  {score.tags[theme.primary]} ×3 = {score.primary}
                </b>
              </p>
              <p>
                {TAGS[theme.secondary]}{" "}
                <b>
                  {score.tags[theme.secondary]} ×2 = {score.secondary}
                </b>
              </p>
              <p>
                配色ボーナス <b>＋{score.harmony}</b>
              </p>
              <small>同じ配色が2点：＋3 / 3点：＋7 / 4点：＋12</small>
            </section>
            <section className="score-card">
              <h3>セイラの作戦</h3>
              <p>
                {rival.name} <b>{rival.score}点</b>
              </p>
              <p>{rival.description}</p>
              <small>
                テーマ点 {rival.primary + rival.secondary} ＋ 配色{" "}
                {rival.harmony}。ライバルの表示衣装は作戦のイメージです。
              </small>
            </section>
          </div>
          <div className="battle-guidance">
            <p>
              {state.difficulty === "expert"
                ? "点数の内訳から、自分だけの攻略を考えてみよう。"
                : `今回は${TAGS[theme.primary]}と${TAGS[theme.secondary]}が得意な衣装が有利。配色は各アイテムの色マークを確認しよう。`}
              <br />
              <small>
                同点はことちゃんの勝ち。結果にランダム要素はありません。
              </small>
            </p>
            <div className="button-row">
              <button onClick={onCloset}>✿ 着替えてくる</button>
              <button
                className="primary"
                onClick={() => dispatch({ type: "BATTLE" })}
              >
                このコーデで対決する →
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
