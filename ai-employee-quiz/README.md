# AI Employee Opportunity Assessment

Static, one-question-at-a-time assessment at `/ai-employee-quiz/`.

## Architecture

- `index.html`: opening, pre-assessment contact and consent, exactly ten questions, Red/Yellow/Green doctrine, transparent results, prompts, and Blueprint.
- `quiz.css`: responsive YourOS styling, sub-400ms transitions, reduced-motion behavior, touch targets, and restrained result-card interaction.
- `quiz.js`: validation, back/forward navigation, focus, session resume, deterministic rendering, copy actions, and one-time server delivery.
- `result-engine.js`: pure versioned logic for placement, strongest automation, readiness, target richness, prompts, and Blueprint.
- `../netlify/functions/ai-opportunity-assessment.js`: server-side Netlify Forms source-of-truth submission and transactional results email.

Name and email are required before question 1. Marketing consent is optional, unchecked by default, represented as an explicit boolean, and never triggers a marketing subscription in this implementation. On-screen results render before delivery is attempted and remain visible if storage or email fails. The browser uses a session-scoped submission ID and lock; the email provider also receives that ID as an idempotency key.

## Server configuration

Required in Netlify:

- `RESEND_API_KEY`: server-only Resend API key.
- `ASSESSMENT_FROM_EMAIL`: verified sender, such as `YourOS <assessment@youros.app>`.

Recommended:

- `QUIZ_LEAD_CAPTURE_URL`: canonical Netlify site URL that owns the `ai-employee-assessment` form. If omitted, the function uses the current `DEPLOY_PRIME_URL`, then `URL`.
- `ASSESSMENT_REPLY_TO`: reply address for assessment emails.

The function records the lead and complete assessment in Netlify Forms before requesting the transactional email. It does not call any marketing API. If Resend is unconfigured or unavailable after a successful form record, the function reports `emailSent: false` and the browser keeps the results visible.

## Test

From the repository root:

```sh
node --test ai-employee-quiz/tests/quiz.test.mjs
python3 -m http.server 4174
# In another terminal:
python3 ai-employee-quiz/tests/browser-smoke.py
```

The browser smoke test intercepts the Netlify Function request, verifies the explicit false consent value and duplicate-delivery lock, and creates no live backend record.
