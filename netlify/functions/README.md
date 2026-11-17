# Netlify Functions

## Automation diagnostic

`automation-diagnostic.js` powers the homepage YourOS AI diagnostic panel.

Required Netlify environment variable:

- `GEMINI_API_KEY` — Google Gemini API key used server-side only. Never expose this in browser JavaScript.

Optional Netlify environment variable:

- `GEMINI_MODEL` — defaults to `gemini-2.5-flash`. The original `gemini-2.0-flash` key test returned free-tier quota limit `0` for this project, while `gemini-2.5-flash` responded successfully.

The function includes a lightweight per-instance IP rate limit of 5 messages/minute and returns a CTA fallback instead of failing visibly when the key is missing, rate-limited, or Gemini is unavailable.

## AI Opportunity Assessment delivery

`ai-opportunity-assessment.js` validates and records the assessment in the statically declared `ai-employee-assessment` Netlify Form, then sends the same results transactionally through Resend.

Required environment variables:

- `RESEND_API_KEY`
- `ASSESSMENT_FROM_EMAIL` (a verified Resend sender)

Recommended environment variables:

- `QUIZ_LEAD_CAPTURE_URL` (the canonical Netlify site URL that owns the form)
- `ASSESSMENT_REPLY_TO`

The function never enrolls a lead in marketing. The optional consent value is stored as an explicit boolean for the server-side source of truth only.
