'use strict';
const games=[
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
for(const label of ['すべて','お気に入り','生活','物語','アクション','おしごと','音あそび']){const b=document.createElement('button');b.textContent=label==='お気に入り'?'★ お気に入り':label;b.dataset.filter=label;b.onclick=()=>{filter=label;render()};$('filters').appendChild(b)}$('search').oninput=render;$('clearRecent').onclick=()=>{recent=[];save();renderRecent();$('notice').textContent='遊んだ履歴を消しました。ゲームのセーブデータは残っています。'};$('random').onclick=()=>{const g=games[Math.floor(Math.random()*games.length)];visit(g.id);location.href=g.url};window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e});$('install').onclick=async()=>{if(installPrompt){await installPrompt.prompt();installPrompt=null}else $('help').hidden=!$('help').hidden};window.addEventListener('pageshow',render);render();
