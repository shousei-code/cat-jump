from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.add_init_script('window.cb=null;window.t=0;requestAnimationFrame=f=>cb=f;window.step=()=>{t+=16;cb(t)}')
 page.goto('http://127.0.0.1:8003/idol/')
 page.locator('#name').fill('ひまり');page.locator('#hair').select_option('1')
 page.locator('#train').click()
 page.locator('#pause').click();before=page.evaluate('elapsed');page.evaluate('for(let i=0;i<100;i++)step()');assert page.evaluate('elapsed')==before
 page.locator('#pause').click()
 page.evaluate('for(let i=0;i<1300;i++){step();for(const n of notes)if(!n.hit&&!n.miss&&Math.abs(n.time-elapsed)<.02)hit(n.lane)}')
 assert page.evaluate('d.skill')==1
 page.locator('#start').click()
 page.evaluate('for(let i=0;i<1800;i++){step();for(const n of notes)if(!n.hit&&!n.miss&&Math.abs(n.time-elapsed)<.02)hit(n.lane)}')
 assert page.evaluate('d.fans')>=90
 assert page.evaluate('d.coins')>=70
 page.locator('#wardrobe button').nth(1).click();assert page.evaluate('d.outfit')==1
 page.locator('#rest').click();assert page.evaluate('d.energy')==100
 page.reload();assert page.locator('#name').input_value()=='ひまり';assert page.evaluate('d.outfit')==1
 page.locator('#start').click();page.locator('#sound').click();assert page.evaluate('muted')
 fans=page.evaluate('d.fans');page.locator('#quit').click();assert page.evaluate('d.fans')==fans
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.screenshot(path='/tmp/idol-mobile.png',full_page=True)
 assert not errors,errors
 b.close()
print('PASS avatar, lesson, pause, full rhythm live, rewards, outfit purchase, rest, persistence, mute, quit and mobile layout')
