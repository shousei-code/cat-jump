import { useEffect, useState } from "react";
import { artUrl, type Sheet } from "./manifest";
const decoded = new Map<string, Promise<void>>();
function load(url: string) {
  let promise = decoded.get(url);
  if (!promise) {
    promise = new Promise<void>((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.decode().then(() => resolve(), reject);
    });
    decoded.set(url, promise);
    promise.catch(() => decoded.delete(url));
  }
  return promise;
}
export function useArtReady(sheets: Sheet[], enabled: boolean) {
  const key = [...new Set(sheets)].sort().join("|");
  const [result, setResult] = useState({ key: "", status: "loading" });
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    Promise.all(key.split("|").map((s) => load(artUrl(s)))).then(
      () => {
        if (active) setResult({ key, status: "ready" });
      },
      () => {
        if (active) setResult({ key, status: "error" });
      },
    );
    return () => {
      active = false;
    };
  }, [key, enabled]);
  return !enabled ? "ready" : result.key === key ? result.status : "loading";
}
