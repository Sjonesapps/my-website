# Claude UX Plan: AI Employee Discovery Quiz

## Model receipt

- Provider: Anthropic first-party, through Claude Code on the connected macOS node
- Canonical model: `claude-sonnet-5`
- Session: `aa74b6a0-5100-45c0-9112-39a7826a237b`
- Terminal reason: `completed`
- Result type: `success`
- Claude Code reported 35 turns and no permission denials

The complete raw response is preserved in the commander session tool record. This file records the implementation decisions adopted from that review.

## Design verdict

Build the quiz as a focused mid-funnel asset inside the existing YourOS visual system. Use deterministic, auditable result logic. Give the visitor the complete Blueprint before asking for contact information. Keep the lead form statically present for Netlify's build-time scanner. Explicitly resolve the global fixed action bar collision on mobile.

## Flow

1. Minimal opening viewport with the promise: "What job has your business accidentally hired you to do?"
2. One question per screen, preserving all ten required concepts.
3. Educational cards before the judgment and trust-control questions.
4. Immediate results: Worker-Mode Profile, best first responsibility, three copy-ready prompts, and AI Employee Blueprint.
5. Independent results lead form with required name and email only. Marketing consent is optional, unchecked, and never required for results.

## Ten question concepts

1. Where time goes: doing, checking/correcting, answering/deciding, selling, planning/improving, firefighting, or all.
2. The unwanted task that consumed the most time on the last full workday.
3. The first three responsibilities to hand to a dependable employee.
4. Recurring work categories.
5. Work trigger.
6. Correct result.
7. Required information.
8. Owner judgment versus clear worker rules.
9. Trust controls.
10. Returned time/attention and what becomes possible.

## Interaction and accessibility

- Use native fieldsets, legends, radios, checkboxes, labels, and textareas.
- Move focus to each new screen heading and announce progress through `aria-live`.
- Include visible Back navigation and keyboard-friendly Enter advancement where safe.
- Respect `prefers-reduced-motion`.
- Keep focus rings visible and contrast aligned with existing site tokens.
- Persist in-progress answers in `sessionStorage` and offer a clean restart.
- Use explicit validation with inline error messages.
- Disable submission during async work and prevent duplicate submissions.
- Hide the global mobile action bar while the quiz is active so it does not collide with quiz controls.

## Visual system

- Reuse the site's Inter type, dark background, blue information accents, orange action accent, card surfaces, sticky site header, and footer conventions.
- Keep the initial viewport sparse and avoid content-heavy sections under the start action.
- Use short interstitial cards with no inputs and a single Continue action.
- Render the result profile as a compact eyebrow/pill.
- Render the first delegation responsibility and Blueprint as high-value cards.

## Result logic

- Implement a pure, versioned `deriveResult(answers)` function.
- Worker-Mode Profile should map to recognizable patterns such as owner-as-switchboard, follow-up coordinator, information bottleneck, quality-control trap, admin anchor, and marketing backlog.
- Score the best first responsibility using repetition, trigger clarity, outcome definition, available inputs, and limited judgment.
- Generate all three prompts locally from the user's answers. Never send answer text to an LLM.
- Include robust fallback text for skipped open responses.
- Never send free-text answer content to analytics.

## Lead capture and privacy

- Results are never gated.
- Collect only name and email.
- Use a separate unchecked checkbox: "Send me useful YourOS articles, tools, and offers. Optional."
- State clearly that the submission stores quiz answers and contact details so YourOS can provide the Blueprint and respond to the visitor's request.
- Link `/privacy-policy` and preserve existing compliance copy.
- Keep the Netlify form and all named inputs in static HTML from first render.
- Add a honeypot, a client-side submit lock, retry handling, and an inline status region.

## Analytics

Use the existing GA4 loader and conventions. Track `quiz_start`, `quiz_question_view`, `quiz_question_answer`, `quiz_complete`, CTA clicks, form start, form success, and form error. Never include email, name, business details, or free-text answers in analytics payloads.

## Visual review checklist

- 375x667 mobile entry shows the promise and Start action without a competing global action bar.
- Desktop and mobile complete paths render without clipping or horizontal overflow.
- Progress is accurate and interstitial cards are not counted as questions.
- Back navigation restores answers.
- Copy buttons expose success and fallback states.
- Consent is visibly unchecked and optional.
- Loading, retry, and duplicate-submit states are visible and functional.
- No em dashes, unsupported claims, invented outcomes, or team-replacement framing.

