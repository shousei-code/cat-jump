import {names,foods,recipes,create,act,cpu,playable,target} from './core.mjs';
const $=id=>document.getElementById(id),titles={uno:'🌈 カラーカード',baba:'🃏 ババ抜き',recipe:'🍓 レシピあつめ'},palette={r:'#ee9399',b:'#92c3ed',g:'#93d3aa',y:'#f3d576',w:'#d4b1e4'},colorNames={r:'赤',b:'青',g:'緑',y:'黄',w:'自由'};
let g=null,timer=null;
function stop(){clearTimeout(timer)}
function modal(html){stop();$('dialogBody').innerHTML=html;$('dialog').showModal()}
function schedule(){stop();if(g&&g.winner===null&&g.turn!==0&&!$('dialog').open)timer=setTimeout(()=>{cpu(g);render()},850)}
$('dialog').addEventListener('close',schedule);
function card(c,type,attrs=''){let text,sub='',col='#f4e5ce';if(type==='uno'){text=({S:'⊘',R:'⇄',D:'+2',W:'★'})[c[1]]||c[1];sub=colorNames[c[0]]+' '+({S:'スキップ',R:'リバース',D:'2枚引く',W:'色を選ぶ'})[c[1]];if(/\d/.test(c[1]))sub=colorNames[c[0]];col=palette[c[0]]}else if(type==='baba'){text=c===0?'🃏':({1:'A',11:'J',12:'Q',13:'K'})[c]||c;sub=c===0?'ジョーカー':'ペアをそろえよう'}else{text=foods[c].split(' ')[0];sub=foods[c].split(' ')[1]}return '<button class="card" style="--c:'+col+'" '+attrs+'>'+text+'<small>'+sub+'</small></button>'}
function start(type){stop();g=create(type);$('home').hidden=true;$('game').hidden=false;render()}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>start(b.dataset.mode));
$('back').onclick=()=>{if(g.winner===null&&!confirm('対戦を終了してテーブル選びに戻りますか？'))return;stop();g=null;$('game').hidden=true;$('home').hidden=false};
function human(){return g&&g.turn===0&&g.winner===null}
function action(a,i,c){if(!human())return;if(act(g,a,i,c))render()}
function render(){
 $('title').textContent=titles[g.type];
 $('players').innerHTML=names.map((n,i)=>'<div class="player '+(g.turn===i&&g.winner===null?'active':'')+'"><span>'+['🐱','🦊','🐰','🐻'][i]+'</span>'+n+'<br>'+g.hands[i].length+'枚</div>').join('');
 $('status').textContent=g.winner!==null?'ゲーム終了！':human()?(g.type==='recipe'?(g.drawn?'いらない材料を1枚選ぼう':'材料を1枚引こう'):g.type==='baba'?'裏向きのカードを1枚選ぼう':'同じ色か数字を出そう') : names[g.turn]+'が考え中…';
 let mid='',hand='';const disabled=human()?'':'disabled';
 if(g.type==='uno'){mid=card(g.pile.at(-1),'uno','disabled')+'<p>今の色：'+colorNames[g.color]+' ／ '+(g.dir===1?'時計回り':'反時計回り')+'</p><button id="draw" '+disabled+'>1枚引いてパス</button>';hand=g.hands[0].map((c,i)=>card(c,'uno','data-play="'+i+'" '+(!human()||!playable(g,c)?'disabled':''))).join('')}
 if(g.type==='baba'){mid='<p>同じ数字のペアは自動で片付くよ。</p>';if(human()){mid+='<p>'+names[target(g)]+'の手札</p>'+g.hands[target(g)].map((_,i)=>'<button class="card" data-pull="'+i+'" aria-label="'+(i+1)+'番目の裏向きカード">✦</button>').join('')}hand=g.hands[0].map(c=>card(c,'baba','disabled')).join('')||'あがり！ 最後まで見届けよう。'}
 if(g.type==='recipe'){const r=recipes[g.goals[0]];mid='<h3>作る料理：'+r[0]+'</h3><div class="chips">'+r[1].map(v=>'<span class="'+(g.hands[0].includes(v)?'have':'')+'">'+foods[v]+(g.hands[0].includes(v)?' ✓':'')+'</span>').join('')+'</div><button id="deck" '+(!human()||g.drawn?'disabled':'')+'>山札から引く</button>';if(g.pile.length)mid+=card(g.pile.at(-1),'recipe','id="pile" aria-label="見えている材料を取る" '+(!human()||g.drawn?'disabled':''));mid+='<p><small>山札か見えている材料を1枚取り、手札から1枚戻そう。</small></p>';hand=g.hands[0].map((c,i)=>card(c,'recipe','data-discard="'+i+'" '+(!human()||!g.drawn?'disabled':''))).join('')}
 $('middle').innerHTML=mid;$('hand').innerHTML=hand;$('log').textContent=g.log.join('\n');
 $('result').innerHTML=g.winner===null?'':(g.type==='baba'?(g.loser===0?'ジョーカーはあなた！ 次はリベンジ！':'あなたもあがり！ ジョーカーは'+names[g.loser]):g.winner===0?'🎉 あなたの勝ち！':names[g.winner]+'の勝ち！ 次は勝とう！')+'<button id="again">もう一度あそぶ</button>';
 if($('again'))$('again').onclick=()=>start(g.type);
 for(const id of ['draw','deck','pile'])if($(id))$(id).onclick=()=>action(id);
 document.querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>{const i=+b.dataset.play;if(g.hands[0][i][0]==='w'){modal('<h2>次の色を選ぼう</h2>'+Object.keys(palette).filter(c=>c!=='w').map(c=>'<button data-color="'+c+'" style="background:'+palette[c]+'">'+colorNames[c]+'</button>').join(''));document.querySelectorAll('[data-color]').forEach(x=>x.onclick=()=>{$('dialog').close();action('play',i,x.dataset.color)})}else action('play',i)});
 document.querySelectorAll('[data-pull]').forEach(b=>b.onclick=()=>action('pull',+b.dataset.pull));
 document.querySelectorAll('[data-discard]').forEach(b=>b.onclick=()=>action('discard',+b.dataset.discard));schedule();
}
$('rules').onclick=()=>{modal('<h2>あそびかた</h2><p>あなたとコンピューター3人で遊びます。</p><p>🌈 <b>カラーカード</b>：同じ色か数字・記号を出して、手札をなくそう。⊘は次の人をお休み、⇄は順番を逆転、+2は次の人が2枚引いてお休み。★で色を選べます。1枚引くと番が終わります。ウノ宣言は自動。+4や重ね出しのない簡易ルールです。</p><p>🃏 <b>ババ抜き</b>：次の人のカードを引こう。同じ数字は自動でペアに。最後にジョーカーが残った人が負けです。</p><p>🍓 <b>レシピあつめ</b>：必要な6種類をそろえよう。材料を1枚引き、いらない1枚を戻します。材料がそろった状態で戻すと勝ち！</p><p>対戦途中の保存はありません。</p><button id="close">とじる</button>');$('close').onclick=()=>$('dialog').close()};
