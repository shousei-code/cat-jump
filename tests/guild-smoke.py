from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8003/guild/')
 page.locator('[data-tab="trade"]').click();page.get_by_role('button',name='🌿 葉3個 → 💎 月の石1個',exact=True).click();assert page.evaluate('d.bag.leaf')==0;assert page.evaluate('d.bag.stone')==2
 page.get_by_role('button',name='💎 月の石2個 → 🎀 リボン1個',exact=True).click();assert page.evaluate('d.bag.ribbon')==1
 page.locator('[data-tab="quest"]').click();page.get_by_role('button',name='星のリボンを1個持つ',exact=False).click();assert page.evaluate('d.coins')==140
 page.locator('[data-tab="team"]').click();page.get_by_role('button',name='90コインで仲間に').first.click()
 page.get_by_role('button',name='チームに入れる').click();page.get_by_role('button',name='アオ',exact=True).click();assert page.evaluate('d.team[0]')=='guard'
 page.locator('[data-tab="battle"]').click();page.get_by_role('button',name='チーム戦をはじめる').click()
 q=page.evaluate('battle.q');wrong=q[2][0];page.get_by_role('button',name=wrong,exact=True).click();assert q[1] in page.locator('.log').inner_text()
 page.get_by_role('button',name='答えを確認した！ 次のターンへ').click()
 page.locator('[data-tab="town"]').click();page.locator('[data-tab="battle"]').click();assert page.evaluate('battle.turn')==1
 for _ in range(25):
  if page.evaluate('battle.phase')=='end':break
  answer=page.evaluate('battle.q[1]');page.get_by_role('button',name=answer,exact=True).click()
  if page.evaluate('battle.phase')=='feedback':page.get_by_role('button',name='答えを確認した！ 次のターンへ').click()
 assert page.evaluate('d.wins')==1
 page.get_by_role('button',name='町へ帰る').click();page.get_by_role('button',name='🌲 森で宝探し').click();answer=page.evaluate('exploreQuestion[1]');page.get_by_role('button',name=answer,exact=True).click();assert page.evaluate('d.bag.leaf')==1
 page.reload();assert page.evaluate('d.wins')==1;assert page.evaluate('d.team[0]')=='guard'
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.screenshot(path='/tmp/guild-mobile.png',full_page=True)
 assert not errors,errors
 b.close()
print('PASS trades, quest reward, recruitment/team swap, wrong answer feedback, battle resume/win, exploration and saved progress')
