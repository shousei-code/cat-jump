import { useEffect, useRef, useState, useCallback } from "react";
import {
  freshState,
  loadSave,
  parseSave,
  reduce,
  SAVE_KEY,
  type Action,
  type LoadedSave,
} from "./game/engine";
import type { GameState } from "./game/types";
function read(): LoadedSave {
  try {
    return loadSave(window.localStorage);
  } catch {
    return { kind: "unavailable" };
  }
}
export function useGame() {
  const [loaded] = useState(read);
  const [state, setState] = useState<GameState>(() =>
    loaded.kind === "ok" ? loaded.state : freshState(),
  );
  const [blocked, setBlocked] = useState(loaded.kind === "invalid");
  const [saveStatus, setSaveStatus] = useState(
    loaded.kind === "unavailable"
      ? "保存できません。設定からセーブを書き出せます。"
      : loaded.kind === "ok"
        ? "セーブを読み込みました"
        : "新しい物語",
  );
  const previous = useRef(state);
  const persist = useCallback((s: GameState) => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(s));
      setSaveStatus("保存済み");
      return true;
    } catch {
      setSaveStatus("保存できません。設定からセーブを書き出してください。");
      return false;
    }
  }, []);
  useEffect(() => {
    if (state === previous.current || blocked) return;
    previous.current = state;
    persist(state);
  }, [state, blocked, persist]);
  const dispatch = useCallback(
    (action: Action) => {
      if (!blocked) setState((s) => reduce(s, action));
    },
    [blocked],
  );
  function reset() {
    setBlocked(false);
    const s = freshState();
    setState(s);
    previous.current = s;
    persist(s);
  }
  function restore(raw: string) {
    const s = parseSave(raw);
    setBlocked(false);
    setState(s);
    previous.current = s;
    persist(s);
  }
  return {
    state,
    dispatch,
    reset,
    restore,
    blocked,
    rawInvalid: loaded.kind === "invalid" ? loaded.raw : null,
    saveStatus,
    saveNow: () => !blocked && persist(state),
  };
}
export function downloadText(text: string, name: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
