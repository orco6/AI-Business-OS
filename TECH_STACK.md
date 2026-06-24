# TECH_STACK

> Concrete technology choices and constraints.
> **Change requires an ADR** for items marked 🔒.

**Status:** Greenfield — stack not yet chosen. First selection must be recorded in [adr/](./adr/).

---

## Selection Criteria

Before choosing any layer, it must satisfy [PROJECT_RULES.md](./PROJECT_RULES.md):

| Criterion | Requirement |
|-----------|-------------|
| AI-first | Native streaming, tool/function calling, easy provider swap |
| Cost | Predictable pricing at 0 → 1,000 users |
| Replaceable | No deep lock-in without an escape hatch |
| DX | Fast local dev, good Cursor/agent support |
| Security | SOC2-ready path (not day-one, but no dead ends) |

---

## Planned Layers

| Layer | Choice | Version | Status |
|-------|--------|---------|--------|
| Language (frontend) | TBD | — | Not chosen |
| Language (backend) | TBD | — | Not chosen |
| Framework | TBD | — | Not chosen |
| Database | TBD | — | Not chosen |
| ORM / query | TBD | — | Not chosen |
| Auth | TBD | — | Not chosen |
| Hosting (app) | TBD | — | Not chosen |
| Hosting (DB) | TBD | — | Not chosen |
| CI/CD | TBD | — | Not chosen |
| Observability | TBD | — | Not chosen |

---

## AI Layer

| Component | Choice | Status |
|-----------|--------|--------|
| Primary LLM | TBD | Not chosen |
| Fallback LLM | TBD | Not chosen |
| Embeddings | TBD | Not chosen |
| Agent orchestration | TBD | Not chosen |
| Prompt storage | `prompts/` in repo | Active |

**Policy (provisional):** Provider-agnostic interface. Models are configuration, not architecture.

---

## 🔒 Requires ADR Before Change

- Database engine
- Auth provider
- Primary AI provider
- Multi-tenancy model
- Monolith vs. services split
- Payment provider

---

## Explicitly Rejected (until reconsidered via ADR)

| Option | Reason | Date |
|--------|--------|------|
| — | Nothing rejected yet | — |

---

## Local Development

Not set up yet. When it is, add [docs/local-development.md](./docs/local-development.md) and update this section with commands only — narrative stays in docs.
