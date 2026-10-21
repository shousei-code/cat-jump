from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.add_init_script('window.cb=null;window.t=0;requestAnimationFrame=f=>cb=f;window.step=n=>{for(let i=0;i<n;i++){t+=16;cb(t)}}')
 page.goto('http://127.0.0.1:8003/creator/')
 page.locator('#name').fill('ひまりゲーム部')
 page.locator('#record').click()
 page.keyboard.down('ArrowRight');page.evaluate('step(15)');page.keyboard.up('ArrowRight')
 assert page.evaluate('x')>300
 page.locator('#pause').click();time=page.evaluate('remaining');page.evaluate('step(100)');assert page.evaluate('remaining')==time
 page.locator('#pause').click()
 page.evaluate('objects=[{x:x,y:220,bad:false}];update(.016)')
 assert page.evaluate('score')==2
 page.evaluate('objects=[{x:x,y:220,bad:true}];update(.016)')
 assert page.evaluate('score')==0
 page.evaluate('step(1700)');assert page.evaluate('state')=='editing'
 assert page.locator('#live').is_disabled()
 page.locator('[data-title]').first.click()
 assert page.evaluate('data.videos.length')==1
 assert page.evaluate('data.subs')>=10
 page.locator('#live').click()
 for _ in range(7):
  page.evaluate('step(285)')
  if page.evaluate('state')=='running':page.locator('#chatChoices button').first.click()
 assert page.evaluate('state')=='idle'
 assert page.evaluate('data.subs')>20
 page.locator('#gear').click();assert page.evaluate('data.gear')==1
 page.locator('#rest').click();assert page.evaluate('data.energy')==90
 page.reload();assert page.locator('#name').input_value()=='ひまりゲーム部'
 assert page.evaluate('data.gear')==1
 assert page.locator('#videos p').count()==1
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.screenshot(path='/tmp/creator-mobile.png',full_page=True)
 assert not errors,errors
 b.close()
print('PASS recording, movement, catch/hazard, pause, publishing, live replies, rewards, upgrades, rest, persistence and mobile layout')
