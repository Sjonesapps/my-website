# Live lead and transactional email verification

## Preview and commit

- Preview: `https://deploy-preview-117--regal-figolla-aebeee.netlify.app/ai-employee-quiz/`
- Commit: `640c199a9ff8da72c29eddf5f6359b152cd76d10`
- Netlify deploy: `6afba3d14c1df61d13499adc`
- Context: `deploy-preview`

## Disposable lead receipt

A complete desktop path submitted one clearly marked disposable record through the live preview function.

- Netlify form: `ai-employee-assessment`
- Submission receipt: `6afba3ff3205777d4dd03d15`
- Test marker: `[TEST DELETE] AI Assessment 640c199`
- Marketing consent stored: `false`
- Function response: `accepted: true`, `stored: true`, `emailSent: false`, `emailStatus: unavailable`
- On-screen result remained available and explained that email delivery was delayed.

The disposable submission was deleted with the Netlify API. A follow-up site-submission query returned `0` records whose name contains `[TEST DELETE]`.

## Consent proof

- Live backend path: checkbox left unchecked and request/store value was exactly `false`.
- Complete iPhone path: checkbox explicitly checked and the intercepted live-preview request value was exactly `true`.
- No marketing provider or marketing-send action exists in the assessment function.
- The checkbox is optional and unchecked in static HTML.

## Duplicate prevention proof

- The browser stores an in-progress/submitted idempotency state in `sessionStorage`.
- Resend receives the submission UUID as its idempotency key when configured.
- A page reload after completion produced no second function request in desktop or iPhone browser tests.
- The function returns the prior response for a repeated UUID within the warm instance window.

## Transactional email blocker

The live function correctly reached the email stage but reported `emailSent: false` because the Netlify site has no approved outbound sender configuration. No `RESEND_API_KEY`, `ASSESSMENT_FROM_EMAIL`, Postmark, SendGrid, Mailgun, Gmail, or equivalent deploy-preview sender configuration is present.

Required to finish live delivery proof:

1. Configure an approved transactional email provider credential for the deploy-preview context.
2. Configure a verified sender address as `ASSESSMENT_FROM_EMAIL`.
3. Submit a new disposable assessment to an inbox under operator control.
4. Capture the provider message ID and inbox receipt.
5. Delete the disposable Netlify submission and verify zero marked test leads remain.

No credential was invented, extracted, or exposed. No marketing message was sent.
