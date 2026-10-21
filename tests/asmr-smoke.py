from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':390,'height':844})
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.add_init_script('''window.frame=null;window.clock=0;window.requestAnimationFrame=f=>window.frame=f;window.advance=()=>{clock+=16;frame(clock)};''')
    page.goto('http://127.0.0.1:8003/asmr/')
    page.locator('#action').click()
    assert page.evaluate('audio.state')=='running'
    page.locator('#pause').click()
    x=page.evaluate('needle')
    page.evaluate('for(let i=0;i<100;i++)advance()')
    assert page.evaluate('needle')==x
    page.locator('#pause').click()
    page.evaluate('''for(let i=0;i<30000&&state!=='won';i++){advance();if(state==='play'&&Math.abs(needle-target)<width*.4)document.getElementById('action').click()}''')
    assert page.evaluate('asmrState().completed')==12
    assert page.evaluate('state')=='won'
    page.locator('#replay').click()
    page.locator('#mute').click()
    assert page.locator('#mute').get_attribute('aria-pressed')=='true'
    page.locator('#restart').click()
    page.evaluate('''for(let i=0;i<2000&&state!=='end';i++){advance();if(state==='play'&&Math.abs(needle-target)>width)document.getElementById('action').click()}''')
    assert page.evaluate('lives')==0
    page.locator('[data-mode="practice"]').click()
    page.locator('#action').click()
    page.evaluate('''for(let i=0;i<600;i++){advance();if(state==='play'&&Math.abs(needle-target)>width)document.getElementById('action').click()}''')
    assert page.evaluate('state')!='end'
    for kind in ['glass','wood','rain']:
        page.locator('[data-sound="'+kind+'"]').click()
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    page.screenshot(path='/tmp/asmr-mobile.png',full_page=True)
    page.reload()
    assert page.evaluate('best.hard')==12
    assert not errors,errors
    browser.close()
print('PASS audio start, pause, full 12-stage win, replay, mute, 3-miss loss, practice, mobile and saved record')
