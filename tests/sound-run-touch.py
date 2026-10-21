from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 m=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);errors=[];m.on('pageerror',lambda e:errors.append(str(e)));m.goto('http://127.0.0.1:8003/sound-run/');m.locator('#action').tap()
 cdp=m.context.new_cdp_session(m)
 def point(id,n):
  r=m.locator(id).bounding_box();return {'x':r['x']+r['width']/2,'y':r['y']+r['height']/2,'id':n}
 right=point('#right',1);jump=point('#jump',2)
 cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[right]});cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[right,jump]});m.wait_for_timeout(150);s=m.evaluate('soundRunState()');assert s['player']['x']>65 and s['player']['y']<406,s
 cdp.send('Input.dispatchTouchEvent',{'type':'touchCancel','touchPoints':[]});assert not m.evaluate('soundRunState().held');m.screenshot(path='/tmp/sound-run-mobile.png');assert m.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors;print('PASS real simultaneous touch movement+jump, pointer cancellation, mobile aspect and no JS errors');b.close()
