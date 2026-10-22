from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
from functools import partial
from playwright.sync_api import sync_playwright,expect
import os,shutil
root=Path(__file__).resolve().parents[2]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root)));Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH') or shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for width in [1280,393]:
  page=browser.new_page(viewport={'width':width,'height':900},has_touch=width==393)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.clock.install()
  page.goto(f'http://127.0.0.1:{server.server_port}/sticker-world/')
  page.get_by_role('button',name='一人で冒険する',exact=True).click()
  page.clock.run_for(250)
  for key,direction,duration in [('KeyS','down',250),('KeyD','right',900)]:
   if width==393:
    page.locator(f'[data-move="{direction}"]').hover();page.mouse.down();page.clock.run_for(duration);page.mouse.up()
   else:
    page.keyboard.down(key);page.clock.run_for(duration);page.keyboard.up(key)
  assert page.evaluate('JSON.parse(localStorage.getItem("sticker-island-v1"))?.found.length>0')
  page.clock.resume()
  page.screenshot(path=f'/tmp/sticker-world-{width}.png',animations='disabled')
  page.close()
  page=browser.new_page(viewport={'width':width,'height':900},has_touch=width==393)
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(f'http://127.0.0.1:{server.server_port}/sticker-world/')
  page.get_by_role('button',name='一人で冒険する',exact=True).click()
  page.locator('[data-panel="avatar"]').first.click();page.locator('[data-avatar="3"]').click();page.locator('#close').click()
  page.locator('[data-panel="job"]').first.click();page.locator('[data-do="work"]').click()
  for i in [0,2,0,2,0,2,0,2,0,2]:page.locator(f'[data-pack="{i}"]').click()
  expect(page.locator('#workArea')).to_contain_text('80コイン')
  page.locator('#close').click();page.locator('[data-panel="gacha"]').first.click();page.locator('[data-gacha="0"]').click()
  expect(page.locator('#gachaResult .sticker')).to_be_visible()
  page.locator('#close').click();page.locator('[data-panel="book"]').first.click();page.locator('[data-book="2"]').click()
  page.locator('[data-sticker]:enabled').first.click();page.locator('[data-slot="0"]').click();expect(page.locator('[data-slot="0"] .sticker')).to_be_visible()
  page.screenshot(path=f'/tmp/sticker-book-{width}.png',full_page=True,animations='disabled')
  page.reload();page.get_by_role('button',name='一人で冒険する',exact=True).click();page.locator('[data-panel="book"]').first.click();expect(page.locator('[data-book="2"]')).to_have_attribute('aria-pressed','true');expect(page.locator('[data-slot="0"] .sticker')).to_be_visible()
  page.locator('[data-slot="0"]').click();expect(page.locator('[data-slot="0"] .sticker')).to_have_count(0)
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors
  page.close();print(f'PASS {width}: WebGL, job, gacha, character, book placement/removal, save reload',flush=True)
 browser.close()
server.shutdown()
