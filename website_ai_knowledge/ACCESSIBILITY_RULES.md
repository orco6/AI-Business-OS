# כללי נגישות (Accessibility)

> חל על: כל רכיבי website  
> סטנדרט יעד: **WCAG 2.2 AA** (AAA ל-focus appearance where feasible)  
> הפניות: `COLOR_AND_CONTRAST.md` (ratios)

---

## Contrast

| אלמנט | ratio |
|-------|-------|
| Body text (<24px) | ≥ 4.5:1 |
| Large text (≥24px / bold ≥18.66px) | ≥ 3:1 |
| UI components | ≥ 3:1 |
| Hero white on overlay 50% | ✅ passes |

### טקסט על תמונות

- **חובה** overlay כהה — ר' `HERO_RULES.md`
- opacity text ≥ 85% on dark overlay

---

## Focus States

### spec

```css
/* Tailwind pattern */
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-offset-2
focus-visible:ring-[var(--color-primary)]
```

| property | value |
|----------|-------|
| ring width | 2px |
| ring offset | 2px |
| contrast | 3:1 focused vs unfocused pixels |
| min area | 2px perimeter of component (WCAG 2.4.13) |

### חל על

- Hero CTA links
- Nav "צור קשר"
- Gallery lightbox links (חצים, סגירה, thumbnails)
- Contact WhatsApp / Phone buttons
- Sticky WhatsApp button

### ❌ Don't

- `outline: none` without replacement
- focus only on `:hover`
- focus ring same color as background

---

## Keyboard Navigation

### Gallery lightbox (:target)

| key | action | status |
|-----|--------|--------|
| Tab | focus next control | ✅ links focusable |
| Enter | activate link | ✅ |
| Escape | close | ⚠️ `:target` limitation — שיפור אופציונלי: `onKeyDown` **באותו קובץ**, ללא library |
| Arrow keys | prev/next | ⚠️ `:target` limitation — hash links + Tab מספיקים ל-AA |

> שיפור Escape/Arrows: רק `onKeyDown` בתוך `gallery-section.tsx` — **לא** modal library, **לא** קובץ חדש.

### General

- כל `<a>` ו-`<button>` reachable via Tab
- `scroll-margin-top: 80px` on `#contact` anchor

---

## Alt Text

| context | alt |
|---------|-----|
| Hero background | `""` (decorative) + overlay provides context — ✅ |
| About image | `{about.title}` — ✅ |
| Gallery grid | `{gallery.title} {index + 1}` — ✅ |
| Lightbox | same as grid — ✅ |
| Icons (MapPin, Phone) | `aria-hidden="true"` — ✅ |

### rules

- descriptive, not "תמונה" / "image"
- ≤ 125 characters
- don't start with "תמונה של" — redundant

---

## ARIA

| component | attributes |
|-----------|------------|
| Gallery section | `aria-labelledby="gallery-heading"` — ✅ |
| Lightbox | `role="dialog"`, `aria-modal="true"`, `aria-label` — ✅ |
| Close backdrop | `aria-label="סגור גלריה"` — ✅ |
| Nav arrows | `aria-label="תמונה קודמת/הבאה"` — ✅ |
| Decorative overlay | `aria-hidden="true"` — ✅ |
| Map iframe | `title="מיקום העסק"` — ✅ |

---

## Touch Targets

| element | min size |
|---------|----------|
| Buttons | 44×44px |
| Gallery nav arrows | 44×44px (p-3 on icon ≈ 48px) |
| Lightbox close | 44×44px |
| Sticky WhatsApp | 56×56px (`size-14`) — נוכחי |

WCAG 2.5.8 minimum: 24×24px (AA). **יעד בפרויקט:** 44×44px (כפתורים), 56×56px (sticky WhatsApp).

---

## Motion Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  .ken-burns { animation: none !important; }
  /* motion components: respect via globals or initial={false} */
}
```

- Ken Burns off — ✅
- whatsapp pulse off — ✅
- whileInView: `initial={false}` under `prefers-reduced-motion` — או CSS `@media`

---

## Links

| rule | spec |
|------|------|
| External (WhatsApp) | `target="_blank"` + `rel="noopener noreferrer"` — ✅ |
| Phone | `tel:` URI — ✅ |
| Color alone | links distinguished by shape (button) not color alone — ✅ |

---

## Semantic HTML

| element | usage |
|---------|-------|
| `<section>` | each component — ✅ |
| `<h1>` | once per page (Hero) — ✅ |
| `<h2>` | section titles — ✅ |
| `<h3>` | service names — ✅ |
| `<nav>` | hero nav — ✅ |
| `<article>` | service cards — ✅ |

---

## ✅ Do

- focus-visible rings on all interactives
- alt text on content images
- aria-labels in Hebrew on icon-only buttons
- 44px touch targets
- prefers-reduced-motion respected

## ❌ Don't

- empty `<a href="#">` without aria-label
- autoplay video/audio
- essential info in title attribute only
- gallery navigation smaller than 24px
- hero background alt with business name (decorative = empty alt OK)
