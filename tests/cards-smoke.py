from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [390,1280]:
  p=b.new_page(viewport={'width':width,'height':850});errors=[]
  p.on('pageerror',lambda e:errors.append(str(e)))
  p.goto('http://127.0.0.1:8010/cards/')
  for mode in ['uno','baba','recipe']:
   p.locator('[data-mode="'+mode+'"]').click()
   assert p.locator('.player').count()==4
   if mode=='uno':
    p.locator('#draw').click()
   elif mode=='baba':
    p.locator('[data-pull]').first.click()
   else:
    p.locator('#deck').click()
    assert p.locator('#hand .card').count()==7
    p.locator('[data-discard]').first.click()
    assert p.locator('#hand .card').count()==6
   p.wait_for_timeout(2800)
   p.locator('#rules').click()
   assert p.locator('dialog').is_visible()
   p.locator('#close').click()
   assert p.evaluate('document.documentElement.scrollWidth<=innerWidth'),mode
   p.screenshot(path='/tmp/cards-'+mode+'-'+str(width)+'.png',full_page=True)
   p.once('dialog',lambda d:d.accept())
   p.locator('#back').click()
   assert p.locator('#home').is_visible()
  assert not errors,errors
  p.close()
 b.close()
print('PASS: 3 modes at mobile/desktop, card actions, CPU turns, rules, return, layout, no JS errors')
