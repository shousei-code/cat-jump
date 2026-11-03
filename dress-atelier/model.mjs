export const palette=['#e9a9c2','#bd9cdb','#8fc8df','#93cbb7','#ebc77d','#f5e9d8','#bc4e69','#40465e','#715045','#d9b884','#9c7088','#f1b79c','#8fafd2','#c7b6d9','#c4d19b','#f3c5d7','#c582a2','#617c91','#d6b29e','#f0d491','#a8d7d4','#e7ded5','#836779','#b5a6bf'];
export const groups={hair:['さらさらロング','ふんわりボブ','ツインテール','サイドポニー','ゆる巻き','お姉さんロング','三つ編み','ハーフアップ','ショート','ウェーブボブ','おだんご','ストレート'],
dress:['リボン制服','チェック制服','セーラー服','カーディガン','パーカーワンピ','デニム風ワンピ','お花ワンピ','レースワンピ','ティーパーティー','プリンセスドレス','星空ドレス','バラのドレス','フリルドレス','舞踏会ドレス','メイドカフェ','アイドルステージ','スポーティー','クラシックコート','冬のおでかけ','サマーワンピ'],
shoes:['ストラップ靴','ローファー','スニーカー','バレエシューズ','ショートブーツ','リボンブーツ','ロングブーツ','レースブーツ','プリンセス靴','おでかけパンプス'],
acc:['リボン','カチューシャ','猫耳','ティアラ','お花ピン','星のピン','ベレー帽','ヘッドホン','ダブルリボン','パール飾り']};
export const themes=[['春の登校','制服（最初の4着）とローファーで、学校へ！',s=>s.dress<4,s=>s.shoes===1],['お城の舞踏会','ドレス（9〜14着目）とティアラがぴったり。',s=>s.dress>=8&&s.dress<=13,s=>s.acc===3],['冬のおでかけ','コートか冬服と、ブーツで暖かく。',s=>s.dress===17||s.dress===18,s=>s.shoes>=4&&s.shoes<=7],['ステージの主役','アイドル衣装と、リボンか星のピン。',s=>s.dress===15,s=>[0,5,8].includes(s.acc)],['カフェのお手伝い','メイドカフェ服とストラップ靴にしよう。',s=>s.dress===14,s=>s.shoes===0]];
export const initial=()=>({hair:0,dress:0,shoes:0,acc:0,hairColor:8,dressColor:0,shoesColor:7,accColor:0});
export function valid(s){return s&&Object.entries(initial()).every(([k])=>Number.isInteger(s[k])&&s[k]>=0&&s[k]<(k.endsWith('Color')?24:groups[k].length))}
export function score(s,t){return 30+(themes[t][2](s)?30:0)+(themes[t][3](s)?25:0)+(s.dressColor===s.accColor?15:0)}
export const combinations=12*20*10*10*24**4;
