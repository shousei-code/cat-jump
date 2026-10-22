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
  page=browser.new_page(viewport={'width':width,'height':900},has_touch=width==393);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(f'http://127.0.0.1:{server.server_port}/squishy-world/')
  page.locator('#play').click();page.locator('[data-panel="house"]').click();page.locator('[data-slot="0"]').click();page.locator('#squeeze').click();expect(page.locator('#careText')).to_contain_text('+5');page.locator('#squeeze').click();expect(page.locator('#coins')).to_have_text('✧ 85')
  page.locator('#remove').click();expect(page.locator('[data-slot="0"]')).to_have_attribute('aria-label','棚1 空き');page.locator('[data-slot="2"]').click();page.screenshot(path=f'/tmp/squishy-house-{width}.png')
  page.locator('#close').click();page.locator('[data-panel="gacha"]').click();page.locator('[data-gacha="1"]').click();expect(page.locator('#result')).to_contain_text('NEW！');page.locator('#close').click()
  page.locator('[data-panel="job"]').click();page.locator('#startJob').click()
  for i in range(10):page.locator(f'[data-pack="{i%3}"]').click()
  expect(page.locator('#panel')).to_contain_text('80コイン');page.locator('#close').click()
  page.locator('[data-panel="memory"]').click();seq=page.locator('#sequence .toy').evaluate_all('(els)=>els.map(e=>e.getAttribute("aria-label"))');page.locator('#remember').click()
  for name in seq:page.locator('#memoryKeys').get_by_role('button',name=name,exact=True).click()
  expect(page.locator('#memoryStatus')).to_contain_text('+25');page.locator('#close').click()
  for m in range(6):
   page.locator('[data-panel="maps"]').click();page.locator(f'[data-map="{m}"]').click();assert page.evaluate('JSON.parse(localStorage.getItem("squishy-world-v1")).map')==m
  page.screenshot(path=f'/tmp/squishy-world-{width}.png');page.reload();page.locator('#play').click();expect(page.locator('#mapName')).to_contain_text('虹の雲');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors;page.close();print('UI passed',width)
 browser.close()
server.shutdown()
