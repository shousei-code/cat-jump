import {create,cpu,act,recipes} from './core.mjs';
import assert from 'node:assert/strict';
for(const type of ['uno','baba','recipe'])for(let n=0;n<100;n++){
 const g=create(type);let count=0;
 while(g.winner===null&&count++<20000)assert.equal(cpu(g),true);
 assert.notEqual(g.winner,null,type+' stalled');
 if(type==='uno')assert.equal(g.hands[g.winner].length,0);
 if(type==='baba')assert.deepEqual(g.hands[g.loser],[0]);
 if(type==='recipe')assert(recipes[g.goals[g.winner]][1].every(v=>g.hands[g.winner].includes(v)));
}
const g=create('uno');g.hands[0]=['rD','b2'];g.pile=['r1'];g.color='r';
const before=g.hands[1].length;assert(act(g,'play',0));assert.equal(g.hands[1].length,before+2);assert.equal(g.turn,2);
console.log('PASS: 300 complete games, winner invariants, draw-two and skip');
