# Netlify Functions

## Automation diagnostic

`automation-diagnostic.js` powers the homepage YourOS AI diagnostic panel.

Required Netlify environment variable:

- `GEMINI_API_KEY` — Google Gemini API key used server-side only. Never expose this in browser JavaScript.

Optional Netlify environment variable:

- `GEMINI_MODEL` — defaults to `gemini-2.5-flash`. The original `gemini-2.0-flash` key test returned free-tier quota limit `0` for this project, while `gemini-2.5-flash` responded successfully.

The function includes a lightweight per-instance IP rate limit of 5 messages/minute and returns a CTA fallback instead of failing visibly when the key is missing, rate-limited, or Gemini is unavailable.
