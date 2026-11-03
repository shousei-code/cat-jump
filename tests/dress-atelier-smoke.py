from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in [390,1280]:
  p=b.new_page(viewport={'width':w,'height':900},accept_downloads=True);errors=[]
  p.on('pageerror',lambda e:errors.append(str(e)))
  p.goto('http://127.0.0.1:8010/dress-atelier/')
  for tab,count in [('hair',12),('dress',20),('shoes',10),('acc',10)]:
   p.locator('[data-tab="'+tab+'"]').click()
   assert p.locator('[data-item]').count()==count
   p.locator('[data-item]').last.click()
   p.locator('[data-color]').nth(3).click()
  p.locator('#save').click()
  assert p.locator('.slot').count()==1
  p.reload()
  assert p.locator('.slot').count()==1
  p.locator('#judge').click()
  assert '点 / 100点' in p.locator('#result').inner_text()
  p.locator('#next').click()
  p.locator('#random').click()
  p.locator('[data-load]').click()
  with p.expect_download() as d:p.locator('#photo').click()
  assert d.value.suggested_filename.endswith('.svg')
  assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
  p.screenshot(path='/tmp/lily-'+str(w)+'.png',full_page=True)
  assert not errors,errors
  p.close()
 b.close()
print('PASS desktop/mobile: all categories, colors, save/reload, outfit recall, judging, random, SVG download, layout')
