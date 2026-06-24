# Agent Operating Guide

> Entry point for AI agents working in AI-Business-OS.
> Follow [PROJECT_RULES.md](../PROJECT_RULES.md) at all times.

---

## Read Order (start of every session)

1. [PROJECT_BRAIN.md](../PROJECT_BRAIN.md) — current truth
2. [PROJECT_RULES.md](../PROJECT_RULES.md) — non-negotiable principles
3. [TECH_STACK.md](../TECH_STACK.md) — constraints and TBD layers
4. [AI/GLOSSARY.md](./GLOSSARY.md) — domain vocabulary
5. Relevant [adr/](../adr/) files if touching architecture
6. Relevant [docs/](../docs/) files if they exist
7. Relevant [prompts/](../prompts/) files if they exist

---

## Self-Documentation Duties

This project becomes self-documenting over time. **Every implementation must update the appropriate docs before finishing.**

| Trigger | Action | Target |
|---------|--------|--------|
| Project status changes (sprint, backlog, product status, architecture diagram, known issues) | Update sections in place | [PROJECT_BRAIN.md](../PROJECT_BRAIN.md) |
| New knowledge discovered (prompt patterns, model quirks, tooling limits, perf findings, lessons) | Append entry using LEARNINGS format | [LEARNINGS.md](../LEARNINGS.md) |
| Architecture decision made (stack choice, auth model, tenancy, provider, major pattern) | Create new ADR + add row to Decisions table | [adr/NNNN-short-title.md](../adr/) + [PROJECT_BRAIN.md](../PROJECT_BRAIN.md) |
| Stable how-to reference needed (setup, deploy, env vars, security) | Create or update reference doc | [docs/](../docs/) |
| Reusable prompt finalized | Save to category folder | [prompts/{category}/](../prompts/) |
| Stack or cost structure changes | Update tables | [TECH_STACK.md](../TECH_STACK.md) / [COSTS.md](../COSTS.md) |
| New domain term introduced | Add definition | [AI/GLOSSARY.md](./GLOSSARY.md) |

**Do not skip updates.** If unsure which doc to touch, prefer PROJECT_BRAIN for status and LEARNINGS for discoveries.

---

## Implementation Standards

- **Minimal scope** — only change what the task requires
- **No duplication** — link to existing docs and code; one source of truth
- **Match conventions** — read surrounding code before writing new code
- **Cost aware** — check [COSTS.md](../COSTS.md) before adding AI calls or infra
- **Security first** — no secrets in repo; validate inputs; audit agent actions
- **ADR before fork** — if a decision is on the 🔒 list in TECH_STACK, write an ADR first

---

## When to Write an ADR

Write `adr/NNNN-kebab-case-title.md` when:

- Choosing or changing database, auth, hosting, or AI provider
- Adopting a pattern that affects multiple modules (multi-tenancy, event bus, etc.)
- Rejecting a technology option permanently (until reconsidered)
- Making a trade-off future teams will question

ADR format:

```markdown
# NNNN. Title

Date: YYYY-MM-DD
Status: Accepted | Superseded by NNNN

## Context
## Decision
## Consequences
```

---

## Prompt Library

Store finalized prompts in [prompts/](../prompts/) subfolders:

| Folder | Use for |
|--------|---------|
| `architecture/` | System design, ADR drafts, trade-off analysis |
| `planning/` | Sprint planning, backlog refinement |
| `coding/` | Implementation, refactoring |
| `review/` | Code review, security review |
| `testing/` | Test generation, test strategy |
| `deployment/` | Release, infra, CI |
| `product/` | PRDs, feature specs |
| `ux/` | Flows, copy, accessibility |

Do not create prompt files speculatively — only when a prompt is tested and reused.

---

## What Not to Do

- Do not create README files unless explicitly requested
- Do not duplicate PROJECT_BRAIN content in docs/
- Do not edit accepted ADRs — supersede with a new one
- Do not edit PROJECT_RULES without explicit human approval
- Do not add placeholder or lorem ipsum content
