'use strict';
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const $=id=>document.getElementById(id);
const cat=new Image();cat.src='assets/kitten.png';
let mode='loading',elapsed=0,distance=0,score=0,best=0,y=0,vy=0,obstacles=[],nextSpawn=1.8,last=0;
try{best=Number(localStorage.getItem('komugi-best'))||0;}catch{}
$('best').textContent=best;
function panel(title,message,button){$('heading').textContent=title;$('message').textContent=message;$('start').textContent=button;$('overlay').hidden=false;}
function start(){elapsed=0;distance=0;score=0;y=0;vy=0;obstacles=[];nextSpawn=1.8;mode='running';$('score').textContent=0;$('overlay').hidden=true;$('pause').disabled=false;$('jump').disabled=false;$('pause').textContent='一時停止';}
function jump(){if(mode==='running'&&y===0)vy=690;}
function pause(){if(mode==='running'){mode='paused';panel('ちょっと、ひとやすみ。','こむぎもひなたぼっこ中。準備ができたら続けよう。','つづける');$('pause').textContent='つづける';}else if(mode==='paused'){mode='running';$('overlay').hidden=true;$('pause').textContent='一時停止';}}
function finish(){mode='over';best=Math.max(best,score);$('best').textContent=best;try{localStorage.setItem('komugi-best',String(best));}catch{}$('pause').disabled=true;$('jump').disabled=true;panel('がんばったね、こむぎ！',`スコア ${score}　・　ベスト ${best}。もう一度、おさんぽする？`,'もう一度あそぶ');}
$('start').onclick=()=>mode==='paused'?pause():start();$('pause').onclick=pause;$('jump').onpointerdown=e=>{e.preventDefault();jump();};canvas.onpointerdown=e=>{e.preventDefault();jump();};
document.addEventListener('keydown',e=>{if(['Space','ArrowUp'].includes(e.code)&&!['BUTTON','INPUT'].includes(document.activeElement.tagName)){e.preventDefault();if(!e.repeat)jump();}if(e.code==='Escape')pause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='running')pause();});
cat.onload=()=>{mode='ready';$('start').disabled=false;$('start').textContent='あそびにいこう';};
cat.onerror=()=>{panel('こむぎが見つかりません','画像の読み込みに失敗しました。ページを再読み込みしてください。','読み込み失敗');};
function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function background(){let g=ctx.createLinearGradient(0,0,0,440);g.addColorStop(0,'#dcece6');g.addColorStop(1,'#faf4d5');ctx.fillStyle=g;ctx.fillRect(0,0,960,540);ellipse(793,94,43,43,'#fff7cf');
 for(let i=0;i<5;i++){let x=((i*260-distance*.12)%1300+1300)%1300-140;ellipse(x,110+i%2*48,62,15,'#ffffff9c');ellipse(x+22,99+i%2*48,30,23,'#ffffff9c');}
 ellipse(200,470,460,180,'#c6d7b1');ellipse(780,460,490,220,'#b4caa2');ellipse(480,470,360,120,'#d2deba');
 ctx.fillStyle='#eee3c3';ctx.fillRect(0,429,960,111);ctx.fillStyle='#94ad75';ctx.fillRect(0,420,960,10);
 for(let i=0;i<30;i++){let x=((i*57-distance*.7)%1100+1100)%1100-40;ctx.strokeStyle='#8ca66d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,420);ctx.lineTo(x-3,409);ctx.moveTo(x,420);ctx.lineTo(x+5,412);ctx.stroke();if(i%4===0){ellipse(x-3,408,4,4,'#fff5d6');ellipse(x-3,408,1.5,1.5,'#e1ac57');}}
 for(let i=0;i<20;i++){const x=((i*73-distance)%1100+1100)%1100;ellipse(x,458+i%3*22,3,1.4,'#d1c3a2');}}
function pot(o){ctx.save();ctx.translate(o.x,420);ellipse(23,4,31,6,'#77684b20');ctx.fillStyle='#b56f50';ctx.beginPath();ctx.moveTo(0,-o.h+10);ctx.lineTo(46,-o.h+10);ctx.lineTo(39,0);ctx.lineTo(7,0);ctx.closePath();ctx.fill();ctx.fillStyle='#ce8864';ctx.fillRect(-3,-o.h,52,12);ctx.fillStyle='#d99c78';ctx.fillRect(10,-o.h+16,5,o.h-23);ctx.strokeStyle='#668b58';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(23,-o.h);ctx.lineTo(23,-o.h-22);ctx.stroke();ellipse(14,-o.h-17,10,5,'#799c62');ellipse(31,-o.h-25,11,5,'#91aa6d');ctx.restore();}
function update(dt){elapsed+=dt;const speed=Math.min(455,255+elapsed*3);distance+=speed*dt;score=Math.floor(distance/35);$('score').textContent=score;vy-=1700*dt;y=Math.max(0,y+vy*dt);if(y===0)vy=0;
 nextSpawn-=dt;if(nextSpawn<=0){obstacles.push({x:1020,h:46+Math.random()*13});nextSpawn=1.55+Math.random()*.55;}
 for(const o of obstacles){o.x-=speed*dt;if(o.x<235&&o.x+46>157&&420-y>420-o.h+6&&345-y<420){finish();break;}}
 obstacles=obstacles.filter(o=>o.x>-70);
}
function draw(){background();for(const o of obstacles)pot(o);ellipse(188,426,Math.max(22,55-y*.13),7,'#71613e25');if(cat.complete&&cat.naturalWidth){const bob=mode==='running'&&y===0?Math.sin(elapsed*24)*2:0;ctx.save();ctx.translate(188,369-y+bob);ctx.rotate(y>0?-.08:0);ctx.drawImage(cat,-95,-65,190,127);ctx.restore();}}
function frame(t){const dt=Math.min((t-last)/1000||0,.033);last=t;if(mode==='running')update(dt);draw();requestAnimationFrame(frame);}requestAnimationFrame(frame);
