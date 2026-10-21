from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8003/fruit/')
 for _ in range(3):page.locator('#choices button').first.click()
 assert page.evaluate('step')==1
 page.locator('#choices button').first.click();page.locator('#choices button').first.click();assert page.evaluate('step')==3
 page.locator('#choices button').first.click()
 for _ in range(2):page.locator('#choices button').first.click()
 page.wait_for_function('step===5')
 assert page.locator('.dance').count()==4
 page.locator('#sound').click();assert page.evaluate('muted')
 page.locator('#restart').click()
 for _ in range(3):page.locator('#choices button').first.click()
 page.locator('#choices button').first.click();page.locator('#choices button').first.click();page.locator('#choices button').nth(1).click();assert page.evaluate('step')==5
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors;b.close()
print('PASS dance, story, cartoon action, reconciliation, alternative ending, restart, mute and mobile layout')
