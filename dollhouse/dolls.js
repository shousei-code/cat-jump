import * as T from './vendor/three.module.js';
const material=c=>new T.MeshStandardMaterial({color:c,roughness:.8});
function faceTexture(){const c=document.createElement('canvas');c.width=1024;c.height=512;const x=c.getContext('2d');x.fillStyle='#ffe2ce';x.fillRect(0,0,1024,512);
 for(const a of [-1,1]){const xx=256+a*49,yy=258;x.save();x.translate(xx,yy);x.fillStyle='#6d405f';x.beginPath();x.ellipse(0,-2,25,34,0,0,Math.PI*2);x.fill();x.fillStyle='#fffafc';x.beginPath();x.ellipse(0,2,23,29,0,0,Math.PI*2);x.fill();const g=x.createLinearGradient(0,-22,0,30);g.addColorStop(0,'#54376c');g.addColorStop(.55,'#ab75c3');g.addColorStop(1,'#dfa4df');x.fillStyle=g;x.beginPath();x.ellipse(0,3,15,27,0,0,Math.PI*2);x.fill();x.fillStyle='#50325e';x.beginPath();x.ellipse(0,0,7,20,0,0,Math.PI*2);x.fill();x.fillStyle='white';x.beginPath();x.ellipse(-6,-11,6,8,0,0,Math.PI*2);x.fill();x.beginPath();x.arc(7,14,3,0,7);x.fill();x.strokeStyle='#6b435b';x.lineWidth=3;x.beginPath();x.moveTo(a*17,-24);x.lineTo(a*29,-33);x.moveTo(a*21,-17);x.lineTo(a*32,-22);x.stroke();x.strokeStyle='#bf8a9b';x.lineWidth=3;x.beginPath();x.ellipse(0,-43,18,4,0,Math.PI,Math.PI*2);x.stroke();x.restore();const blush=x.createRadialGradient(xx+a*15,302,2,xx+a*15,302,24);blush.addColorStop(0,'#eea6b499');blush.addColorStop(1,'#eea6b400');x.fillStyle=blush;x.fillRect(xx+a*15-25,277,50,50);}
 x.strokeStyle='#c5818c';x.lineWidth=3;x.lineCap='round';x.beginPath();x.moveTo(244,313);x.quadraticCurveTo(256,324,268,313);x.stroke();x.fillStyle='#e4ad9f';x.beginPath();x.ellipse(256,291,3,2,0,0,7);x.fill();const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;return tex;}
let sharedFace;
export function createDoll({hair=material('#e9a2c6'),dress=material('#c88bac'),skin=material('#ffe2ce')}={}){const root=new T.Group(),body=new T.Group();root.add(body);const cream=material('#fff7ec'),shoe=material('#986d85');
 function add(g,geo,m,x,y,z,s){const o=new T.Mesh(geo,m);o.position.set(x,y,z);if(s)o.scale.set(...s);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
 const ball=(g,r,m,x,y,z,s)=>add(g,new T.SphereGeometry(r,24,18),m,x,y,z,s);
 const tube=(g,r1,r2,h,m,x,y,z)=>add(g,new T.CylinderGeometry(r1,r2,h,32),m,x,y,z);
 // Longer doll proportions, layered skirt and fine scalloped lace.
 tube(body,.16,.22,.43,dress,0,1.24,0);tube(body,.21,.43,.46,dress,0,.81,0);tube(body,.4,.44,.07,cream,0,.6,0);tube(body,.19,.2,.07,cream,0,1.1,0);
 for(let i=0;i<18;i++){const a=i*Math.PI/9;ball(body,.047,cream,Math.sin(a)*.405,.575,Math.cos(a)*.405,[1,.65,1]);}
 for(const a of [-1,1]){ball(body,.10,cream,a*.1,1.42,.12,[1,.45,1]);const bow=ball(body,.09,dress,a*.075,1.12,.215,[1.2,.6,.5]);bow.rotation.z=a*.3;}ball(body,.035,cream,0,1.12,.23);
 tube(body,.08,.08,.12,skin,0,1.54,0);
 if(!sharedFace)sharedFace=faceTexture();const face=new T.MeshStandardMaterial({map:sharedFace,roughness:.88});ball(body,.39,face,0,1.95,0,[.91,1.12,.85]);
 // Smooth back hair, a swept fringe and long tapered locks (no bead-like bangs).
 ball(body,.4,hair,0,1.93,-.16,[.98,1.16,.78]);
 const cap=add(body,new T.SphereGeometry(.405,32,20,0,Math.PI*2,0,1.32),hair,0,1.96,-.015,[.94,1.12,.88]);
 for(const a of [-1,1]){const lock=ball(body,.22,hair,a*.31,1.57,-.13,[.55,2.1,.7]);lock.rotation.z=a*-.1;const curl=ball(body,.13,hair,a*.37,1.23,-.1,[.8,1.5,.8]);curl.rotation.z=a*.35;const fringe=ball(body,.23,hair,a*.12,2.13,.23,[.85,.4,.45]);fringe.rotation.z=a*-.2;
 const bow=new T.Group();bow.position.set(a*.32,2.18,-.02);body.add(bow);for(const b of [-1,1]){const loop=ball(bow,.1,cream,b*.08,0,0,[1.1,.7,.45]);loop.rotation.z=b*.35;}ball(bow,.04,dress,0,0,.035);}
 const limbs=[];for(const a of [-1,1]){const leg=new T.Group();leg.position.set(a*.13,.62,0);root.add(leg);tube(leg,.06,.065,.4,skin,0,-.17,0);tube(leg,.07,.07,.19,cream,0,-.37,0);ball(leg,.1,shoe,0,-.51,.04,[.9,.65,1.5]);ball(leg,.035,cream,0,-.46,.1,[1.3,.5,.7]);limbs.push(leg);const arm=new T.Group();arm.position.set(a*.2,1.4,0);body.add(arm);ball(arm,.11,dress,0,-.06,0,[1,1.1,1]);tube(arm,.05,.047,.32,skin,a*.035,-.25,0);ball(arm,.06,skin,a*.04,-.43,0);arm.rotation.z=a*.18;limbs.push(arm);}
 return {root,body,limbs};}
