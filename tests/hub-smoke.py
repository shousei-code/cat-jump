from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8003/')
 assert page.locator('.card').count()==19
 urls=page.locator('.card a').evaluate_all('(xs)=>xs.map(a=>a.href)')
 for url in urls: assert page.request.get(url).status==200,url
 page.locator('.favorite').first.click()
 page.locator('[data-filter="お気に入り"]').click();assert page.locator('.card').count()==1
 page.reload();page.locator('[data-filter="お気に入り"]').click();assert page.locator('.card').count()==1
 page.locator('[data-filter="すべて"]').click();page.locator('#search').fill('ピザ');assert page.locator('.card').count()==1
 page.locator('[data-game="pizza"]').click();assert '/pizza/' in page.url
 page.go_back();assert 'ピッツァ' in page.locator('#recent').inner_text()
 page.locator('#clearRecent').click();assert page.locator('#recentSection').is_hidden()
 page.locator('#search').fill('');page.locator('[data-filter="すべて"]').click()
 page.locator('#install').click();assert page.locator('#help').is_visible()
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.screenshot(path='/tmp/hub-mobile.png',full_page=True)
 page.locator('[data-game="cat"]').click();page.wait_for_function('!document.querySelector("#start").disabled')
 assert page.locator('#game').count()==1
 assert not errors,errors
 b.close()
print('PASS all 19 destinations, favorite persistence, search, recent history, home-screen help, preserved cat game and mobile layout')
