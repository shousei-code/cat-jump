"""Run against python3 -m http.server 8002; requires Playwright and Chromium."""
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1000,'height':900})
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto('http://127.0.0.1:8002/magic/')
    for role in ['hero','mage','healer']:
        page.reload()
        page.locator('[data-class="'+role+'"]').click()
        assert page.evaluate('magicState().kind')==role
        page.evaluate('p.hp=p.max/2')
        before=page.evaluate('p.hp')
        page.locator('#skill').click()
        assert page.evaluate('magicState().cooldown')>0
        if role=='healer': assert page.evaluate('p.hp')>before+30
        page.locator('#pause').click()
        t=page.evaluate('magicState().elapsed')
        page.wait_for_timeout(150)
        assert page.evaluate('magicState().elapsed')==t
        page.locator('#resume').click()
        page.evaluate('p.xp=p.need;update(.01)')
        assert page.evaluate('magicState().mode')=='upgrade'
        page.locator('[data-upgrade="0"]').click()
        assert page.evaluate('magicState().player.level')==2
    page.evaluate('enemies=[];enemy();enemies[0].x=p.x+35;enemies[0].y=p.y;enemies[0].hp=1;attack=0;update(.04);update(.04)')
    assert page.evaluate('kills')>=1
    page.evaluate('elapsed=120;update(.01)')
    assert page.evaluate('enemies.some(e=>e.boss)')
    page.evaluate('enemies.find(e=>e.boss).hp=0;update(.01)')
    assert '魔法の森を守った' in page.locator('#panel').inner_text()
    page.locator('#again').click()
    page.locator('[data-class="hero"]').click()
    page.evaluate('p.hp=1;p.inv=0;enemies=[];enemy();enemies[0].x=p.x;enemies[0].y=p.y;update(.01)')
    assert page.evaluate('mode')=='end'
    page.set_viewport_size({'width':390,'height':844})
    page.locator('#again').click()
    page.locator('[data-class="mage"]').click()
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    x=page.evaluate('p.x')
    page.locator('[data-key="ArrowRight"]').dispatch_event('pointerdown',{'pointerId':1})
    page.keyboard.down('ArrowRight');page.wait_for_timeout(200);page.keyboard.up('ArrowRight')
    assert page.evaluate('p.x')>x
    page.screenshot(path='/tmp/magic-mobile.png')
    assert not errors, errors
    browser.close()
print('PASS classes, healing, cooldown, pause, upgrades, combat, boss, loss, mobile layout and movement')
