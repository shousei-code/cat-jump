# キャラクター刷新のレビュー資料

旧SVGキャラクターを撤去し、新規生成した透過イラストを用いる描画に移行した。学園背景・ゲーム進行・所持品・セーブv1は保持。公開サイトにはまだ反映していない。

## 主な変更ファイル

- `src/components/Avatar.tsx`：顔、髪、着衣ボディ、靴、装飾の合成・瞬き・着替え反応。
- `src/components/RasterSprite.tsx`：透過WebPアトラスの表示と読み込み失敗表示。
- `src/art/manifest.ts`：アイテムと画像の対応、セル、首/足/髪の配置補正。
- `src/art/MotionProvider.tsx` / `useArtReady.ts`：演出品質調整、画像のデコード待ち。
- `src/art/useSkinTexture.ts` / `skin.worker.ts` / `recolorSkin.ts`：肌色変更とキャッシュ、旧ブラウザ用Canvas処理。
- `src/components/Portrait.tsx`：4人の男の子の新規立ち絵と3表情。
- `src/components/Story.tsx`：会話・返答に合わせた人物と主人公の表情。返答を次の話者として表示していた点も修正。
- `src/components/Closet.tsx`：11表情の確認、拡大表示と既存着せ替えへの接続。
- `src/components/Battle.tsx` / `Academy.tsx`：勝敗と秘密の衣装のリアクション。
- `src/App.tsx` / `main.tsx` / `style.css`：タイトル演出、画面遷移、レスポンシブ配置、動きの抑制。
- `src/game/data.ts`：新規プレイだけ初期髪型をロングに設定。
- `public/art/characters/`：配信WebP 9枚、合計約4.4MiB。`art-source/`：生成元PNG9枚、約22MiB。使用しなくなった旧人物画像の複製 `public/art/classmates.png` を削除。
- `src/art/manifest.test.ts` / `tests/game.spec.ts`：素材対応、旧セーブ、着せ替え、表情、肌色、動きを減らす設定を検証。
- `README.md` / `docs/CHARACTER-ART.md`：技術選定、素材仕様、制作プロンプト、不足素材、現行構成。

## 完成範囲と残る制作

現行の30アイテムの表示を移行し、主人公11表情＋瞬き、男の子各3表情を組み込んだ。髪・瞳・衣装の情報量は旧幾何図形から大きく増えた。

商用レベルの原画監修、正式Live2Dモデル、独立したスカート/袖の物理変形、男の子の瞬きと追加表情、女の子の友達固有の顔原画は未完成。生成素材の接合や装飾の組み合わせはさらに監修・修正の余地がある。詳細は CHARACTER-ART.md の不足素材一覧を参照。今回の変更を「商用Live2Dキャラクター完成」とは扱わない。

## 動作確認

- `npm run check`：Vitest 12件成功、TypeScript型検査とVite本番ビルド成功。
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`：10件成功。PC/Pixel 5相当の2構成で、物語完走・敗北再挑戦・保存再開・不正セーブ保護・別セッションへのセーブ移行・着せ替えと表情・肌色・動きを減らす設定を確認。
- 肌色テストではPC側がWorker経路、モバイル側はOffscreenCanvasを無効にしてCanvas代替経路を確認。
- 初回の並行確認ではPC肌色変換の5秒待ちがタイムアウトしたが、ブラウザ確認の並行実行をやめた最終実行で全件成功。待ち時間を延ばして隠す変更は行っていない。
- 実機のiPhone/iPad/Android、Safari、低性能端末での60fps維持は未検証。Chromiumの画面サイズ・タッチ操作のエミュレーション結果であり、実機試験とは区別する。
- `/cat-jump/princess/` 配下の本番ビルドを1440×1000、390×844、820×1180で配信・確認。JavaScript/HTTPエラーなし、ページの横はみ出しなし。通常設定で待機アニメーション3件と実際の瞬きを観測。動きを減らす設定では実行中アニメーション0件。
- タブレットの色ボタンがカードからはみ出す点を最終調整し、幅に応じて折り返すようにした。
