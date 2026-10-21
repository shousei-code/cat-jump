from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':390,'height':844});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.goto('http://127.0.0.1:8003/art-party/');p.locator('#submit').click();assert p.locator('#exhibition').is_hidden()
 p.locator('#name').fill('えんか');c=p.locator('#canvas');c.scroll_into_view_if_needed();r=c.bounding_box();p.mouse.move(r['x']+20,r['y']+20);p.mouse.down();p.mouse.move(r['x']+100,r['y']+150,steps=10);p.mouse.up();assert p.evaluate('strokes.length')==1
 p.locator('#submit').click();assert p.locator('.entry').count()==12
 assert 'ショウショウくん' in p.locator('#gallery').inner_text()
 p.locator('#judge').click();assert p.locator('.ribbon').count()==1;assert p.locator('#judge').is_disabled()
 p.locator('#back').click();assert p.evaluate('strokes.length')==1
 with p.expect_download() as dl:p.locator('#download').click()
 assert dl.value.suggested_filename.endswith('.png')
 p.locator('#undo').click();assert p.evaluate('strokes.length')==0
 assert p.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors;b.close()
print('PASS drawing, all 12 participants, judging, edit return, image download, undo and mobile layout')
