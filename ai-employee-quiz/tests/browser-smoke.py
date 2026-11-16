"""Run with the repository served at QUIZ_BASE_URL (default http://127.0.0.1:4174)."""
import os
from playwright.sync_api import sync_playwright
BASE=os.getenv('QUIZ_BASE_URL','http://127.0.0.1:4174')
with sync_playwright() as p:
 browser=p.chromium.launch(channel='chrome',headless=True)
 for label,size in [('desktop',{'width':1440,'height':1000}),('mobile',{'width':375,'height':667})]:
  page=browser.new_page(viewport=size);errors=[]
  posts=[]
  def intercept(route,request):
   if request.method=='POST' and request.url.rstrip('/')==BASE.rstrip('/'):
    posts.append(request.post_data or '')
    route.fulfill(status=200,body='ok',content_type='text/plain')
   else: route.continue_()
  page.route('**/*',intercept)
  page.on('pageerror',lambda error:errors.append(str(error)))
  page.goto(f'{BASE}/ai-employee-quiz/',wait_until='domcontentloaded')
  assert page.locator('[data-start]').is_visible()
  assert page.locator('.yos-action-bar').count()==0 or not page.locator('.yos-action-bar').is_visible()
  if label=='mobile': assert page.locator('[data-start]').bounding_box()['y']<size['height']
  page.click('[data-start]');next_button='[data-screen]:not([hidden]) [data-next]'
  page.check('[name=timeAllocation][value=checking]');page.click(next_button)
  page.fill('[name=unwantedTask]','Correcting job records');page.click(next_button)
  for i,value in enumerate(['Update job records','Send follow-ups','Prepare reports']):page.locator('[name=delegateFirst]').nth(i).fill(value)
  page.click(next_button);page.check('[name=categories][value=quality]');page.click(next_button)
  page.check('[name=trigger][value=record]');page.click(next_button)
  page.fill('[name=correctResult]','Every completed job has an accurate record');page.click(next_button)
  page.check('[name=requiredInfo][value=records]');page.click(next_button);page.click(next_button)
  page.check('[name=judgment][value=mixed]');page.click(next_button);page.click(next_button)
  page.check('[name=trustControls][value=visibility]');page.check('[name=trustControls][value=escalation]');page.click(next_button)
  page.fill('[name=returnedTime]','Talk to customers');page.click(next_button)
  page.wait_for_selector('[data-profile]:has-text("Quality-Control Trap")')
  assert page.locator('[data-profile]').bounding_box()['y']>=64,'focused result heading must remain below the sticky header'
  assert page.locator('[data-prompts] .prompt-card').count()==3
  assert not page.locator('[name=marketing_consent]').is_checked()
  page.fill('[name=name]','Disposable QA')
  page.fill('[name=email]','quiz-qa-disposable@example.com')
  page.locator('#quiz-lead-form [type=submit]').click()
  page.wait_for_selector('[data-form-status]:has-text("request was sent")')
  page.locator('#quiz-lead-form').evaluate('form=>form.requestSubmit()')
  assert len(posts)==1,'duplicate submit must not create a second request'
  assert 'marketing_consent=' not in posts[0],'unchecked marketing consent must remain independent'
  page.reload(wait_until='domcontentloaded')
  page.locator('#quiz-lead-form').evaluate('form=>form.requestSubmit()')
  assert len(posts)==1,'reload must not bypass duplicate prevention'
  page.click('[data-restart]')
  assert page.evaluate("sessionStorage.getItem('youros-ai-employee-quiz-submission-v1')") is None,'restart must clear the prior submission lock'
  assert page.locator('[data-start]').is_visible()
  assert not errors,errors
  page.close()
 browser.close()
print('Browser smoke test passed at desktop and mobile sizes; lead submission was intercepted locally and no live backend record was created.')
