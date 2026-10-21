from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.add_init_script('window.cb=null;window.t=0;requestAnimationFrame=f=>cb=f;window.step=n=>{for(let i=0;i<n;i++){t+=50;cb(t)}}')
 page.goto('http://127.0.0.1:8003/salon/')
 page.locator('#start').click()
 recipe=page.evaluate('customers[0].recipe')
 for key in recipe:
  page.locator('[data-service="'+key+'"]').click();page.evaluate('step(45)')
 assert page.evaluate('served')==1
 page.locator('#pause').click();time=page.evaluate('remaining');page.evaluate('step(100)');assert page.evaluate('remaining')==time
 page.locator('#pause').click()
 before=page.evaluate('d.stock.shampoo')
 page.locator('#openPhone').click();page.locator('#products button').first.click();page.evaluate('step(170)')
 assert page.evaluate('d.stock.shampoo')==before+6
 page.locator('#closePhone').click();page.locator('#hire').click();assert page.evaluate('d.hired')
 page.locator('#openPhone').click();page.locator('#products button').nth(1).click();assert page.evaluate('deliveries[0].time')==2
 page.locator('#closePhone').click();page.evaluate('step(45)')
 page.locator('[data-look="2"]').click();page.locator('[data-shop="1"]').click()
 page.evaluate('step(2000)');assert page.evaluate('state')=='ended';assert page.evaluate('lost')>0
 page.reload();assert page.evaluate('d.look')==2;assert page.evaluate('d.shop')==1;assert page.evaluate('d.hired')
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.screenshot(path='/tmp/salon-mobile.png',full_page=True)
 assert not errors,errors
 b.close()
print('PASS ordered treatment, rewards, pause, stock deliveries, courier speed, dress-up, closing, persistence and mobile')
