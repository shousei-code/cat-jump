import { useEffect, useRef, useState } from "react";
import {
  CHAPTERS,
  DIFFICULTY_NAMES,
  type Chapter,
  type ChallengeKind,
  type CampaignDifficulty,
} from "./data";
import { threshold } from "./engine";
const symbols = ["★", "♥", "◆", "☾"];
const colors = ["#af7daa", "#739eaa", "#b39a65", "#8681ae"];
const rank = (d: CampaignDifficulty) =>
  ["normal", "hard", "expert", "secret"].indexOf(d);
function useElapsed(running: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const time = useRef(0);
  useEffect(() => {
    if (!running) return;
    let last = performance.now(),
      id = 0;
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (!document.hidden && dt < 1000) {
        time.current += dt;
        setElapsed(time.current);
      }
      id = requestAnimationFrame(tick);
    };
    time.current = 0;
    setElapsed(0);
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [running]);
  return elapsed;
}
export function Challenge({
  kind,
  chapter,
  difficulty,
  fashionScore,
  onResult,
  onCloset,
}: {
  kind: ChallengeKind;
  chapter: Chapter;
  difficulty: CampaignDifficulty;
  fashionScore: number;
  onResult: (score: number) => void;
  onCloset: () => void;
}) {
  const [phase, setPhase] = useState<"ready" | "play" | "result">("ready");
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const done = useRef(false);
  const elapsed = useElapsed(phase === "play");
  const level = rank(difficulty);
  const count =
    kind === "rhythm"
      ? 10 + level * 2
      : kind === "memory"
        ? 4 + level
        : 8 + level * 2;
  const spacing = [850, 720, 620, 540][level],
    windowMs = [240, 190, 145, 115][level];
  const sequence = Array.from(
    { length: count },
    (_, i) => (i * i + i * 3 + chapter.number + Math.floor(i / 2)) % 4,
  );
  const beats = sequence.map((lane, i) => ({ lane, at: 1500 + i * spacing }));
  const demoDuration = count * 850 + 450;
  const finish = (value: number) => {
    if (done.current) return;
    done.current = true;
    const n = Math.max(0, Math.min(100, Math.round(value)));
    setScore(n);
    setPhase("result");
    onResult(n);
  };
  const tap = (tile: number) => {
    if (phase !== "play" || done.current) return;
    if (kind === "memory") {
      if (elapsed < demoDuration) return;
      if (tile !== sequence[hits.length]) {
        finish(0);
        return;
      }
      if (hits.length + 1 === count) finish(100);
      else setHits([...hits, tile]);
    } else if (kind === "rhythm") {
      const index = beats.findIndex(
        (b, i) =>
          b.lane === tile &&
          !hits.includes(i) &&
          Math.abs(elapsed - b.at) <= windowMs,
      );
      if (index < 0) setMistakes((n) => n + 1);
      else setHits([...hits, index]);
    } else if (kind === "mission") {
      const target = (hits.length * 5 + chapter.number) % 9;
      if (tile !== target) {
        setMistakes((n) => n + 1);
        return;
      }
      if (hits.length + 1 === count) finish(Math.max(0, 100 - mistakes * 10));
      else setHits([...hits, tile]);
    }
  };
  const tapRef = useRef(tap);
  tapRef.current = tap;
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (
        event.repeat ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLSelectElement
      )
        return;
      const keys = ["ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight"];
      let i = keys.indexOf(event.key);
      if (i < 0 && /^[1-4]$/.test(event.key)) i = Number(event.key) - 1;
      if (i >= 0 && (kind === "rhythm" || kind === "memory")) {
        event.preventDefault();
        tapRef.current(i);
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [kind]);
  const limit = [24000, 20000, 16000, 13000][level];
  useEffect(() => {
    if (phase !== "play") return;
    if (kind === "rhythm" && elapsed > beats.at(-1)!.at + windowMs + 250)
      finish((hits.length * 100 - mistakes * 20) / count);
    if (kind === "mission" && elapsed >= limit) finish(0);
  }, [elapsed, phase]);
  const puzzle = chapter.puzzle ?? CHAPTERS.find((c) => c.puzzle)!.puzzle!;
  const pass = score >= threshold(difficulty);
  const instructions: Record<ChallengeKind, string> = {
    fashion:
      "テーマのタグと配色をそろえよう。着せ替えで得点の内訳を確認できます。",
    rhythm:
      "上から落ちてくる印が金色の線に重なったら、同じ列のボタンを押そう。連打すると減点。音なしでも遊べます。",
    memory:
      "光る印を順番に覚えて、同じ順番で押そう。覚えている間は操作できません。",
    puzzle: "手がかりを読み、答えを選ぼう。間違えても何度でも挑戦できます。",
    mission:
      "上に表示された品物を探してタップし、リストの順番に届けよう。違う品物は減点。時間内に全部届ければ合格判定です。",
  };
  return (
    <section className="panel challenge-panel">
      <span className="eyebrow">
        {DIFFICULTY_NAMES[difficulty]} · 合格 {threshold(difficulty)}点
      </span>
      <h2>
        {kind === chapter.kind
          ? chapter.challenge
          : {
              rhythm: "星のリズム",
              memory: "きらめきの記憶",
              puzzle: "花時計の暗号",
              mission: "準備リレー",
              fashion: "コーディネート練習",
            }[kind]}
      </h2>
      <p>{instructions[kind]}</p>
      <p className="fine">
        失敗してもコインは減りません。別の画面へ移動すると挑戦の最初から再開します。非表示タブでは時計が止まります。
      </p>
      {phase === "ready" && (
        <button
          className="primary"
          onClick={(event) => {
            const panel = event.currentTarget.closest("section");
            setPhase("play");
            requestAnimationFrame(() =>
              panel?.scrollIntoView({ block: "start", behavior: "instant" }),
            );
          }}
        >
          挑戦をはじめる
        </button>
      )}
      {phase === "play" && kind === "fashion" && (
        <>
          <p>
            いまの得点：
            <strong>
              {Math.min(100, Math.round((fashionScore / 80) * 100))}点
            </strong>
            （コーデ得点 {fashionScore} / 基準80）
          </p>
          <div className="button-row">
            <button onClick={onCloset}>着せ替えで準備する</button>
            <button
              className="primary"
              onClick={() =>
                finish(Math.min(100, Math.round((fashionScore / 80) * 100)))
              }
            >
              このコーデで挑む
            </button>
          </div>
        </>
      )}
      {phase === "play" && kind === "rhythm" && (
        <>
          <div className="rhythm-track" aria-label="リズムの光る目印">
            <div className="rhythm-line" />
            {beats.map((b, i) => {
              const y = 250 + (elapsed - b.at) * 0.17;
              return !hits.includes(i) && y > -24 && y < 285 ? (
                <span
                  key={i}
                  className="rhythm-note"
                  style={{
                    left: `${b.lane * 25 + 12.5}%`,
                    top: y,
                    background: colors[b.lane],
                  }}
                >
                  {symbols[b.lane]}
                </span>
              ) : null;
            })}
          </div>
          <div className="challenge-tiles">
            {symbols.map((x, i) => (
              <button
                key={x}
                aria-label={`リズム ${i + 1}`}
                onClick={() => tap(i)}
              >
                {x}
                <small>{i + 1}</small>
              </button>
            ))}
          </div>
          <p role="status">
            成功 {hits.length} / {count}　空振り {mistakes}
          </p>
        </>
      )}
      {phase === "play" && kind === "memory" && (
        <>
          <p role="status">
            {elapsed < demoDuration
              ? `順番を覚えよう ${Math.min(count, Math.floor(elapsed / 850) + 1)} / ${count}`
              : `同じ順番で押そう ${hits.length} / ${count}`}
          </p>
          <div className="challenge-tiles">
            {symbols.map((x, i) => (
              <button
                key={x}
                disabled={elapsed < demoDuration}
                className={
                  elapsed < demoDuration &&
                  elapsed % 850 < 600 &&
                  sequence[Math.floor(elapsed / 850)] === i
                    ? "lit"
                    : ""
                }
                aria-label={`記憶 ${i + 1}`}
                onClick={() => tap(i)}
              >
                {x}
                <small>{i + 1}</small>
              </button>
            ))}
          </div>
        </>
      )}
      {phase === "play" && kind === "puzzle" && (
        <>
          <p className="puzzle-clue">{puzzle.clue}</p>
          {level < 2 && <p>ヒント：{puzzle.hint}</p>}
          <div className="choices">
            {puzzle.options.map((answer) => (
              <button
                key={answer}
                onClick={() => finish(answer === puzzle.answer ? 100 : 0)}
              >
                {answer}
              </button>
            ))}
          </div>
        </>
      )}
      {phase === "play" && kind === "mission" && (
        <>
          <p role="status">
            次に届けるもの：<strong>{symbols[hits.length % 4]}</strong>　
            {hits.length}/{count}　残り{" "}
            {Math.max(0, Math.ceil((limit - elapsed) / 1000))}秒
          </p>
          <div className="mission-grid">
            {Array.from({ length: 9 }, (_, i) => {
              const correct = i === (hits.length * 5 + chapter.number) % 9;
              return (
                <button
                  key={i}
                  aria-label={`${correct ? "届ける品物" : "別の品物"} ${i + 1}`}
                  onClick={() => tap(i)}
                >
                  {correct
                    ? symbols[hits.length % 4]
                    : symbols[(hits.length + 1 + (i % 3)) % 4]}
                </button>
              );
            })}
          </div>
          <p>お手つき {mistakes} 回</p>
        </>
      )}
      {phase === "result" && (
        <div role="status">
          <h3>
            {pass ? "✧ チャレンジ成功！" : "あと一歩。もう一度挑戦しよう！"}
          </h3>
          <p>
            {score}点 / 合格 {threshold(difficulty)}点
          </p>
          <p>上の「再挑戦」で最初から練習できます。難易度も変更できます。</p>
        </div>
      )}
    </section>
  );
}
