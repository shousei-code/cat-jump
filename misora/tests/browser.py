from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
from functools import partial
from playwright.sync_api import sync_playwright,expect
import json,os,shutil
root=Path(__file__).resolve().parents[2]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root)))
Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
 for width in [1280,393]:
  page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce',has_touch=width==393)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(f'http://127.0.0.1:{server.server_port}/misora/')
  page.locator('.cover .scene image').wait_for()
  page.screenshot(path=f'/tmp/misora-title-{width}.png',animations='disabled')
  page.get_by_role('button',name='ミソラに会いにいく').click()
  page.clock.install();page.clock.pause_at(1000000000000)
  for chapter in range(6):
   page.locator('[data-action="choice-0"]').click()
   page.get_by_role('button',name='一緒に挑戦する').click()
   page.get_by_role('button',name='チャレンジ開始').click()
   if chapter in [0,5]:page.locator('[data-answer="0"]').click()
   elif chapter==1:
    page.locator('[data-answer="0"]').click();expect(page.get_by_role('heading',name='もう一度、やってみよう！')).to_be_visible()
    page.get_by_role('button',name='再挑戦',exact=True).click();page.get_by_role('button',name='チャレンジ開始').click()
    for a in [1,0,1]:page.locator(f'[data-answer="{a}"]').click()
   elif chapter==2:
    page.clock.run_for(4100)
    for a in [0,2,1,3]:page.locator(f'[data-tile="{a}"]').click()
   elif chapter==3:
    for a in [0,2,1,0,1,2]:page.locator(f'[data-tile="{a}"]').click()
   elif chapter==4:
    page.clock.run_for(1020);(page.get_by_role('button',name='決める！').tap() if width==393 else page.get_by_role('button',name='決める！').click())
    for _ in range(2):page.clock.run_for(2042);(page.get_by_role('button',name='決める！').tap() if width==393 else page.get_by_role('button',name='決める！').click())
   expect(page.get_by_role('heading',name='✧ ふたりでクリア！')).to_be_visible()
   page.locator('[data-action="next"]').click()
  expect(page.get_by_role('heading',name='ずっと、放課後の友だち')).to_be_visible()
  saved=page.evaluate('localStorage.getItem("misora-school-v1")');assert len(json.loads(saved)['album'])==6
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  page.reload();page.get_by_role('button',name='物語のつづきから').click();expect(page.get_by_role('heading',name='ずっと、放課後の友だち')).to_be_visible()
  page.screenshot(path=f'/tmp/misora-ending-{width}.png',animations='disabled',full_page=True)
  page.get_by_role('button',name='違う選択でもう一度').click();assert json.loads(page.evaluate('localStorage.getItem("misora-school-v1")'))['album']==list(range(6))
  assert not errors,errors
  page.close();print(f'PASS {width}: all chapters, four games, quiz retry, ending, save reload, collection preserved',flush=True)
 page=browser.new_page(viewport={'width':393,'height':900},reduced_motion='reduce')
 page.goto(f'http://127.0.0.1:{server.server_port}/misora/')
 for chapter in [2,3]:
  state={'v':1,'chapter':chapter,'phase':'challenge','chosen':0,'friend':0,'brave':0,'study':0,'cleared':[],'album':[],'endings':[],'sound':False}
  page.evaluate('(s)=>localStorage.setItem("misora-school-v1",JSON.stringify(s))',state)
  page.reload();page.get_by_role('button',name='物語のつづきから').click()
  page.clock.install();page.clock.pause_at(1000000000000)
  page.get_by_role('button',name='チャレンジ開始').click()
  if chapter==2:
   page.clock.run_for(4100);page.locator('[data-tile="1"]').click()
  else:page.clock.run_for(30100)
  expect(page.get_by_role('heading',name='もう一度、やってみよう！')).to_be_visible()
  page.get_by_role('button',name='再挑戦',exact=True).click()
  expect(page.get_by_role('button',name='チャレンジ開始')).to_be_visible()
  assert json.loads(page.evaluate('localStorage.getItem("misora-school-v1")'))['phase']=='challenge'
 page.evaluate('localStorage.setItem("misora-school-v1","broken")');page.reload()
 page.get_by_role('button',name='ミソラに会いにいく').click()
 expect(page.get_by_role('button',name='元の保存データを取り出す')).to_be_visible()
 assert page.evaluate('localStorage.getItem("misora-school-v1")')=='broken'
 print('PASS: wrong memory, cafe timeout, retry, corrupt save protection',flush=True)
 browser.close()
server.shutdown()
