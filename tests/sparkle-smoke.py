from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8003/sparkle/')
 page.locator('#name').fill('ひまり');page.locator('#outfit').select_option('かっこいいジャケット')
 for i in range(6):
  page.locator('#cast button').nth(i).click()
  for kind in range(3):
   page.locator('#choices button').nth(kind).click()
   page.locator('#choices button').nth(1).click()
   assert '落ち着ける' in page.locator('#text').inner_text()
   page.locator('#cast button').nth(i).click()
 assert page.evaluate('d.album.length')==18
 page.locator('#choices button').first.click();assert page.evaluate('d.album.length')==18
 page.reload();assert page.evaluate('d.album.length')==18
 assert page.locator('#name').input_value()=='ひまり'
 page.locator('#places button').nth(3).click();page.locator('#choices button').first.click();page.locator('#choices button').first.click();page.locator('#choices button').nth(1).click();page.locator('#choices button').first.click();assert page.evaluate('d.outfit')=='リボンのワンピース'
 page.locator('#all').click();assert '6人' in page.locator('#speaker').inner_text()
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 assert not errors,errors
 b.close()
print('PASS all six characters, 18 unique memories, preference response, outfit outing, party and saved progress')
