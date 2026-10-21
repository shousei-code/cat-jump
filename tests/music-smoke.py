import wave
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':390,'height':844});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.goto('http://127.0.0.1:8003/music/');assert p.locator('#grid button').count()==176
 p.locator('#play').click();p.wait_for_timeout(300);assert p.evaluate('playing');assert p.evaluate('audio.state')=='running'
 p.locator('#mute').click();assert p.evaluate('muted');p.locator('#stop').click();assert not p.evaluate('playing')
 p.locator('[data-preset="park"]').click();assert p.evaluate('tempo')==110
 p.locator('#save').click();before=p.evaluate('JSON.stringify(pattern)');p.locator('#clear').click();assert p.evaluate('pattern.flat().some(Boolean)')==False
 p.locator('#load').click();assert p.evaluate('JSON.stringify(pattern)')==before
 p.locator('#grid button').nth(0).click();p.locator('#grid button').nth(16).click();assert p.evaluate('pattern.slice(0,8).filter(r=>r[0]).length')<=1
 with p.expect_download() as info:p.locator('#download').click()
 info.value.save_as('/tmp/wakuwaku-test.wav')
 with wave.open('/tmp/wakuwaku-test.wav') as wav:
  assert wav.getnchannels()==1;assert wav.getnframes()>100000
  assert any(wav.readframes(wav.getnframes()))
 p.reload();p.locator('#load').click();assert p.evaluate('JSON.stringify(pattern)')==before
 assert p.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors;b.close()
print('PASS playback, audio state, mute, stop, preset, save/load, clear, monophonic editing, nonempty WAV export and mobile layout')
