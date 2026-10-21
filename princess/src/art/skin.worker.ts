/// <reference lib="webworker" />
import { recolorSkin } from "./recolorSkin";
// Recolor only warm skin pixels in exposed limb regions, preserving cloth, alpha and linework.
// Work is off the UI thread and each sheet/tone is cached by the caller.
self.onmessage = async (
  event: MessageEvent<{ key: string; url: string; tone: string }>,
) => {
  const { key, url, tone } = event.data;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("asset");
    const bitmap = await createImageBitmap(await response.blob());
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height),
      ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    recolorSkin(image, tone);
    ctx.putImageData(image, 0, 0);
    // Runtime-only texture: lossless PNG avoids expensive WebP recompression on every new tone.
    const blob = await canvas.convertToBlob({
      type: "image/png",
    });
    self.postMessage({ key, blob });
  } catch {
    self.postMessage({ key, error: true });
  }
};
