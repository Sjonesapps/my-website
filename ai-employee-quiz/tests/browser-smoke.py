"""Serve the repository at QUIZ_BASE_URL before running."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=os.getenv('QUIZ_BASE_URL','http://127.0.0.1:4174')
ARTIFACTS=Path(__file__).resolve().parents[2]/'pr-assets'
ARTIFACTS.mkdir(exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(channel='chrome',headless=True)
 for label,size in [('desktop',{'width':1440,'height':1000}),('mobile',{'width':375,'height':667})]:
  page=browser.new_page(viewport=size);errors=[];deliveries=[]
  def intercept(route,request):
   if request.url.endswith('/.netlify/functions/ai-opportunity-assessment'):
    deliveries.append(request.post_data or '')
    route.fulfill(status=200,body='{"accepted":true,"stored":true,"emailSent":true}',content_type='application/json')
   else: route.continue_()
  page.route('**/*',intercept);page.on('pageerror',lambda error:errors.append(f'page: {error}'));page.on('console',lambda msg: errors.append(f'console: {msg.text}') if msg.type=='error' else None)
  if label=='mobile': page.emulate_media(reduced_motion='reduce')
  page.goto(f'{BASE}/ai-employee-quiz/',wait_until='domcontentloaded');assert page.locator('[data-start]').is_visible();page.screenshot(path=ARTIFACTS/f'quiz-language-intro-{label}.png',full_page=True)
  page.click('[data-start]');page.wait_for_timeout(300);assert page.locator('[data-screen="contact"] h1').evaluate('el=>document.activeElement===el')
  if label=='mobile': assert page.locator('[data-screen="contact"]').evaluate("el=>getComputedStyle(el).animationName")=='none'
  page.fill('[name=name]','Disposable QA');page.fill('[name=email]','quiz-qa-disposable@example.com');assert not page.locator('[name=marketing_consent]').is_checked()
  if label=='mobile': page.check('[name=marketing_consent]')
  page.click('#quiz-lead-form [type=submit]');page.wait_for_timeout(300);assert page.locator('[data-question="manager-employee-mix"] h2').evaluate('el=>document.activeElement===el')
  def assert_question(question_id):
   page.wait_for_timeout(300);screen=page.locator(f'[data-question="{question_id}"]:not([hidden])');assert screen.is_visible();assert screen.locator('.teaching-blip').is_visible();heading=screen.locator('h2');assert '?' in heading.inner_text();header_bottom=page.locator('.yos-header').evaluate('el=>el.getBoundingClientRect().bottom');heading_top=heading.evaluate('el=>el.getBoundingClientRect().top');assert heading_top>=header_bottom,f'{question_id} heading is hidden behind the fixed header'
  assert_question('manager-employee-mix');page.screenshot(path=ARTIFACTS/f'quiz-language-q1-{label}.png',full_page=True)
  def nxt(): page.click('[data-screen]:not([hidden]) [data-next]')
  page.check('[name=managerEmployeeMix][value=employee-leaning]');page.locator('[name=managerEmployeeMix][value=employee-leaning]').press('Enter');page.wait_for_timeout(300);assert_question('last-week')
  page.fill('[name=unwantedTask]','Correcting job records last week');nxt();assert_question('dependable-hire')
  page.locator('[name=delegateFirst]').first.fill('Update job records')
  nxt();assert_question('recurrence');page.check('[name=categories][value=quality]');page.check('[name=categories][value=reports]');page.fill('[name=recurringWorkDetail]','Reports in our job tracker');nxt();assert_question('trigger')
  page.check('[name=trigger][value=record]');nxt();assert_question('correct-outcome');page.fill('[name=correctResult]','Every completed job has an accurate record');nxt();assert_question('information')
  page.check('[name=requiredInfo][value=records]');page.check('[name=requiredInfo][value=documented]');nxt();assert_question('nuance')
  page.check('[name=judgment][value=mixed]');page.check('[name=exceptionTypes][value=missing]');nxt()
  assert page.locator('.doctrine:not([hidden])').is_visible();nxt()
  assert_question('trust');page.check('[name=yellowTrust][value=plan]');page.check('[name=yellowTrust][value=approval]');page.check('[name=greenReadiness][value=boundaries]');page.check('[name=greenReadiness][value=escalation]');nxt();assert_question('returned-time');page.screenshot(path=ARTIFACTS/f'quiz-language-q10-{label}.png',full_page=True)
  page.fill('[name=returnedTime]','Talk to customers');page.check('[name=targetRichness][value=adjacent]');nxt()
  page.wait_for_selector('[data-placement]:has-text("Employee-leaning")');page.wait_for_selector('[data-delivery-status]:has-text("Sent")')
  assert page.locator('[data-prompts] .prompt-card').count()==3;assert page.locator('[data-blueprint] > div').count()>=10;assert len(deliveries)==1;page.screenshot(path=ARTIFACTS/f'quiz-language-results-{label}.png',full_page=True)
  expected_consent='true' if label=='mobile' else 'false';assert f'"marketingConsent":{expected_consent}' in deliveries[0]
  if label=='desktop':
   card=page.locator('.result-card').first;before=card.evaluate('el=>getComputedStyle(el).transform');card.hover();page.wait_for_timeout(220);after=card.evaluate('el=>getComputedStyle(el).transform');assert after!=before and after!='none','desktop result cards need restrained hover movement'
  page.reload(wait_until='domcontentloaded');page.wait_for_timeout(100);assert len(deliveries)==1,'reload must not duplicate delivery'
  page.click('[data-restart]');assert page.locator('[data-start]').is_visible();assert not errors,errors
  page.close()
 browser.close()
print('Browser smoke passed at desktop and mobile sizes; function delivery was intercepted locally.')
