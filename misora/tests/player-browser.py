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
  page.get_by_role('button',name='自分をつくる・恋の物語',exact=True).click()
  page.locator('#player-name').fill('こと');page.get_by_role('button',name='名前を決める',exact=True).click()
  page.locator('[data-player-slot="hair"]').select_option('2');page.locator('[data-player-slot="color"]').select_option('0');page.locator('[data-player-slot="eyes"]').select_option('1')
  expect(page.locator('.player-items button')).to_have_count(20)
  page.locator('[data-action="player-equip-dress-10"]').click()
  for slot,index in [('pin',5),('shoes',3)]:
   page.locator(f'[data-action="player-tab-{slot}"]').click();expect(page.locator('.player-items button')).to_have_count(26 if slot=="pin" else 20);page.locator(f'[data-action="player-equip-{slot}-{index}"]').click()
  avatar=page.locator('.player-mirror .player-figure');expect(avatar).to_have_attribute('data-dress','10');expect(avatar).to_have_attribute('data-pin','5');expect(avatar).to_have_attribute('data-shoes','3')
  page.evaluate('async()=>{await Promise.all([...document.querySelectorAll("svg image")].map(e=>{const i=new Image();i.src=e.getAttribute("href");return i.decode();}));}')
  page.screenshot(path=f'/tmp/misora-player-{width}.png',full_page=True,animations='disabled')
  page.get_by_role('button',name='ミソラくんに会いにいく').click()
  for _ in range(3):page.locator('[data-action="player-choice-0"]').click();page.locator('[data-action="player-reply"]').click()
  expect(page.get_by_role('heading',name='まずは、学園の思い出を作ろう')).to_be_visible()
  # A valid saved checkpoint from the independently tested school events.
  page.evaluate('''()=>{const s=JSON.parse(localStorage.getItem('misora-school-v1'));s.school.completed=['festival','sports'];localStorage.setItem('misora-school-v1',JSON.stringify(s));}''')
  page.reload();page.get_by_role('button',name='自分をつくる・恋の物語',exact=True).click();expect(page.locator('#player-name')).to_have_value('こと');expect(page.locator('.player-mirror .player-figure')).to_have_attribute('data-dress','10')
  page.get_by_role('button',name='ミソラくんに会いにいく').click()
  for _ in range(5):page.locator('[data-action="player-choice-0"]').click();page.locator('[data-action="player-reply"]').click()
  expect(page.get_by_role('heading',name='恋人の約束',exact=True)).to_be_visible()
  page.screenshot(path=f'/tmp/misora-love-{width}.png',full_page=True,animations='disabled')
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  page.get_by_role('button',name='学園生活へ',exact=True).click();page.locator('[data-action="school-tab-shop"]').first.click()
  expect(page.locator('.clothes-grid article')).to_have_count(20);page.locator('[data-action="school-buy-extra-13"]').click();expect(page.locator('.dressing-mirror [data-costume="extra-13"]')).to_be_visible()
  page.locator('[data-action="school-tab-friends"]').click();expect(page.locator('.friend-list article')).to_have_count(5);expect(page.get_by_role('heading',name='ライバル・リナ')).to_be_visible()
  s=page.evaluate('JSON.parse(localStorage.getItem("misora-school-v1"))');assert s['player']['ending']=='恋人の約束';assert s['school']['equipped']=='extra-13'
  assert not errors,errors
  page.close();print(f'PASS {width}: creator, 20 clothes/pins/shoes, name/hair/eyes, save, event gate, romance ending, 20 Misora outfits, five friends and rival',flush=True)
 browser.close()
server.shutdown()
