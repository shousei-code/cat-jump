from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':390,'height':844})
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto('http://127.0.0.1:8003/world/')
    assert page.locator('#avatar svg').count()==1
    page.locator('#name').fill('ひまり')
    page.locator('#cute').click()
    page.locator('[data-tab="hair"]').click()
    assert page.locator('[data-option="3"]').get_attribute('aria-pressed')=='true'
    page.reload()
    assert page.locator('#name').input_value()=='ひまり'
    assert page.locator('[data-option="3"]').get_attribute('aria-pressed')=='true'
    page.locator('#go').click()
    page.locator('.rooms [data-place="cafe"]').click()
    page.locator('#order').click()
    order=page.evaluate('order')
    page.locator('[data-food="'+str((order+1)%3)+'"]').click()
    assert page.evaluate('s.stars')==0
    page.locator('[data-food="'+str(order)+'"]').click()
    assert page.evaluate('s.stars')==3
    page.locator('.rooms [data-place="home"]').click()
    page.locator('[data-decor="2"]').click()
    assert page.locator('#decor').count()==1
    page.locator('[data-decor="0"]').click()
    assert page.locator('#decor').count()==0
    page.locator('.rooms [data-place="park"]').click()
    page.locator('#pet').click()
    assert page.evaluate('s.pet')
    page.locator('#editTab').click()
    page.locator('#cool').click()
    assert page.evaluate('s.hair')==4
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    page.screenshot(path='/tmp/world-mobile.png',full_page=True)
    page.reload()
    assert page.evaluate('s.stars')==3
    assert page.evaluate('s.pet')
    assert not errors,errors
    browser.close()
print('PASS customization, persistence, cafe correct/wrong order, room decoration/removal, friend and mobile layout')
