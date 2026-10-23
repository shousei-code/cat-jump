'use strict';
const games=[
['umi','🎮','海ちゃんの放課後♡ゲーマー日記','天才ゲーマー海ちゃんの7日間！ 制服の学校生活、友達、ペット、3つのゲームと大会。','物語','umi/','#f2dbea'],
['moon-witch','🦄','月の魔女とユニコーンの約束','全20ステージの魔法冒険。電気・氷・星の魔法とユニコーン変身で、魔王城へ！','アクション','moon-witch/','#dcc7e5'],
['squishy-world','🐰','ぷにぷにワールド♡スクイーズの家','6つの世界で100種類を集めよう！ 家に飾ってぷにぷに、お仕事・ガチャ・アスレチック。','アクション','squishy-world/','#f3dce9'],
['sticker-world','🎀','シールの島♡きらめきアスレチック','3Dの島でレアシール探し！ お仕事、かわいいガチャ、自分だけのシール帳。オンラインは試用版。','アクション','sticker-world/','#e8daf1'],
['misora','🌸','ミソラと放課後♡きらめきスクール','自分を作ってミソラと恋しよう。服・ピン・靴を各20点から選び、友だち5人と文化祭へ！','物語','misora/','#f3dce9'],
['princess','👑','キラキラ学園♡運命のプリンセス','ことちゃんと全12章の学園生活へ！ 着せ替え、文化祭、5種類のチャレンジと6つの結末。','物語','princess-play/','#efdeef'],
['dodge','🏐','みんなでドッジボール！','9人からチームを選んで3対3！ ゴーリさんの審判で、投げてよけて勝負。','アクション','dodge/','#f0e0c5'],
['music','🎶','わくわく音楽スタジオ','ダンスや遊園地の音楽を再生！ マスと鍵盤で作曲し、音声ファイルにも保存。','音あそび','music/','#e5d7f1'],
['art-party','🎨','ププさんのおえかき大会','パパや果物の仲間と12人のおえかき対決！ 自分の絵を描いて展覧会へ。','生活','art-party/','#f4e6ce'],
['fruit','🍎','りんごとバナナのブーブーダンス','踊る果物、泣いちゃう仲間、パパのおなら！？ ボタンで進むへんてこコメディ。','物語','fruit/','#f6eac8'],
['study','📚','まなびバトルドリル','漢字・算数・理科・社会！ 2人対戦、問題の訂正、手書き漢字の練習も。','勉強','study/','#d9edf0'],
['sparkle','🌷','きみが主役の放課後','6人の男の子と、ごほうびのお出かけ。ほめ言葉をアルバムに集めよう。','物語','sparkle/','#f4dfe9'],
['guild','📖','ことば冒険ギルド','3対3の漢字チーム戦！ 仲間を集めて宝探し、アイテム交換、依頼を楽しもう。','アクション','guild/','#dcebd9'],
['salon','🫧','ふわり美容室','シャンプー・リンス・カットでおもてなし。在庫注文やお店の着せ替えも！','おしごと','salon/','#efe1ef'],
['idol','🎤','きらめきアイドル・デビュー！','自分だけのアイドルでレッスンとリズムライブ！ ファンと衣装を増やそう。','音あそび','idol/','#f3dce9'],
['campus','🏫','桜坂スクールライフ 3D','自分の目線で学校へ。授業・文化祭・おうちでの生活。','生活','campus/','#dce9e5'],
['school','🌸','桜坂中学','6人の男の子と過ごす季節。文化祭からバレンタインまで。','物語','school/','#f0dce6'],
['dream','🌙','ゆめねこ遊園地','不思議な猫やウサギとおしゃべり。夢の遊園地で遊ぼう。','物語','dream/','#e1d8f0'],
['creator','🎮','きらきら配信者','ゲーム実況や配信ごっこ。登録者を増やしてお部屋も成長！','おしごと','creator/','#e2d9f3'],
['sound-run','🎧','音の島のアスレチック','ガラス・木・雨の足音。消える足場をジャンプで突破！','アクション','sound-run/','#e2e9ec'],
['asmr','💧','しずくのASMR工房','針を的にぴったり止めて、12音の作品を作ろう。','音あそび','asmr/','#d7e8df'],
['heart','💌','放課後、きみにときめく。','3人から選ぶ、7日間のやさしい初恋ストーリー。','物語','heart/','#f7e1e9'],
['world','🎀','ミルキー・ワールド','髪型・目・服を着せ替えて、カフェやお部屋で遊ぼう。','生活','world/','#efe0f3'],
['magic','🪄','きらめき魔法隊','勇者・魔法使い・回復使い。魔法を育ててボスに挑戦！','アクション','magic/','#dddaf1'],
['pizza','🍕','ピッツァ・ポン！','お客さんを待たせないで！ 注文どおりにピザを作ろう。','おしごと','pizza/','#f4e2c9'],
['ghost','👻','おばけの館と、まほうのカギ','かわいいおばけの館でカギを探して脱出しよう。','アクション','ghost/','#e7dcf2'],
['kart','🏁','モコモコ・カート','動物たちのカートレース。アイテムを使ってゴールへ！','アクション','kart/','#dcebe3'],
['bunny','🐰','モコのアスレチック','にんじんを集めてぴょん！ ウサギと3つのコースを冒険。','アクション','bunny/','#f5e1e7'],
['dollhouse','🏡','こもれびタウン 3D','お部屋の模様替え、街のお仕事、友達やペットとの暮らし。','生活','dollhouse/','#e4ead8'],
['cat','🐈','こむぎのジャンプ日和','かわいい茶トラの猫と、植木鉢を飛び越えておさんぽ。','アクション','cat.html','#f5e4cd']
].map(([id,icon,title,desc,category,url,color])=>({id,icon,title,desc,category,url,color}));
const $=id=>document.getElementById(id);let favorites=[],recent=[],filter='すべて',installPrompt=null;const known=id=>games.some(g=>g.id===id);
try{const f=JSON.parse(localStorage.getItem('plaza-favorites')),r=JSON.parse(localStorage.getItem('plaza-recent'));if(Array.isArray(f))favorites=[...new Set(f.filter(known))];if(Array.isArray(r))recent=[...new Set(r.filter(known))].slice(0,6)}catch{}
function save(){try{localStorage.setItem('plaza-favorites',JSON.stringify(favorites));localStorage.setItem('plaza-recent',JSON.stringify(recent))}catch{$('notice').textContent='このブラウザではお気に入りや履歴を保存できません。ゲームは遊べます。'}}
function visit(id){recent=[id,...recent.filter(x=>x!==id)].slice(0,6);save()}
function renderRecent(){$('recentSection').hidden=!recent.length;$('recent').replaceChildren();for(const id of recent){const g=games.find(g=>g.id===id),a=document.createElement('a');a.href=g.url;a.textContent=g.icon+' '+g.title;a.onclick=()=>visit(g.id);$('recent').appendChild(a)}}
function render(){const query=$('search').value.trim().toLocaleLowerCase();const list=games.filter(g=>(filter==='すべて'||filter==='お気に入り'&&favorites.includes(g.id)||g.category===filter)&&(g.title+g.desc+g.category).toLocaleLowerCase().includes(query));$('heading').textContent=filter==='すべて'?'すべてのゲーム':filter;$('count').textContent=`${list.length} / ${games.length} ゲーム`;$('empty').hidden=!!list.length;$('empty').textContent=filter==='お気に入り'?'カードの☆を押すと、ここにゲームが並びます。':'見つかりませんでした。ほかの言葉で探してみてね。';$('games').replaceChildren();for(const g of list){const card=document.createElement('article');card.className='card';card.style.setProperty('--cover',g.color);const a=document.createElement('a');a.href=g.url;a.dataset.game=g.id;a.innerHTML=`<div class="cover"><span aria-hidden="true">${g.icon}</span><span class="badge">${g.category}</span></div><div class="body"><h3>${g.title}</h3><p>${g.desc}</p><span class="play">あそぶ →</span></div>`;a.onclick=()=>visit(g.id);const b=document.createElement('button');b.className='favorite';b.textContent=favorites.includes(g.id)?'★':'☆';b.setAttribute('aria-label',g.title+'をお気に入り'+(favorites.includes(g.id)?'から外す':'に追加'));b.setAttribute('aria-pressed',String(favorites.includes(g.id)));b.onclick=()=>{favorites=favorites.includes(g.id)?favorites.filter(x=>x!==g.id):[...favorites,g.id];save();render();$('notice').textContent=favorites.includes(g.id)?g.title+'をお気に入りに追加しました。':g.title+'をお気に入りから外しました。'};card.append(a,b);$('games').appendChild(card)}for(const b of $('filters').children)b.setAttribute('aria-pressed',String(b.dataset.filter===filter));renderRecent()}
for(const label of ['すべて','お気に入り','生活','物語','アクション','おしごと','音あそび','勉強']){const b=document.createElement('button');b.textContent=label==='お気に入り'?'★ お気に入り':label;b.dataset.filter=label;b.onclick=()=>{filter=label;render()};$('filters').appendChild(b)}$('search').oninput=render;$('clearRecent').onclick=()=>{recent=[];save();renderRecent();$('notice').textContent='遊んだ履歴を消しました。ゲームのセーブデータは残っています。'};$('random').onclick=()=>{const g=games[Math.floor(Math.random()*games.length)];visit(g.id);location.href=g.url};window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e});$('install').onclick=async()=>{if(installPrompt){await installPrompt.prompt();installPrompt=null}else $('help').hidden=!$('help').hidden};window.addEventListener('pageshow',render);render();
