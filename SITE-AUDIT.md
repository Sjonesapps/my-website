# YourOS Site Audit — May 2026
*UX/UI · SEO · Conversion Funnel · Technical*

---

## CRITICAL BUGS TO FIX FIRST

These are breaking things right now.

### 1. Broken link on the homepage — `/utah-ai-automation/`
`index.html` has a "Utah AI Consulting" service card that links to `/utah-ai-automation/` — a page that doesn't exist. Every visitor who clicks that gets a 404. Google sees it too. Either build the page (worth doing — local SEO value is real) or remove the card.

### 2. Blog nav "YourOS Home" goes to `/blog/`
`blog/index.html` nav has `href="/blog/"` for the "YourOS Home" link. Anyone who clicks it stays on the blog. Should point to `https://www.youros.app/youros-home`.

### 3. What-does-youros-do CTA bypasses your funnel
The CTA at the bottom of `what-does-youros-do/index.html` links directly to a Google Form URL instead of `/Begin-Your-Revolution.html`. This sends leads off-site, untracked, to an outdated form. Change to match every other page.

### 4. Three different nav designs exist on the same site
- **New nav** (index, service pages): sticky, Services dropdown, orange "Book a Workflow Audit" button ✓
- **Semi-old nav** (stories pages): sticky but uses old links (Security & Trust, Let's Talk AI, Pricing & Competitors) — no Services dropdown, no CTA button
- **Old nav** (Begin-Your-Revolution, what-does-youros-do): not sticky, different class names, different structure

A visitor navigating through the site sees three different navigation menus. Every page needs the same nav.

---

## CONVERSION FUNNEL — HIGHEST IMPACT

### 5. Begin-Your-Revolution form has too many fields
Current: Name, Email, Company, Role, Problem, Platform, Phone = **7 fields**.
Every field you add reduces submissions by ~10-15%. Industry benchmark for a first-touch audit offer: **3 fields** (Name, Email, "What's the biggest thing breaking your workflow?"). You can get role/company/platform on the discovery call.

### 6. Begin-Your-Revolution page has no meta description, old design
The page that all traffic is being sent to:
- No `<meta name="description">` tag — Google generates its own, usually badly
- Uses old nav (.navbar class, not sticky, not matching anything else)
- Testimonials are jokey ("We nearly picked Salesforce. Then we remembered we liked sleep") — these don't build the trust you need at the moment of a high-intent form fill. Replace with measurable-outcome quotes from real clients (the same ones now on the stories pages)
- No "what happens next" text below the form (e.g., "You'll hear from us within 1 business day to schedule a 20-minute session")
- No privacy micro-copy below the email field ("We don't sell your info. Ever.")

### 7. Every CTA says the exact same thing
"Book a Free Workflow Audit" is on every single button on every single page. Context-aware CTAs convert significantly better. Examples:
- On the HVAC case study: *"Are your field techs costing you contracts? Let's talk."*
- On Replace Spreadsheets: *"Show Us Your Most Dangerous Spreadsheet"* (already good — use it more)
- On the AI Assistants page: *"See What an AI Sidekick Does for Your Team"* (already in place — good)
The service pages have good CTA copy. Make the end-of-page CTAs match the page's specific pain point.

### 8. No intermediate conversion path
Right now: visitor arrives → reads → either books an audit or leaves forever. There's no middle option. Someone who's interested but not ready to book has nowhere to go. Options:
- An email opt-in offering a "5 Signs Your Business Needs a Workflow Audit" checklist
- A "workflow self-assessment" quiz
- A newsletter or blog subscription
Without this, you're losing a large segment of warm traffic that just needs more time.

### 9. Blog has zero conversion path
Three blog posts, no CTA at the bottom, no email capture, no "book an audit" link. Blog traffic is intent-qualifying — people searching "dashboard design best practices" are exactly the operations managers who'd hire YourOS. Put a CTA at the bottom of every post.

### 10. No pricing information anywhere
Visitors have no idea what this costs. "Book a free audit" is the only signal. This is a double-edged sword: it reduces friction but it also attracts unqualified leads and causes sticker shock post-call. Even a vague "Projects typically range from $X to $Y depending on scope" on a Pricing page (which you have! — but it's in the old nav only, not accessible from the new nav) filters appropriately.

---

## SEO — ORGANIC TRAFFIC OPPORTUNITIES

### 11. No Open Graph / social meta tags anywhere
When anyone shares a YourOS link on LinkedIn, Twitter, Slack, etc., there's no preview image, no custom title, no description — just a blank card. For a B2B service business where referral sharing matters, this is leaving a lot of first-impression value on the table. Every page needs:
```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta property="og:url" content="..." />
<meta property="og:type" content="website" />
```

### 12. No structured data (Schema.org) anywhere
Google uses structured data to create rich results. Missing:
- `LocalBusiness` schema on homepage (name, address, phone, service area — critical for local search in Utah)
- `Service` schema on service pages
- `FAQPage` schema (these pages have implied Q&A structure, formalizing it could get you FAQ rich results)
- `Article` schema on blog posts
- `Review` / `AggregateRating` on Begin-Your-Revolution page (if using any star ratings)

### 13. No sitemap.xml or robots.txt
Neither file exists in the repo. Google can discover your pages through links, but a sitemap guarantees it and helps prioritize crawling. A `robots.txt` is also expected by all crawlers. Both are 10-minute fixes.

### 14. Blog canonical URL is relative, not absolute
`<link rel="canonical" href="/blog/" />` — should be `href="https://www.youros.app/blog/"`. Relative canonicals can cause issues when pages are scraped or indexed from alternate URLs.

### 15. Blog content is 10 months old with no new posts
Last post: July 2025. Google's freshness signals favor recently updated sites. Three posts is also extremely thin content for a site trying to rank on competitive keywords like "AI workflow automation for small business." Recommend publishing 2–4 posts per month targeting specific long-tail questions your ideal clients are asking:
- "how to replace spreadsheets with a custom app"
- "AppSheet vs custom software for small business"
- "AI automation ROI for field service companies"
- "how to build a workflow system for HVAC companies"

### 16. No local SEO page or Google Business Profile reference
The homepage mentions Utah once (in the trust strip). There's a `/utah-ai-automation/` card on the homepage but no page. For a local consulting business, a dedicated location page and a verified Google Business Profile are the two highest-ROI local SEO moves. A page at `/utah-ai-automation/` with local-specific content (industries served in Utah, Wasatch Front reference, local case studies if any) would compound value quickly.

### 17. Image alt text and hosting
- All images are hosted on `postimg.cc` — a third-party free CDN. If that service goes down or rate-limits the images, your site breaks visually. Self-host or use Netlify's CDN.
- Alt text is mostly `"YourOS Logo"` — functional but not keyword-rich. For the service-specific images, add descriptive alt text.

### 18. what-does-youros-do/index.html is a missed SEO opportunity
This page gets a prominent nav link from every page. Its current content is a pottery class parable and a philosophy statement. It has no links to service pages, no links to case studies, no clear structure. For SEO, this page should be a hub that clearly explains what YourOS does with links to every service, every case study, and the primary CTA. It's currently a content dead end.

---

## UX / UI — DESIGN AND USABILITY

### 19. No footer navigation
Every page has a single copyright line as the footer. No links to services, no social profiles, no contact email, no "Book an Audit" link. Footer navigation is where users go when they finish reading and want to explore or take action. A simple 3-column footer (Services | Company | Contact) would meaningfully improve navigation flow.

### 20. Floating favicon is confusing UX
The fixed `<img class="favicon-footer">` pinned to the bottom-right corner of every page is a link that goes to the homepage. Most users don't know it's clickable. It's visually noisy. Either remove it, replace it with a "Back to top" button, or add a visible label. The trademark "floating Y" is distinctive but unexplained.

### 21. youros-home vs index.html — two homepages?
`/youros-home` is linked as "YourOS Home" in the nav on every page, but `/` (index.html) is also a homepage. These two pages compete with each other for the same searches and confuse users about where "home" actually is. Either consolidate them or give each a distinct purpose (e.g., `/` = marketing homepage, `/youros-home` = existing client hub).

### 22. "Security & Trust" and "Let's Talk AI" are in old nav but not new nav
Pages at `/security-trust` and `/lets-talk-ai` are linked from the stories section nav but not from the homepage or service page nav. If these pages matter (and trust signals absolutely do), they need to be accessible everywhere — either in the nav or in the footer. If they don't matter, update the stories nav to match the rest of the site.

### 23. Hero on index.html shows a large logo image
The hero has the eyebrow, h1, tagline, a 260px logo image, body copy, and then the CTA buttons. The logo in the middle of the hero pushes the CTA below the fold on mobile and creates a cluttered visual hierarchy. The logo is already in the nav. Moving it to the footer or removing it from the hero would tighten the fold and lift the CTA into immediate view.

### 24. Service page internal links don't connect to case studies
The 5 service pages link to other service pages but none of them link to the stories/testimony pages. This is a missed trust-building opportunity. Someone on the HVAC automation page should see a link to the HVAC case study. Someone on the AppSheet consulting page should see the Brad/biotech story. Connecting service pages → case studies adds proof at the moment of consideration.

### 25. Blog dates are styled but `.muted` class isn't defined
`<p class="muted">July 20, 2025 — Productivity</p>` — the `muted` class in the blog CSS is defined as `--muted` color variable but the class `.muted { color: var(--muted); }` isn't in the blog stylesheet. The dates render as the default text color, not the muted gray intended.

---

## PRIORITY RANKING

| Priority | Change | Effort | Impact |
|---|---|---|---|
| 🔴 Critical | Fix broken `/utah-ai-automation/` link | 30 min | SEO + UX |
| 🔴 Critical | Fix blog nav "YourOS Home" link | 5 min | UX |
| 🔴 Critical | Fix what-does-youros-do CTA to /Begin-Your-Revolution.html | 5 min | Funnel |
| 🔴 Critical | Unify nav across ALL pages | 2–3 hrs | UX + Brand |
| 🔴 High | Reduce Begin-Your-Revolution form to 3 fields | 30 min | Conversion |
| 🔴 High | Add OG meta tags to all pages | 1 hr | SEO + Social |
| 🟡 High | Add CTA to bottom of all 3 blog posts | 30 min | Conversion |
| 🟡 High | Add LocalBusiness schema to homepage | 1 hr | Local SEO |
| 🟡 High | Create `/utah-ai-automation/` page | 2 hrs | Local SEO |
| 🟡 High | Add sitemap.xml and robots.txt | 30 min | SEO |
| 🟡 High | Rewrite what-does-youros-do as services hub | 2 hrs | SEO + Funnel |
| 🟡 Medium | Overhaul Begin-Your-Revolution page design + copy | 3 hrs | Conversion |
| 🟡 Medium | Add case study links to each service page | 1 hr | Trust + SEO |
| 🟡 Medium | Add footer navigation to all pages | 1 hr | UX |
| 🟡 Medium | Fix blog .muted class | 10 min | UX |
| 🟢 Medium | Add context-specific CTAs on case study pages | 1 hr | Conversion |
| 🟢 Medium | Remove or label the floating favicon | 15 min | UX |
| 🟢 Medium | Add Article schema to blog posts | 45 min | SEO |
| 🟢 Low | Self-host images (move off postimg.cc) | 2 hrs | Reliability |
| 🟢 Low | Add email capture / lead magnet | Ongoing | Nurture |
| 🟢 Low | Consolidate youros-home vs index.html | 1 hr | SEO clarity |

---

## BIGGEST SINGLE OPPORTUNITY

**The Begin-Your-Revolution page is the one page that ALL traffic is sent to — and it's the weakest page on the site.**

Old nav design, 7-field form, generic jokey testimonials, no meta description, no "what happens next" copy. Every other page has been improved significantly. This page converts all that traffic (or doesn't). A complete rebuild of this page — modern dark design, 3-field form, real client quotes with outcomes, a clear "what happens after you submit" expectation — is likely the single highest-ROI change you can make to the site.

---

*Report generated: 2026-05-05 | Pages audited: 15 | TARS*
