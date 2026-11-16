# AI Employee Discovery Quiz

Static, one-question-at-a-time discovery quiz at `/ai-employee-quiz/`.

## Architecture

- `index.html`: semantic quiz, results, and build-time discoverable Netlify form.
- `quiz.css`: responsive YourOS styling and accessible states.
- `quiz.js`: navigation, validation, session resume, rendering, analytics, copying, and submission.
- `result-engine.js`: pure, versioned deterministic result logic. It makes no network calls.
- `tests/quiz.test.mjs`: Node built-in assertions for scoring, form requirements, consent independence, duplicate prevention, and static accessibility basics.

Answers remain in `sessionStorage` while the quiz is in progress. Free-text answers and contact details are never sent to analytics. If the visitor submits the optional form, Netlify receives the name, email, quiz answers, result, optional marketing consent, and QA marker. Results never depend on form submission or consent.

## Test

From the repository root:

```sh
node --test ai-employee-quiz/tests/quiz.test.mjs
python3 -m http.server 4174
# In another terminal:
python3 ai-employee-quiz/tests/browser-smoke.py
```

Then open `http://127.0.0.1:4174/ai-employee-quiz/`. The browser smoke test intercepts the form POST locally, verifies consent independence and duplicate prevention, and creates no live backend record.
