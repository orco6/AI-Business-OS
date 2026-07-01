# כללי טיפוגרפיה

> **מקור אמת** לגדלי טקסט בכל הרכיבים  
> חל על: hero, about, services, gallery, contact  
> Font stack: `var(--font-heading)` לכותרות (Heebo / Frank Ruhl / Secular One / Rubik לפי theme), `var(--font-body)` (Heebo Variable) לגוף

---

## עקרון מנחה

מקסימום **4 גדלי טקסט** לסקשן. הפרש מינימלי בין רמות: ≥4px (≥0.25rem).  
**Luxury principle:** oversized section headers, dramatic whitespace, fewer text elements per view.

---

## סולם גדלים (Type Scale)

| רמה | Desktop | Mobile | weight | line-height | שימוש |
|-----|---------|--------|--------|-------------|-------|
| Display / Hero H1 | 60–96px | 60px+ (`sm:`→96px) | 700 | 1.1 | `hero.headline` |
| Hero subheadline | 20–24px | 18–20px | 400 | 1.5–1.6 | `hero.subheadline` |
| Section H2 | 48–72px | 48px (`text-5xl`) | 900 (`font-black`) | 1.1–1.2 | about, services, gallery, contact |
| Card H3 | 18–20px | 18px | 700 | 1.3 | `service.name` |
| Body large | 18px | 16–18px | 400 | 1.6–1.75 | `about.story` |
| Body default | 16px | 16px | 400 | 1.5–1.6 | descriptions |
| Body small | 14px | 14px | 400–500 | 1.5 | stat lines, meta |
| Label / badge | 12–14px | 12–14px | 500–600 | 1.3 | tags, nav CTA |
| CTA button | 18–20px | 16–18px | 600–700 | 1.2 | hero, contact buttons |

### Tailwind mapping

```
Hero H1:     text-6xl sm:text-7xl md:text-8xl   ← נוכחי בקוד
Section H2:  text-5xl sm:text-6xl lg:text-7xl | font-black | tracking-[-0.03em]
Card H3:     text-lg
Body large:  text-lg
Body:        text-base
Small:       text-sm
```

---

## Letter-spacing

| גודל | tracking |
|------|----------|
| Display (≥48px) | `-0.02em` עד `-0.04em` |
| Section H2 | `-0.03em` |
| Body | `0` (default) |
| ALL CAPS labels | `+0.05em` — נדיר בעברית |

---

## Max-width לקריאות

| אלמנט | max-width |
|-------|-----------|
| Hero headline | 720–800px |
| Hero subheadline | 540px (`max-w-xl`) |
| About story | 65ch (~560px) |
| Service description | card width (לא truncate) |

---

## Opacity hierarchy

| רמה | opacity |
|-----|---------|
| Primary text | 100% |
| Secondary / subheadline | 85–90% |
| Tertiary / meta | 75–80% |
| Decorative | 60% max — **מינimize decorative text** |

---

## RTL

| אלמנט | class / property |
|-------|------------------|
| Hero, About, Contact body | `text-right` |
| Section H2 (Services, Gallery) | `text-center` |
| Hero subheadline paragraph | `direction: rtl` |
| Hero CTA container | `justify-end` |
| Hero accent line animation | `origin-right` |
| Logical spacing | `ms-*`, `me-*`, `ps-*`, `pe-*` — לא `ml`/`mr` |

> `dir="rtl"` מוגדר ב-`website-renderer.tsx` — לא לשנות ברכיבים.

---

## Font pairing

- **כותרות**: `var(--font-heading)` — נקבע לפי `theme.fontHeading`.
- **גוף**: `var(--font-body)` — Heebo Variable.
- **מקסימום 2 משפחות** בדף.

---

## Section-specific

### Hero (`hero-section.tsx`)

```
H1:       text-6xl sm:text-7xl md:text-8xl | weight 700 | lh 1.1 | tracking -0.02em
Sub:      text-xl sm:text-2xl | weight 400 | lh 1.6 | opacity 85% | max-w-xl
Nav name: text-2xl | weight 700
Accent:   var(--color-primary) only
```

### About (`about-section.tsx`)

```
H2: text-5xl sm:text-6xl lg:text-7xl | font-black | tracking -0.03em | mb-20
Story: text-lg | lh relaxed (1.625) | opacity 90%
Owner: text-base | weight 500 | opacity 75%
Stat line: text-sm | text-gray-500 | max 2 items inline
```

### Services (`services-section.tsx`)

```
H2: text-5xl sm:text-6xl lg:text-7xl | font-black | center | mb-20
H3: text-lg | weight 700 | lh snug (1.375)
Description: text-sm | opacity 80%
Price: text-base | weight 600 | color primary
```

### Contact (`contact-section.tsx`)

```
H2: text-5xl sm:text-6xl lg:text-7xl | font-black | mb-20
Address: text-lg | opacity 90%
Hours: text-base | opacity 80%
Buttons: text-lg | weight 600
```

---

## ✅ Do

- 3 רמות טקסט ב-Hero בלבד (H1, sub, CTA).
- `text-pretty` על paragraphs ארוכים.
- negative tracking על display text (`-0.03em` על H2).
- `font-family: var(--font-heading)` על כל H1/H2/H3.
- `font-black` (900) על Section H2 — luxury weight.

## ❌ Don't

- יותר מ-4 גדלי טקסט שונים בסקשן אחד.
- body text מתחת ל-16px.
- ALL CAPS לכותרות עבריות ארוכות.
- line-height מתחת ל-1.1 על display text.
- line-height מעל 1.8 על body (מרגיש רופף מדי).
- decorative numbered labels (01, 02) ב-service cards.
- pill/badge grids ל-highlights — stat line בלבד.
