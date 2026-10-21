# 新規生成イラスト原画

PNG原画はこのディレクトリに保管し、ゲームは public/art/characters/ の透過WebPを読み込む。
WebPはPNGと同じ画素寸法・構図・アルファを保ち、quality=92, method=6で圧縮した表示用ファイル。
原画はViteの公開ディレクトリ外に置くため配信ビルドに重複して含めない。

- koto-keyart.png：新規主人公デザイン基準。髪・制服・顔を制作する参照原画。ゲームの着せ替えは分割アトラスを使用する。
- koto-expressions.png：表情12コマ（4×3）。行ごとの余白差はレンダラーで補正。
- koto-hair.png：髪型6種（3×2）。顔の開口部の中心はmanifestで補正。
- wardrobe-a/b/c.png：衣装ボディ各4種（2×2）。10種を使用、cの下段2種はアイドル/冬季用の追加候補で未使用。
- accessories.png：装飾8種（4×2）。
- haruto-ren.png / aoi-kaito.png：各2人×3表情（2×3）。

すべて今回の新規生成素材。手作業で仕上げた商用原画、Cubismモデル、パーツの裏側・背面差分ではない。
生成プロンプトと構成・残課題は ../docs/CHARACTER-ART.md を参照。
