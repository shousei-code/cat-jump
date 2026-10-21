from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8003/sound-run/');page.locator('#action').click()
 assert page.evaluate('audio.state')=='running'
 page.evaluate('for(let i=0;i<5;i++)landingSound(i)')
 page.locator('#mute').click();assert page.evaluate('muted')
 page.locator('#pause').click();page.wait_for_timeout(100)
 assert page.evaluate('audio.state')=='suspended'
 # Place above a crumble tile, then use normal gravity and collisions.
 page.evaluate('''const tile=platforms.find(p=>p.crumble);player.x=tile.x+10;player.y=tile.y-60;player.vy=0;ground=null;grounded=false;for(let i=0;i<35;i++)update(1/120);''')
 assert page.evaluate('ground && ground.crumble')
 page.evaluate('for(let i=0;i<110;i++)update(1/120)')
 assert page.evaluate('platforms.some(p=>p.gone>0)')
 page.evaluate('for(let i=0;i<300;i++)update(1/120)')
 assert page.evaluate('platforms.every(p=>p.gone===0)')
 assert not errors,errors
 b.close()
print('PASS five sound generators, mute, audio pause, crumble collision and return')
