import {palette} from './model.mjs';
export function doll(s,id='main'){
const h=palette[s.hairColor],d=palette[s.dressColor],b=palette[s.shoesColor],a=palette[s.accColor],long=[0,2,3,4,5,6,7,11].includes(s.hair),gown=s.dress>=8&&s.dress<=13,boot=s.shoes>=4&&s.shoes<=7,skirt=gown?438:340+(s.dress%3)*12;
const path=(p,fill,extra='')=>'<path d="'+p+'" fill="'+fill+'" '+extra+'/>';
const bow=(x,y,c)=>'<g transform="translate('+x+' '+y+')">'+path('M0 0 Q-27 -23 -24 4 Q-20 18 0 3 Q22 18 25 3 Q27 -23 0 0',c,'stroke="#735264" stroke-width="1"')+'<ellipse rx="5" ry="7" fill="#f4dfaa"/>'+path('M-4 5 L-14 29 L-2 23 L4 7 M4 5 L17 26 L22 17 L8 3',c)+'</g>';
let rear=long?path('M157 72 Q126 115 133 225 Q125 253 150 270 L175 245 L223 247 L249 269 Q275 207 247 97 Z',h):path('M153 80 Q124 113 139 164 Q147 182 170 170 L238 171 Q272 145 245 83 Z',h);
if(s.hair===2||s.hair===3)rear+=path('M148 100 Q93 86 109 172 Q100 206 120 237 Q161 209 151 134 M249 101 Q300 83 294 169 Q304 208 282 238 Q247 207 250 130',h);
if(s.hair===6){rear='';for(const x of [151,248])for(let i=0;i<9;i++)rear+='<ellipse cx="'+(x+Math.sin(i*2)*4)+'" cy="'+(123+i*14)+'" rx="13" ry="11" fill="'+h+'" stroke="#795b66" stroke-width="1"/>'}
if([4,5].includes(s.hair))for(const x of [145,246])rear+=path('M'+x+' 101 Q'+(x-15)+' 131 '+x+' 155 Q'+(x+17)+' 180 '+x+' 205 Q'+(x-15)+' 227 '+x+' 248','none','stroke="#fff2dc" stroke-opacity=".35" stroke-width="3"');
if(s.hair===7)rear+=bow(248,129,a);
if(s.hair===9)rear+=path('M140 132 Q117 175 154 186 Q172 172 163 153 M246 132 Q279 176 245 186 Q228 173 237 155',h);
if(s.hair===10)rear+='<circle cx="151" cy="78" r="25" fill="'+h+'"/><circle cx="248" cy="78" r="25" fill="'+h+'"/>';
let shoe='';
for(const x of [176,218]){shoe+=path('M'+(x-11)+' '+(boot?(s.shoes===6||s.shoes===7?375:424):464)+' L'+(x+10)+' '+(boot?(s.shoes===6||s.shoes===7?375:424):464)+' L'+(x+11)+' 484 Q'+(x+18)+' 501 '+(x-6)+' 501 L'+(x-17)+' 501 Q'+(x-22)+' 494 '+(x-13)+' 482 Z',b,'stroke="#645264" stroke-width="1.5"');
shoe+=path('M'+(x-15)+' 491 Q'+x+' 497 '+(x+13)+' 492','none','stroke="#fff7eb" stroke-width="2"');
if(s.shoes%2===0)shoe+=path('M'+(x-10)+' 475 L'+(x+9)+' 475','none','stroke="#e9d4b2" stroke-width="4"');
if(s.shoes===5||s.shoes===7)shoe+=bow(x,boot?438:480,a);
}
let clothes=path('M148 184 Q137 190 134 212 L155 225 L170 193 M252 184 Q264 191 268 212 L246 225 L231 193',d,'stroke="#795d75" stroke-width="1.2"')+path('M175 175 Q159 174 146 193 L154 252 L165 259 L158 275 Q198 290 240 275 L234 258 L246 250 L254 193 Q241 175 224 175 L200 191 Z','url(#'+id+'cloth)','stroke="#795d75" stroke-width="1.2"');
clothes+=path('M160 273 Q196 283 237 273 L'+(gown?283:260)+' '+skirt+' Q200 '+(skirt+30)+' '+(gown?114:138)+' '+skirt+' Z','url(#'+id+'cloth)','stroke="#795d75" stroke-width="1.5"');
for(let i=0;i<7;i++){const x=162+i*12;clothes+=path('M'+x+' 284 Q'+(x+(i-3)*4)+' '+(skirt-28)+' '+(x+(i-3)*(gown?10:4))+' '+(skirt+4),'none','stroke="#574457" stroke-opacity=".22" stroke-width="3"')}
clothes+=path('M'+(gown?118:141)+' '+(skirt-8)+' Q200 '+(skirt+15)+' '+(gown?280:257)+' '+(skirt-8),'none','stroke="#fff3dd" stroke-width="6" stroke-dasharray="3 3"');
clothes+=path('M174 177 L199 201 L183 213 L166 185 M225 177 L200 201 L216 213 L236 185','#fff9ee','stroke="#d9bdc6"');
clothes+=bow(200,210,a);
clothes+=path('M160 268 Q198 280 239 268','none','stroke="#f2d390" stroke-width="5"');
for(let y=238;y<262;y+=11)clothes+='<circle cx="200" cy="'+y+'" r="2.5" fill="#efd18a"/>';
if([1,16].includes(s.dress))for(let y=300;y<skirt;y+=14)clothes+=path('M145 '+y+' L255 '+y,'none','stroke="#fff8e6" stroke-opacity=".45" stroke-width="2"');
if([6,7,10,11,12,19].includes(s.dress))for(let i=0;i<10;i++){const x=156+(i%5)*21,y=302+Math.floor(i/5)*30;clothes+='<text x="'+x+'" y="'+y+'" font-size="12" fill="#fff4dc">'+(s.dress===10?'✦':'❀')+'</text>'}
if(s.dress===14)clothes+=path('M178 230 L222 230 L230 277 L244 333 Q200 353 155 333 L171 277 Z','#fffcf0','stroke="#ead8db"');
if(s.dress===2)clothes+=path('M166 181 L199 215 L238 181 L231 218 L200 231 L168 217 Z',a,'stroke="#fff7f0" stroke-width="3"');
if([3,4,17,18].includes(s.dress))clothes+=path('M171 180 L184 227 L179 272 L150 272 L145 200 M228 180 L215 227 L221 272 L250 272 L255 200',d,'stroke="#6e566a" stroke-width="1.5"');
let acc='';
if([0,8].includes(s.acc)){acc=bow(155,83,a);if(s.acc===8)acc+=bow(246,83,a)}
if(s.acc===1)acc=path('M147 107 Q152 43 222 63 Q250 72 254 106','none','stroke="'+a+'" stroke-width="9"');
if(s.acc===2)acc=path('M145 90 L138 45 Q161 50 174 72 M226 72 Q241 49 261 44 L253 95',a,'stroke="#755366" stroke-width="3"');
if(s.acc===3)acc=path('M164 72 L158 42 L180 55 L199 28 L219 55 L241 42 L234 72 Z','#ecd08e','stroke="#ab8749" stroke-width="2"')+'<circle cx="199" cy="52" r="6" fill="'+a+'"/>';
if(s.acc===4||s.acc===5)acc='<text x="237" y="98" font-size="34" fill="'+a+'">'+(s.acc===4?'❀':'★')+'</text>';
if(s.acc===6)acc='<ellipse cx="195" cy="65" rx="62" ry="25" fill="'+a+'" stroke="#826175"/>';
if(s.acc===7)acc=path('M143 119 Q133 49 199 49 Q267 49 258 120','none','stroke="'+a+'" stroke-width="12"')+'<rect x="131" y="107" width="20" height="37" rx="8" fill="'+a+'"/><rect x="250" y="107" width="20" height="37" rx="8" fill="'+a+'"/>';
if(s.acc===9)for(let i=0;i<9;i++)acc+='<circle cx="'+(154+i*11)+'" cy="'+(75-Math.sin(i/8*Math.PI)*12)+'" r="4" fill="#fff4df" stroke="#cfb28b"/>';
return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="70 0 260 525"><defs><linearGradient id="'+id+'skin" x2=".8" y2="1"><stop stop-color="#fff0e2"/><stop offset=".6" stop-color="#f9d4c6"/><stop offset="1" stop-color="#eab8b0"/></linearGradient><linearGradient id="'+id+'cloth"><stop stop-color="'+d+'"/><stop offset=".45" stop-color="'+d+'"/><stop offset="1" stop-color="#70576e"/></linearGradient><radialGradient id="'+id+'eye"><stop stop-color="#dfc8f4"/><stop offset=".6" stop-color="#a581c4"/><stop offset="1" stop-color="#4b395d"/></radialGradient></defs><ellipse cx="200" cy="505" rx="75" ry="10" fill="#bf90a4" opacity=".2"/><g class="breath"><g class="hair">'+rear+'</g>'+path('M158 306 L194 306 L188 392 L185 478 L163 478 L165 389 Z M205 306 L239 306 L232 390 L229 478 L208 478 L208 391 Z','url(#'+id+'skin)')+shoe+path('M148 191 Q132 222 130 253 L121 287 Q114 304 123 312 Q132 320 136 304 L141 291 L156 252 L170 200 M250 191 Q266 223 269 253 L279 290 Q286 307 277 314 Q269 319 263 302 L259 289 L243 252 L232 201','url(#'+id+'skin)','stroke="#cf9d9e" stroke-width="1"')+path('M185 147 L183 177 Q197 195 216 177 L213 145','url(#'+id+'skin)')+clothes+path('M153 103 Q151 145 173 159 Q199 180 224 159 Q247 143 247 103 Q234 66 199 65 Q161 69 153 103','url(#'+id+'skin)','stroke="#b4868d" stroke-width="1.3"')+
[174,225].map(x=>'<g><path d="M'+(x-14)+' 118 Q'+x+' 104 '+(x+12)+' 117 Q'+(x+8)+' 136 '+(x-8)+' 132 Z" fill="#fffaf8"/><ellipse cx="'+x+'" cy="121" rx="9" ry="12" fill="url(#'+id+'eye)"/><ellipse cx="'+x+'" cy="122" rx="3.5" ry="7" fill="#4e3d5b"/><ellipse cx="'+(x-3)+'" cy="115" rx="3.4" ry="4.2" fill="white"/><circle cx="'+(x+4)+'" cy="127" r="2" fill="#f9edff"/><path d="M'+(x-15)+' 117 Q'+x+' 104 '+(x+13)+' 117" fill="none" stroke="#66505e" stroke-width="2.8"/><path d="M'+(x-13)+' 114 L'+(x-17)+' 109" stroke="#66505e" stroke-width="1.6"/></g>').join('')+'<ellipse cx="164" cy="139" rx="11" ry="4" fill="#e997a5" opacity=".3"/><ellipse cx="235" cy="139" rx="11" ry="4" fill="#e997a5" opacity=".3"/>'+path('M199 130 L197 139 L201 140','none','stroke="#d39f9e" stroke-width="1"')+path('M191 150 Q199 156 208 149','none','stroke="#b66b80" stroke-width="1.6" stroke-linecap="round"')+
'<g class="hair">'+path('M147 112 Q137 58 190 55 Q240 47 254 99 L249 129 L237 99 Q225 103 213 81 L216 112 Q195 102 185 82 L185 110 Q169 105 166 88 L154 126 Z',h,'stroke="#735365" stroke-width="1.2"')+path('M155 94 Q150 69 182 65 M168 91 Q168 71 188 64 M193 66 Q213 64 231 85 M229 76 Q243 90 245 111','none','stroke="#fff2dc" stroke-opacity=".45" stroke-width="2"')+'</g>'+acc+'</g></svg>';
}
