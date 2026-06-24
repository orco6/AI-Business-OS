# Glossary

> Domain vocabulary for AI-Business-OS. Agents and humans use these terms consistently.
> Add a term when it first appears in product, code, or docs.

---

## Product

| Term | Definition |
|------|------------|
| **AI-Business-OS** | The product: an AI-first operating system for SMB workflows. |
| **Business OS** | The conceptual layer above individual SaaS apps — coordinates work, context, and decisions. |
| **Agent** | An AI worker that executes a workflow step; always auditable and overridable by a human. |
| **Human-in-the-loop** | Required approval or override point before an agent action has external effect. |
| **Workflow** | A sequence of steps (manual, automated, or agent-driven) that accomplishes a business outcome. |
| **Business memory** | Persistent organizational context agents draw on across sessions (future capability). |

---

## Engineering

| Term | Definition |
|------|------------|
| **PROJECT_BRAIN** | Living doc — current vision, status, sprint, backlog. |
| **PROJECT_RULES** | Immutable engineering philosophy — rarely changes. |
| **ADR** | Architecture Decision Record in `adr/` — immutable history of forks. |
| **Self-documenting** | Practice of agents updating brain, learnings, and ADRs as part of every task. |
| **Replaceable module** | Component swappable without rewriting dependents — see PROJECT_RULES. |

---

## AI / Prompts

| Term | Definition |
|------|------------|
| **Prompt library** | Versioned prompts in `prompts/` organized by task category. |
| **Provider** | External LLM API (e.g. Anthropic, OpenAI) — configuration, not architecture. |
| **Tool use** | Agent capability to call functions/APIs — distinct from chat-only responses. |

---

## Status Labels

| Label | Meaning |
|-------|---------|
| **TBD** | Not decided — requires ADR or sprint work. |
| **P0 / P1 / P2** | Backlog priority in PROJECT_BRAIN. |
| **Pre-MVP** | Before first shippable product increment. |
