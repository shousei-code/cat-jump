import { useEffect, useState } from "react";
import { recolorSkin } from "./recolorSkin";
import { artUrl, type Sheet } from "./manifest";
let worker: Worker | undefined;
const cache = new Map<string, Promise<string>>();
const pending = new Map<
  string,
  { resolve: (url: string) => void; reject: () => void }
>();
function texture(sheet: Sheet, tone: string): Promise<string> {
  const key = sheet + tone,
    existing = cache.get(key);
  if (existing) return existing;
  const promise = new Promise<string>((resolve, reject) => {
    if (
      typeof Worker === "undefined" ||
      typeof OffscreenCanvas === "undefined"
    ) {
      reject();
      return;
    }
    worker ??= new Worker(new URL("./skin.worker.ts", import.meta.url), {
      type: "module",
    });
    worker.onmessage = (
      event: MessageEvent<{ key: string; blob?: Blob; error?: boolean }>,
    ) => {
      const job = pending.get(event.data.key);
      if (!job) return;
      if (event.data.blob) job.resolve(URL.createObjectURL(event.data.blob));
      else job.reject();
      pending.delete(event.data.key);
    };
    worker.onerror = () => {
      for (const job of pending.values()) job.reject();
      pending.clear();
      worker?.terminate();
      worker = undefined;
    };
    pending.set(key, { resolve, reject: () => reject() });
    worker.postMessage({
      key,
      url: new URL(artUrl(sheet), document.baseURI).href,
      tone,
    });
  });
  const resilient = promise.catch(() => fallbackTexture(sheet, tone));
  cache.set(key, resilient);
  resilient.catch(() => cache.delete(key));
  return resilient;
}
// Only used on browsers without worker canvas support; cached per sheet/tone.
async function fallbackTexture(sheet: Sheet, tone: string): Promise<string> {
  const img = new Image();
  img.src = artUrl(sheet);
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(img, 0, 0);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  recolorSkin(pixels, tone);
  ctx.putImageData(pixels, 0, 0);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (value) =>
        value ? resolve(value) : reject(new Error("Encoding failed")),
      "image/png",
    ),
  );
  return URL.createObjectURL(blob);
}
export function useSkinTexture(sheet: Sheet, tone?: string) {
  const [result, setResult] = useState<{ key: string; url: string } | null>(
      null,
    ),
    key = sheet + tone;
  useEffect(() => {
    if (!tone || tone === "#ffe2cd") return;
    let active = true;
    texture(sheet, tone).then(
      (url) => {
        if (active) setResult({ key, url });
      },
      () => {},
    );
    return () => {
      active = false;
    };
  }, [sheet, tone, key]);
  return result?.key === key ? result.url : artUrl(sheet);
}
