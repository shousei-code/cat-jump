import { useEffect, useState } from "react";
import { useGame, downloadText } from "./useGame";
import { levelFor, parseSave } from "./game/engine";
import { Avatar } from "./components/Avatar";
import { Story } from "./components/Story";
import { Closet } from "./components/Closet";
import { Battle } from "./components/Battle";
import { Academy, Album } from "./components/Academy";
import { Dialog } from "./components/Dialog";
import { startAudio, stopAudio, setAudioVolume, chime } from "./audio";
const tabs = [
  ["story", "✉", "物語"],
  ["closet", "♧", "着せ替え"],
  ["battle", "♛", "対決"],
  ["map", "❀", "学園"],
  ["album", "♡", "アルバム"],
  ["settings", "⚙", "設定"],
];
export default function App() {
  const game = useGame(),
    { state, dispatch } = game;
  const [screen, setScreen] = useState("title"),
    [notice, setNotice] = useState(""),
    [confirm, setConfirm] = useState(""),
    [pending, setPending] = useState(""),
    [music, setMusic] = useState(false);
  function go(s: string) {
    setScreen(s);
    window.scrollTo(0, 0);
    chime();
  }
  function toast(s: string) {
    setNotice(s);
  }
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(t);
  }, [notice]);
  useEffect(() => {
    const hide = () => {
      if (document.hidden) {
        stopAudio();
        setMusic(false);
      }
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      document.removeEventListener("visibilitychange", hide);
      stopAudio();
    };
  }, []);
  function newGame() {
    game.reset();
    go("create");
  }
  function exportSave() {
    downloadText(
      game.blocked && game.rawInvalid
        ? game.rawInvalid
        : JSON.stringify(state, null, 2),
      "kirakira-save.json",
    );
  }
  const settings = (
    <section className="panel settings">
      <span className="eyebrow">SAVE & SOUND</span>
      <h1>設定とセーブ</h1>
      <p>
        進行はこのブラウザに自動保存されます。他の端末へはセーブファイルを移してください。
      </p>
      <p role="status">{game.saveStatus}</p>
      <div className="button-row">
        <button
          onClick={() => {
            game.saveNow();
            toast("保存状況を確認しました");
          }}
        >
          いま保存する
        </button>
        <button onClick={exportSave}>セーブを書き出す</button>
        <label className="file-button">
          セーブを読み込む
          <input
            type="file"
            accept=".json,application/json"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              if (f.size > 150000) {
                toast("ファイルが大きすぎます");
                return;
              }
              try {
                const raw = await f.text();
                parseSave(raw);
                setPending(raw);
                setConfirm("import");
              } catch {
                toast("読み込めないセーブです。現在の進行は変更していません。");
              }
            }}
          />
        </label>
      </div>
      <hr />
      <h2>学園のオルゴール</h2>
      <p>音は最初はオフです。音量を調整して楽しんでください。</p>
      <button
        aria-pressed={music}
        onClick={async () => {
          if (music) {
            stopAudio();
            setMusic(false);
          } else {
            const ok = await startAudio();
            setMusic(!!ok);
            if (!ok) toast("このブラウザでは音を再生できませんでした");
          }
        }}
      >
        {music ? "♪ 音をオフにする" : "♪ 音をオンにする"}
      </button>
      <label className="volume">
        音量{" "}
        <input
          aria-label="音量"
          type="range"
          min="0"
          max=".5"
          step=".01"
          defaultValue=".18"
          onChange={(e) => setAudioVolume(Number(e.target.value))}
        />
      </label>
      <hr />
      <button onClick={() => go("title")}>タイトルへ戻る</button>
      <button className="danger" onClick={() => setConfirm("new")}>
        最初からやり直す
      </button>
      <p className="fine">
        MVP v0.1 ·
        第1章／30衣装／3難易度／温室の謎。追加の章は今後の開発対象です。
      </p>
    </section>
  );
  return (
    <>
      <a className="skip" href="#main">
        本文へ
      </a>
      {screen === "title" ? (
        <main id="main" className="title-screen academy-art">
          <div className="title-shade" />
          <div className="title-copy">
            <span className="eyebrow">A LITTLE COURAGE. A LITTLE MAGIC.</span>
            <span className="title-kicker">
              あなたの「好き」が、物語になる。
            </span>
            <h1>
              キラキラ学園<span>♡ 運命のプリンセス ♡</span>
            </h1>
            <div className="gold-line">✦ ─── CHAPTER 01 ─── ✦</div>
            <p>
              一通の招待状からはじまる、
              <br />
              ときめきと秘密の学園生活。
            </p>
            <div className="title-buttons">
              {state.started && !game.blocked && (
                <button
                  className="primary"
                  onClick={() => go(state.battle ? "battle" : "story")}
                >
                  物語のつづきから →
                </button>
              )}
              <button
                className={state.started ? "" : "primary"}
                onClick={() =>
                  state.started || game.blocked
                    ? setConfirm("new")
                    : go("create")
                }
              >
                新しい物語をはじめる
              </button>
              <button className="text-button" onClick={() => go("settings")}>
                セーブ・音の設定
              </button>
            </div>
            <p className="title-note">
              着せ替え × 学園ストーリー × ファッション対決
            </p>
          </div>
          <div className="title-character">
            <div className="character-halo" />
            <Avatar state={state} expression="calm" />
            <span>
              ことちゃん
              <br />
              <small>この物語の主人公は、あなた。</small>
            </span>
          </div>
          <div className="title-footer">
            KIRAKIRA ACADEMY <span>第1章 プレイ可能版 · 音声は初期OFF</span>
          </div>
        </main>
      ) : (
        <div className="app-shell">
          <aside className="sidebar">
            <button className="brand" onClick={() => go("title")}>
              ♛<strong>キラキラ学園</strong>
              <small>運命のプリンセス</small>
            </button>
            <span className="sidebar-label">MY SCHOOL LIFE</span>
            <nav>
              {tabs.map(([id, icon, label]) => (
                <button
                  key={id}
                  aria-current={screen === id ? "page" : undefined}
                  onClick={() => go(id)}
                  disabled={!state.started && id !== "settings"}
                >
                  <span>{icon}</span>
                  {label}
                </button>
              ))}
            </nav>
            <div className="sidebar-bottom">
              ✧ 第1章
              <br />
              <small>はじまりの招待状</small>
            </div>
          </aside>
          <div className="app-content">
            <header className="topbar">
              <span>ことちゃんの学園生活</span>
              <div>
                <b>Lv.{levelFor(state.xp)}</b>
                <span>✧ {state.xp} EXP</span>
                <span>◈ {state.coins}</span>
              </div>
            </header>
            <main id="main" className="main-content">
              {screen === "create" ? (
                <>
                  <div className="page-heading">
                    <div>
                      <span className="eyebrow">HELLO, PRINCESS</span>
                      <h1>はじめまして、ことちゃん。</h1>
                      <p>
                        好きな姿で出かけよう。あとから何度でも着替えられます。
                      </p>
                    </div>
                    <button
                      className="primary"
                      onClick={() => {
                        dispatch({ type: "START" });
                        go("story");
                      }}
                    >
                      この姿で学園へ →
                    </button>
                  </div>
                  <Closet
                    state={state}
                    dispatch={dispatch}
                    toast={toast}
                    onBattle={() =>
                      toast("「この姿で学園へ」から物語を始めましょう")
                    }
                  />
                </>
              ) : screen === "story" ? (
                <Story state={state} dispatch={dispatch} go={go} />
              ) : screen === "closet" ? (
                <Closet
                  state={state}
                  dispatch={dispatch}
                  toast={toast}
                  onBattle={() => go("battle")}
                />
              ) : screen === "battle" ? (
                <Battle
                  state={state}
                  dispatch={dispatch}
                  onCloset={() => go("closet")}
                  onStory={() => go("story")}
                />
              ) : screen === "map" ? (
                <Academy state={state} dispatch={dispatch} toast={toast} />
              ) : screen === "album" ? (
                <Album state={state} onReplay={() => setConfirm("replay")} />
              ) : (
                settings
              )}
            </main>
            <footer className="save-footer">
              <span>✧ {game.saveStatus}</span>
              <span>自動セーブ · このブラウザ内</span>
            </footer>
          </div>
        </div>
      )}
      {game.blocked && !confirm && screen === "title" && (
        <Dialog title="セーブを確認してください" onClose={() => go("settings")}>
          <p>
            保存データを読み込めませんでした。元のデータは上書きしていません。
          </p>
          <button
            onClick={() =>
              downloadText(game.rawInvalid || "", "kirakira-recovery.json")
            }
          >
            元のデータを書き出す
          </button>
          <button onClick={() => setConfirm("new")}>新しく始める</button>
        </Dialog>
      )}
      {confirm && (
        <Dialog
          title={
            confirm === "import"
              ? "セーブを読み込みますか？"
              : confirm === "replay"
                ? "別の選択で遊びますか？"
                : "新しい物語を始めますか？"
          }
          onClose={() => setConfirm("")}
        >
          <p>
            {confirm === "replay"
              ? "衣装と実績は残ります。第1章の選択・関係・性格がリセットされます。"
              : "現在の進行が置き換わります。必要なら先にセーブを書き出してください。"}
          </p>
          <div className="button-row">
            <button onClick={exportSave}>現在のセーブを書き出す</button>
            <button onClick={() => setConfirm("")}>キャンセル</button>
            <button
              className="primary"
              onClick={() => {
                if (confirm === "import") {
                  game.restore(pending);
                  go("title");
                  toast("セーブを読み込みました");
                } else if (confirm === "replay") {
                  dispatch({ type: "REPLAY" });
                  go("story");
                } else newGame();
                setConfirm("");
              }}
            >
              確認して進む
            </button>
          </div>
        </Dialog>
      )}
      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}
    </>
  );
}
