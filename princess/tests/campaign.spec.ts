import { test, expect, type Page } from "@playwright/test";
import { freshState, reduce } from "../src/game/engine";
import { CHAPTERS } from "../src/campaign/data";
function checkpoint() {
  let s = reduce(freshState(), { type: "START" });
  for (const id of [
    "letter-kind",
    "gate-haruto",
    "welcome-mio",
    "invite-kaito",
  ])
    s = reduce(s, { type: "CHOICE", id });
  for (const id of ["hair-twin", "dress-mint", "shoes-mint", "acc-clover"])
    s = reduce(s, { type: "EQUIP", id });
  s = reduce(s, { type: "BATTLE" });
  for (const id of ["festival-thanks", "epilogue-promise"])
    s = reduce(s, { type: "CHOICE", id });
  return reduce(s, { type: "CLEAR_RESULT" });
}
async function costume(page: Page, moon: boolean) {
  await page.locator("nav").getByRole("button", { name: "着せ替え" }).click();
  for (const [tab, id] of moon
    ? [
        ["お洋服", "dress-moon"],
        ["ヘア", "hair-long"],
        ["シューズ", "shoes-night"],
        ["アクセ", "acc-moon"],
      ]
    : [
        ["お洋服", "dress-mint"],
        ["ヘア", "hair-twin"],
        ["シューズ", "shoes-mint"],
        ["アクセ", "acc-clover"],
      ]) {
    await page
      .locator(".wardrobe-tabs")
      .getByRole("button", { name: tab })
      .click();
    await page.locator(`[data-item="${id}"]`).click();
  }
  await page.locator("nav").getByRole("button", { name: "物語" }).click();
}
test("第2章から12章まで全ミニゲームを操作して結末に到達し、保存から再開する", async ({
  page,
}, info) => {
  test.setTimeout(240000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(
    (s) => localStorage.setItem("kirakira-princess-save-v1", JSON.stringify(s)),
    checkpoint(),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "物語のつづきから" }).click();
  await page.getByRole("button", { name: "物語の第2章へ" }).click();
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 100));
  for (const chapter of CHAPTERS) {
    await expect(
      page.getByRole("heading", { name: chapter.title, exact: true }),
    ).toBeVisible();
    if (chapter.number === 9)
      await page.locator(".route-card").filter({ hasText: "ハルト" }).click();
    for (let i = 0; i < 3; i++) {
      await page.locator(".campaign .choices button").first().click();
      await page.getByRole("button", { name: "つづける", exact: true }).click();
    }
    if (chapter.kind === "fashion")
      await costume(page, chapter.theme === "moon");
    await page
      .getByRole("button", { name: "挑戦をはじめる", exact: true })
      .click();
    if (chapter.kind === "memory") {
      await page.clock.runFor(4100);
      for (let i = 0; i < 4; i++) {
        const tile = (i * i + i * 3 + chapter.number + Math.floor(i / 2)) % 4;
        await page
          .getByRole("button", { name: `記憶 ${tile + 1}`, exact: true })
          .click();
      }
    } else if (chapter.kind === "rhythm") {
      await page.clock.runFor(1500);
      for (let i = 0; i < 10; i++) {
        if (i) await page.clock.runFor(850);
        const lane = (i * i + i * 3 + chapter.number + Math.floor(i / 2)) % 4;
        await page
          .getByRole("button", { name: `リズム ${lane + 1}`, exact: true })
          .click();
      }
      await page.clock.runFor(600);
    } else if (chapter.kind === "mission") {
      for (let i = 0; i < 8; i++)
        await page.getByRole("button", { name: /^届ける品物/ }).click();
    } else if (chapter.kind === "puzzle")
      await page
        .getByRole("button", { name: chapter.puzzle!.answer, exact: true })
        .click();
    else
      await page
        .getByRole("button", { name: "このコーデで挑む", exact: true })
        .click();
    if (chapter.number < 12) {
      await expect(
        page.getByRole("heading", { name: `第${chapter.number}章クリア！` }),
      ).toBeVisible();
      await page
        .getByRole("button", {
          name: `第${chapter.number + 1}章へ進む`,
          exact: true,
        })
        .click();
    }
  }
  await expect(
    page.getByRole("heading", { name: "太陽みたいな、きみと", exact: true }),
  ).toBeVisible();
  const saved = await page.evaluate(() =>
    localStorage.getItem("kirakira-princess-save-v1")!,
  );
  expect(JSON.parse(saved).campaign.cleared).toHaveLength(11);
  // Remove the fixture initializer by opening a fresh context page with the completed save.
  const next = await page.context().newPage();
  await next.goto("/");
  await next.evaluate(
    (s) => localStorage.setItem("kirakira-princess-save-v1", s),
    saved,
  );
  await next.reload();
  await next.getByRole("button", { name: "物語のつづきから" }).click();
  await expect(
    next.getByRole("heading", { name: "太陽みたいな、きみと", exact: true }),
  ).toBeVisible();
  await next.screenshot({
    path: info.outputPath("ending.png"),
    fullPage: true,
    scale: "css",
    animations: "disabled",
  });
  expect(
    await next.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  await next.close();
});

