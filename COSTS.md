# COSTS

> Monthly burn, variable costs, and unit economics.
> Updated when providers are chosen or usage patterns change.

**Last updated:** Documentation foundation phase  
**Monthly burn target (pre-revenue):** Minimize — defer paid infra until MVP needs it

---

## Fixed Monthly Costs

| Service | Purpose | Cost/mo | Notes |
|---------|---------|---------|-------|
| Domain | TBD | $0 | Not registered yet |
| Git hosting | Source control | $0 | Assumes free tier |
| Cursor | Development | (personal) | Not a company cost yet |
| Hosting | App + DB | $0 | Not deployed yet |

**Total fixed:** ~$0/mo (pre-MVP)

---

## Variable Costs (projected)

| Category | Unit | Est. cost | Notes |
|----------|------|-----------|-------|
| LLM inference | per 1M tokens | TBD | Depends on provider ADR |
| Embeddings | per 1M tokens | TBD | |
| Email / SMS | per message | TBD | When notifications ship |
| File storage | per GB | TBD | When uploads ship |

---

## Unit Economics (when live)

| Metric | Target | Current |
|--------|--------|---------|
| Cost per active user / mo | TBD | — |
| Cost per AI action | TBD | — |
| Gross margin at $X ARPU | TBD | — |

---

## Budget Caps & Alerts

| Cap | Threshold | Action |
|-----|-----------|--------|
| Dev AI spend | Set when provider chosen | Hard limit in provider dashboard |
| Production AI spend | TBD | Alert at 80%, block at 100% |
| Infra spend | TBD | Review weekly in sprint |

---

## Cost-Aware Design Decisions

Document trade-offs here when built; link to ADR if architectural.

| Decision | Savings | Trade-off |
|----------|---------|-----------|
| — | — | — |
