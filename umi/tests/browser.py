from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
from functools import partial
from playwright.sync_api import sync_playwright,expect
import shutil
root=Path(__file__).resolve().parents[2]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root)));Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=shutil.which('chromium'),args=['--no-sandbox'])
 for width in [1280,393]:
  page=b.new_page(viewport={'width':width,'height':900},has_touch=width==393);errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.clock.install(time=0);page.clock.pause_at(1000);page.goto(f'http://127.0.0.1:{server.server_port}/umi/');page.screenshot(path=f'/tmp/umi-title-{width}.png');page.locator('#begin').click();page.locator('[data-choice="0"]').click();page.locator('#leave').click();page.locator('#pet').click();page.locator('#closePet').click();expect(page.locator('#pet')).to_be_disabled()
  page.locator('[data-practice="0"]').click();page.locator('#startGame').click();seq=page.locator('#sequence [data-symbol]').evaluate_all('(els)=>els.map(e=>e.dataset.symbol)');page.locator('#remember').click()
  for n in seq:page.locator(f'#keys [data-symbol="{n}"]').click()
  assert page.locator('.score').evaluate('(e)=>e.childNodes[0].textContent.trim()')=='100',page.locator('.score').inner_text();page.locator('#return').click();expect(page.locator('[data-practice="0"]')).to_be_disabled();page.reload();page.locator('#begin').click();expect(page.locator('[data-practice="0"]')).to_be_disabled();page.screenshot(path=f'/tmp/umi-home-{width}.png');page.locator('#sleep').click()
  for day in range(2,8):
   page.locator('[data-choice="0"]').click();page.locator('#leave').click()
   if day<7:page.locator('#sleep').click()
  expect(page.locator('#finish')).to_be_disabled();page.locator('[data-round="0"]').click();page.locator('#startGame').click();seq=page.locator('#sequence [data-symbol]').evaluate_all('(els)=>els.map(e=>e.dataset.symbol)');page.locator('#remember').click()
  for n in seq:page.locator(f'#keys [data-symbol="{n}"]').click()
  page.locator('#return').click();page.locator('[data-round="1"]').click();page.locator('#startGame').click();page.clock.run_for(1000)
  for i in range(12):
   page.keyboard.press('Space')
   if i<11:page.clock.run_for(900)
  page.clock.run_for(700);assert page.locator('.score').evaluate('(e)=>e.childNodes[0].textContent.trim()')=='100',page.locator('.score').inner_text();page.locator('#return').click();page.locator('[data-round="2"]').click();page.locator('#startGame').click()
  for i in range(12):
   if width==393:page.locator('#target').tap()
   else:page.locator('#target').click()
  assert page.locator('.score').evaluate('(e)=>e.childNodes[0].textContent.trim()')=='100',page.locator('.score').inner_text();page.locator('#return').click();page.locator('#finish').click();expect(page.locator('h1')).to_contain_text('金メダル');page.screenshot(path=f'/tmp/umi-ending-{width}.png');page.reload();page.locator('#begin').click();expect(page.locator('h1')).to_contain_text('金メダル');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors;page.close();print('Full week and tournament passed',width,flush=True)
 b.close()
server.shutdown()
