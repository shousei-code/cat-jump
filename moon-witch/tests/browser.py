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
  page=b.new_page(viewport={'width':width,'height':900},has_touch=width==393);errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.clock.install();page.goto(f'http://127.0.0.1:{server.server_port}/moon-witch/');page.wait_for_function('Array.from(document.images).every(i=>i.complete)');page.screenshot(path=f'/tmp/moon-title-{width}.png');page.locator('#begin').click();page.locator('#start').click();expect(page.locator('#stageLabel')).to_contain_text('1/20');page.keyboard.down('KeyJ')
  for code,duration in [('KeyD',2000),('KeyS',700),('KeyA',800),('KeyW',700)]:
   page.keyboard.down(code);page.clock.run_for(duration);page.keyboard.up(code)
  page.keyboard.up('KeyJ');page.clock.resume();page.screenshot(path=f'/tmp/moon-play-{width}.png');page.locator('#menu').click();expect(page.locator('[data-stage="1"]')).to_be_disabled();page.locator('#resume').click();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors
  # Verify persisted unlocked stages and transformation controls after reload.
  page.evaluate('localStorage.setItem("moon-witch-v1",JSON.stringify({version:1,unlocked:20,cleared:Array.from({length:19},(_,i)=>i),stars:Array.from({length:20},(_,i)=>i<19?3:0),sound:false}))');page.reload();page.locator('#select').click();page.locator('[data-stage="6"]').click();page.locator('#start').click();page.locator('[data-spell="unicorn"]').click();expect(page.locator('#objective')).to_contain_text('変身中');page.locator('#menu').click();page.locator('[data-stage="19"]').click();expect(page.locator('#panel')).to_contain_text('魔王');page.locator('#start').click();expect(page.locator('#stageLabel')).to_contain_text('20/20');assert not errors,errors;page.close();print('Browser passed',width,flush=True)
 b.close()
server.shutdown()
