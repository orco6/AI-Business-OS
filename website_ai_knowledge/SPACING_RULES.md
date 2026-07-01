# כללי ריווח (Spacing)

> **מקור אמת** לריווח ו-whitespace  
> חל על: כל רכיבי website  
> Container: `max-w-5xl` (1024px) — **אל תשנה** (חוץ מ-Gallery desktop — full-bleed)

---

## Spacing Scale

| Token | px | Tailwind | שימוש |
|-------|-----|----------|-------|
| xs | 4 | `1` | micro gaps |
| sm | 8 | `2` | icon gaps |
| md | 12 | `3` | mobile gallery gap |
| base | 16 | `4` | grid gaps, card internal |
| lg | 20 | `5` | — |
| xl | 24 | `6` | section px mobile, hero nav |
| 2xl | 32 | `8` | hero px desktop, headline→sub gap |
| 3xl | 40 | `10` | card internal padding (services) |
| 4xl | 48 | `12` | — |
| 5xl | 64 | `16` | — |
| 6xl | 80 | `20` | H2→content gap (`mb-20`) |
| section-sm | 128 | `32` | `py-32` — section padding mobile |
| section-lg | 160 | `40` | `sm:py-40` — section padding desktop |

---

## Section Padding

| סקשן | vertical | horizontal |
|------|----------|------------|
| Hero | full viewport | `px-8` (32px) |
| About | `py-32 sm:py-40` (128/160px) | `px-6` (24px) |
| Services | `py-32 sm:py-40` | `px-6` |
| Gallery | `py-32 sm:py-40` | title only: `px-6`; grid desktop: **full-bleed** |
| Contact | `py-32 sm:py-40` | `px-6` |

### mobile vs desktop

- horizontal: `px-6` mobile, `px-8` hero desktop.
- vertical sections: `py-32 sm:py-40` (128/160px) — luxury standard; `py-24` (96px) — minimum.

---

## Internal Section Spacing

| between | gap |
|---------|-----|
| H2 → content grid | `mb-20` (80px) |
| Hero accent line → H1 | `mb-6` (24px) |
| H1 → subheadline | `mt-6` (24px) |
| Subheadline → CTA | `mt-10` (40px) |
| About H2 → story | `mb-20` on H2 |
| About story → owner | natural flow |
| About stat line | `mt-8`, gap `gap-8` (32px) |
| Service card internal | `gap-3` (12px), padding `p-10` (40px) |
| Contact columns | `gap-10` (40px) |
| Contact info items | `gap-6` (24px) |
| Contact buttons | `gap-3` (12px) |

---

## Grid Gaps

| layout | gap |
|--------|-----|
| Services desktop 3-col | `gap-8` (32px) |
| Services mobile scroll | `gap-4` (16px) |
| About 2-col | `gap-10` (40px) |
| Gallery masonry | `gap-4` (16px) |
| Gallery mobile scroll | `gap-3` (12px) |

---

## Container

```
mx-auto max-w-5xl px-6
```

- **max-w-5xl** = 1024px.
- טווח editorial מקובל: 960–1200px — **אל תרחיב** ל-`max-w-7xl` (1280px).
- **חריג:** Gallery desktop grid — `w-full`, ללא max-width, edge-to-edge.

---

## Hero Specific

| area | spacing |
|------|---------|
| Nav padding | `px-8 py-6` |
| Content bottom padding | `pb-24` (96px) |
| Content top padding | `pt-32` (128px) — clears nav |
| CTA padding | `px-10 py-5` |

---

## Whitespace Rules

1. Headline + sub = unit (`mt-6` = 24px ביניהם); CTA = unit נפרד (`mt-10` = 40px).
2. H2 → content: `mb-20` (80px) — luxury breathing room.
3. Card internal padding: `p-10` (40px) minimum on services.
4. ≥ 20% גובה viewport ריק ב-Hero (bottom-align + padding).
5. כל spacing — כפולות של 4px.
6. פחות אלמנטים לכל view — whitespace במקום decoration.

---

## Mobile Scroll Cards

| property | value |
|----------|-------|
| card width | `75vw` |
| snap | `scroll-snap-align: start` |
| bottom padding | `pb-4` for scroll area |

---

## Border Radius

| element | radius |
|---------|--------|
| Cards, images | `rounded-2xl` (16px) |
| Buttons, badges | `rounded-full` |
| Lightbox image | `rounded-xl` (12px) |
| Map iframe | `rounded-2xl` |

---

## ✅ Do

- spacing scale של 4px multiples.
- `py-32 sm:py-40` לכל content sections.
- `max-w-5xl` container (חוץ מ-gallery full-bleed).
- `mb-20` (80px) בין H2 לתוכן.
- `mt-10` (40px) בין subheadline ל-CTA.

## ❌ Don't

- padding אנכי מתחת ל-`py-24` (96px) על sections.
- gap-1/gap-2 בין cards — too tight.
- decorative elements שמוסיפים רעש (pill grids, faded numbers, floating boxes).
- inconsistent px between sections (always px-6 base).
