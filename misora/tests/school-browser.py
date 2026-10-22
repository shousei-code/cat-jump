from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
from functools import partial
from playwright.sync_api import sync_playwright,expect
import json,os,shutil
root=Path(__file__).resolve().parents[2]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root)));Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
 for width in [1280,393]:
  page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce',has_touch=width==393)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(f'http://127.0.0.1:{server.server_port}/misora/')
  page.get_by_role('button',name='学園生活・着せ替え',exact=True).click()
  def click(a):page.locator(f'[data-action="school-{a}"]').first.click()
  click('tab-shop');click('buy-sport')
  expect(page.locator('.dressing-mirror [data-costume="sport"]')).to_be_visible()
  click('tab-friends');click('greet-haru');click('greet-yui')
  click('tab-campus');click('event-sports')
  page.evaluate('async()=>{const i=new Image();i.src="assets/wardrobe.png?v=1";await i.decode();}')
  page.screenshot(path=f'/tmp/misora-sports-{width}.png',full_page=True,animations='disabled')
  assert page.locator('.event-cast > .wardrobe-figure > g[clip-path]').count()==2
  page.clock.install();page.clock.pause_at(1000000000000)
  click('start')
  page.locator('#relay-hit').click()
  page.clock.run_for(1020);page.locator('#relay-hit').click()
  for _ in range(2):page.clock.run_for(2042);page.locator('#relay-hit').click()
  expect(page.get_by_role('heading',name='✧ みんなでクリア！')).to_be_visible()
  click('tab-shop');click('buy-cafe');click('tab-campus');click('event-festival');click('start')
  for _ in range(3):page.locator('[data-school-tile="1"]').click()
  expect(page.get_by_role('heading',name='大丈夫、もう一度やってみよう！')).to_be_visible()
  click('event-festival');click('start')
  for tile in [0,2,1,2,0,1]:page.locator(f'[data-school-tile="{tile}"]').click()
  expect(page.get_by_role('heading',name='✧ みんなでクリア！')).to_be_visible()
  click('tab-shop');click('buy-hoodie');click('tab-campus');click('event-club');click('start');page.clock.run_for(4100)
  page.locator('[data-school-tile="0"]').click();expect(page.get_by_role('heading',name='大丈夫、もう一度やってみよう！')).to_be_visible()
  click('event-club');click('start');page.clock.run_for(4100)
  for tile in [2,0,3,1]:page.locator(f'[data-school-tile="{tile}"]').click()
  expect(page.get_by_role('heading',name='✧ みんなでクリア！')).to_be_visible()
  click('tab-shop');click('buy-casual');click('buy-winter')
  saved=page.evaluate('JSON.parse(localStorage.getItem("misora-school-v1"))');assert len(saved['school']['owned'])==6;assert len(saved['school']['completed'])==3;assert len(saved['school']['styled'])==3;assert saved['chapter']==0
  page.reload();page.get_by_role('button',name='学園生活・着せ替え',exact=True).click();click('tab-shop')
  expect(page.locator('.dressing-mirror [data-costume="winter"]')).to_be_visible()
  page.evaluate('async()=>{const i=new Image();i.src="assets/wardrobe.png?v=1";await i.decode();}')
  page.screenshot(path=f'/tmp/misora-shop-{width}.png',full_page=True,animations='disabled')
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors
  page.close();print(f'PASS {width}: buy/equip, friends, sports, cafe retry, memory retry, rewards, six outfits, save reload',flush=True)
 browser.close()
server.shutdown()
