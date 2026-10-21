// Keep the same color treatment in worker and older-browser fallback.
export function recolorSkin(image: ImageData, tone: string) {
  const data = image.data;
  const factors = tone === "#c58d6d" ? [0.77, 0.64, 0.56] : [0.94, 0.88, 0.81];
  const cellW = image.width / 2,
    cellH = image.height / 2;
  for (let y = 0; y < image.height; y++)
    for (let x = 0; x < image.width; x++) {
      const u = (x % cellW) / cellW,
        v = (y % cellH) / cellH;
      const limb =
        (v > 0.59 && v < 0.77 && u > 0.39 && u < 0.64) ||
        (v > 0.18 && v < 0.5 && (u < 0.27 || u > 0.73));
      if (!limb) continue;
      const i = (y * image.width + x) * 4,
        r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      if (data[i + 3] < 16 || r < 110 || g < 65 || b < 55) continue;
      const warmth = r / g,
        blue = b / g;
      if (warmth < 1.085 || warmth > 1.6 || blue < 0.79 || blue > 1.045)
        continue;
      const blend = Math.min(1, (warmth - 1.085) / 0.055);
      for (let c = 0; c < 3; c++)
        data[i + c] = Math.round(
          data[i + c] * (1 - blend + blend * factors[c]),
        );
    }
}
