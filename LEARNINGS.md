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
