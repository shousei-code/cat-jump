import {groups,palette,initial,valid,themes,score,combinations} from './model.mjs';
import {doll} from './art.mjs';
const $=id=>document.getElementById(id),key='lily-atelier-v1',labels={hair:'髪型',dress:'お洋服',shoes:'靴・ブーツ',acc:'アクセサリー'};
let s=initial(),saved=[],tab='dress',theme=0,audio=null,enabled=false,blocked=false;
try{const raw=localStorage.getItem(key);if(raw){const v=JSON.parse(raw);if(!valid(v.current)||!Array.isArray(v.saved)||v.saved.length>6||!v.saved.every(valid))throw Error();s=v.current;saved=v.saved}}catch{blocked=true;$('message').textContent='保存を読み込めませんでした。元の保存は上書きせずに遊べます。'}
function persist(){if(blocked)return;try{localStorage.setItem(key,JSON.stringify({current:s,saved}))}catch{$('message').textContent='ブラウザに保存できません。コーデ画像を保存してください。'}}
function tone(){if(!enabled)return;try{audio??=new AudioContext();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.value=660;g.gain.setValueAtTime(.05,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.15);o.start();o.stop(audio.currentTime+.15)}catch{}}
function render(){ $('doll').innerHTML=doll(s);$('category').textContent=labels[tab]+' · '+groups[tab].length+'種類';
 $('tabs').innerHTML=Object.entries(labels).map(([k,v])=>'<button data-tab="'+k+'" aria-pressed="'+(tab===k)+'">'+v+'</button>').join('');
 $('options').innerHTML=groups[tab].map((v,i)=>'<button data-item="'+i+'" aria-pressed="'+(s[tab]===i)+'">'+(i+1)+'. '+v+'</button>').join('');
 $('colors').innerHTML=palette.map((c,i)=>'<button style="background:'+c+'" data-color="'+i+'" aria-label="カラー '+(i+1)+'" aria-pressed="'+(s[tab+'Color']===i)+'"></button>').join('');
 document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;render()});
 document.querySelectorAll('[data-item]').forEach(b=>b.onclick=()=>{s[tab]=+b.dataset.item;change()});
 document.querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>{s[tab+'Color']=+b.dataset.color;change()});
 $('theme').textContent=themes[theme][0];$('hint').textContent=themes[theme][1]+' 服とアクセサリーの色を合わせるとボーナス！';
}
function change(){tone();$('result').textContent='';persist();render()}
function album(){ $('slots').innerHTML=saved.map((x,i)=>'<div class="slot">'+doll(x,'slot'+i)+'<button data-load="'+i+'">着る</button><button data-delete="'+i+'" aria-label="コーデ'+(i+1)+'を削除">削除</button></div>').join('');
 document.querySelectorAll('[data-load]').forEach(b=>b.onclick=()=>{s={...saved[+b.dataset.load]};change()});
 document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{if(confirm('このお気に入りを削除しますか？')){saved.splice(+b.dataset.delete,1);persist();album()}});
}
$('save').onclick=()=>{if(saved.length>=6){$('message').textContent='6つ保存済みです。いらないコーデを削除してから保存してね。';return}saved.push({...s});persist();album();$('message').textContent='お気に入りに追加したよ！'};
$('random').onclick=()=>{for(const k of Object.keys(s))s[k]=Math.floor(Math.random()*(k.endsWith('Color')?24:groups[k].length));change()};
$('next').onclick=()=>{theme=(theme+1)%themes.length;$('result').textContent='';render()};
$('judge').onclick=()=>{const n=score(s,theme);$('result').textContent=n+'点 / 100点 '+(n===100?'✧ パーフェクト！':n>=85?'とってもおしゃれ！':'ヒントを見て、もう一度挑戦しよう！');tone()};
$('sound').onclick=()=>{enabled=!enabled;$('sound').textContent='音：'+(enabled?'オン':'オフ');tone()};
$('photo').onclick=()=>{const svg=doll(s,'export').replace('<svg ','<svg width="780" height="1575" '),url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'})),a=document.createElement('a');a.href=url;a.download='lily-coordinate.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('message').textContent='コーデ画像（SVG）を保存しました。'};
render();album();
console.info('コーデの組み合わせ数',combinations);
