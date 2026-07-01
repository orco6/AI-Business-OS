# כללי Gallery Section

> חל על: `gallery-section.tsx`  
> מקורות השראה: Awwwards portfolios, Mobbin mobile galleries, Aceternity bento grids  
> הפניות: `PERFORMANCE_RULES.md`, `ACCESSIBILITY_RULES.md`, `TYPOGRAPHY.md`, `SPACING_RULES.md`

---

## מטרת Gallery

להציג עבודות/תמונות העסק כ**אירוע ויזואלי** — לא כ-grid של thumbnails קטנים.

---

## מספר תמונות

| פרמטר | ערך |
|-------|-----|
| מקסימום | 9 תמונות (כבר מיושם) |
| מינימום להצגה | 1 — אם 0, `return null` |
| aspect ratios | מעורב — masonry natural heights |

---

## כותרת סקשן

| פרמטר | ערך |
|-------|-----|
| גודל | 30–36px desktop, 24–30px mobile — ר' `TYPOGRAPHY.md` |
| יישור | `text-center` |
| margin-bottom | `mb-10` (40px) |
| aria | `aria-labelledby="gallery-heading"` |

---

## Desktop — Masonry (CSS Columns)

| פרמטר | ערך |
|-------|-----|
| columns | 3 |
| gap | `gap-4` (16px) |
| break-inside | `break-inside-avoid` |
| border-radius | `rounded-2xl` (16px) |
| max-width | `max-w-5xl` |

### Hover (Desktop)

| פרמטר | ערך |
|-------|-----|
| scale | `1.04` (ברירת מחדל) — **מקסימום** `1.08` |
| duration | `500ms` |
| easing | `ease-out` |
| overflow | `overflow-hidden` על wrapper — חובה |
| overlay אופציונלי | gradient `from-black/0 to-black/30` ב-opacity 0→100 — רק אם יש caption |

---

## Mobile — Horizontal Scroll Snap

| פרמטר | ערך |
|-------|-----|
| direction | horizontal, `scroll-snap-type: x mandatory` |
| card width | `75vw` |
| aspect ratio | `4/5` (portrait) |
| gap | `gap-3` (12px) |
| padding | `px-6` |
| scrollbar | hidden (`.scroll-hide`) |

### Mobile — אין hover

- כל מידע חיוני **גלוי תמיד** — לא תלוי hover.
- tap פותח lightbox.

---

## Lightbox (CSS :target)

> ארכיטקטורה קיימת — שפר UX בתוך המבנה, אל תחליף ב-JS modal.

### Backdrop

| פרמטר | ערך |
|-------|-----|
| background | `bg-black/92` — מינימום 90% |
| backdrop-blur | `backdrop-blur-sm` |
| z-index | `z-[100]` |

### תמונה ב-lightbox

| פרמטר | ערך |
|-------|-----|
| max-height | `85vh` |
| max-width | `80vw` |
| object-fit | `object-contain` |
| border-radius | `rounded-xl` |
| shadow | `shadow-2xl` |

### ניווט

| אלמנט | spec |
|-------|------|
| חצים | `rounded-full bg-white/20 p-3`, min 44×44px; מיקום `-start-12` / `-end-12` (RTL logical) |
| כפתור סגירה | `top-4 end-4`, min 44×44px |
| aria | `role="dialog"`, `aria-modal="true"`, `aria-label` לכל תמונה |
| סגירה | tap על backdrop + כפתור ✕ |

### שיפורים אופציונליים (בתוך `:target`, אותו קובץ)

- `scroll-margin-top: 80px` על anchors — מניעת jump.
- counter `"3 / 9"` — `text-sm`, opacity 70%, בתחתית lightbox.
- **לא** להחליף ב-JS modal library.

---

## Layout Patterns (CSS בלבד — אותו `gallery-section.tsx`)

| Pattern | columns | הערה |
|---------|---------|------|
| Masonry columns | 3 | **ברירת מחדל נוכחית** |
| Equal grid | 2–3 | `grid-cols-3` + `aspect-[4/5]` uniform |
| Bento accent | 3 | tile ראשון `col-span-2 row-span-2` — CSS בלבד |

**אסור:** קומponent חדש, קובץ חדש, או שינוי JSON schema.

---

## Stagger Animation (scroll-in)

| פרמטר | ערך |
|-------|-----|
| initial | opacity 0, y: 20 (desktop) / scale 0.95 (mobile) |
| whileInView | opacity 1, y: 0 / scale 1 |
| viewport | `{ once: true }` |
| duration | 300–400ms |
| stagger delay | `index * 0.04`–`0.05` — מקסימום 400ms סה"כ |

---

## ✅ Do

- תמונות גדולות מספיק — masonry full-width columns.
- lightbox עם backdrop כהה (92%+).
- touch targets 44×44px לניווט.
- `loading="lazy"` על grid (לא lightbox).
- alt text: `{gallery.title} {index + 1}`.

## ❌ Don't

- thumbnails קטנים (<150px) ב-desktop.
- hover scale מעל `1.08` — hard limit.
- captions שמופיעים **רק** ב-hover (mobile blind).
- carousel auto-play.
- lightbox בגודל זהה ל-thumbnail — חייב להיות גדול משמעותית.
- החלפת :target lightbox ב-library — שפר CSS בתוך `gallery-section.tsx`.
- יותר מ-9 תמונות.