test("練習の失敗から再挑戦でき、色違いを購入して表示・保存できる", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const s = reduce(checkpoint(), { type: "CAMPAIGN_START" });
  await page.addInitScript(
    (s) => localStorage.setItem("kirakira-princess-save-v1", JSON.stringify(s)),
    s,
  );
  await page.goto("/");
  await page.getByRole("button", { name: "物語のつづきから" }).click();
  await page
    .getByRole("button", { name: "ミニゲーム練習", exact: true })
    .click();
  await page.getByRole("button", { name: "謎解き", exact: true }).click();
  await page.getByRole("button", { name: "挑戦をはじめる" }).click();
  await page.getByRole("button", { name: "星・花・月", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "あと一歩。もう一度挑戦しよう！" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "再挑戦", exact: true }).click();
  await page.getByRole("button", { name: "挑戦をはじめる" }).click();
  await page.getByRole("button", { name: "月・花・星", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "✧ チャレンジ成功！" }),
  ).toBeVisible();
  await page.locator("nav").getByRole("button", { name: "着せ替え" }).click();
  await page
    .locator(".wardrobe-tabs")
    .getByRole("button", { name: "ヘア", exact: true })
    .click();
  await page.getByRole("button", { name: "コレクション全部" }).click();
  await page.locator('[data-item="hair-bob-edition-0"]').click();
  await page.getByRole("button", { name: "40 コインで購入して着る" }).click();
  await expect(page.locator(".mirror .raster-avatar")).toHaveAttribute(
    "data-hair",
    "hair-bob-edition-0",
  );
  expect(
    await page
      .locator(".mirror .doll-hair-back")
      .evaluate((e) => getComputedStyle(e).filter),
  ).toContain("hue-rotate");
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("kirakira-princess-save-v1")!),
  );
  expect(saved.owned).toContain("hair-bob-edition-0");
  expect(saved.campaign.chapter).toBe(2);
});

test("時間切れと記憶ミスから練習し直せて、物語の進行は変わらない", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const state = reduce(checkpoint(), { type: "CAMPAIGN_START" });
  await page.addInitScript(
    (s) => localStorage.setItem("kirakira-princess-save-v1", JSON.stringify(s)),
    state,
  );
  await page.goto("/");
  await page.getByRole("button", { name: "物語のつづきから" }).click();
  await page
    .getByRole("button", { name: "ミニゲーム練習", exact: true })
    .click();
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 100));
  await page
    .getByRole("button", { name: "時間制限ミッション", exact: true })
    .click();
  await page.getByRole("button", { name: "挑戦をはじめる" }).click();
  await page.clock.runFor(24500);
  await expect(
    page.getByRole("heading", { name: "あと一歩。もう一度挑戦しよう！" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "再挑戦", exact: true }).click();
  await page.getByRole("button", { name: "挑戦をはじめる" }).click();
  for (let i = 0; i < 8; i++)
    await page.getByRole("button", { name: /^届ける品物/ }).click();
  await expect(
    page.getByRole("heading", { name: "✧ チャレンジ成功！" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "記憶", exact: true }).click();
  await page.getByRole("button", { name: "挑戦をはじめる" }).click();
  await expect(
    page.getByRole("button", { name: "記憶 1", exact: true }),
  ).toBeDisabled();
  await page.clock.runFor(4100);
  await page.getByRole("button", { name: "記憶 1", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "あと一歩。もう一度挑戦しよう！" }),
  ).toBeVisible();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("kirakira-princess-save-v1")!),
  );
  expect(saved.campaign.chapter).toBe(2);
  expect(saved.campaign.phase).toBe("story");
  expect(saved.campaign.records["mission:normal"]).toBe(100);
  await page.locator("nav").getByRole("button", { name: "アルバム" }).click();
  await expect(
    page.getByRole("heading", { name: /実績.*\/ 12/ }),
  ).toBeVisible();
  await expect(
    page
      .locator(".achievement-list .earned")
      .filter({ hasText: "笑顔を届ける係" }),
  ).toBeVisible();
});
