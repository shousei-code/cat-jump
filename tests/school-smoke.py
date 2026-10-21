from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8003/school/')
 for boy in range(6):
  page.locator('#name').fill('ひまり')
  page.locator('#choices button').first.click()
  for day in range(9):
   page.locator('#choices button').nth(boy).click()
   page.locator('#choices button').first.click()
   if day==3:
    page.reload();page.locator('#continue').click()
   page.locator('#choices button').first.click()
  assert page.evaluate('s.phase')=='gift'
  page.locator('#choices button').nth(boy%3).click()
  page.locator('#choices button').nth(boy).click()
  page.locator('#choices button').first.click()
  assert page.evaluate('s.ending')=='love'
  page.locator('#choices button').first.click()
  assert page.evaluate('s.phase')=='end'
  assert 'ひまり' in page.locator('#text').inner_text()
  page.locator('#title').click()
 # Minimal contact yields a non-reciprocated answer; explicit friendship stays friendship.
 for friendship in [False,True]:
  page.locator('#choices button').first.click()
  for _ in range(9):
   page.locator('#choices button').nth(6).click();page.locator('#choices button').first.click()
  page.locator('#choices button').nth(2).click()
  page.locator('#choices button').first.click()
  page.locator('#choices button').nth(1 if friendship else 0).click()
  assert page.evaluate('s.ending')==('friend' if friendship else 'wait')
  page.locator('#choices button').first.click()
  page.locator('#diaryButton').click()
  assert page.locator('#diary .badge').count()==12
  page.locator('#title').click()
 page.reload();page.locator('#continue').click()
 assert page.evaluate('s.phase')=='end'
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.screenshot(path='/tmp/school-mobile.png',full_page=True)
 assert not errors,errors
 b.close()
print('PASS six romance routes, all gift types, respectful refusal, friendship, diary, resume and mobile layout')
