from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':390,'height':844});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.add_init_script('window.cb=null;window.t=0;requestAnimationFrame=f=>cb=f;window.step=n=>{for(let i=0;i<n;i++){t+=16;cb(t)}}')
 p.goto('http://127.0.0.1:8003/dodge/');p.locator('#roster button').first.click();assert p.locator('#start').is_disabled();p.locator('#roster button').nth(8).click();p.locator('#start').click()
 assert p.evaluate('new Set(players.map(p=>p.id)).size')==6
 x=p.evaluate('players[active].x');p.keyboard.down('ArrowRight');p.evaluate('step(20)');p.keyboard.up('ArrowRight');assert p.evaluate('players[active].x')>x
 p.locator('#pause').click();time=p.evaluate('time');p.evaluate('step(100)');assert p.evaluate('time')==time;p.locator('#pause').click()
 p.evaluate('step(80)');p.locator('#throw').click();assert p.evaluate('balls.some(b=>b.side===0)')
 p.locator('#dodge').click();assert p.evaluate('players[active].inv')>0
 p.evaluate('balls=[];players[active].inv=0;balls.push({x:players[active].x,y:players[active].y,vx:0,vy:0,side:1,life:1});update(.001)')
 assert p.evaluate('players[active].hp')==1
 p.locator('#team button').nth(1).click();assert p.evaluate('active')==1
 p.evaluate('for(const p of players.filter(p=>p.side===1))p.hp=0;update(.001)');assert p.evaluate('state')=='end';assert p.evaluate('wins')==1
 p.locator('#menu').click();p.locator('#start').click();p.evaluate('step(5800)');assert p.evaluate('state')=='end'
 p.reload();assert p.evaluate('wins')>=1
 assert p.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors;b.close()
print('PASS team selection, movement, pause, throwing, dodge, collision, switching, victory, full match and saved wins')
