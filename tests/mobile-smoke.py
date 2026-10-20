from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 m=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);m.set_default_timeout(90000);errors=[];m.on('pageerror',lambda e:errors.append(str(e)))
 m.goto('http://127.0.0.1:8001/dollhouse/',wait_until='domcontentloaded');m.wait_for_function('!!window.roomState');print('mobile loaded',flush=True)
 m.locator('#portrait').tap();m.evaluate('window.scrollTo(0,0)');m.screenshot(path='/tmp/town-portrait-final.png');m.locator('#portrait').tap()
 m.locator('[data-zone="town"]').tap();assert m.evaluate('roomState().life.zone')=='town'
 m.locator('[data-zone="pets"]').tap();m.locator('#shop').tap();m.get_by_role('button',name='🐰 白いうさぎを迎える',exact=True).tap();assert m.evaluate('roomState().life.pet')=='bunny';m.locator('#dialogClose').tap();print('mobile town and bunny adoption',flush=True)
 m.locator('[data-zone="home"]').tap();m.locator('#placedFurniture').get_by_role('button',name='ベッドを削除',exact=True).tap();assert m.evaluate('roomState().count')==6;m.evaluate('window.scrollTo(0,0)');m.screenshot(path='/tmp/town-mobile.png');assert m.evaluate('document.documentElement.scrollWidth<=innerWidth')
 m.reload(wait_until='domcontentloaded');m.wait_for_function('!!window.roomState');assert m.evaluate('roomState().count')==6;assert m.evaluate('roomState().life.pet')=='bunny';assert not errors,errors
 print('PASS mobile touch: portrait, town, shops, bunny adoption, furniture deletion, saved reload, responsive layout; no JS errors',flush=True)
 b.close()
