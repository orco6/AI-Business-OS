# PROJECT_RULES

> Immutable engineering philosophy for AI-Business-OS.
> Changes here are rare and deliberate — discuss before editing.
> Living project state belongs in [PROJECT_BRAIN.md](./PROJECT_BRAIN.md).

---

## Core Principles

### UX First

Every feature must be understandable in under 30 seconds by a non-technical business owner. If the UX needs a manual, redesign it. AI complexity stays behind the scenes.

### AI First

Design workflows assuming an agent executes them. Humans approve, override, and audit — they don't copy-paste between tools. Prompts, context, and feedback loops are first-class, not bolt-ons.

### No Duplication

One source of truth per concept. No parallel implementations, no copy-pasted logic, no second doc saying the same thing. Link instead of repeat.

### Modular Architecture

Small, bounded modules with clear interfaces. A module can be replaced without rewriting the system. Dependencies flow inward; side effects flow outward through explicit boundaries.

### Everything Replaceable

No vendor, library, or provider is permanent. Wrap external dependencies. Keep migration paths in mind — especially for AI models, payment, and auth providers.

### Security First

Assume breach attempts from day one. Least privilege, encrypted secrets, validated inputs, audited agent actions. Customer data never appears in logs or prompts without explicit need.

### Cost Aware

Every AI call, database query, and background job has a cost. Measure unit economics early. Prefer cheaper paths that meet the quality bar — document trade-offs in [COSTS.md](./COSTS.md) and ADRs.

### Performance Matters

Perceived speed is a feature. Lazy-load, cache intelligently, stream AI responses. Set budgets (p95 latency, token limits) and enforce them.

---

## Documentation Rules

1. **Status changes** → update [PROJECT_BRAIN.md](./PROJECT_BRAIN.md)
2. **Discoveries** → append to [LEARNINGS.md](./LEARNINGS.md)
3. **Architecture forks** → new file in [adr/](./adr/) + index in PROJECT_BRAIN
4. **Stable how-to reference** → [docs/](./docs/) (not the brain)
5. **Reusable prompts** → [prompts/](./prompts/) by category

Agents and humans follow [AI/AGENT.md](./AI/AGENT.md) for execution details.

---

## Code Rules (when code exists)

- Minimal scope per change — solve the problem, nothing extra
- Match existing conventions before introducing new patterns
- Tests for behavior that matters, not for coverage percentages
- No secrets in repo — ever
