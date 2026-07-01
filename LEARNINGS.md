# LEARNINGS

> Important discoveries during development. Append-only — edit past entries only to correct errors.
> Agents must add an entry here when new knowledge is discovered during implementation.

---

## How to Add an Entry

```markdown
### YYYY-MM-DD — Short title

**Context:** What we were doing  
**Discovery:** What we learned  
**Action:** What we changed or will do differently  
**Tags:** `prompts` | `claude` | `cursor` | `performance` | `architecture` | `ux` | `other`
```

---

## Prompt Patterns

_Discoveries about effective prompts, context windows, tool use._

<!-- Entries below -->

---

## AI Model Behavior

_Mistakes, surprises, and reliability patterns (Claude, GPT, others)._

<!-- Entries below -->

---

## Cursor & Agent Tooling

_Limitations, workarounds, and workflows that work in this repo._

<!-- Entries below -->

---

## Performance

_Latency, caching, query, and cost optimizations that proved valuable._

<!-- Entries below -->

---

## Architecture

_Lessons from building — what we'd do differently, what worked._

### 2026-06-23 — Documentation-first foundation

**Context:** Greenfield repo setup  
**Discovery:** Separating living state (`PROJECT_BRAIN`), immutable philosophy (`PROJECT_RULES`), and append-only knowledge (`LEARNINGS`) prevents doc rot and gives agents clear write targets.  
**Action:** All future agent work must update the correct doc type per [AI/AGENT.md](./AI/AGENT.md).  
**Tags:** `architecture`, `cursor`

---

## UX & Product

_User research, usability findings, copy that works._

<!-- Entries below -->

### 2026-07-01 — Safari iOS overflow-hidden clips fixed-position children

**Context:** Hamburger menu overlay on Hero did not appear on Safari iOS despite `position: fixed` and `z-index: 9999`.  
**Discovery:** An ancestor with `overflow-hidden` (the Hero `<section>`) creates a containing block that clips fixed/absolute descendants on Safari iOS.  
**Action:** Render the menu overlay as a sibling outside the section (fragment root); keep `overflow-hidden` only on the inner Ken Burns image wrapper.  
**Tags:** `ux`, `other`

### 2026-07-01 — Safari iOS Framer Motion whileInView stuck at opacity 0

**Context:** Preview website on Safari iOS — About, Services, Gallery, and Contact sections were invisible after Hero. Diagnostic: removing all Framer Motion from those sections fixed visibility.  
**Discovery:** `whileInView` on motion components never fires on Safari iOS; elements stay at `initial={{ opacity: 0 }}`. `amount: 0` on viewport alone did not fix it.  
**Action:** Replace `whileInView` with `useInView` hook + `animate={isInView ? … : …}` on section components; one ref per section, shared `isInView` for all child animations.  
**Tags:** `ux`, `other`

### 2026-06-30 — Mobile website section spacing

**Context:** Preview site showed huge empty colored screens between Hero → About → Services → Gallery on iPhone (375px).  
**Discovery:** FIX 1–4 visual upgrade changed section padding from `py-20` to `py-32 sm:py-40` (128px mobile) and headers to `mb-20` (80px). Stacked with `whileInView` opacity-0 animations and section background colors (`#111827` navy vs white), users scrolled through ~256px of padding per section before content faded in. No cinematic break exists between Services/Gallery on mobile (desktop featured image is `sm:block` only).  
**Action:** Responsive spacing: `py-16 sm:py-32 lg:py-40`, `mb-10 sm:mb-16 lg:mb-20`; About grid `lg:grid-cols-2`; hero uses `100svh` on mobile without forced `min-h-[600px]`.  
**Tags:** `ux`, `other`

### 2026-07-01 — Hamburger menu invisible after repeated opens

**Context:** Fullscreen hamburger overlay worked on first opens, then showed blank dark overlay with no links on Safari iOS.  
**Discovery:** CSS `animation-fill-mode: both` on nav links keeps `opacity: 0` during delay and if the animation fails to restart on remount, links stay invisible. `onTouchEnd` + `preventDefault` on menu controls can also degrade touch handling after multiple taps.  
**Action:** Use `motion/react` + `AnimatePresence` with a per-open `menuKey`; remove duplicate `onTouchEnd` handlers; scroll via Lenis ref instead of `scrollIntoView`.  
**Tags:** `ux`, `other`

### 2026-07-01 — Hamburger menu links empty or invisible

**Context:** User saw only the bottom CTA ("צור קשר") in the fullscreen menu — no section links in the center.  
**Discovery:** (1) Stored `navbar.links` can be empty or use PascalCase `Label`/`Href` so `link.label` renders blank; (2) nested Framer Motion `opacity: 0` on links inside a transforming parent stays stuck on Safari iOS while the solid CTA button still appears.  
**Action:** `resolveNavbar()` builds links from website sections when API data is missing; normalize PascalCase; render nav links as plain `<a>` with full opacity (no motion fade).  
**Tags:** `ux`, `other`

### 2026-07-02 — Onboarding stuck on "רגע..." from CORS port mismatch

**Context:** User stuck on onboarding after clicking Continue (business type or contact details flow).  
**Discovery:** (1) CORS allowed only `localhost:3000` and `192.168.x.x:3000` — Next.js often runs on `:3001`/`:3002`; network URL uses `10.x.x.x`. (2) API bound to `localhost:5063` only, so `API_BASE` hostname routing from LAN could not reach the server. (3) Related: `UseHttpsRedirection()` before CORS breaks preflight in dev — already skipped in Development.  
**Action:** CORS now allows any port on `localhost`, `127.0.0.1`, `10.*`, and `192.168.*`. API listens on `0.0.0.0:5063`. Onboarding API calls use `AbortSignal.timeout(90s)` with visible Hebrew error on failure.  
**Tags:** `ux`, `architecture`

