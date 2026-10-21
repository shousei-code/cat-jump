from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8003/study/')
 page.locator('#mode').select_option('two');page.get_by_role('button',name='5問ドリルをはじめる').click()
 for i in range(5):
  page.get_by_role('button',name='準備OK').click();q=page.evaluate('session.qs[session.index]');page.get_by_role('button',name=q['answer'],exact=True).click()
  assert '正解：' not in page.locator('#panel').inner_text()
  page.get_by_role('button',name='準備OK').click();page.get_by_role('button',name=q['wrong'][0],exact=True).click();assert q['explain'] in page.locator('#panel').inner_text();page.get_by_role('button',name='次へ',exact=True).click()
 assert page.evaluate('session.scores')==[5,0]
 assert page.evaluate('record.missed.length')==5
 page.locator('[data-view="edit"]').click();page.get_by_role('button',name='＋ 新しい問題を作る').click()
 page.locator('#editText').fill('2 + 3 は？');page.locator('#editSubject').select_option('算数');page.locator('#editAnswer').fill('5');page.locator('#wrong1').fill('4');page.locator('#wrong2').fill('5');page.get_by_role('button',name='保存する',exact=True).click();assert page.locator('#error').inner_text()
 page.locator('#wrong2').fill('6');page.locator('#explain').fill('2に3を足すと5。');page.get_by_role('button',name='保存する',exact=True).click();assert page.evaluate('questions.length')==21
 page.reload();assert page.evaluate('questions.length')==21
 page.locator('[data-view="review"]').click();page.get_by_role('button',name='間違い直しをはじめる').click();q=page.evaluate('session.qs[0]');page.get_by_role('button',name=q['answer'],exact=True).click();assert page.evaluate('record.missed.length')==4
 page.locator('[data-view="write"]').click();c=page.locator('#writingCanvas');c.scroll_into_view_if_needed();r=c.bounding_box();page.mouse.move(r['x']+20,r['y']+20);page.mouse.down();page.mouse.move(r['x']+80,r['y']+140,steps=10);page.mouse.up();page.get_by_role('button',name='お手本と比べて、練習できた！').click();assert page.evaluate('record.written.includes("山")')
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors;b.close()
print('PASS two-player hidden answers, scoring, review, question validation/addition/persistence, handwriting and mobile layout')
