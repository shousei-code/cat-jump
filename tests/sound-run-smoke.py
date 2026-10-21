from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1100,'height':900});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.add_init_script('''window._frames=[];window._time=0;window.requestAnimationFrame=f=>_frames.push(f);window.advance=n=>{for(let i=0;i<n;i++){_time+=1000/60;const fs=_frames.splice(0);fs.forEach(f=>f(_time));}}''')
 page.goto('http://127.0.0.1:8003/sound-run/');page.locator('#action').click()
 def state():return page.evaluate('soundRunState()')
 def step(n=1):page.evaluate('(n)=>advance(n)',n)
 def move_to(x):
  page.keyboard.down('ArrowRight')
  for _ in range(300):
   if state()['player']['x']>=x:break
   step()
  page.keyboard.up('ArrowRight')
 move_to(420);step(100);assert state()['deaths']>0
 print('PASS fall and respawn',flush=True)
 page.locator('#pause').click();before=state()['player'];step(60);assert state()['player']==before;page.locator('#action').click()
 for level in range(3):
  s=state()
  for i in range(len(s['platforms'])-1):
   current=state()['platforms'][i];move_to(current['x']+current['w']-40)
   page.keyboard.down('ArrowRight');page.keyboard.press('Space')
   for _ in range(90):
    step();st=state();dest=st['platforms'][i+1]
    if st['player']['x']>=dest['x']+20:page.keyboard.up('ArrowRight')
    if st['grounded'] and abs(st['player']['y']+44-dest['y'])<1 and st['player']['x']+34>dest['x']:break
   page.keyboard.up('ArrowRight');st=state();assert abs(st['player']['y']+44-st['platforms'][i+1]['y'])<1,(level,i,st)
   if i+1==3:assert st['checkpoint']==3
  last=state()['platforms'][-1];move_to(last['x']+last['w']-90);assert state()['mode']=='clear',state();print('PASS level',level+1,'clear',flush=True)
  if level<2:page.locator('#action').click()
 assert all(v>0 for v in state()['best']);page.reload();assert all(v>0 for v in state()['best']);step();page.screenshot(path='/tmp/sound-run-desktop.png')
 assert not errors,errors
 print('PASS all three stages, keyboard, checkpoints, respawn, pause and records');b.close()
