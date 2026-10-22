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
 browser=p.chromium.launch(executable_path=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
 for width in [1280,393]:
  page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce',has_touch=width==393)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(f'http://127.0.0.1:{server.server_port}/misora/')
  page.get_by_role('button',name='自分をつくる・恋の物語',exact=True).click()
  expect(page.locator('#player-name')).to_have_value('リンちゃん')
  expect(page.locator('.player-mirror .rin-head')).to_be_visible()
  expect(page.locator('[data-player-slot="color"]')).to_be_disabled()
  page.locator('[data-action="player-equip-dress-10"]').click()
  page.get_by_role('button',name='ミソラくんに会いにいく').click()
  expect(page.locator('.event-dialogue')).to_contain_text('リンちゃん')
  page.locator('[data-action="player-choice-0"]').click();page.locator('[data-action="player-reply"]').click()
  page.get_by_role('button',name='自分を着せ替える').click()
  page.locator('[data-player-slot="hair"]').select_option('2')
  expect(page.locator('[data-player-slot="color"]')).to_be_enabled()
  page.locator('#player-name').fill('前の名前');page.get_by_role('button',name='名前を決める',exact=True).click()
  page.get_by_role('button',name='リンちゃんにする',exact=True).click()
  expect(page.locator('#player-name')).to_have_value('リンちゃん')
  page.reload();page.get_by_role('button',name='自分をつくる・恋の物語',exact=True).click()
  expect(page.locator('.player-mirror .player-figure')).to_have_attribute('data-dress','10')
  expect(page.locator('.player-mirror .rin-head')).to_be_visible()
  s=page.evaluate('JSON.parse(localStorage.getItem("misora-school-v1"))');assert s['player']['chapter']==1 and s['player']['name']=='リンちゃん'
  page.evaluate('async()=>{await Promise.all([...document.querySelectorAll("svg image")].map(e=>{const i=new Image();i.src=e.getAttribute("href");return i.decode();}));}')
  page.screenshot(path=f'/tmp/rin-{width}.png',full_page=True,animations='disabled')
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors
  page.close();print(f'PASS Rin {width}: new illustration, wardrobe, dialogue name, preset preserving progress, save reload',flush=True)
 browser.close()
server.shutdown()
