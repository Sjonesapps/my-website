# AI Employee Opportunity Assessment: Claude pre-implementation plan

## Model evidence

- Provider: Anthropic first-party
- Model: `claude-sonnet-5`
- Session: `1de8b703-2f74-4814-950d-604bcbe2bb0a`
- Review type: UX, instructional copy, interaction, data design, and scoring plan before implementation
- Verdict: Proceed with the plan below

## Design thesis

This is a three-minute manager-skills lesson that produces a personal AI Opportunity Assessment. The visitor should recognize the employee work hiding inside their week, learn how AI employees earn trust, and leave with an evidence-based first automation, useful prompts, and a blueprint.

Keep the one-question-per-screen rhythm and the existing YourOS visual system. Move name and email before the questions so the completed assessment can be delivered transactionally. Keep the marketing choice separate and unchecked.

## Copy-ready opening

**Eyebrow:** AI Opportunity Assessment

**Headline:** Who's Really Running This Place: You, or Your To-Do List?

**Lead:** Ten quick questions, about three minutes. Think like a manager: managers set direction, use judgment, and handle exceptions. The repeatable work, the admin, and the button-pushing are employee tasks. They are often the work an AI employee can take off your plate.

**Teaching card:** Step one is noticing it. Think back over the last week. Now picture handing that same week to a dependable new hire starting Monday. What would you actually give them?

**CTA:** Find My Opportunity

## Exact ten-question map

| # | Actual question | Instructional anchor | Response and field | Result, prompt, blueprint, and market use |
|---|---|---|---|---|
| 1 | Right now, are you running this part of the business, or is it running you? | Managers aim, decide, and handle exceptions. Employees execute the standard case. Most owners are both. The question is the mix. | Five scored choices from Mostly Manager to Mostly Employee. `managerEmployeeMix`. | Direct Manager-to-Employee placement and operator-load cohort. |
| 2 | Think back over the last week. What ate the most time you did not want to give it? | Use the actual week you just lived, not a hypothetical. | Required textarea. `unwantedTask`. | Seeds first-automation candidates and recurring-pain analysis. |
| 3 | If a dependable new hire started Monday, what are the first three things you would hand them? | This is the start of a real job description, not a wish list. | Three required responsibility fields. `delegateFirst`. | Primary candidates for strongest automation, job title, prompts, and role-demand intelligence. |
| 4 | Which of this keeps coming back, week after week? | A one-time task needs a decision. Work that returns needs a process. | Recurring-work categories plus specific tool/system detail. `categories`, `recurringWorkDetail`. | Repetition evidence, product category demand, and tool/integration context. |
| 5 | When does this work actually start? What signal would a new employee need to notice? | Employees notice or receive a trigger, then begin the work. | Trigger choices. `trigger`. | Blueprint trigger, prompt context, and integration-signal demand. |
| 6 | Think of the last time this went right. What did done correctly actually look like? | Managers care about the correct outcome, not every tool or button used to get there. | Required textarea. `correctResult`. | Expected result for scoring, prompts, blueprint, and outcome clarity. |
| 7 | To do this well, where does the knowledge actually live? | Some work is documented. Some exists only in someone's head. That gap must be closed before any employee can own it. | Information-location choices including documented sources and only in my head. `requiredInfo`. | Readiness signal, blueprint inputs, and documentation-gap intelligence. |
| 8 | Is this mostly the same every time, or does it need real judgment calls? | Rules handle the standard case. Nuance appears in edge cases and escalation points. | Straightforward-to-nuanced scale plus exception types. `judgment`, `exceptionTypes`. | Complexity score, exception rules, and escalation architecture. |
| 9 | What would it take to trust an AI employee with this? | Two sections distinguish what gets it into Yellow from what unlocks Green. | Yellow trust controls and Green safeguards/evidence. `yellowTrust`, `greenReadiness`. | Approval maturity, readiness band, manager approval points, and escalation controls. |
| 10 | If this stopped taking your time, what would you do with it back, and what is next? | Name the returned value, then decide whether the next win is more of this role or another AI employee. | Returned-time text plus same-role, adjacent-role, or unsure choice. `returnedTime`, `targetRichness`. | Target richness, expansion demand, and personalized next-step language. |

Every numbered slot is a real question. Teaching doctrine screens remain unnumbered.

## Red, Yellow, Green AI Bot Method

Place this concise doctrine screen immediately before question 9.

**Headline:** Every AI employee earns its way in: Red, then Yellow, then Green.

**Red:** It trains. It studies real examples and runs simulated attempts that never touch live work.

