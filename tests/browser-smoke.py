from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':1000,'height':760});page.set_default_timeout(60000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8001/dollhouse/');page.wait_for_function('!!window.roomState');print('loaded',flush=True)
 assert page.evaluate('roomState().count')==7
 page.locator('#placedFurniture').get_by_role('button',name='ベッドを削除',exact=True).click();assert page.evaluate('roomState().count')==6
 page.locator('#catalog').get_by_role('button',name='🛏 ベッド',exact=True).click();assert page.evaluate('roomState().count')==7
 page.locator('#remove').click();assert page.evaluate('roomState().count')==6
 page.reload();page.wait_for_function('!!window.roomState');assert page.evaluate('roomState().count')==6;print('furniture deletion persists',flush=True)
 page.locator('[data-zone="town"]').click();assert page.evaluate('roomState().life.zone')=='town';page.screenshot(path='/tmp/town-world.png')
 page.locator('#friends').click();page.get_by_role('button',name='もも ♡♡♡♡♡',exact=True).click();page.get_by_role('button',name='💬 おしゃべり',exact=True).click();assert page.evaluate('roomState().life.friends.momo')==1
 page.get_by_role('button',name='👭 いっしょにおさんぽ',exact=True).click();assert page.evaluate('roomState().life.companion')=='momo';print('friendship and companion',flush=True)
 page.locator('[data-zone="bakery"]').click();page.locator('#work').click()
 goods={'bread':'焼きたてパン','cake':'いちごケーキ','tea':'いちごミルク','meal':'オムライス'}
 for i in range(3):
  order=page.evaluate('roomState().life.job.order')
  if i==0:
   wrong='cake' if order!='cake' else 'bread';page.get_by_role('button',name=goods[wrong]+'を渡す',exact=False).click();assert page.evaluate('roomState().life.job.step')==0
  page.get_by_role('button',name=goods[order]+'を渡す',exact=False).click()
 assert page.evaluate('roomState().life.coins')==145
 page.get_by_role('button',name='お買い物をする',exact=True).click();page.get_by_role('button',name='🥐 焼きたてパン · 10コイン',exact=True).click();assert page.evaluate('roomState().life.inventory.bread')==1
 page.locator('#dialogClose').click();page.locator('#bag').click();page.get_by_role('button',name='🥐 焼きたてパン ×1 を食べる',exact=True).click();assert page.evaluate('roomState().life.energy')==95;page.locator('#dialogClose').click();print('job, wrong order, salary, purchase and food',flush=True)
 page.locator('[data-zone="cafe"]').click();page.locator('#shop').click();page.get_by_role('button',name='🍳 オムライス · 25コイン',exact=True).click();page.locator('#dialogClose').click()
 page.locator('[data-zone="pets"]').click();page.locator('#shop').click();page.get_by_role('button',name='🐱 茶トラのねこを迎える',exact=True).click();page.get_by_role('textbox',name='ペットの名前').fill('もなか');page.get_by_role('button',name='名前をつける',exact=True).click();page.locator('#dialogClose').click();page.locator('#shop').click();page.get_by_role('button',name='🐾 ペットごはん · 8コイン',exact=True).click();page.locator('#dialogClose').click();page.locator('#pet').click();page.get_by_role('button',name='🍽 ごはんをあげる（残り 1個）',exact=True).click();assert page.evaluate('roomState().life.petLove')==2;page.locator('#dialogClose').click();print('pet adoption, naming and feeding',flush=True)
 page.locator('[data-zone="home"]').click();page.screenshot(path='/tmp/town-home.png');page.reload();page.wait_for_function('!!window.roomState');s=page.evaluate('roomState()');assert s['life']['coins']==102;assert s['life']['petName']=='もなか';assert s['life']['friends']['momo']==1;assert s['life']['petLove']==2;assert s['life']['inventory']['meal']==1;assert s['count']==6
 page.close();m=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);m.set_default_timeout(90000);m.on('pageerror',lambda e:errors.append(str(e)));m.goto('http://127.0.0.1:8001/dollhouse/');m.wait_for_function('!!window.roomState');m.locator('[data-zone="town"]').tap();m.locator('[data-zone="pets"]').tap();m.locator('#shop').tap();m.get_by_role('button',name='🐰 白いうさぎを迎える',exact=True).tap();assert m.evaluate('roomState().life.pet')=='bunny';m.locator('#dialogClose').tap();m.locator('[data-zone="home"]').tap();m.locator('#placedFurniture').get_by_role('button',name='ベッドを削除',exact=True).tap();assert m.evaluate('roomState().count')==6;m.evaluate('window.scrollTo(0,0)');m.screenshot(path='/tmp/town-mobile.png');assert m.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors
 print('PASS all: furniture deletion x2 and persistence, town navigation, friends, work, money, food, shops, pets, reload, mobile touch; no JS errors',flush=True);b.close()
