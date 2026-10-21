from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844});errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8003/heart/')
 for boy in ['ren','haru','sora']:
  page.locator('#name').fill('ひまり')
  page.locator('[data-boy="'+boy+'"]').click()
  for day in range(6):
   page.locator('#choices button').first.click()
   if day==2:
    page.reload();page.locator('#continue').click()
   else: page.locator('#next').click()
  page.locator('#choices button').first.click()
  assert '両想い' in page.locator('#bond').inner_text()
  assert 'ひまり' in page.locator('#text').inner_text()
  page.locator('#another').click()
 page.locator('#album').click()
 assert page.locator('#memories span').count()==3
 page.locator('[data-boy="haru"]').click()
 for day in range(6):
  page.locator('#choices button').first.click();page.locator('#next').click()
 page.locator('#choices button').nth(1).click()
 assert '友達' in page.locator('#bond').inner_text()
 page.reload();page.locator('#continue').click()
 assert '友達' in page.locator('#bond').inner_text()
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.screenshot(path='/tmp/heart-mobile.png',full_page=True)
 assert not errors,errors
 b.close()
print('PASS all three romance endings, friendship choice, saved continuation, album, mobile layout; no JS errors')
