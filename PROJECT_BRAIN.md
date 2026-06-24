# PROJECT_BRAIN

> Single source of truth for AI-Business-OS. Updated when project status changes.
> Immutable philosophy lives in [PROJECT_RULES.md](./PROJECT_RULES.md).

---

## Vision

**AI-Business-OS** is an AI-first SaaS platform that gives small and mid-size businesses an operating system for running core workflows — sales, operations, support, and reporting — with AI agents doing the heavy lifting and humans staying in control.

**12-month bet:** Businesses don't need more dashboards. They need an OS that understands their context, acts on their behalf, and stays transparent. We win by being the layer that connects their tools, data, and decisions through reliable AI — not by replacing every app they already use.

**Target user:** Founder-led or ops-led teams (5–50 people) drowning in manual coordination across spreadsheets, email, and disconnected SaaS tools.

**Non-goals (for now):** Enterprise compliance certifications, on-prem deployment, custom ML model training.

---

## Current Architecture

**Status:** Pre-MVP — documentation foundation only. No application code yet.

```
[ Not built ]
  User → (future) Web App → (future) API → (future) Data + AI Layer
```

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | TBD | See [TECH_STACK.md](./TECH_STACK.md) |
| Backend / API | TBD | |
| Database | TBD | |
| AI providers | TBD | |
| Hosting / CI | TBD | |

Next architectural decision should be recorded in [adr/](./adr/).

---

## Product Status

| Area | Status |
|------|--------|
| Documentation foundation | **Done** |
| Product definition | Not started |
| Design system | Not started |
| MVP features | Not started |
| Production deployment | Not started |

---

## Current Sprint

**Sprint:** Documentation foundation  
**Goal:** Establish lean, self-documenting project structure for humans and AI agents.  
**Exit criteria:**

- [x] Root docs created (`PROJECT_BRAIN`, `PROJECT_RULES`, `TECH_STACK`, `COSTS`, `LEARNINGS`)
- [x] `AI/`, `adr/`, `docs/`, `prompts/`, `.cursor/rules/` in place
- [ ] First ADR when stack is chosen
- [ ] First `docs/` entry when local dev setup exists

---

## Decisions

| ID | Title | Status | Link |
|----|-------|--------|------|
| — | No ADRs yet | — | — |

When a decision is made, add a row here and create `adr/NNNN-short-title.md`.

---

## Backlog

| Priority | Item | Notes |
|----------|------|-------|
| P0 | Choose core tech stack | Requires ADR |
| P0 | Define MVP scope (3–5 features max) | Product + UX |
| P1 | Local development setup | Add `docs/local-development.md` when ready |
| P1 | AI provider selection & cost model | Update [COSTS.md](./COSTS.md) |
| P2 | Design system / UX primitives | Prompts in `prompts/ux/` |

---

## Known Issues

| Severity | Issue | Workaround |
|----------|-------|------------|
| — | None yet | — |

---

## Future Ideas

_Uncommitted ideas — not in backlog until promoted._

- Vertical-specific OS templates (e.g. agencies, e-commerce, professional services)
- "Business memory" — persistent context across all agent interactions
- Marketplace for third-party agent workflows
- White-label for consultants serving SMB clients
