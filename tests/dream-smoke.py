from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.add_init_script('window.cb=null;window.t=0;requestAnimationFrame=f=>cb=f;window.step=n=>{for(let i=0;i<n;i++){t+=16;cb(t)}}')
 page.goto('http://127.0.0.1:8003/dream/')
 page.locator('[data-ride="wheel"]').click()
 assert page.locator('#activity').is_hidden()
 for i in range(4):
  page.locator('[data-friend="'+str(i)+'"]').click();page.locator('#choices button').first.click()
 assert page.evaluate('saved.friends.length')==4
 page.locator('[data-ride="wheel"]').click()
 for _ in range(3):page.locator('#controls button').first.click()
 assert page.evaluate('saved.stamps.includes("wheel")')
 page.locator('[data-ride="music"]').click()
 page.evaluate('note((sequence[0]+1)%3)');assert page.evaluate('entered.length')==0
 for _ in range(3):
  seq=page.evaluate('sequence')
  for n in seq:page.locator('#controls button').nth(n).click()
 assert page.evaluate('saved.stamps.includes("music")')
 page.locator('[data-ride="stars"]').click();page.locator('#pause').click()
 time=page.evaluate('time');page.evaluate('step(50)');assert page.evaluate('time')==time
 page.locator('#pause').click()
 page.evaluate('for(let i=0;i<1300;i++){if(items.length)x=items[0].x;step(1)}')
 assert page.evaluate('saved.stamps.includes("stars")')
 page.locator('#ending').click();assert '夜明けのパレード' in page.locator('#speaker').inner_text()
 page.reload();assert page.evaluate('saved.stamps.length')==3
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.screenshot(path='/tmp/dream-mobile.png',full_page=True)
 assert not errors,errors
 b.close()
print('PASS conversations, unlocks, all attractions, wrong note, pause, parade, persistence and mobile layout')
