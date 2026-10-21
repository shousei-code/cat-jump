import { test, expect, type Page } from "@playwright/test";
async function start(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "新しい物語をはじめる" }).click();
  await page.getByRole("button", { name: "この姿で学園へ" }).click();
}
async function choose(page: Page, id: string) {
  await page.locator('[data-choice="' + id + '"]').click();
  const next = page.getByRole("button", { name: "つづける", exact: false });
  if (await next.count()) await next.click();
}
async function nav(page: Page, name: string) {
  await page.locator("nav").getByRole("button", { name, exact: false }).click();
}
test("第1章を攻略・再開・探索、初期衣装でエキスパート勝利", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await start(page);
  for (const id of [
    "letter-kind",
    "gate-haruto",
    "welcome-mio",
    "invite-kaito",
  ])
    await choose(page, id);
  await page.getByRole("button", { name: "対決へ進む" }).click();
  await page.getByRole("button", { name: "エキスパート", exact: true }).click();
  await page.getByRole("button", { name: "このコーデで対決する" }).click();
  await expect(page.getByText("あと一歩。着替えてもう一度！")).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "物語のつづきから" }).click();
  await expect(page.getByText("あと一歩。着替えてもう一度！")).toBeVisible();
  await page.getByRole("button", { name: "クローゼットで着替える" }).click();
  for (const [tab, id] of [
    ["お洋服", "dress-mint"],
    ["ヘア", "hair-twin"],
    ["シューズ", "shoes-mint"],
    ["アクセ", "acc-clover"],
  ]) {
    await page
      .locator(".wardrobe-tabs")
      .getByRole("button", { name: tab })
      .click();
    await page.locator('[data-item="' + id + '"]').click();
  }
  await page.getByRole("button", { name: "対決を確認" }).click();
  await page.getByRole("button", { name: "このコーデで対決する" }).click();
  await expect(
    page.getByText("ことちゃんの勝利！", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "勝利のあとの物語へ" }).click();
  await choose(page, "festival-thanks");
  await choose(page, "epilogue-promise");
  await expect(
    page.getByRole("heading", { name: "はじまりのプリンセス" }),
  ).toBeVisible();
  await nav(page, "学園");
  await page.getByRole("button", { name: "調べてみる" }).first().click();
  await page.getByRole("button", { name: "調べてみる" }).first().click();
  await page.getByLabel("紋章 1").selectOption("☾");
  await page.getByLabel("紋章 2").selectOption("✿");
  await page.getByLabel("紋章 3").selectOption("✦");
  await page.getByRole("button", { name: "扉を開く" }).click();
  await expect(page.getByText("✧ 謎解きクリア")).toBeVisible();
  await nav(page, "着せ替え");
  await page.screenshot({
    path: info.outputPath("closet.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.reload();
  await page.getByRole("button", { name: "物語のつづきから" }).click();
  await expect(
    page.getByRole("heading", { name: "はじまりのプリンセス" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("壊れたセーブは上書きせず保護する", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("kirakira-princess-save-v1", "broken"),
  );
  await page.reload();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("kirakira-princess-save-v1"),
    ),
  ).toBe("broken");
});
test("設定から不正ファイルを読み込んでも進行は残る", async ({ page }) => {
  await start(page);
  await nav(page, "設定");
  const before = await page.evaluate(() =>
    localStorage.getItem("kirakira-princess-save-v1"),
  );
  await page.locator("input[type=file]").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from("{}"),
  });
  await expect(
    page.getByText("読み込めないセーブです。現在の進行は変更していません。"),
  ).toBeVisible();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("kirakira-princess-save-v1"),
    ),
  ).toBe(before);
});

test("ファイルを別セッションに読み込み、続きから再開する", async ({ page }) => {
  await start(page);
  await choose(page, "letter-kind");
  const saved = await page.evaluate(() =>
    localStorage.getItem("kirakira-princess-save-v1")!,
  );
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: "セーブ・音の設定" }).click();
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "save.json",
      mimeType: "application/json",
      buffer: Buffer.from(saved),
    });
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "確認して進む" }).click();
  await page.getByRole("button", { name: "物語のつづきから" }).click();
  await expect(
    page.getByRole("heading", { name: "桜の向こうの、新しい友達。" }),
  ).toBeVisible();
});
