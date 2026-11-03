export const names=['あなた','ハル','モモ','ソラ'];
export const foods=['🍚 お米','🥚 たまご','🥛 牛乳','🌾 小麦粉','🍅 トマト','🧀 チーズ','🍖 お肉','🥔 じゃがいも','🥕 にんじん','🧅 玉ねぎ','🍓 いちご','🐟 さかな'];
export const recipes=[['オムライス',[0,1,4,6,8,9]],['ピザ',[3,4,5,6,8,9]],['いちごランチ',[1,2,3,5,7,10]],['おさかな定食',[0,1,7,8,9,11]]];
export function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function pairs(a){const out=[];for(const c of a){const i=out.indexOf(c);if(c!==0&&i>=0)out.splice(i,1);else out.push(c)}return shuffle(out)}
function next(g,p){do{p=(p+1)%4}while(!g.hands[p].length);return p}
function note(g,s){g.log.unshift(s);g.log=g.log.slice(0,5)}
export function create(type){
 const g={type,hands:[[],[],[],[]],deck:[],pile:[],turn:0,dir:1,winner:null,log:[],drawn:false,goals:shuffle([0,1,2,3]),order:[]};
 if(type==='uno'){for(const c of ['r','b','g','y']){g.deck.push(c+'0');for(const v of ['1','2','3','4','5','6','7','8','9','S','R','D'])g.deck.push(c+v,c+v)}g.deck.push('wW','wW','wW','wW')}
 if(type==='baba')g.deck=[0,...Array.from({length:52},(_,i)=>i%13+1)];
 if(type==='recipe')g.deck=Array.from({length:72},(_,i)=>i%12);
 shuffle(g.deck);
 if(type==='baba'){let p=0;while(g.deck.length)g.hands[p++%4].push(g.deck.pop());g.hands=g.hands.map(pairs);g.order=[0,1,2,3].filter(p=>!g.hands[p].length);g.turn=next(g,3);return g}
 for(let i=0;i<(type==='uno'?7:6);i++)for(const h of g.hands)h.push(g.deck.pop());
 if(type==='uno'){const i=g.deck.findIndex(c=>/\d/.test(c[1]));g.pile.push(g.deck.splice(i,1)[0]);g.color=g.pile[0][0]}else g.pile.push(g.deck.pop());
 return g;
}
function take(g,p){if(!g.deck.length&&g.pile.length>1){const top=g.pile.pop();g.deck=shuffle(g.pile);g.pile=[top]}if(g.deck.length)g.hands[p].push(g.deck.pop())}
export function playable(g,c){return c[0]==='w'||c[0]===g.color||c[1]===g.pile.at(-1)[1]}
export function act(g,action,i,color){
 if(g.winner!==null)return false;
 const p=g.turn,h=g.hands[p],who=names[p];
 if(g.type==='uno'){
  if(action==='draw'){take(g,p);note(g,who+'が1枚引きました');g.turn=(p+g.dir+4)%4;return true}
  const c=h[i];if(action!=='play'||!c||!playable(g,c)||c[0]==='w'&&!['r','b','g','y'].includes(color))return false;
  h.splice(i,1);g.pile.push(c);g.color=c[0]==='w'?color:c[0];let skip=1;
  if(c[1]==='R')g.dir*=-1;
  if(c[1]==='S')skip=2;
  if(c[1]==='D'){const q=(p+g.dir+4)%4;take(g,q);take(g,q);skip=2}
  note(g,who+'がカードを出したよ'+(h.length===1?'！ ウノ！':''));
  if(!h.length)g.winner=p;g.turn=(p+g.dir*skip+8)%4;return true;
 }
 if(g.type==='baba'){
  const q=next(g,p),target=g.hands[q];if(action!=='pull'||!Number.isInteger(i)||i<0||i>=target.length)return false;
  h.push(target.splice(i,1)[0]);g.hands[p]=pairs(h);
  for(const n of [q,p])if(!g.hands[n].length&&!g.order.includes(n))g.order.push(n);
  note(g,who+'が'+names[q]+'から1枚引いたよ');
  const left=[0,1,2,3].filter(n=>g.hands[n].length);if(left.length===1){g.loser=left[0];g.winner=g.order[0]}else g.turn=next(g,p);return true;
 }
 if(action==='deck'||action==='pile'){
  if(g.drawn||action==='pile'&&!g.pile.length)return false;
  if(action==='pile')h.push(g.pile.pop());else take(g,p);
  g.drawn=true;return true;
 }
 if(action!=='discard'||!g.drawn||!Number.isInteger(i)||i<0||i>=h.length)return false;
 g.pile.push(h.splice(i,1)[0]);g.drawn=false;note(g,who+'が材料を交換したよ');
 if(recipes[g.goals[p]][1].every(v=>h.includes(v)))g.winner=p;
 g.turn=(p+1)%4;return true;
}
export function cpu(g){
 const h=g.hands[g.turn];
 if(g.type==='uno'){const i=h.findIndex(c=>playable(g,c));return i<0?act(g,'draw'):act(g,'play',i,['r','b','g','y'].sort((a,b)=>h.filter(c=>c[0]===b).length-h.filter(c=>c[0]===a).length)[0])}
 if(g.type==='baba')return act(g,'pull',Math.floor(Math.random()*g.hands[next(g,g.turn)].length));
 const need=recipes[g.goals[g.turn]][1],top=g.pile.at(-1);
 if(!g.drawn)act(g,need.includes(top)&&!h.includes(top)?'pile':'deck');
 const i=h.findIndex((v,j)=>!need.includes(v)||h.indexOf(v)!==j);
 return act(g,'discard',i<0?h.length-1:i);
}
export function target(g){return next(g,g.turn)}
