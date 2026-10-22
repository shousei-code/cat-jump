from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
from functools import partial
from playwright.sync_api import sync_playwright
import os,shutil
root=Path(__file__).resolve().parents[2]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root)));Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
 page=browser.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/sticker-world/tests/room.html?localPeer=1')
 page.wait_for_function('!!window.Room')
 page.evaluate('''()=>{window.statuses=[];window.views=[];window.rooms=[];const make=()=>{const i=rooms.length;const r=new Room(s=>statuses[i]=s,p=>views[i]=p);rooms.push(r);return r};window.make=make;make().start();window.ticker=setInterval(()=>rooms.forEach((r,i)=>r.update({x:i,y:0,z:7,avatar:i%6})),100);}''')
 page.wait_for_function('rooms[0].peer?.open')
 for i in range(9):
  page.evaluate('make().start(rooms[0].code)')
  try: page.wait_for_function(f'rooms[0].count==={i+2}',timeout=20000)
  except Exception:
   print(page.evaluate('({statuses,rooms:rooms.map(r=>({code:r.code,id:r.peer?.id,open:r.peer?.open,links:[...r.links.values()].map(c=>({id:c.peer,open:c.open,state:c.peerConnection?.connectionState}))}))})'),flush=True);raise
 page.wait_for_function('Object.keys(views[1]||{}).length===9')
 assert page.evaluate('rooms[0].count')==10
 page.evaluate('make().start(rooms[0].code)')
 page.wait_for_function('statuses[10]?.includes("いっぱい")',timeout=20000)
 assert page.evaluate('rooms[0].count')==10
 page.evaluate('rooms[1].leave()');page.wait_for_function('rooms[0].count===9')
 page.evaluate('rooms[0].leave()');page.wait_for_function('statuses[2]?.includes("ホストが退出")')
 page.evaluate('clearInterval(ticker);rooms.forEach(r=>r.leave())')
 browser.close();print('PASS actual WebRTC: 10 players, position propagation, 11th refused, guest exit, host exit')
server.shutdown()
