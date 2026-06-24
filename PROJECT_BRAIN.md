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

**Status:** Pre-MVP — Next.js web app scaffolded with modular monolith folder structure.

```
User → apps/web (Next.js App Router) → (future) services / AI layer → (future) Data
```

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | Next.js 16, React 19, TypeScript | `apps/web` — App Router, React Compiler, Tailwind v4 |
| Backend / API | Next.js Route Handlers (future) | Thin routing in `app/api/` when needed |
| Database | TBD | See [TECH_STACK.md](./TECH_STACK.md) |
| AI providers | TBD | Cross-cutting wrappers in `services/` when added |
| Hosting / CI | TBD | |

**App structure** (`apps/web`): `app/` (routing), `components/` (ui + shared), `features/` (vertical modules), `services/`, `types/`, `lib/`, `hooks/`.

First feature module: `features/onboarding/`.

Next architectural decision should be recorded in [adr/](./adr/).

---

## Product Status

| Area | Status |
|------|--------|
| Documentation foundation | **Done** |
| Web app foundation (`apps/web`) | **Done** |
| Product definition | Not started |
| Design system | In progress (`components/ui/button`, light tokens in `globals.css`) |
| MVP features | In progress — onboarding step 1 UI at `/onboarding` |
| Production deployment | Not started |

---

## Current Sprint

**Sprint 1:** Project foundation and initial Next.js setup — **Complete**

Exit criteria:

- [x] Root docs created (`PROJECT_BRAIN`, `PROJECT_RULES`, `TECH_STACK`, `COSTS`, `LEARNINGS`)
- [x] `AI/`, `adr/`, `docs/`, `prompts/`, `.cursor/rules/` in place
- [x] Next.js app at `apps/web` (Next.js 16, React 19, Tailwind v4, React Compiler)
- [x] Modular monolith folder structure in `apps/web`
- [x] First feature scaffold: `features/onboarding/`

**Next up:** Wire onboarding step 1 submit flow, define MVP scope, first ADR for core stack choices.

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
| P0 | Choose core tech stack | Requires ADR — partial choices in `apps/web`; formalize in TECH_STACK |
| P0 | Define MVP scope (3–5 features max) | Product + UX |
| P1 | Local development setup | Add `docs/local-development.md` when ready |
| P1 | AI provider selection & cost model | Update [COSTS.md](./COSTS.md) |
| P2 | Design system / UX primitives | `components/ui/` — prompts in `prompts/ux/` |

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
