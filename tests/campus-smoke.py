from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader'])
 page=b.new_page(viewport={'width':1000,'height':800});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.add_init_script('window.cb=null;window.t=0;requestAnimationFrame=f=>cb=f;window.step=n=>{for(let i=0;i<n;i++){t+=40;cb(t)}}')
 page.goto('http://127.0.0.1:8003/campus/')
 page.locator('#yourName').fill('ひまり');page.locator('#hair').select_option('#e1a2c0');page.locator('#choices button').click()
 assert page.evaluate('campusState().area')=='home'
 page.locator('#map').click();page.get_by_role('button',name='🏫 教室',exact=True).click()
 def walk(key,ms):
  page.keyboard.down(key);page.evaluate('(n)=>step(n)',round(ms/40));page.keyboard.up(key)
 # Aisle beside the center desks, then the teacher.
 walk('d',700);walk('w',4700);walk('a',700)
 page.locator('#interact').click()
 assert '森先生' in page.locator('#title').inner_text(),page.evaluate('campusState()')
 page.get_by_role('button',name='200円',exact=True).click();assert page.evaluate('campusState().data.knowledge')==3
 page.get_by_role('button',name='もどる',exact=True).click()
 page.locator('#map').click();page.get_by_role('button',name='🎪 文化祭・中庭',exact=True).click()
 walk('w',3500);page.locator('#interact').click()
 assert '文化祭' in page.locator('#title').inner_text()
 page.get_by_role('button',name='恒星（こうせい）',exact=True).click();assert page.evaluate('campusState().data.tickets')==1
 page.get_by_role('button',name='もどる',exact=True).click()
 page.locator('#map').click();page.get_by_role('button',name='🏠 おうち',exact=True).click()
 walk('a',2000);walk('w',2600);page.locator('#interact').click()
 assert 'おやすみ' in page.locator('#title').inner_text(),page.evaluate('campusState()')
 page.get_by_role('button',name='次の日へ',exact=True).click();assert page.evaluate('campusState().data.day')==2
 page.reload();page.locator('#choices button').click();assert page.evaluate('campusState().data.name')=='ひまり'
 page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(300);page.evaluate('step(1)')
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.screenshot(path='/tmp/campus-mobile.png',full_page=True)
 assert not errors,errors
 b.close()
print('PASS 3D render, avatar, first-person walking, lesson, festival, home, next day, persistence and mobile layout')
