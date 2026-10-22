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
 b=p.chromium.launch(executable_path=shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for width in [1280,393]:
  page=b.new_page(viewport={'width':width,'height':900},has_touch=width==393);page.clock.install();page.goto(f'http://127.0.0.1:{server.server_port}/squishy-world/');page.locator('#play').click();page.clock.run_for(200)
  if width==393:
   page.locator('[data-move="right"]').hover();page.mouse.down();page.clock.run_for(900);page.mouse.up()
  else:
   page.keyboard.down('KeyD');page.clock.run_for(900);page.keyboard.up('KeyD')
  assert page.evaluate('JSON.parse(localStorage.getItem("squishy-world-v1")).found.includes(1)');print('Movement and pickup passed',width);page.close()
 b.close()

server.shutdown()