**Yellow:** It does real work out loud. Before anything goes out, it explains what it plans to do and the manager signs off. This is useful, but if every item waits for approval, the manager remains the throughput constraint.

**Green:** It acts automatically inside the authority and limits the manager sets, then surfaces fringe cases and exceptions.

**Strong line:** Yellow builds the track record. Green is what gives you the time back.

Question 9 contains two visually distinct fieldsets: what is needed to trust the bot in Yellow and what additional safeguards or evidence unlock Green. This preserves ten numbered questions while collecting two separate maturity signals.

## Transparent assessment logic

Do not show percentages or decimals.

1. **Manager-to-Employee placement:** reflect the visitor's five-point Q1 choice directly. Label it as self-report and support it with answer evidence without silently changing the placement.
2. **Strongest first automation:** rank the three Q3 responsibilities using recurrence, clear trigger, defined outcome, available information, and limited judgment. Show why the winner ranked highest, not a pseudo-precise number.
3. **Readiness:** show a plain-language band: Red, Yellow-ready, Yellow-ready with Green in reach, or Green-ready for the standard case. Show the selected Yellow and Green evidence beside the band.
4. **Target richness:** reflect the Q10 choice directly and tailor the next-step sentence.

## Pre-assessment contact and consent

**Headline:** Where should we send your results?

**Lead:** You will see everything on this screen when you finish. We will also email the full assessment, blueprint, and ready-to-use prompts so you are not stuck copying from a browser tab.

Collect required name and email. Include one unchecked optional checkbox:

> Also send me YourOS Articles and AI Advice. Optional and separate from delivery of my assessment.

Privacy copy must state that answers and contact details are stored to deliver results, link the Privacy Policy, and state clearly that leaving the optional box unchecked will not add the person to marketing.

## Transactional email architecture

At completion, submit the lead and answers to the server-side source of truth and send one transactional results email. The email mirrors the on-screen order:

1. Manager-to-Employee placement
2. Strongest first automation and rationale
3. Readiness band and visible evidence
4. Target-richness line
5. Three copyable prompts
6. Full AI Employee Blueprint
7. If marketing consent is false, a separate optional confirmation path for YourOS Articles and AI Advice
8. Privacy and contact footer

Email failure must never hide or block the on-screen result. Credentials stay server-side. No marketing subscription occurs without explicit consent.

## Results and prompt architecture

Results should show, in order: placement, strongest automation, readiness with evidence, target richness, three prompts, the Blueprint, and the sales transition.

Prompts should naturally encode the visitor's current reality, desired result, operating limits, approval scope, and escalation behavior. Do not label or teach the SOCA acronym, and do not use Situation, Objective, Constraints, or Authority as headings.

## Interaction specification

- Forward and back transitions use a fast fade plus 16px directional slide. Incoming motion is about 220ms and total handoff stays below 400ms.
- Use CSS classes and preserve `prefers-reduced-motion`; reduced motion removes the movement without breaking state or focus.
- Move focus to the incoming heading after the transition. Preserve keyboard operation and back navigation.
- Results, prompt cards, and Blueprint rows receive a restrained 2px lift and soft brand-color glow on hover or focus-within. No important content depends on hover.
- Mobile fields stack, touch targets remain at least 44px, and the two Q9 fieldsets remain visually distinct at iPhone widths.

## Current implementation risks and priorities

1. Current Q1 is categorical, not an ordered Manager-to-Employee assessment.
2. Lead capture currently occurs after results and no transactional email function exists.
3. Red, Yellow, Green fields and doctrine are new.
4. The result engine and deterministic tests require a versioned schema update.
5. Netlify form fields must remain statically discoverable in HTML.
6. Motion must be added without delaying accessibility focus or introducing layout shift.

Implementation order: update result schema and tests; move static lead form before Q1; revise all question fields and doctrine; add server-side lead/email handling; render the assessment; add motion and interaction polish; then verify full desktop and mobile paths.

## Acceptance checklist

- Exactly ten numbered real questions, each with a concise anchor.
- Q1 through Q10 capture the fields and uses in the map above.
- Yellow and Green are separate response sections inside Q9.
- No fabricated percentages or precision.
- Name and email precede the assessment; marketing remains separate and unchecked.
- Transactional email mirrors the on-screen result and does not subscribe without consent.
- Motion stays below 500ms and respects reduced motion, focus, keyboard, and touch.
- Assessment, prompts, and Blueprint visibly reflect the visitor's answers.
- Draft PR only. No merge or production deployment.
